// =====================================================
// SERVEUR API — LYBOK v3.0
// Tontine des Anciens Élèves
// Node.js + Express + PostgreSQL (Supabase)
// =====================================================

const express    = require('express');
const cors       = require('cors');
const { Pool }   = require('pg');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const path       = require('path');
const crypto     = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const DEMO_MODE = process.env.DEMO_MODE === 'true';

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET manquant dans .env — arrêt du serveur.');
  process.exit(1);
}

// =====================================================
// POSTGRESQL POOL
// =====================================================
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  // Une instance locale (dev) n'a généralement pas SSL activé ; Supabase en a besoin.
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('❌ Erreur de connexion à PostgreSQL:', err);
});

// =====================================================
// MIDDLEWARE
// =====================================================
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// =====================================================
// EMAIL — Nodemailer
// =====================================================
var emailTransporter = null;

function initEmail() {
  console.log('\n── Configuration Email ───────────────────────');
  console.log('  EMAIL_USER :', process.env.EMAIL_USER || '❌ NON DÉFINI');
  console.log('  EMAIL_PASS :', process.env.EMAIL_PASS ? '✅ défini' : '❌ NON DÉFINI');
  console.log('─────────────────────────────────────────────');
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️  Email désactivé — ajoutez EMAIL_USER et EMAIL_PASS dans .env\n');
    return;
  }
  try {
    emailTransporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    emailTransporter.verify(function(err) {
      if (err) { console.log('❌ Email erreur:', err.message); emailTransporter = null; }
      else      console.log('✅ Email opérationnel :', process.env.EMAIL_USER);
    });
  } catch(e) { console.log('❌ Email init:', e.message); }
}

async function sendEmail(to, subject, html) {
  if (!emailTransporter) { console.log('📭 Email non configuré →', to, ':', subject); return false; }
  try {
    var info = await emailTransporter.sendMail({
      from: '"Lybok Tontine" <' + process.env.EMAIL_USER + '>',
      to,
      subject,
      html
    });
    console.log('✅ Email envoyé à', to, '| ID:', info.messageId);
    return true;
  } catch(e) { console.log('❌ Email erreur:', e.message); return false; }
}

// =====================================================
// MIDDLEWARE AUTH
// =====================================================
function decodeToken(req) {
  var token = (req.headers['authorization'] || '').replace('Bearer ', '');
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET); } catch(e) { return null; }
}

// =====================================================
// AUTH ROUTES
// =====================================================

