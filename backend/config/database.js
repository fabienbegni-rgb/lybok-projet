const { Pool } = require('pg');
require('dotenv').config();

// Configuration de la connexion à Supabase PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // Important pour Supabase
  }
});

pool.on('error', (err) => {
  console.error('Erreur de connexion à la base de données:', err);
});

module.exports = pool;