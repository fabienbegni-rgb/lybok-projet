# 🗄️ Architecture de Base de Données - lybok
## Tontine des Anciens Élèves

## 📋 Vue d'ensemble

L'application utilise une architecture SQL pour gérer toutes les données de la tontine. Ce document décrit la structure de la base de données et comment l'intégrer.

## 🏗️ Structure de la Base de Données

### Tables Principales

| Table | Description |
|-------|-------------|
| `members` | Membres de l'association |
| `cagnotes` | Cagnottes mensuelles |
| `contributions` | Cotisations des membres |
| `messages` | Messages du chat |
| `announcements` | Annonces officielles |
| `aid_requests` | Demandes d'aide sociale |
| `aid_payments` | Paiements d'aides |
| `notifications` | Notifications membres |

## 📊 Schéma Relationnel

```
members (1) ──────< (N) contributions
members (1) ──────< (N) messages
members (1) ──────< (N) aid_requests
members (1) ──────< (N) notifications
cagnotes (1) ──────< (N) contributions
aid_requests (1) ──────< (N) aid_payments
```

## 🛠️ Installation

### 1. Créer la base de données

```sql
CREATE DATABASE lybok CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Exécuter le schéma

```bash
mysql -u root -p lybok < src/database/schema.sql
```

Ou simplement exécuter le fichier schema.sql qui crée automatiquement la base `lybok` :

### 3. Configurer l'environnement

```bash
cp .env.example .env
# Modifier les variables selon votre configuration
```

### 4. Installer les dépendances du backend

```bash
npm install express cors mysql2 dotenv bcrypt jsonwebtoken
npm install -D @types/express @types/cors @types/bcrypt @types/jsonwebtoken
```

## 📝 Requêtes SQL Utiles

### Récupérer les cotisations d'un membre

```sql
SELECT 
    c.amount,
    c.payment_date,
    c.status,
    cag.month,
    cag.year
FROM contributions c
JOIN cagnotes cag ON c.cagnote_id = cag.id
WHERE c.member_id = ?
ORDER BY cag.year DESC, cag.month DESC;
```

### Statistiques de la cagnote active

```sql
SELECT 
    cag.month,
    cag.year,
    cag.target_amount,
    cag.collected_amount,
    COUNT(DISTINCT c.member_id) as members_paid,
    (SELECT COUNT(*) FROM members WHERE is_active = TRUE) as total_members,
    ROUND((cag.collected_amount / cag.target_amount) * 100, 2) as completion_percentage
FROM cagnotes cag
LEFT JOIN contributions c ON cag.id = c.cagnote_id AND c.status = 'paid'
WHERE cag.status = 'active'
GROUP BY cag.id;
```

### Membres en retard de cotisation

```sql
SELECT 
    m.name,
    m.email,
    m.phone
FROM members m
WHERE m.is_active = TRUE
AND m.id NOT IN (
    SELECT c.member_id 
    FROM contributions c 
    JOIN cagnotes cag ON c.cagnote_id = cag.id 
    WHERE cag.status = 'active' 
    AND c.status = 'paid'
);
```

### Total des aides distribuées

```sql
SELECT 
    category,
    COUNT(*) as nb_aids,
    SUM(approved_amount) as total_amount
FROM aid_requests
WHERE status IN ('approved', 'paid')
GROUP BY category;
```

## 🔐 Sécurité

### Recommandations

1. **Mots de passe**: Toujours utiliser bcrypt pour le hachage
2. **Requêtes préparées**: Utiliser des requêtes préparées pour éviter les injections SQL
3. **Indexation**: Ajouter des index sur les colonnes fréquemment utilisées
4. **Backups**: Planifier des sauvegardes régulières
5. **Logs**: Activer les logs d'accès pour l'audit

## 🚀 Déploiement

### Options de Base de Données

| Option | Avantages |
|--------|-----------|
| **MySQL** | Populaire, bien supporté |
| **PostgreSQL** | Plus performant, fonctionnalités avancées |
| **SQLite** | Simple, pas besoin de serveur |
| **MariaDB** | Compatible MySQL, open source |

### Migration vers PostgreSQL

Pour migrer vers PostgreSQL, modifiez :

```typescript
// Utiliser pg au lieu de mysql2
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

## 📈 Performance

### Index Recommandés

```sql
-- Index pour les performances
CREATE INDEX idx_contributions_member_status 
ON contributions(member_id, status);

CREATE INDEX idx_contributions_cagnote 
ON contributions(cagnote_id);

CREATE INDEX idx_messages_created 
ON messages(created_at);

CREATE INDEX idx_notifications_unread 
ON notifications(member_id, is_read);
```

### Vues Optimisées

```sql
-- Vue pour le tableau de bord
CREATE VIEW v_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM members WHERE is_active = TRUE) as total_members,
    (SELECT collected_amount FROM cagnotes WHERE status = 'active') as current_collected,
    (SELECT target_amount FROM cagnotes WHERE status = 'active') as current_target,
    (SELECT COUNT(*) FROM aid_requests WHERE status = 'pending') as pending_aids;
```

## 🔄 Synchronisation Frontend-Backend

L'application est conçue pour fonctionner en deux modes :

1. **Mode Démo**: Utilise des données mock (pas de base de données)
2. **Mode Production**: Connecté à la base SQL via l'API

Pour activer le mode production, mettez à jour la variable `VITE_API_URL` dans votre fichier `.env`.

---

**Version**: 1.0  
**Dernière mise à jour**: Janvier 2024
