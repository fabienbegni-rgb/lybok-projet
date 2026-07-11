-- =====================================================
-- Migration 001 — Parrainage et statut d'adhésion
-- =====================================================
-- À exécuter dans l'éditeur SQL de Supabase (ou via psql) contre la base
-- PostgreSQL de production, une fois la connectivité au projet rétablie.
-- Idempotent : peut être relancée sans erreur si déjà appliquée.

ALTER TABLE membres
  ADD COLUMN IF NOT EXISTS ville             TEXT,
  ADD COLUMN IF NOT EXISTS domaine_activite  TEXT,
  ADD COLUMN IF NOT EXISTS statut            TEXT NOT NULL DEFAULT 'actif',
  ADD COLUMN IF NOT EXISTS parrain1_id       UUID REFERENCES membres(id),
  ADD COLUMN IF NOT EXISTS parrain2_id       UUID REFERENCES membres(id);

ALTER TABLE membres
  ADD CONSTRAINT IF NOT EXISTS membres_statut_check
  CHECK (statut IN ('actif', 'en_attente', 'refuse', 'suspendu', 'exclu'));

-- Les membres déjà existants (créés avant cette migration) restent 'actif'
-- par défaut — seuls les nouveaux dossiers d'inscription passeront par
-- 'en_attente' en attendant validation du bureau (voir server.js).
