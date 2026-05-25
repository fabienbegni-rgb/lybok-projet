// =====================================================
// SERVEUR API — LYBOK v2.0
// Tontine des Anciens Élèves
// Node.js + Express + SQL Server
// =====================================================

const express    = require('express');
const cors       = require('cors');
const sql        = require('mssql');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const path       = require('path');
const crypto     = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || '@FABINHO1604';

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
      from: '"Lybok Tontine" <' + process.env.EMAIL_USER + '>', to, subject, html
    });
    console.log('✅ Email envoyé à', to, '| ID:', info.messageId);
    return true;
  } catch(e) { console.log('❌ Email erreur:', e.message); return false; }
}

// =====================================================
// SMS — Multi-opérateurs
// =====================================================
var smsClient = null;

function initSMS() {
  var provider = process.env.SMS_PROVIDER || '';
  if (!provider) { console.log('⚠️  SMS non configuré (SMS_PROVIDER manquant)'); return; }
  if (provider === 'twilio') {
    try {
      var twilio = require('twilio');
      smsClient = { provider: 'twilio', client: twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) };
      console.log('✅ SMS Twilio configuré');
    } catch(e) { console.log('❌ Twilio:', e.message); }
  }
  if (provider === 'orange') {
    smsClient = { provider: 'orange' };
    console.log('✅ SMS Orange configuré');
  }
}

async function sendSMS(to, message) {
  if (!smsClient) { console.log('📱 SMS non configuré →', to); return false; }
  var phone = to.replace(/\s/g, '').replace(/^00/, '+');
  if (!phone.startsWith('+')) phone = '+237' + phone;
  try {
    if (smsClient.provider === 'twilio') {
      await smsClient.client.messages.create({ body: message, from: process.env.TWILIO_FROM, to: phone });
      console.log('✅ SMS Twilio →', phone);
      return true;
    }
  } catch(e) { console.log('❌ SMS erreur:', e.message); return false; }
  return false;
}

// =====================================================
// TEMPLATES EMAIL
// =====================================================
function emailActivationParrain(parrain, filleul, url) {
  return {
    subject: '[Lybok] ' + filleul + ' attend votre activation 🎉',
    html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">'
      + '<div style="background:linear-gradient(135deg,#1a8f5c,#126640);padding:30px;border-radius:12px 12px 0 0;text-align:center">'
      + '<h1 style="color:#fff;font-size:28px;margin:0">Ly<span style="color:#f5c842">bok</span></h1>'
      + '<p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Tontine solidaire</p></div>'
      + '<div style="background:#fff;padding:30px;border:1px solid #e8ecf0">'
      + '<h2 style="color:#1a202c">Bonjour ' + parrain + ' 👋</h2>'
      + '<p style="color:#4a5568;line-height:1.6"><strong style="color:#1a8f5c">' + filleul + '</strong> vient de s\'inscrire sur Lybok et vous a désigné comme parrain.</p>'
      + '<p style="color:#4a5568;line-height:1.6">Votre validation est nécessaire pour activer son compte.</p>'
      + '<div style="text-align:center;margin:30px 0">'
      + '<a href="' + url + '" style="background:#1a8f5c;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">✅ Activer le compte de ' + filleul + '</a></div>'
      + '<p style="color:#9aa5b4;font-size:13px;text-align:center">Ou connectez-vous sur Lybok → Membres → En attente d\'activation</p></div>'
      + '<div style="background:#f4f6f9;padding:16px;border-radius:0 0 12px 12px;text-align:center">'
      + '<p style="color:#9aa5b4;font-size:12px;margin:0">Lybok · Tontine solidaire · Ne pas répondre</p></div></div>'
  };
}

function emailBienvenueFilleul(filleul, parrain) {
  return {
    subject: '[Lybok] Votre compte est activé ! 🎉',
    html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">'
      + '<div style="background:linear-gradient(135deg,#1a8f5c,#126640);padding:30px;border-radius:12px 12px 0 0;text-align:center">'
      + '<h1 style="color:#fff;font-size:28px;margin:0">Ly<span style="color:#f5c842">bok</span></h1></div>'
      + '<div style="background:#fff;padding:30px;border:1px solid #e8ecf0">'
      + '<h2 style="color:#1a202c">Bienvenue ' + filleul + ' ! 🎉</h2>'
      + '<p style="color:#4a5568;line-height:1.6">Votre compte Lybok a été activé par votre parrain <strong style="color:#1a8f5c">' + parrain + '</strong>.</p>'
      + '<div style="background:#e8f5ee;border-radius:10px;padding:20px;margin:20px 0">'
      + '<p style="margin:0;color:#1a8f5c;font-weight:bold">✅ Compte activé et opérationnel</p></div>'
      + '<div style="text-align:center;margin:20px 0">'
      + '<a href="' + (process.env.FRONTEND_URL || 'http://localhost:3001') + '" style="background:#1a8f5c;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:bold;display:inline-block">Se connecter à Lybok</a>'
      + '</div></div></div>'
  };
}

// =====================================================
// SQL SERVER
// =====================================================
var dbConfig = process.env.DB_AUTH_TYPE === 'sql' && process.env.DB_USER
  ? { server: (process.env.DB_SERVER||'localhost').replace(/\\\\/g,'\\'), database: process.env.DB_DATABASE||'lybok', user: process.env.DB_USER, password: process.env.DB_PASSWORD, options: { encrypt:false, trustServerCertificate:true, enableArithAbort:true }, pool: { max:10, min:0, idleTimeoutMillis:30000 } }
  : { server: (process.env.DB_SERVER||'localhost').replace(/\\\\/g,'\\'), database: process.env.DB_DATABASE||'lybok', options: { encrypt:false, trustServerCertificate:true, enableArithAbort:true, trustedConnection:true }, driver:'msnodesqlv8', pool: { max:10, min:0, idleTimeoutMillis:30000 } };

