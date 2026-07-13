-- =====================================================
-- Migration 005 — Compte système (messages automatiques)
-- =====================================================
-- Un membre spécial "Lybok Système" qui envoie des messages privés
-- automatiques (ex: confirmation de déclaration de cotisation).
-- statut='systeme' l'exclut de l'annuaire, du parrainage, du login
-- (voir server.js), tout en le laissant apparaître normalement comme
-- expéditeur dans les conversations privées. Idempotent.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'membres_statut_check'
  ) THEN
    ALTER TABLE membres
      ADD CONSTRAINT membres_statut_check
      CHECK (statut IN ('actif', 'en_attente', 'refuse', 'suspendu', 'exclu', 'systeme'));
  ELSE
    ALTER TABLE membres DROP CONSTRAINT membres_statut_check;
    ALTER TABLE membres
      ADD CONSTRAINT membres_statut_check
      CHECK (statut IN ('actif', 'en_attente', 'refuse', 'suspendu', 'exclu', 'systeme'));
  END IF;
END $$;

INSERT INTO membres (id, nom, prenom, email, avatar, role, statut, mot_de_passe, date_inscription, date_modification)
VALUES (
  '0a14ce0f-0dfc-48de-8682-414c25f6fd99',
  'Système', 'Lybok', 'systeme@lybok.local', '🤖', 'membre', 'systeme',
  -- hash bcrypt inexploitable (aucun mot de passe en clair ne correspondra) ; le login est
  -- de toute façon bloqué explicitement pour statut='systeme' côté serveur.
  '$2a$10$0000000000000000000000000000000000000000000000000000',
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;