// POST /api/auth/login
app.post('/api/auth/login', async function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  try {
    const result = await pool.query(
      "SELECT * FROM membres WHERE email = $1",
      [email]
    );
    var m = result.rows[0];
    if (!m) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    var valid = false;
    try { valid = await bcrypt.compare(password, m.mot_de_passe); } catch(e) {}
    if (!valid && DEMO_MODE && password === 'demo1234') valid = true;
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Un dossier en attente de parrainage/validation par le bureau ne peut pas se connecter.
    var statut = m.statut || 'actif'; // comptes créés avant l'ajout de la colonne = actifs par défaut
    if (statut === 'en_attente') {
      return res.status(403).json({ error: 'Votre dossier est en attente de validation par le bureau.' });
    }
    if (statut === 'refuse') {
      return res.status(403).json({ error: 'Votre demande d\'adhésion a été refusée par le bureau.' });
    }

    var token = jwt.sign({
      id: m.id, 
      email: m.email, 
      role: m.role, 
      nom: m.nom, 
      prenom: m.prenom 
    }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token, 
      membre: { 
        id: m.id, 
        nom: m.nom, 
        prenom: m.prenom, 
        email: m.email, 
        telephone: m.telephone, 
        avatar: m.avatar, 
        role: m.role 
      } 
    });
  } catch(err) { 
    console.error('Erreur login:', err.message); 
    res.status(500).json({ error: 'Erreur serveur.' }); 
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async function(req, res) {
  var nom             = req.body.nom;
  var prenom          = req.body.prenom || '';
  var email           = (req.body.email || '').trim().toLowerCase();
  var telephone       = req.body.telephone || null;
  var ville           = req.body.ville || null;
  var domaineActivite = req.body.domaine_activite || null;
  var parrain1Email   = (req.body.parrain1_email || '').trim().toLowerCase();
  var parrain2Email   = (req.body.parrain2_email || '').trim().toLowerCase();
  var password        = req.body.password || req.body.mot_de_passe;
  // L'inscription publique ne peut créer que des membres standards.
  // La promotion admin/trésorier se fait ensuite via PUT /api/membres/:id (réservé admin/trésorier).
  var role            = 'membre';

  if (!nom || !email || !password || !ville || !domaineActivite) {
    return res.status(400).json({ error: 'nom, email, password, ville et domaine_activite sont obligatoires.' });
  }
  if (!parrain1Email || !parrain2Email) {
    return res.status(400).json({ error: 'Deux parrains (parrain1_email, parrain2_email) sont obligatoires.' });
  }
  if (parrain1Email === parrain2Email) {
    return res.status(400).json({ error: 'Les deux parrains doivent être différents.' });
  }
  if (parrain1Email === email || parrain2Email === email) {
    return res.status(400).json({ error: 'Vous ne pouvez pas être votre propre parrain.' });
  }

  try {
    var existing = await pool.query("SELECT id FROM membres WHERE email = $1", [email]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Cet email est déjà utilisé.' });

    var parrains = await pool.query(
      "SELECT id, email FROM membres WHERE email = ANY($1) AND COALESCE(statut, 'actif') = 'actif'",
      [[parrain1Email, parrain2Email]]
    );
    var parrain1 = parrains.rows.find(function(r) { return r.email === parrain1Email; });
    var parrain2 = parrains.rows.find(function(r) { return r.email === parrain2Email; });
    if (!parrain1 || !parrain2) {
      return res.status(400).json({ error: 'Les deux parrains doivent être des membres déjà actifs de Lybok.' });
    }

    var hashedPwd = await bcrypt.hash(password, 10);
    var newId = crypto.randomUUID();

    const result = await pool.query(
      `INSERT INTO membres (id, nom, prenom, email, telephone, ville, domaine_activite, role, statut, parrain1_id, parrain2_id, mot_de_passe, date_inscription, date_modification)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'en_attente', $9, $10, $11, NOW(), NOW())
       RETURNING id, nom, prenom, email, role, statut`,
      [newId, nom, prenom, email, telephone, ville, domaineActivite, role, parrain1.id, parrain2.id, hashedPwd]
    );

    var nouveau = result.rows[0];
    console.log('📋 Nouveau dossier en attente :', prenom, nom, '-', email, '| parrains:', parrain1Email, parrain2Email);
    // Pas de token émis : le compte n'est pas actif tant que le bureau ne l'a pas validé.
    res.status(201).json({ membre: nouveau });
  } catch(err) {
    console.error('Erreur register:', err.message);
    res.status(500).json({ error: 'Erreur: ' + err.message });
  }
});

// GET /api/membres/en-attente — dossiers en attente de validation (admin/trésorier)
app.get('/api/membres/en-attente', async function(req, res) {
  var user = decodeToken(req);
  if (!user || (user.role !== 'admin' && user.role !== 'tresorier')) {
    return res.status(403).json({ error: 'Accès refusé.' });
  }
  try {
    const result = await pool.query(
      `SELECT m.id, m.nom, m.prenom, m.email, m.telephone, m.ville, m.domaine_activite, m.date_inscription,
              p1.nom AS parrain1_nom, p1.prenom AS parrain1_prenom, p1.email AS parrain1_email,
              p2.nom AS parrain2_nom, p2.prenom AS parrain2_prenom, p2.email AS parrain2_email
       FROM membres m
       LEFT JOIN membres p1 ON m.parrain1_id = p1.id
       LEFT JOIN membres p2 ON m.parrain2_id = p2.id
       WHERE m.statut = 'en_attente'
       ORDER BY m.date_inscription ASC`
    );
    res.json(result.rows);
  } catch(err) {
    console.error('Erreur GET membres en-attente:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/membres/:id/valider — le bureau valide le dossier (admin/trésorier)
app.patch('/api/membres/:id/valider', async function(req, res) {
  var user = decodeToken(req);
  if (!user || (user.role !== 'admin' && user.role !== 'tresorier')) {
    return res.status(403).json({ error: 'Accès refusé.' });
  }
  try {
    const result = await pool.query(
      "UPDATE membres SET statut = 'actif', date_modification = NOW() WHERE id = $1 AND statut = 'en_attente' RETURNING id, nom, prenom, email, statut",
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Dossier en attente introuvable.' });
    console.log('✅ Dossier validé par le bureau:', result.rows[0].email);
    res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/membres/:id/refuser — le bureau refuse le dossier (admin/trésorier)
app.patch('/api/membres/:id/refuser', async function(req, res) {
  var user = decodeToken(req);
  if (!user || (user.role !== 'admin' && user.role !== 'tresorier')) {
    return res.status(403).json({ error: 'Accès refusé.' });
  }
  try {
    const result = await pool.query(
      "UPDATE membres SET statut = 'refuse', date_modification = NOW() WHERE id = $1 AND statut = 'en_attente' RETURNING id, nom, prenom, email, statut",
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Dossier en attente introuvable.' });
    console.log('⛔ Dossier refusé par le bureau:', result.rows[0].email);
    res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// MEMBRES
// =====================================================

// GET /api/membres
app.get('/api/membres', async function(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, nom, prenom, email, telephone, avatar, role, date_inscription FROM membres ORDER BY nom, prenom"
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur GET membres:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/membres/:id
app.get('/api/membres/:id', async function(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, nom, prenom, email, telephone, avatar, role, date_inscription FROM membres WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Membre non trouvé.' });
    res.json(result.rows[0]);
  } catch(err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// PUT /api/membres/:id
app.put('/api/membres/:id', async function(req, res) {
  var user = decodeToken(req);
  if (!user || (user.role !== 'admin' && user.role !== 'tresorier')) {
    return res.status(403).json({ error: 'Accès refusé.' });
  }
  
  var id        = req.params.id;
  var nom       = req.body.nom;
  var prenom    = req.body.prenom || '';
  var email     = req.body.email;
  var telephone = req.body.telephone || null;
  var role      = req.body.role || 'membre';

  if (!nom || !email) return res.status(400).json({ error: 'Nom et email obligatoires.' });

  try {
    const result = await pool.query(
      `UPDATE membres 
       SET nom = $1, prenom = $2, email = $3, telephone = $4, role = $5, date_modification = NOW()
       WHERE id = $6
       RETURNING id, nom, prenom, email, role`,
      [nom, prenom, email, telephone, role, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Membre non trouvé.' });
    console.log('✅ Membre mis à jour:', nom, prenom);
    res.json(result.rows[0]);
  } catch(err) {
    console.error('Erreur PUT membre:', err.message);
    res.status(500).json({ error: 'Erreur: ' + err.message });
  }
});

// =====================================================
// CAGNOTTES
// =====================================================

app.get('/api/cagnottes', async function(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, mois, annee, montant_cible, montant_collecte, montant_cotisation, statut, date_limite, date_creation FROM cagnottes ORDER BY annee DESC, CASE WHEN mois='Janvier' THEN 1 WHEN mois='Février' THEN 2 WHEN mois='Mars' THEN 3 WHEN mois='Avril' THEN 4 WHEN mois='Mai' THEN 5 WHEN mois='Juin' THEN 6 WHEN mois='Juillet' THEN 7 WHEN mois='Août' THEN 8 WHEN mois='Septembre' THEN 9 WHEN mois='Octobre' THEN 10 WHEN mois='Novembre' THEN 11 ELSE 12 END DESC"
    );
    res.json(result.rows);
  } catch(err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.get('/api/cagnottes/:id', async function(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM cagnottes WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cagnotte non trouvée.' });
    res.json(result.rows[0]);
  } catch(err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// =====================================================
// COTISATIONS
// =====================================================

app.get('/api/cotisations', async function(req, res) {
  try {
    const result = await pool.query(
      `SELECT c.id, c.membre_id, c.montant, c.mode_paiement, c.statut, c.date_paiement, c.date_creation,
              m.nom, m.prenom, m.email, m.avatar,
              cag.mois, cag.annee
       FROM cotisations c
       LEFT JOIN membres m ON c.membre_id = m.id
       LEFT JOIN cagnottes cag ON c.cagnotte_id = cag.id
       ORDER BY c.date_creation DESC`
    );
    res.json(result.rows);
  } catch(err) { 
    console.error('Erreur GET cotisations:', err.message); 
    res.status(500).json({ error: err.message }); 
  }
});

app.post('/api/cotisations', async function(req, res) {
  var user = decodeToken(req);
  if (!user || (user.role !== 'admin' && user.role !== 'tresorier')) {
    return res.status(403).json({ error: 'Accès refusé.' });
  }

  var membre_id    = req.body.membre_id;
  var cagnotte_id  = req.body.cagnotte_id;
  var montant      = req.body.montant;
  var mode_paiement = req.body.mode_paiement || 'especes';

  try {
    const result = await pool.query(
      `INSERT INTO cotisations (membre_id, cagnotte_id, montant, mode_paiement, statut, date_paiement, date_creation, date_modification)
       VALUES ($1, $2, $3, $4, 'paye', NOW(), NOW(), NOW())
       RETURNING *`,
      [membre_id, cagnotte_id, montant, mode_paiement]
    );

    // Notification
    try {
      await pool.query(
        `INSERT INTO notifications (membre_id, titre, contenu, type, est_lu, date_creation)
         VALUES ($1, $2, $3, $4, false, NOW())`,
        [membre_id, 'Cotisation reçue', 'Votre cotisation a été enregistrée.', 'success']
      );
    } catch(e) {}

    res.status(201).json(result.rows[0]);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// MESSAGES (CHAT)
// =====================================================

app.get('/api/messages', async function(req, res) {
  var limit = parseInt(req.query.limit) || 100;
  try {
    const result = await pool.query(
      `SELECT m.id, m.membre_id, m.contenu, m.type_message, m.date_creation,
              mb.nom, mb.prenom, mb.avatar
       FROM messages m
       LEFT JOIN membres mb ON m.membre_id = mb.id
       ORDER BY m.date_creation DESC
       LIMIT $1`,
      [limit]
    );
    res.json(result.rows);
  } catch(err) { 
    console.error('Erreur GET messages:', err.message); 
    res.status(500).json({ error: err.message }); 
  }
});

app.post('/api/messages', async function(req, res) {
  var user = decodeToken(req);
  if (!user) return res.status(401).json({ error: 'Authentification requise.' });

  var contenu = req.body.contenu || req.body.message || '';
  var membre_id = req.body.membre_id;
  var type_message = req.body.type_message || 'message';

  if (!contenu.trim()) return res.status(400).json({ error: 'Contenu vide.' });

  try {
    const result = await pool.query(
      `INSERT INTO messages (membre_id, contenu, type_message, date_creation)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [membre_id, contenu, type_message]
    );
    res.status(201).json(result.rows[0]);
  } catch(err) { 
    console.error('Erreur POST message:', err.message); 
    res.status(500).json({ error: err.message }); 
  }
});

// =====================================================
// ACTUALITÉS
// =====================================================

app.get('/api/actualites', async function(req, res) {
  try {
    const result = await pool.query(
      `SELECT a.id, a.titre, a.contenu, a.auteur_id, a.priorite, a.est_active, a.date_creation,
              m.nom, m.prenom, m.avatar
       FROM actualites a
       LEFT JOIN membres m ON a.auteur_id = m.id
       WHERE a.est_active = true
       ORDER BY a.date_creation DESC`
    );
    res.json(result.rows);
  } catch(err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.post('/api/actualites', async function(req, res) {
  var user = decodeToken(req);
  if (!user || (user.role !== 'admin' && user.role !== 'tresorier')) {
    return res.status(403).json({ error: 'Accès refusé.' });
  }

  var titre = req.body.titre;
  var contenu = req.body.contenu;
  var auteur_id = req.body.auteur_id;
  var priorite = req.body.priorite || 'normal';

  try {
    const result = await pool.query(
      `INSERT INTO actualites (titre, contenu, auteur_id, priorite, est_active, date_creation)
       VALUES ($1, $2, $3, $4, true, NOW())
       RETURNING *`,
      [titre, contenu, auteur_id, priorite]
    );
    res.status(201).json(result.rows[0]);
  } catch(err) { 
    console.error('Erreur POST actualite:', err.message); 
    res.status(500).json({ error: err.message }); 
  }
});

// =====================================================
// NOTIFICATIONS
// =====================================================

app.get('/api/notifications/:membre_id', async function(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE membre_id = $1 ORDER BY date_creation DESC",
      [req.params.membre_id]
    );
    res.json(result.rows);
  } catch(err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.patch('/api/notifications/:id/lire', async function(req, res) {
  try {
    await pool.query("UPDATE notifications SET est_lu = true WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch(err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// =====================================================
// STATS DASHBOARD
// =====================================================

app.get('/api/stats/dashboard', async function(req, res) {
  try {
    const result = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM membres) as total_membres,
        (SELECT COALESCE(SUM(montant_collecte), 0) FROM cagnottes WHERE statut = 'active') as montant_collecte,
        (SELECT COALESCE(SUM(montant_cible), 0) FROM cagnottes WHERE statut = 'active') as montant_cible,
        (SELECT COUNT(*) FROM cotisations WHERE statut = 'paye') as cotisations_payees,
        (SELECT COALESCE(SUM(montant), 0) FROM cotisations) as total_verse_global,
        (SELECT COUNT(*) FROM messages) as total_messages`
    );
    res.json(result.rows[0]);
  } catch(err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// =====================================================
// INFO API
// =====================================================

app.get('/api', function(req, res) {
  res.json({ 
    nom: 'Lybok API', 
    version: '3.0', 
    base_de_donnees: 'PostgreSQL Supabase', 
    statut: 'En ligne' 
  });
});

// =====================================================
// CATCH-ALL — Frontend
// =====================================================

app.get('*', function(req, res) {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Route non trouvée.' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =====================================================
// DÉMARRAGE
// =====================================================

async function start() {
  try {
    // Test de connexion PostgreSQL
    await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL Supabase connecté !');
    
    initEmail();
    
    app.listen(PORT, function() {
      console.log('\n=====================================================');
      console.log('  🚀 LYBOK v3.0 — SERVEUR DÉMARRÉ !');
      console.log('=====================================================');
      console.log('  📊 Base     : PostgreSQL Supabase');
      console.log('  🖥️  Host    :', process.env.DB_HOST);
      console.log('  🌐 App     : http://localhost:' + PORT);
      console.log('  📡 API     : http://localhost:' + PORT + '/api');
      console.log('=====================================================\n');
    });
  } catch(err) { 
    console.error('❌ Démarrage:', err.message); 
    process.exit(1); 
  }
}

start();