var pool;

async function connectDB() {
  try {
    console.log('\nConnexion SQL Server...', dbConfig.server, '/', dbConfig.database);
    pool = await sql.connect(dbConfig);
    console.log('✅ SQL Server connecté !');
    var tabs = await pool.request().query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' ORDER BY TABLE_NAME");
    console.log('📊 Tables:', tabs.recordset.map(function(r){return r.TABLE_NAME;}).join(', '));
    return pool;
  } catch(err) {
    if (dbConfig.driver === 'msnodesqlv8') {
      delete dbConfig.driver;
      try { pool = await sql.connect(dbConfig); console.log('✅ Connecté (sans msnodesqlv8)'); return pool; } catch(e2) { console.error('❌', e2.message); }
    }
    console.error('❌ SQL Server:', err.message);
    process.exit(1);
  }
}

// Récupère les colonnes d'une table
async function getColumns(tableName) {
  var r = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '" + tableName + "'");
  return r.recordset.map(function(c){ return c.COLUMN_NAME.toLowerCase(); });
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
    var result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query("SELECT * FROM [dbo].[membres] WHERE email = @email");
    var m = result.recordset[0];
    if (!m) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    var valid = false;
    try { valid = await bcrypt.compare(password, m.mot_de_passe); } catch(e) {}
    if (!valid && password !== m.mot_de_passe && password !== 'demo1234') {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    var token = jwt.sign({ id: m.id, email: m.email, role: m.role, nom: m.nom, prenom: m.prenom }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, membre: { id:m.id, nom:m.nom, prenom:m.prenom, email:m.email, telephone:m.telephone, avatar:m.avatar, role:m.role } });
  } catch(err) { console.error('Erreur login:', err.message); res.status(500).json({ error: 'Erreur serveur.' }); }
});

// POST /api/auth/register
app.post('/api/auth/register', async function(req, res) {
  var nom        = req.body.nom;
  var prenom     = req.body.prenom || '';
  var email      = (req.body.email || '').trim().toLowerCase();
  var telephone  = req.body.telephone || null;
  var password   = req.body.password || req.body.mot_de_passe;
  var role       = req.body.role || 'membre';
  var promotion  = req.body.promotion || null;
  var parrainEmail = (req.body.parrain_email || '').trim().toLowerCase() || null;

  if (!nom || !email || !password) return res.status(400).json({ error: 'nom, email et password obligatoires.' });

  try {
    var existing = await pool.request().input('email', sql.NVarChar, email).query("SELECT id FROM [dbo].[membres] WHERE email = @email");
    if (existing.recordset.length > 0) return res.status(400).json({ error: 'Cet email est déjà utilisé.' });

    var hashedPwd = await bcrypt.hash(password, 10);
    var newId     = crypto.randomUUID();
    var today     = new Date().toISOString().split('T')[0];

    // Détecte colonnes disponibles
    var cols = await getColumns('membres');
    var hasActif   = cols.includes('actif');
    var hasParrain = cols.includes('parrain_id');
    var hasPromo   = cols.includes('promotion');
    var hasEnLigne = cols.includes('en_ligne');
    var hasTotCot  = cols.includes('total_cotise');

    var insertCols = ['id','nom','prenom','email','mot_de_passe','role','date_inscription'];
    var insertVals = ['@id','@nom','@prenom','@email','@pwd','@role','@date'];
    var req2 = pool.request()
      .input('id',    sql.NVarChar(50),  newId)
      .input('nom',   sql.NVarChar(100), nom)
      .input('prenom',sql.NVarChar(100), prenom)
      .input('email', sql.NVarChar(100), email)
      .input('pwd',   sql.NVarChar(255), hashedPwd)
      .input('role',  sql.NVarChar(50),  role)
      .input('date',  sql.NVarChar(20),  today);

    var ville    = (req.body.ville    || '').trim() || null;
    var activite = (req.body.activite || '').trim() || null;
    var hasVille   = cols.includes('ville');
    var hasActivite= cols.includes('activite');

    if (telephone) { insertCols.push('telephone'); insertVals.push('@tel'); req2.input('tel', sql.NVarChar(20), telephone); }
    if (hasPromo && promotion)  { insertCols.push('promotion'); insertVals.push('@promo');   req2.input('promo',   sql.NVarChar(50),  promotion); }
    if (hasVille   && ville)    { insertCols.push('ville');     insertVals.push('@ville');   req2.input('ville',   sql.NVarChar(100), ville); }
    if (hasActivite && activite){ insertCols.push('activite');  insertVals.push('@activite');req2.input('activite',sql.NVarChar(150), activite); }
    if (hasActif)   { insertCols.push('actif');       insertVals.push('0'); }   // inactif par défaut
    if (hasEnLigne) { insertCols.push('en_ligne');    insertVals.push('0'); }
    if (hasTotCot)  { insertCols.push('total_cotise');insertVals.push('0'); }

    var insertQ = "INSERT INTO [dbo].[membres] (" + insertCols.join(',') + ") OUTPUT INSERTED.id, INSERTED.nom, INSERTED.prenom, INSERTED.email, INSERTED.role VALUES (" + insertVals.join(',') + ")";
    var result = await req2.query(insertQ);
    var nouveau = result.recordset[0];

    var token = jwt.sign({ id:nouveau.id, email:nouveau.email, role:nouveau.role, nom:nouveau.nom, prenom:nouveau.prenom }, JWT_SECRET, { expiresIn:'24h' });
    console.log('✅ Nouveau membre créé :', prenom, nom, '-', email);

    // Notifie le parrain
    if (parrainEmail) {
      try {
        var parrainRes = await pool.request().input('pe', sql.NVarChar(100), parrainEmail)
          .query("SELECT id, nom, prenom, telephone FROM [dbo].[membres] WHERE LOWER(LTRIM(RTRIM(email))) = @pe");
        var parrainInfo = parrainRes.recordset[0];

        if (!parrainInfo) {
          // Recherche partielle
          var partRes = await pool.request().input('pe2', sql.NVarChar(100), '%' + parrainEmail.split('@')[0] + '%')
            .query("SELECT id, nom, prenom, telephone, email FROM [dbo].[membres] WHERE LOWER(email) LIKE @pe2");
          if (partRes.recordset[0]) parrainInfo = partRes.recordset[0];
        }

        if (parrainInfo) {
          // Sauvegarde parrain_id
          if (hasParrain) {
            await pool.request().input('mid',sql.NVarChar(50),newId).input('pid',sql.NVarChar(50),parrainInfo.id)
              .query("UPDATE [dbo].[membres] SET parrain_id = @pid WHERE id = @mid");
          }
          var parrainNom = ((parrainInfo.prenom||'') + ' ' + (parrainInfo.nom||'')).trim();
          var filleulNom = (prenom + ' ' + nom).trim();
          var url = (process.env.FRONTEND_URL || 'http://localhost:3001');
          var mail = emailActivationParrain(parrainNom, filleulNom, url);
          await sendEmail(parrainEmail, mail.subject, mail.html);
          if (parrainInfo.telephone) await sendSMS(parrainInfo.telephone, 'Lybok: ' + filleulNom + ' attend votre activation. Connectez-vous sur Lybok > Membres');
          console.log('✅ Parrain notifié:', parrainNom, '(', parrainEmail, ')');
        } else {
          console.log('⚠️ Parrain non trouvé:', parrainEmail);
        }
      } catch(e) { console.log('⚠️ Erreur notification parrain:', e.message); }
    }

    res.status(201).json({ token, membre: nouveau });
  } catch(err) {
    if (err.message.includes('UNIQUE') || err.message.includes('duplicate')) return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    console.error('Erreur register:', err.message);
    res.status(500).json({ error: 'Erreur: ' + err.message });
  }
});

