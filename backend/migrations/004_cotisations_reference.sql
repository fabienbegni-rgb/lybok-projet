-- =====================================================
-- Migration 004 — Référence de paiement sur les cotisations
-- =====================================================
-- Permet au trésorier de retrouver la transaction mobile money déclarée
-- par le membre (numéro utilisé) avant de confirmer. Idempotent.

ALTER TABLE cotisations
  ADD COLUMN IF NOT EXISTS reference_paiement TEXT;
