// =====================================================
// EXEMPLE DE BACKEND API - Node.js + Express + SQL
// =====================================================
// Ce fichier montre comment créer le backend pour
// connecter l'application à une vraie base SQL

/*
// Installation requise:
// npm install express cors mysql2 dotenv bcrypt jsonwebtoken
// npm install -D @types/express @types/cors @types/bcrypt @types/jsonwebtoken typescript

import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lybok',
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

// =====================================================
// MIDDLEWARE D'AUTHENTIFICATION
// =====================================================
const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

// =====================================================
// ROUTES DES MEMBRES
// =====================================================
app.get('/api/members', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM members WHERE is_active = TRUE');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/members', async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO members (name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
      [name, email, phone, hashedPassword]
    );
    res.status(201).json({ id: result.insertId, name, email, phone });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création' });
  }
});

// =====================================================
// ROUTES DES CAGNOTTES
// =====================================================
app.get('/api/cagnotes', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM cagnotes ORDER BY year DESC, FIELD(status, "active", "upcoming", "completed")'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/cagnotes/active', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM cagnotes WHERE status = "active" LIMIT 1'
    );
    const cagnote = (rows as any[])[0];
    if (!cagnote) {
      return res.status(404).json({ error: 'Aucune cagnote active' });
    }
    res.json(cagnote);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/cagnotes', authMiddleware, async (req, res) => {
  const { month, year, target_amount, subscription_amount, deadline } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO cagnotes (month, year, target_amount, subscription_amount, deadline, status) VALUES (?, ?, ?, ?, ?, "active")',
      [month, year, target_amount, subscription_amount, deadline]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création' });
  }
});

// =====================================================
// ROUTES DES COTISATIONS
// =====================================================
app.get('/api/contributions', authMiddleware, async (req, res) => {
  const { member_id, cagnote_id, status } = req.query;
  let query = 'SELECT * FROM contributions WHERE 1=1';
  const params: any[] = [];

  if (member_id) {
    query += ' AND member_id = ?';
    params.push(member_id);
  }
  if (cagnote_id) {
    query += ' AND cagnote_id = ?';
    params.push(cagnote_id);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  try {
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/contributions', authMiddleware, async (req, res) => {
  const { member_id, cagnote_id, amount, payment_method, payment_reference } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Insérer la cotisation
    const [result] = await connection.execute(
      'INSERT INTO contributions (member_id, cagnote_id, amount, payment_method, payment_reference, status) VALUES (?, ?, ?, ?, ?, "pending")',
      [member_id, cagnote_id, amount, payment_method, payment_reference]
    );
    
    // Mettre à jour le montant collecté de la cagnote
    await connection.execute(
      'UPDATE cagnotes SET collected_amount = collected_amount + ? WHERE id = ?',
      [amount, cagnote_id]
    );
    
    await connection.commit();
    res.status(201).json({ id: result.insertId, status: 'pending' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: 'Erreur lors du paiement' });
  } finally {
    connection.release();
  }
});

app.patch('/api/contributions/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status, payment_date } = req.body;
  try {
    await pool.execute(
      'UPDATE contributions SET status = ?, payment_date = ? WHERE id = ?',
      [status, payment_date || new Date(), id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// =====================================================
// ROUTES DES MESSAGES
// =====================================================
app.get('/api/messages', authMiddleware, async (req, res) => {
  const { limit } = req.query;
  try {
    const query = limit 
      ? `SELECT m.*, mem.name as user_name 
         FROM messages m 
         JOIN members mem ON m.member_id = mem.id 
         ORDER BY m.created_at DESC 
         LIMIT ?`
      : `SELECT m.*, mem.name as user_name 
         FROM messages m 
         JOIN members mem ON m.member_id = mem.id 
         ORDER BY m.created_at DESC`;
    
    const [rows] = limit 
      ? await pool.execute(query, [parseInt(limit as string)])
      : await pool.execute(query);
    
    res.json((rows as any[]).reverse());
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/messages', authMiddleware, async (req, res) => {
  const { member_id, content, message_type } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO messages (member_id, content, message_type) VALUES (?, ?, ?)',
      [member_id, content, message_type || 'message']
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi' });
  }
});

// =====================================================
// ROUTES DES AIDES SOCIALES
// =====================================================
app.get('/api/aid-requests', authMiddleware, async (req, res) => {
  const { status, member_id } = req.query;
  let query = 'SELECT * FROM aid_requests WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (member_id) {
    query += ' AND member_id = ?';
    params.push(member_id);
  }

  try {
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/aid-requests', authMiddleware, async (req, res) => {
  const { member_id, category, description, requested_amount } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO aid_requests (member_id, category, description, requested_amount) VALUES (?, ?, ?, ?)',
      [member_id, category, description, requested_amount]
    );
    res.status(201).json({ id: result.insertId, status: 'pending' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la soumission' });
  }
});

app.patch('/api/aid-requests/:id/approve', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { approved_amount, reviewed_by, review_notes } = req.body;
  try {
    await pool.execute(
      'UPDATE aid_requests SET status = "approved", approved_amount = ?, reviewed_by = ?, review_notes = ?, reviewed_at = NOW() WHERE id = ?',
      [approved_amount, reviewed_by, review_notes, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'approbation' });
  }
});

// =====================================================
// ROUTES DES NOTIFICATIONS
// =====================================================
app.get('/api/notifications/member/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { unread } = req.query;
  let query = 'SELECT * FROM notifications WHERE member_id = ?';
  const params: any[] = [id];

  if (unread === 'true') {
    query += ' AND is_read = FALSE';
  }

  query += ' ORDER BY created_at DESC';

  try {
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.patch('/api/notifications/:id/read', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// =====================================================
// DÉMARRAGE DU SERVEUR
// =====================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

export default app;
*/

// Ce fichier est un exemple - pour l'utiliser, décommentez le code ci-dessus
// et assurez-vous d'avoir installé les dépendances nécessaires.
console.log('Backend API example - Voir les commentaires pour la mise en place');
