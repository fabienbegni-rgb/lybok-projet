-- =====================================================
-- SCHÉMA DE LA BASE DE DONNÉES - lybok
-- Tontine des Anciens Élèves
-- SQL Server — DESKTOP-FABINHO\SAGEX3
-- =====================================================
-- Ce fichier reflète la structure réelle de la base lybok

USE [lybok];
GO

-- =====================================================
-- TABLE: dbo.membres (Membres de l'association)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[membres]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[membres] (
        id INT PRIMARY KEY IDENTITY(1,1),
        nom NVARCHAR(100) NOT NULL,
        prenom NVARCHAR(100) NOT NULL,
        email NVARCHAR(150) UNIQUE NOT NULL,
        telephone NVARCHAR(20) NULL,
        avatar NVARCHAR(10) NULL,
        role NVARCHAR(20) DEFAULT 'membre',
        mot_de_passe NVARCHAR(255) NOT NULL,
        est_actif BIT DEFAULT 1,
        date_inscription DATETIME DEFAULT GETDATE(),
        date_modification DATETIME DEFAULT GETDATE()
    );
    PRINT 'Table [dbo].[membres] créée.';
END
ELSE
    PRINT 'Table [dbo].[membres] existe déjà.';
GO

-- =====================================================
-- TABLE: dbo.members (Copie anglophone — compatibilité)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[members]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[members] (
        id INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(150) UNIQUE NOT NULL,
        phone NVARCHAR(20) NULL,
        avatar NVARCHAR(10) NULL,
        role NVARCHAR(20) DEFAULT 'member',
        password_hash NVARCHAR(255) NOT NULL,
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
    PRINT 'Table [dbo].[members] créée.';
END
ELSE
    PRINT 'Table [dbo].[members] existe déjà.';
GO

-- =====================================================
-- TABLE: dbo.cagnottes (Cagnottes mensuelles)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[cagnottes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[cagnottes] (
        id INT PRIMARY KEY IDENTITY(1,1),
        mois NVARCHAR(20) NOT NULL,
        annee INT NOT NULL,
        montant_cible DECIMAL(12,2) NOT NULL,
        montant_collecte DECIMAL(12,2) DEFAULT 0,
        montant_cotisation DECIMAL(12,2) NOT NULL,
        statut NVARCHAR(20) DEFAULT 'a_venir',
        date_limite DATE NULL,
        date_creation DATETIME DEFAULT GETDATE(),
        CONSTRAINT unique_cagnotte UNIQUE (mois, annee)
    );
    PRINT 'Table [dbo].[cagnottes] créée.';
END
ELSE
    PRINT 'Table [dbo].[cagnottes] existe déjà.';
GO

-- =====================================================
-- TABLE: dbo.cotisations (Cotisations des membres)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[cotisations]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[cotisations] (
        id INT PRIMARY KEY IDENTITY(1,1),
        membre_id INT NOT NULL,
        cagnotte_id INT NOT NULL,
        montant DECIMAL(12,2) NOT NULL,
        mode_paiement NVARCHAR(50) NOT NULL,
        reference_paiement NVARCHAR(100) NULL,
        statut NVARCHAR(20) DEFAULT 'en_attente',
        date_paiement DATETIME NULL,
        date_creation DATETIME DEFAULT GETDATE(),
        date_modification DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (membre_id) REFERENCES [dbo].[membres](id) ON DELETE CASCADE,
        FOREIGN KEY (cagnotte_id) REFERENCES [dbo].[cagnottes](id) ON DELETE CASCADE,
        CONSTRAINT unique_cotisation UNIQUE (membre_id, cagnotte_id)
    );
    PRINT 'Table [dbo].[cotisations] créée.';
END
ELSE
    PRINT 'Table [dbo].[cotisations] existe déjà.';
GO

-- =====================================================
-- TABLE: dbo.contributions (Contributions — anglophone)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[contributions]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[contributions] (
        id INT PRIMARY KEY IDENTITY(1,1),
        member_id INT NOT NULL,
        cagnotte_id INT NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        payment_method NVARCHAR(50) NOT NULL,
        payment_reference NVARCHAR(100) NULL,
        status NVARCHAR(20) DEFAULT 'pending',
        payment_date DATETIME NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
    PRINT 'Table [dbo].[contributions] créée.';
END
ELSE
    PRINT 'Table [dbo].[contributions] existe déjà.';
GO

-- =====================================================
-- TABLE: dbo.messages (Messages du chat)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[messages]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[messages] (
        id INT PRIMARY KEY IDENTITY(1,1),
        membre_id INT NOT NULL,
        contenu NVARCHAR(MAX) NOT NULL,
        type_message NVARCHAR(20) DEFAULT 'message',
        est_epingle BIT DEFAULT 0,
        date_creation DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (membre_id) REFERENCES [dbo].[membres](id) ON DELETE CASCADE
    );
    PRINT 'Table [dbo].[messages] créée.';
END
ELSE
    PRINT 'Table [dbo].[messages] existe déjà.';
GO

-- =====================================================
-- TABLE: dbo.actualites (Actualités / Annonces)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[actualites]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[actualites] (
        id INT PRIMARY KEY IDENTITY(1,1),
        titre NVARCHAR(200) NOT NULL,
        contenu NVARCHAR(MAX) NOT NULL,
        auteur_id INT NOT NULL,
        priorite NVARCHAR(20) DEFAULT 'normal',
        est_active BIT DEFAULT 1,
        date_expiration DATETIME NULL,
        date_creation DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (auteur_id) REFERENCES [dbo].[membres](id) ON DELETE CASCADE
    );
    PRINT 'Table [dbo].[actualites] créée.';
END
ELSE
    PRINT 'Table [dbo].[actualites] existe déjà.';
GO

-- =====================================================
-- TABLE: dbo.announcements (Annonces — anglophone)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[announcements]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[announcements] (
        id INT PRIMARY KEY IDENTITY(1,1),
        title NVARCHAR(200) NOT NULL,
        content NVARCHAR(MAX) NOT NULL,
        author_id INT NOT NULL,
        priority NVARCHAR(20) DEFAULT 'normal',
        is_active BIT DEFAULT 1,
        expires_at DATETIME NULL,
        created_at DATETIME DEFAULT GETDATE()
    );
    PRINT 'Table [dbo].[announcements] créée.';
END
ELSE
    PRINT 'Table [dbo].[announcements] existe déjà.';
GO

-- =====================================================
-- TABLE: dbo.likes_actualites (Likes sur les actualités)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[likes_actualites]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[likes_actualites] (
        id INT PRIMARY KEY IDENTITY(1,1),
        actualite_id INT NOT NULL,
        membre_id INT NOT NULL,
        date_creation DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (actualite_id) REFERENCES [dbo].[actualites](id) ON DELETE CASCADE,
        FOREIGN KEY (membre_id) REFERENCES [dbo].[membres](id),
        CONSTRAINT unique_like UNIQUE (actualite_id, membre_id)
    );
    PRINT 'Table [dbo].[likes_actualites] créée.';
END
ELSE
    PRINT 'Table [dbo].[likes_actualites] existe déjà.';
GO

-- =====================================================
-- TABLE: dbo.notifications (Notifications)
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[notifications]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[notifications] (
        id INT PRIMARY KEY IDENTITY(1,1),
        membre_id INT NOT NULL,
        titre NVARCHAR(200) NOT NULL,
        contenu NVARCHAR(MAX) NOT NULL,
        type NVARCHAR(20) DEFAULT 'info',
        est_lu BIT DEFAULT 0,
        lien NVARCHAR(255) NULL,
        date_creation DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (membre_id) REFERENCES [dbo].[membres](id) ON DELETE CASCADE
    );
    PRINT 'Table [dbo].[notifications] créée.';
END
ELSE
    PRINT 'Table [dbo].[notifications] existe déjà.';
GO

-- =====================================================
-- INDEXES
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_cotisations_membre' AND object_id = OBJECT_ID('cotisations'))
    CREATE INDEX idx_cotisations_membre ON [dbo].[cotisations](membre_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_cotisations_cagnotte' AND object_id = OBJECT_ID('cotisations'))
    CREATE INDEX idx_cotisations_cagnotte ON [dbo].[cotisations](cagnotte_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_cotisations_statut' AND object_id = OBJECT_ID('cotisations'))
    CREATE INDEX idx_cotisations_statut ON [dbo].[cotisations](statut);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_messages_date' AND object_id = OBJECT_ID('messages'))
    CREATE INDEX idx_messages_date ON [dbo].[messages](date_creation);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_notifications_membre' AND object_id = OBJECT_ID('notifications'))
    CREATE INDEX idx_notifications_membre ON [dbo].[notifications](membre_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_likes_actualite' AND object_id = OBJECT_ID('likes_actualites'))
    CREATE INDEX idx_likes_actualite ON [dbo].[likes_actualites](actualite_id);

PRINT 'Index créés.';
GO

-- =====================================================
-- VUES
-- =====================================================
IF EXISTS (SELECT * FROM sys.views WHERE name = 'v_cotisations_membres')
    DROP VIEW v_cotisations_membres;
GO

CREATE VIEW v_cotisations_membres AS
SELECT 
    m.id,
    m.nom,
    m.prenom,
    m.email,
    COUNT(c.id) AS total_cotisations,
    ISNULL(SUM(c.montant), 0) AS total_verse,
    MAX(c.date_paiement) AS dernier_paiement
FROM [dbo].[membres] m
LEFT JOIN [dbo].[cotisations] c ON m.id = c.membre_id AND c.statut = 'paye'
GROUP BY m.id, m.nom, m.prenom, m.email;
GO

IF EXISTS (SELECT * FROM sys.views WHERE name = 'v_stats_cagnottes')
    DROP VIEW v_stats_cagnottes;
GO

CREATE VIEW v_stats_cagnottes AS
SELECT 
    cag.id,
    cag.mois,
    cag.annee,
    cag.montant_cible,
    cag.montant_collecte,
    cag.montant_cotisation,
    cag.statut,
    COUNT(DISTINCT cot.membre_id) AS membres_ayant_paye,
    (SELECT COUNT(*) FROM [dbo].[membres] WHERE est_actif = 1) AS total_membres,
    CASE 
        WHEN cag.montant_cible > 0 
        THEN ROUND((cag.montant_collecte / cag.montant_cible) * 100, 2)
        ELSE 0 
    END AS pourcentage
FROM [dbo].[cagnottes] cag
LEFT JOIN [dbo].[cotisations] cot ON cag.id = cot.cagnotte_id AND cot.statut = 'paye'
GROUP BY cag.id, cag.mois, cag.annee, cag.montant_cible, cag.montant_collecte, cag.montant_cotisation, cag.statut;
GO

PRINT 'Vues créées.';
GO

-- =====================================================
-- DONNÉES DE DÉMONSTRATION
-- =====================================================
IF NOT EXISTS (SELECT 1 FROM [dbo].[membres])
BEGIN
    INSERT INTO [dbo].[membres] (nom, prenom, email, telephone, avatar, role, mot_de_passe) VALUES
    (N'Diallo', N'Amadou', N'amadou.diallo@email.com', N'+224622000001', N'👨🏿‍💼', N'admin', N'$2b$10$hash1'),
    (N'Keita', N'Fatoumata', N'fatoumata@email.com', N'+224622000002', N'👩🏿', N'membre', N'$2b$10$hash2'),
    (N'Touré', N'Ibrahim', N'ibrahim@email.com', N'+224622000003', N'👨🏿‍🏫', N'membre', N'$2b$10$hash3'),
    (N'Bah', N'Aïssatou', N'aissatou@email.com', N'+224622000004', N'👩🏿‍🎓', N'membre', N'$2b$10$hash4'),
    (N'Condé', N'Moussa', N'moussa@email.com', N'+224622000005', N'👨🏿‍💻', N'membre', N'$2b$10$hash5'),
    (N'Sylla', N'Mariam', N'mariam@email.com', N'+224622000006', N'👩🏿‍🔬', N'membre', N'$2b$10$hash6'),
    (N'Camara', N'Ousmane', N'ousmane@email.com', N'+224622000007', N'👨🏿‍⚕️', N'membre', N'$2b$10$hash7'),
    (N'Diallo', N'Kadiatou', N'kadiatou@email.com', N'+224622000008', N'👩🏿‍🎨', N'membre', N'$2b$10$hash8'),
    (N'Barry', N'Alpha', N'alpha@email.com', N'+224622000009', N'👨🏿‍🎓', N'membre', N'$2b$10$hash9'),
    (N'Sow', N'Mariama', N'mariama@email.com', N'+224622000010', N'👩🏿‍💼', N'membre', N'$2b$10$hash10');
    
    PRINT '10 membres insérés dans [dbo].[membres].';
END
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[cagnottes])
BEGIN
    INSERT INTO [dbo].[cagnottes] (mois, annee, montant_cible, montant_collecte, montant_cotisation, statut, date_limite) VALUES
    (N'Janvier', 2024, 250000.00, 175000.00, 25000.00, N'active', '2024-01-31'),
    (N'Décembre', 2023, 250000.00, 250000.00, 25000.00, N'terminee', '2023-12-31'),
    (N'Novembre', 2023, 250000.00, 200000.00, 25000.00, N'terminee', '2023-11-30');
    
    PRINT '3 cagnottes insérées dans [dbo].[cagnottes].';
END
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[cotisations])
BEGIN
    INSERT INTO [dbo].[cotisations] (membre_id, cagnotte_id, montant, mode_paiement, statut, date_paiement) VALUES
    (1, 1, 25000.00, N'orange_money', N'paye', '2024-01-10'),
    (2, 1, 25000.00, N'orange_money', N'paye', '2024-01-12'),
    (3, 1, 25000.00, N'mtn_momo', N'en_attente', NULL),
    (4, 1, 25000.00, N'wave', N'paye', '2024-01-16'),
    (5, 1, 25000.00, N'orange_money', N'paye', '2024-01-14'),
    (6, 1, 25000.00, N'mtn_momo', N'en_attente', NULL),
    (7, 1, 25000.00, N'wave', N'paye', '2024-01-18'),
    (8, 1, 25000.00, N'orange_money', N'paye', '2024-01-11'),
    (9, 1, 25000.00, N'orange_money', N'paye', '2024-01-20'),
    (10, 1, 25000.00, N'wave', N'en_attente', NULL),
    -- Décembre 2023
    (1, 2, 25000.00, N'orange_money', N'paye', '2023-12-08'),
    (2, 2, 25000.00, N'wave', N'paye', '2023-12-10'),
    (3, 2, 25000.00, N'mtn_momo', N'paye', '2023-12-12'),
    (4, 2, 25000.00, N'orange_money', N'paye', '2023-12-09'),
    (5, 2, 25000.00, N'orange_money', N'paye', '2023-12-15'),
    (6, 2, 25000.00, N'wave', N'paye', '2023-12-11');
    
    PRINT '16 cotisations insérées dans [dbo].[cotisations].';
END
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[messages])
BEGIN
    INSERT INTO [dbo].[messages] (membre_id, contenu, type_message) VALUES
    (2, N'Bienvenue à tous dans notre groupe Lybok ! 🎉', N'message'),
    (3, N'Merci Fatoumata ! Content de faire partie de cette communauté.', N'message'),
    (1, N'📢 Rappel : Cotisation de janvier = 25 000 FCFA. Merci de régulariser avant le 25.', N'info'),
    (4, N'Mon paiement est fait ce matin ! 🙌', N'message'),
    (5, N'Bravo à tous pour votre ponctualité !', N'message'),
    (7, N'Quelqu''un a des nouvelles du projet d''aide aux étudiants ?', N'message'),
    (1, N'Oui, nous avons déjà aidé 5 étudiants grâce à la cagnotte de décembre.', N'message'),
    (6, N'C''est formidable ! La solidarité en action 💪', N'message'),
    (8, N'Je viens de faire ma cotisation via Wave. Confirmation reçue !', N'message'),
    (9, N'Merci à tous, ensemble nous sommes plus forts 🤝', N'message');
    
    PRINT '10 messages insérés dans [dbo].[messages].';
END
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[actualites])
BEGIN
    INSERT INTO [dbo].[actualites] (titre, contenu, auteur_id, priorite) VALUES
    (N'Aide aux étudiants réussie', N'Grâce à vos contributions de décembre, nous avons aidé 5 étudiants avec leurs frais de scolarité. Merci pour votre générosité !', 1, N'important'),
    (N'Assemblée générale annuelle', N'L''AG se tiendra le 28 janvier à 15h au siège. Tous les membres sont conviés.', 1, N'normal'),
    (N'Rappel cotisation janvier', N'La cotisation de janvier est due avant le 25. Pensez à régulariser votre situation.', 1, N'urgent'),
    (N'Nouveau membre : Alpha Barry', N'Bienvenue à Alpha Barry qui rejoint notre communauté Lybok !', 1, N'normal'),
    (N'Bilan 2023 disponible', N'Le rapport annuel de la tontine est maintenant disponible. Contactez l''admin pour le consulter.', 1, N'important');
    
    PRINT '5 actualités insérées dans [dbo].[actualites].';
END
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[notifications])
BEGIN
    INSERT INTO [dbo].[notifications] (membre_id, titre, contenu, type) VALUES
    (1, N'Cotisation reçue', N'Votre cotisation de 25 000 FCFA pour janvier a été reçue.', N'success'),
    (3, N'Rappel cotisation', N'Votre cotisation de janvier est en attente.', N'warning'),
    (6, N'Rappel cotisation', N'Votre cotisation de janvier est en attente.', N'warning'),
    (10, N'Rappel cotisation', N'Votre cotisation de janvier est en attente.', N'warning'),
    (1, N'Nouvelle demande d''aide', N'Une nouvelle demande d''aide sociale a été soumise.', N'info');
    
    PRINT '5 notifications insérées dans [dbo].[notifications].';
END
GO

-- =====================================================
-- VÉRIFICATION FINALE
-- =====================================================
PRINT '=====================================================';
PRINT '  BASE DE DONNÉES LYBOK — INSTALLATION TERMINÉE';
PRINT '=====================================================';
PRINT '';

SELECT 'membres' AS [Table], COUNT(*) AS [Lignes] FROM [dbo].[membres]
UNION ALL
SELECT 'cagnottes', COUNT(*) FROM [dbo].[cagnottes]
UNION ALL
SELECT 'cotisations', COUNT(*) FROM [dbo].[cotisations]
UNION ALL
SELECT 'messages', COUNT(*) FROM [dbo].[messages]
UNION ALL
SELECT 'actualites', COUNT(*) FROM [dbo].[actualites]
UNION ALL
SELECT 'likes_actualites', COUNT(*) FROM [dbo].[likes_actualites]
UNION ALL
SELECT 'notifications', COUNT(*) FROM [dbo].[notifications]
ORDER BY [Table];
GO
