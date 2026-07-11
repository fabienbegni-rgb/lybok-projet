-- =====================================================
-- Migration 002 — Données de démo (dev local uniquement)
-- =====================================================
-- Mot de passe réel pour les 3 comptes ci-dessous : demo1234
-- (utile aussi si DEMO_MODE est un jour désactivé). Ne pas exécuter
-- sur un environnement de production réel.

INSERT INTO membres (nom, prenom, email, telephone, avatar, role, statut, ville, domaine_activite, mot_de_passe)
VALUES
  ('Diallo', 'Amadou', 'amadou.diallo@email.com', '+224622000001', '👨🏿‍💼', 'admin', 'actif', 'Bokito', 'Gestion de projet', '$2a$10$7bZJ0iquA8Sl9FHaLYQ7XOMPWGBd6KLtAqlG1bEq7S7NFgJunMuBy'),
  ('Keita', 'Fatoumata', 'fatoumata@email.com', '+224622000002', '👩🏿', 'membre', 'actif', 'Yaoundé', 'Commerce', '$2a$10$7bZJ0iquA8Sl9FHaLYQ7XOMPWGBd6KLtAqlG1bEq7S7NFgJunMuBy'),
  ('Touré', 'Ibrahim', 'ibrahim@email.com', '+224622000003', '👨🏿‍🏫', 'tresorier', 'actif', 'Douala', 'Enseignement', '$2a$10$7bZJ0iquA8Sl9FHaLYQ7XOMPWGBd6KLtAqlG1bEq7S7NFgJunMuBy')
ON CONFLICT (email) DO NOTHING;

INSERT INTO cagnottes (mois, annee, montant_cible, montant_collecte, montant_cotisation, statut, date_limite)
SELECT 'Janvier', 2024, 200000, 75000, 25000, 'active', NOW() + INTERVAL '25 days'
WHERE NOT EXISTS (SELECT 1 FROM cagnottes WHERE mois = 'Janvier' AND annee = 2024);