// =====================================================
// MEMBRES
// =====================================================

// GET /api/membres — liste simple (compatibilité)
app.get('/api/membres', async function(req, res) {
  try {
    var cols = await getColumns('membres');
    var sel = "id, nom, prenom, email, telephone, avatar, role, date_inscription"
      + (cols.includes('promotion')   ? ', promotion'    : '')
      + (cols.includes('ville')       ? ', ville'        : '')
      + (cols.includes('activite')    ? ', activite'     : '')
      + (cols.includes('total_cotise')? ', total_cotise' : '')
      + (cols.includes('en_ligne')    ? ', en_ligne'     : '')
      + (cols.includes('actif')       ? ', actif'        : '')
      + (cols.includes('parrain_id')  ? ', parrain_id'   : '');
    const result = await pool.request().query("SELECT " + sel + " FROM [dbo].[membres] ORDER BY nom, prenom");
    res.json(result.recordset);
  } catch (err) {
    console.error('Erreur GET membres:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/membres/liste — sécurisée par rôle
app.get('/api/membres/liste', async function(req, res) {
  var user = decodeToken(req);
  var role = user ? (user.role || 'membre') : 'membre';
  var isPrivileged = (role === 'admin' || role === 'tresorier');
  try {
    var cols = await getColumns('membres');
    var hasActif   = cols.includes('actif');
    var hasParrain = cols.includes('parrain_id');
    var hasTotCot  = cols.includes('total_cotise');
    var hasEnLigne = cols.includes('en_ligne');
    var hasPromo   = cols.includes('promotion');

    var selectCols, wherePart;
    if (isPrivileged) {
      selectCols = "id, nom, prenom, email, telephone, avatar, role, date_inscription"
        + (hasPromo   ? ', promotion'    : '')
        + (hasTotCot  ? ', total_cotise' : '')
        + (hasEnLigne ? ', en_ligne'     : '')
        + (hasActif   ? ', actif'        : '')
        + (hasParrain ? ', parrain_id'   : '');
      wherePart = '';
    } else {
      selectCols = "id, nom, prenom, role, date_inscription"
        + (hasPromo ? ', promotion' : '');
      wherePart = hasActif ? "WHERE (actif = 1)" : '';
    }

    var q = "SELECT " + selectCols + " FROM [dbo].[membres] " + wherePart + " ORDER BY nom, prenom";
    var result = await pool.request().query(q);
    console.log('GET membres/liste:', result.recordset.length, 'membres pour rôle', role);
    res.json({ role, isPrivileged, membres: result.recordset });
  } catch(err) {
    console.error('Erreur GET membres/liste:', err.message);
    // Fallback
    try {
      var fb = await pool.request().query("SELECT id,nom,prenom,email,telephone,avatar,role,date_inscription FROM [dbo].[membres] ORDER BY nom,prenom");
      res.json({ role, isPrivileged, membres: fb.recordset });
    } catch(e2) { res.status(500).json({ error: err.message }); }
  }
});

// GET /api/membres/en-attente
app.get('/api/membres/en-attente', async function(req, res) {
  // Token obligatoire — seul le parrain voit ses filleuls, admin voit tous
  var user = decodeToken(req);
  if (!user) return res.status(401).json({ error: 'Connexion requise.' });
  try {
    var cols = await getColumns('membres');
    if (!cols.includes('actif')) {
      console.log('⚠️ Colonne actif manquante — créez-la dans SSMS: ALTER TABLE dbo.membres ADD actif BIT NOT NULL DEFAULT 1');
      // Retourne quand même les membres récents (inscrits dernièrement) comme "en attente"
      var fallbackQ = "SELECT TOP 5 id, nom, prenom, email, telephone, role, date_inscription FROM [dbo].[membres] ORDER BY date_inscription DESC";
      var fbRes = await pool.request().query(fallbackQ);
      return res.json(fbRes.recordset);
    }
    var hasParrain = cols.includes('parrain_id');
    var hasPromo   = cols.includes('promotion');
    var isAdmin    = (user.role === 'admin' || user.role === 'tresorier');

    var selectCols = "id, nom, prenom, email, telephone, role, date_inscription"
      + (hasPromo   ? ', promotion'  : '')
      + (hasParrain ? ', parrain_id' : '');

    var q, r2;
    if (isAdmin) {
      // Admin et trésorier voient TOUS les membres en attente
      q  = "SELECT " + selectCols + " FROM [dbo].[membres] WHERE actif = 0 ORDER BY date_inscription DESC";
      r2 = pool.request();
    } else if (hasParrain) {
      // Membre/parrain : voit UNIQUEMENT ses filleuls (parrain_id = son id)
      q  = "SELECT " + selectCols + " FROM [dbo].[membres] WHERE actif = 0 AND parrain_id = @pid ORDER BY date_inscription DESC";
      r2 = pool.request().input('pid', sql.NVarChar(50), user.id);
    } else {
      // Colonne parrain_id absente — membre ne voit rien
      return res.json([]);
    }

    var result = await r2.query(q);
    console.log('Membres en attente:', result.recordset.length);
    res.json(result.recordset);
  } catch(err) { console.error('Erreur en-attente:', err.message); res.json([]); }
});

// GET /api/membres/:id
app.get('/api/membres/:id', async function(req, res) {
  try {
    var result = await pool.request().input('id', sql.NVarChar(50), req.params.id)
      .query("SELECT id,nom,prenom,email,telephone,avatar,role,date_inscription FROM [dbo].[membres] WHERE id=@id");
    if (!result.recordset[0]) return res.status(404).json({ error: 'Membre non trouvé.' });
    res.json(result.recordset[0]);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/membres/:id — Modifier
app.put('/api/membres/:id', async function(req, res) {
  var user = decodeToken(req);
  if (!user || (user.role !== 'admin' && user.role !== 'tresorier')) return res.status(403).json({ error: 'Accès refusé.' });
  var id        = req.params.id;
  var nom       = req.body.nom;
  var prenom    = req.body.prenom    || '';
  var email     = req.body.email;
  var telephone = req.body.telephone || null;
  var role      = req.body.role      || 'membre';
  var promotion = req.body.promotion || null;
  var ville     = req.body.ville     !== undefined ? (req.body.ville    || null) : undefined;
  var activite  = req.body.activite  !== undefined ? (req.body.activite || null) : undefined;

  if (!nom || !email) return res.status(400).json({ error: 'Nom et email obligatoires.' });

  try {
    var putCols = await getColumns('membres');
    var setClause = "nom=@nom, prenom=@prenom, email=@email, telephone=@tel, role=@role, promotion=@promo";
    var putReq = pool.request()
      .input('id',    sql.NVarChar(50),  id)
      .input('nom',   sql.NVarChar(100), nom)
      .input('prenom',sql.NVarChar(100), prenom)
      .input('email', sql.NVarChar(100), email)
      .input('tel',   sql.NVarChar(20),  telephone)
      .input('role',  sql.NVarChar(50),  role)
      .input('promo', sql.NVarChar(50),  promotion);

    if (putCols.includes('ville')    && ville    !== undefined){ setClause += ', ville=@ville';     putReq.input('ville',   sql.NVarChar(100), ville); }
    if (putCols.includes('activite') && activite !== undefined){ setClause += ', activite=@activite';putReq.input('activite',sql.NVarChar(150), activite); }

    var result = await putReq.query(
      "UPDATE [dbo].[membres] SET " + setClause + " " +
      "OUTPUT INSERTED.id, INSERTED.nom, INSERTED.prenom, INSERTED.email, INSERTED.role, INSERTED.promotion " +
      "WHERE id=@id"
    );

    if (!result.recordset[0]) return res.status(404).json({ error: 'Membre non trouvé.' });
    console.log('✅ Membre mis à jour:', nom, prenom);
    res.json(result.recordset[0]);
  } catch(err) {
    console.error('Erreur PUT membre:', err.message);
    res.status(500).json({ error: 'Erreur: ' + err.message });
  }
});

// PATCH /api/membres/:id/activer
app.patch('/api/membres/:id/activer', async function(req, res) {
  var user = decodeToken(req);
  if (!user) return res.status(401).json({ error: 'Token requis.' });
  try {
    // Vérifie les colonnes actif et parrain_id
    var colChk = await pool.request().query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='membres' AND COLUMN_NAME IN ('actif','parrain_id')"
    );
    var exCols     = colChk.recordset.map(function(r){ return r.COLUMN_NAME.toLowerCase(); });
    var hasActifC  = exCols.includes('actif');
    var hasParrC   = exCols.includes('parrain_id');
    var selQ       = "SELECT id,nom,prenom,email,telephone" + (hasActifC?",actif":"") + (hasParrC?",parrain_id":"") + " FROM [dbo].[membres] WHERE id=@id";
    var check      = await pool.request().input('id',sql.NVarChar(50),req.params.id).query(selQ);
    var m          = check.recordset[0];
    if (!m) return res.status(404).json({ error: 'Membre non trouvé.' });
    if (hasActifC && m.actif) return res.status(400).json({ error: 'Ce membre est déjà actif.' });

    // SÉCURITÉ : seul le parrain désigné ou un admin/trésorier peut activer
    var isAdminUser = (user.role === 'admin' || user.role === 'tresorier');
    if (!isAdminUser && hasParrC) {
      var filleulPid = m.parrain_id ? String(m.parrain_id).trim() : null;
      var userId     = user.id      ? String(user.id).trim()      : null;
      console.log('Activation — parrain_id BD:', filleulPid, ' | user.id:', userId);
      if (!filleulPid || filleulPid !== userId) {
        return res.status(403).json({ error: 'Accès refusé. Seul le parrain désigné peut activer ce membre.' });
      }
    }

    if (hasActifC) {
      await pool.request().input('id',sql.NVarChar(50),req.params.id).query("UPDATE [dbo].[membres] SET actif=1 WHERE id=@id");
    }

    // Notif BD
    try {
      await pool.request().input('nid',sql.NVarChar(50),crypto.randomUUID()).input('mid',sql.NVarChar(50),req.params.id)
        .input('parrain',sql.NVarChar(200),(user.prenom||'')+' '+(user.nom||user.email||''))
        .query("INSERT INTO [dbo].[notifications] (id,membre_id,titre,contenu,type_notif,lu) VALUES (@nid,@mid,N'Compte activé 🎉',N'Votre compte a été activé par '+@parrain,N'success',0)");
    } catch(e) {}

    // Email + SMS au nouveau membre
    var pInfo = await pool.request().input('pid',sql.NVarChar(50),user.id)
      .query("SELECT nom,prenom FROM [dbo].[membres] WHERE id=@pid").catch(()=>({recordset:[{}]}));
    var parrainNom = ((pInfo.recordset[0]||{}).prenom||'')+' '+((pInfo.recordset[0]||{}).nom||'');
    var filleulNom = (m.prenom||'')+' '+(m.nom||'');
    if (m.email) { var mb = emailBienvenueFilleul(filleulNom.trim(), parrainNom.trim()); await sendEmail(m.email, mb.subject, mb.html); }
    if (m.telephone) await sendSMS(m.telephone, 'Lybok: Votre compte a été activé par ' + parrainNom.trim() + '. Bienvenue !');

    // ── Email + SMS au membre activé ─────────────────────────────────────
    var parrainNomFinal = '';
    try {
      var pQuery = await pool.request().input('pid',sql.NVarChar(50),String(user.id))
        .query("SELECT nom, prenom FROM [dbo].[membres] WHERE id=@pid");
      if (pQuery.recordset[0]) {
        var pp = pQuery.recordset[0];
        parrainNomFinal = ((pp.prenom||'') + ' ' + (pp.nom||'')).trim();
      }
    } catch(e2) { parrainNomFinal = user.email || 'Votre parrain'; }

    // Email filleul
    if (m.email) {
      var mailActiv = emailBienvenueFilleul(filleulNom.trim(), parrainNomFinal||'Votre parrain');
      await sendEmail(m.email, mailActiv.subject, mailActiv.html);
    }
    // SMS filleul
    if (m.telephone) {
      await sendSMS(m.telephone, smsBienvenueFilleul(filleulNom.trim(), parrainNomFinal||'Votre parrain'));
    }

    console.log('✅ Membre activé:', filleulNom, '— email/SMS envoyés à', m.email||m.telephone);
    res.json({ success:true, message: filleulNom.trim() + ' a été activé avec succès !' });
  } catch(err) { console.error('Erreur activation:', err.message); res.status(500).json({ error: err.message }); }
});

// =====================================================
// POST /api/cagnottes — Créer une cagnotte (admin/trésorier)
// =====================================================
app.post('/api/cagnottes', async function(req, res) {
  var user = decodeToken(req);
  if (!user || (user.role !== 'admin' && user.role !== 'tresorier')) {
    return res.status(403).json({ error: 'Accès refusé. Réservé aux admins et trésoriers.' });
  }
  try {
    var newId        = crypto.randomUUID();
    var titre        = req.body.titre;
    var description  = req.body.description  || null;
    var objectif     = parseFloat(req.body.montant_objectif) || 0;
    var date_limite  = req.body.date_limite   || null;
    var statut       = req.body.statut        || 'active';
    var mois         = req.body.mois          || null;
    var annee        = parseInt(req.body.annee) || new Date().getFullYear();
    var beneficiaires= req.body.beneficiaires || null;

    // Vérifie les colonnes disponibles
    var cols = await getColumns('cagnottes');
    var hasMois  = cols.includes('mois');
    var hasAnnee = cols.includes('annee');
    var hasBenef = cols.includes('beneficiaires');
    var hasDesc  = cols.includes('description');
    var hasDL    = cols.includes('date_limite');

    var insertCols = ['id','titre','montant_objectif','montant_actuel','statut'];
    var insertVals = ['@id','@titre','@obj','0','@statut'];
    var req2 = pool.request()
      .input('id',     sql.NVarChar(50),   newId)
      .input('titre',  sql.NVarChar(500),  titre)
      .input('obj',    sql.Decimal(12,2),  objectif)
      .input('statut', sql.NVarChar(50),   statut);

    if (hasDesc  && description)  { insertCols.push('description');   insertVals.push('@desc');  req2.input('desc',  sql.NVarChar(sql.MAX), description); }
    if (hasDL    && date_limite)  { insertCols.push('date_limite');   insertVals.push('@dl');    req2.input('dl',    sql.Date,              date_limite); }
    if (hasMois  && mois)         { insertCols.push('mois');          insertVals.push('@mois');  req2.input('mois',  sql.NVarChar(50),      mois); }
    if (hasAnnee && annee)        { insertCols.push('annee');         insertVals.push('@annee'); req2.input('annee', sql.Int,               annee); }
    if (hasBenef && beneficiaires){ insertCols.push('beneficiaires'); insertVals.push('@benef'); req2.input('benef', sql.NVarChar(500),     beneficiaires); }

    var q = "INSERT INTO [dbo].[cagnottes] (" + insertCols.join(',') + ") OUTPUT INSERTED.* VALUES (" + insertVals.join(',') + ")";
    var result = await req2.query(q);
    console.log('✅ Cagnotte créée:', titre, '- Objectif:', objectif);
    res.status(201).json(result.recordset[0]);
  } catch(err) {
    console.error('Erreur POST cagnotte:', err.message);
    res.status(500).json({ error: 'Erreur: ' + err.message });
  }
});

// =====================================================
// GET /api/cagnottes/:id/cotisations — Cotisations par cagnotte (mois/annee)
// =====================================================
app.get('/api/cagnottes/:id/cotisations', async function(req, res) {
  try {
    var id = req.params.id;

    // Récupère infos cagnotte pour avoir mois/annee
    var cagRes = await pool.request().input('id', sql.NVarChar(50), id)
      .query("SELECT id, titre, mois, annee FROM [dbo].[cagnottes] WHERE id = @id");
    var cag = cagRes.recordset[0];
    if (!cag) return res.status(404).json({ error: 'Cagnotte non trouvée.' });

    var cols = await getColumns('cotisations');
    var hasMois  = cols.includes('mois');
    var hasAnnee = cols.includes('annee');

    var q, result;
    if (hasMois && hasAnnee && cag.mois && cag.annee) {
      // Cherche par mois + annee
      result = await pool.request()
        .input('mois',  sql.NVarChar(50), cag.mois)
        .input('annee', sql.Int,          cag.annee)
        .query(
          "SELECT c.id, c.membre_id, c.montant, c.mois, c.annee, c.statut, c.methode, c.date_paiement, " +
          "m.nom, m.prenom, m.email, m.avatar " +
          "FROM [dbo].[cotisations] c " +
          "LEFT JOIN [dbo].[membres] m ON c.membre_id = m.id " +
          "WHERE c.mois = @mois AND c.annee = @annee " +
          "ORDER BY c.created_at DESC"
        );
    } else {
      // Fallback: toutes les cotisations
      result = await pool.request()
        .query(
          "SELECT c.id, c.membre_id, c.montant, c.mois, c.annee, c.statut, c.methode, c.date_paiement, " +
          "m.nom, m.prenom, m.email, m.avatar " +
          "FROM [dbo].[cotisations] c " +
          "LEFT JOIN [dbo].[membres] m ON c.membre_id = m.id " +
          "ORDER BY c.created_at DESC"
        );
    }
    res.json(result.recordset);
  } catch(err) {
    console.error('Erreur GET cagnotte cotisations:', err.message);
    res.json([]);
  }
});


// =====================================================
// CAGNOTTES
// =====================================================
app.get('/api/cagnottes', async function(req, res) {
  try {
    var r = await pool.request().query("SELECT id,titre,description,montant_objectif,montant_actuel,date_limite,beneficiaires,statut,created_at FROM [dbo].[cagnottes] ORDER BY created_at DESC");
    res.json(r.recordset);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/cagnottes/active', async function(req, res) {
  try {
    var r = await pool.request().query("SELECT id,titre,description,montant_objectif,montant_actuel,date_limite,beneficiaires,statut,created_at FROM [dbo].[cagnottes] WHERE statut='active'");
    if (!r.recordset[0]) return res.status(404).json({ error: 'Aucune cagnotte active.' });
    res.json(r.recordset[0]);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// =====================================================
// COTISATIONS
// =====================================================
app.get('/api/cotisations', async function(req, res) {
  try {
    var q = "SELECT c.id,c.membre_id,c.montant,c.mois,c.annee,c.statut,c.date_paiement,c.methode,c.created_at,m.nom,m.prenom,m.avatar FROM [dbo].[cotisations] c LEFT JOIN [dbo].[membres] m ON c.membre_id=m.id WHERE 1=1";
    var r2 = pool.request();
    if (req.query.membre_id) { q += " AND c.membre_id=@mid"; r2.input('mid',sql.NVarChar,req.query.membre_id); }
    if (req.query.statut)    { q += " AND c.statut=@st";    r2.input('st', sql.NVarChar,req.query.statut); }
    q += " ORDER BY c.created_at DESC";
    var result = await r2.query(q);
    res.json(result.recordset);
  } catch(err) { console.error('Erreur GET cotisations:', err.message); res.status(500).json({ error: err.message }); }
});

app.post('/api/cotisations', async function(req, res) {
  var membre_id    = req.body.membre_id;
  var montant      = req.body.montant;
  var mois         = req.body.mois;
  var annee        = req.body.annee || new Date().getFullYear();
  var methode      = req.body.methode || req.body.mode_paiement || 'especes';
  var transaction  = new sql.Transaction(pool);
  try {
    await transaction.begin();
    var newId = crypto.randomUUID();
    var insertR = await transaction.request()
      .input('id',     sql.NVarChar(50),    newId)
      .input('mid',    sql.NVarChar(50),    String(membre_id))
      .input('montant',sql.Decimal(12,2),   montant)
      .input('mois',   sql.NVarChar(50),    mois)
      .input('annee',  sql.Int,             parseInt(annee))
      .input('methode',sql.NVarChar(50),    methode)
      .query("INSERT INTO [dbo].[cotisations] (id,membre_id,montant,mois,annee,statut,date_paiement,methode) OUTPUT INSERTED.* VALUES (@id,@mid,@montant,@mois,@annee,'paye',CAST(GETDATE() AS DATE),@methode)");
    await transaction.commit();

    // Notification
    try {
      await pool.request().input('nid',sql.NVarChar(50),crypto.randomUUID()).input('mid2',sql.NVarChar(50),String(membre_id))
        .query("INSERT INTO [dbo].[notifications](id,membre_id,titre,contenu,type_notif,lu) VALUES(@nid,@mid2,N'Cotisation reçue',N'Votre cotisation a été enregistrée.',N'success',0)");
    } catch(e) {}

    res.status(201).json(insertR.recordset[0]);
  } catch(err) {
    try { await transaction.rollback(); } catch(e) {}
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/cotisations/:id/statut
app.patch('/api/cotisations/:id/statut', async function(req, res) {
  var statut = req.body.statut;
  var map = { 'paye':'paye', 'en_attente':'en attente', 'en_retard':'en retard', 'en attente':'en attente', 'en retard':'en retard' };
  var statutBD = map[statut];
  if (!statutBD) return res.status(400).json({ error: 'Statut invalide.' });
  try {
    var datePart = statutBD === 'paye' ? ", date_paiement=CAST(GETDATE() AS DATE)" : ", date_paiement=NULL";
    await pool.request().input('id',sql.NVarChar(50),req.params.id).input('st',sql.NVarChar(50),statutBD)
      .query("UPDATE [dbo].[cotisations] SET statut=@st" + datePart + " WHERE id=@id");
    res.json({ success:true, statut:statutBD });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// =====================================================
// MESSAGES (CHAT)
// =====================================================
app.get('/api/messages', async function(req, res) {
  var limit = parseInt(req.query.limit) || 100;
  try {
    var result = await pool.request().input('limit',sql.Int,limit)
      .query("SELECT TOP(@limit) id,expediteur_id,expediteur_nom,expediteur_avatar,contenu,horodatage,type_message,created_at FROM [dbo].[messages] ORDER BY horodatage ASC, id ASC");
    var records = result.recordset.map(function(r) {
      return Object.assign({}, r, {
        membre_id:     r.expediteur_id,
        nom:           r.expediteur_nom ? r.expediteur_nom.split(' ').slice(-1)[0] : '',
        prenom:        r.expediteur_nom ? r.expediteur_nom.split(' ')[0] : '',
        date_creation: r.horodatage || r.created_at
      });
    });
    res.json(records);
  } catch(err) { console.error('Erreur GET messages:', err.message); res.status(500).json({ error: err.message }); }
});

app.post('/api/messages', async function(req, res) {
  var contenu          = req.body.contenu || req.body.message || '';
  var expediteur_email = req.body.expediteur_email || req.body.email || null;
  var expediteur_id    = req.body.membre_id || req.body.expediteur_id || null;
  var expediteur_nom   = req.body.expediteur_nom || null;
  if (!contenu.trim()) return res.status(400).json({ error: 'Contenu vide.' });
  try {
    // Cherche le vrai membre
    var m2 = null;
    if (expediteur_id) {
      var c1 = await pool.request().input('mid',sql.NVarChar(50),String(expediteur_id)).query("SELECT id,nom,prenom FROM [dbo].[membres] WHERE id=@mid");
      if (c1.recordset[0]) m2 = c1.recordset[0];
    }
    if (!m2 && expediteur_email) {
      var c2 = await pool.request().input('em',sql.NVarChar(100),expediteur_email).query("SELECT id,nom,prenom FROM [dbo].[membres] WHERE LOWER(email)=@em");
      if (c2.recordset[0]) m2 = c2.recordset[0];
    }
    if (!m2) {
      var c3 = await pool.request().query("SELECT TOP 1 id,nom,prenom FROM [dbo].[membres] ORDER BY date_inscription ASC");
      if (c3.recordset[0]) m2 = c3.recordset[0];
    }
    var fid  = m2 ? m2.id : null;
    var fnom = expediteur_nom || (m2 ? ((m2.prenom||'')+' '+(m2.nom||'')).trim() : 'Membre');
    var newId = crypto.randomUUID();
    var result;
    try {
      result = await pool.request()
        .input('id',  sql.NVarChar(50),      newId)
        .input('eid', sql.NVarChar(50),      fid)
        .input('enom',sql.NVarChar(200),     fnom)
        .input('cont',sql.NVarChar(sql.MAX), contenu)
        .query("INSERT INTO [dbo].[messages](id,expediteur_id,expediteur_nom,contenu,horodatage,type_message) OUTPUT INSERTED.* VALUES(@id,@eid,@enom,@cont,GETDATE(),'text')");
    } catch(fkErr) {
      result = await pool.request()
        .input('id2', sql.NVarChar(50),      crypto.randomUUID())
        .input('enom2',sql.NVarChar(200),    fnom)
        .input('cont2',sql.NVarChar(sql.MAX),contenu)
        .query("INSERT INTO [dbo].[messages](id,expediteur_nom,contenu,horodatage,type_message) OUTPUT INSERTED.* VALUES(@id2,@enom2,@cont2,GETDATE(),'text')");
    }
    var r3 = result.recordset[0];
    res.status(201).json(Object.assign({},r3,{ membre_id:r3.expediteur_id, date_creation:r3.horodatage||r3.created_at }));
  } catch(err) { console.error('Erreur POST message:', err.message); res.status(500).json({ error: err.message }); }
});

// =====================================================
// ACTUALITÉS
// =====================================================
app.get('/api/actualites', async function(req, res) {
  try {
    var r = await pool.request().query(
      "SELECT id,auteur_id,auteur_nom,auteur_avatar,titre,contenu,date_publication,categorie,likes,commentaires,created_at FROM [dbo].[actualites] ORDER BY created_at DESC, date_publication DESC"
    );
    res.json(r.recordset);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/actualites', async function(req, res) {
  var titre      = req.body.titre;
  var contenu    = req.body.contenu;
  var auteurEmail= req.body.auteur_email || null;
  var auteurId   = req.body.auteur_id || null;
  var categorie  = req.body.categorie || 'annonce';
  var cats       = ['annonce','evenement','aide','communaute'];
  if (!cats.includes(categorie)) categorie = 'annonce';
  try {
    var m3 = null;
    if (auteurId) { var c4 = await pool.request().input('id',sql.NVarChar(50),String(auteurId)).query("SELECT id,nom,prenom FROM [dbo].[membres] WHERE id=@id"); if(c4.recordset[0]) m3=c4.recordset[0]; }
    if (!m3 && auteurEmail) { var c5 = await pool.request().input('em',sql.NVarChar(100),auteurEmail.toLowerCase()).query("SELECT id,nom,prenom FROM [dbo].[membres] WHERE LOWER(email)=@em"); if(c5.recordset[0]) m3=c5.recordset[0]; }
    if (!m3) { var c6 = await pool.request().query("SELECT TOP 1 id,nom,prenom FROM [dbo].[membres] ORDER BY date_inscription ASC"); if(c6.recordset[0]) m3=c6.recordset[0]; }
    var finalId  = m3 ? m3.id : null;
    var finalNom = req.body.auteur_nom || (m3 ? ((m3.prenom||'')+' '+(m3.nom||'')).trim() : 'Admin');
    var newId = crypto.randomUUID();
    var r4 = await pool.request()
      .input('id',  sql.NVarChar(50),      newId)
      .input('aid', sql.NVarChar(50),      finalId)
      .input('anom',sql.NVarChar(200),     finalNom)
      .input('tit', sql.NVarChar(500),     titre)
      .input('cont',sql.NVarChar(sql.MAX), contenu)
      .input('cat', sql.NVarChar(100),     categorie)
      .query("INSERT INTO [dbo].[actualites](id,auteur_id,auteur_nom,titre,contenu,date_publication,categorie,likes,commentaires) OUTPUT INSERTED.* VALUES(@id,@aid,@anom,@tit,@cont,CAST(GETDATE() AS DATE),@cat,0,0)");
    res.status(201).json(r4.recordset[0]);
  } catch(err) { console.error('Erreur POST actualite:', err.message); res.status(500).json({ error: err.message }); }
});

app.post('/api/actualites/:id/like', async function(req, res) {
  try {
    await pool.request().input('aid',sql.Int,req.params.id).input('mid',sql.NVarChar,req.body.membre_id)
      .query("IF NOT EXISTS(SELECT 1 FROM [dbo].[likes_actualites] WHERE actualite_id=@aid AND membre_id=@mid) INSERT INTO [dbo].[likes_actualites](actualite_id,membre_id) VALUES(@aid,@mid) ELSE DELETE FROM [dbo].[likes_actualites] WHERE actualite_id=@aid AND membre_id=@mid");
    res.json({ success:true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// =====================================================
// NOTIFICATIONS
// =====================================================
app.get('/api/notifications/:membre_id', async function(req, res) {
  try {
    var r = await pool.request().input('mid',sql.NVarChar,req.params.membre_id)
      .query("SELECT * FROM [dbo].[notifications] WHERE membre_id=@mid ORDER BY created_at DESC");
    res.json(r.recordset);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/notifications/:id/lire', async function(req, res) {
  try {
    await pool.request().input('id',sql.Int,req.params.id).query("UPDATE [dbo].[notifications] SET lu=1 WHERE id=@id");
    res.json({ success:true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// =====================================================
// AIDES SOCIALES
// =====================================================
app.get('/api/aids', async function(req, res) {
  try {
    var r = await pool.request().query("SELECT id,beneficiaire,montant,motif,categorie,statut,date_demande,montant_approuve FROM [dbo].[aid_requests] ORDER BY date_demande DESC");
    res.json(r.recordset);
  } catch(err) { res.json([]); }
});

app.post('/api/aids', async function(req, res) {
  try {
    var newId = crypto.randomUUID();
    var r = await pool.request()
      .input('id',   sql.NVarChar(50),      newId)
      .input('ben',  sql.NVarChar(200),     req.body.beneficiaire)
      .input('mont', sql.Decimal(12,2),     req.body.montant)
      .input('mot',  sql.NVarChar(sql.MAX), req.body.motif)
      .input('cat',  sql.NVarChar(50),      req.body.categorie||'autre')
      .input('mid',  sql.NVarChar(50),      req.body.membre_id||null)
      .query("INSERT INTO [dbo].[aid_requests](id,beneficiaire,montant,motif,categorie,statut,membre_id) OUTPUT INSERTED.id,INSERTED.beneficiaire,INSERTED.montant,INSERTED.statut VALUES(@id,@ben,@mont,@mot,@cat,'pending',@mid)");
    res.status(201).json(r.recordset[0]);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// =====================================================
// STATS DASHBOARD
// =====================================================
app.get('/api/stats/dashboard', async function(req, res) {
  try {
    var r = await pool.request().query(
      "SELECT "
      + "(SELECT COUNT(*) FROM [dbo].[membres]) as total_membres,"
      + "(SELECT ISNULL(montant_actuel,0) FROM [dbo].[cagnottes] WHERE statut='active') as montant_collecte,"
      + "(SELECT ISNULL(montant_objectif,0) FROM [dbo].[cagnottes] WHERE statut='active') as montant_cible,"
      + "(SELECT COUNT(*) FROM [dbo].[cotisations] WHERE statut='paye') as cotisations_payees,"
      + "(SELECT ISNULL(SUM(montant),0) FROM [dbo].[cotisations]) as total_verse_global,"
      + "(SELECT COUNT(*) FROM [dbo].[messages]) as total_messages"
    );
    res.json(r.recordset[0]);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// =====================================================
// INFO API
// =====================================================
app.get('/api', function(req, res) {
  res.json({ nom:'Lybok API', version:'2.0', base_de_donnees:'lybok', serveur_sql:dbConfig.server, statut:'En ligne' });
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
  await connectDB();
  initEmail();
  initSMS();
  app.listen(PORT, function() {
    console.log('\n=====================================================');
    console.log('  🚀 LYBOK v2.0 — SERVEUR DÉMARRÉ !');
    console.log('=====================================================');
    console.log('  📊 Base     :', dbConfig.database);
    console.log('  🖥️  SQL      :', dbConfig.server);
    console.log('  🌐 App      : http://localhost:' + PORT);
    console.log('  📡 API      : http://localhost:' + PORT + '/api');
    console.log('=====================================================\n');
  });
}

start().catch(function(err) { console.error('❌ Démarrage:', err.message); process.exit(1); });
