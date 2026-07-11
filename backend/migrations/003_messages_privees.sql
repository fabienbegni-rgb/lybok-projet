-- =====================================================
-- Migration 003 — Messages privés
-- =====================================================
-- destinataire_id NULL = message du chat de groupe (comportement actuel).
-- destinataire_id renseigné = message privé entre membre_id et destinataire_id.
-- Idempotent.

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS destinataire_id  UUID REFERENCES membres(id),
  ADD COLUMN IF NOT EXISTS est_lu           BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON messages (membre_id, destinataire_id, date_creation);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_rev
  ON messages (destinataire_id, membre_id, date_creation);
