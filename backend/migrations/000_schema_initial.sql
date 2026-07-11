-- =====================================================
-- Migration 000 — Schéma initial PostgreSQL
-- =====================================================
-- Reconstruit à partir des requêtes SQL réellement utilisées dans
-- backend/server.js (aucun schéma PostgreSQL canonique n'existait dans
-- le dépôt jusqu'ici — l'ancien schema.sql était pour SQL Server et a
-- été retiré). Idempotent : peut être relancée sans erreur.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS membres (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom                TEXT NOT NULL,
  prenom             TEXT,
  email              TEXT NOT NULL UNIQUE,
  telephone          TEXT,
  avatar             TEXT,
  role               TEXT NOT NULL DEFAULT 'membre',
  mot_de_passe       TEXT NOT NULL,
  date_inscription   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  date_modification  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cagnottes (
  id                   SERIAL PRIMARY KEY,
  mois                 TEXT NOT NULL,
  annee                INTEGER NOT NULL,
  montant_cible        NUMERIC(12,2) NOT NULL DEFAULT 0,
  montant_collecte     NUMERIC(12,2) NOT NULL DEFAULT 0,
  montant_cotisation   NUMERIC(12,2) NOT NULL DEFAULT 0,
  statut               TEXT NOT NULL DEFAULT 'active',
  date_limite          TIMESTAMPTZ,
  date_creation        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cotisations (
  id                 SERIAL PRIMARY KEY,
  membre_id          UUID REFERENCES membres(id),
  cagnotte_id        INTEGER REFERENCES cagnottes(id),
  montant            NUMERIC(12,2) NOT NULL,
  mode_paiement      TEXT NOT NULL DEFAULT 'especes',
  statut             TEXT NOT NULL DEFAULT 'paye',
  date_paiement      TIMESTAMPTZ,
  date_creation      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  date_modification  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id             SERIAL PRIMARY KEY,
  membre_id      UUID REFERENCES membres(id),
  contenu        TEXT NOT NULL,
  type_message   TEXT NOT NULL DEFAULT 'message',
  date_creation  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS actualites (
  id             SERIAL PRIMARY KEY,
  titre          TEXT NOT NULL,
  contenu        TEXT NOT NULL,
  auteur_id      UUID REFERENCES membres(id),
  priorite       TEXT NOT NULL DEFAULT 'normal',
  est_active     BOOLEAN NOT NULL DEFAULT TRUE,
  date_creation  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id             SERIAL PRIMARY KEY,
  membre_id      UUID REFERENCES membres(id),
  titre          TEXT NOT NULL,
  contenu        TEXT,
  type           TEXT NOT NULL DEFAULT 'info',
  est_lu         BOOLEAN NOT NULL DEFAULT FALSE,
  date_creation  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
