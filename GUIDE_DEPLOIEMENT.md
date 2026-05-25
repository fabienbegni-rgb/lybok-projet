# 🚀 GUIDE DE DÉPLOIEMENT — LYBOK
## Tontine des Anciens Élèves — Step by Step

---

## 📋 PRÉREQUIS

Avant de commencer, vérifiez que vous avez :

| Logiciel | Version minimum | Vérifier |
|----------|----------------|----------|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| SQL Server | 15+ (vous l'avez ✅) | SSMS connecté |
| Git | 2+ | `git --version` |

Base de données `lybok` déjà créée ✅ (DESKTOP-FABINHO\SAGEX3)

---

## 📁 STRUCTURE DU PROJET

```
lybok/
├── frontend/          ← Application React (ce projet)
│   ├── src/
│   ├── dist/          ← Build généré
│   ├── package.json
│   └── vite.config.ts
│
├── backend/           ← API Node.js (à créer)
│   ├── server.js
│   ├── routes/
│   ├── .env
│   └── package.json
│
└── database/
    └── schema.sql     ← Déjà exécuté ✅
```

---

## ÉTAPE 1 : PRÉPARER LE BACKEND (API)

### 1.1 — Créer le dossier backend

Ouvrez un terminal (PowerShell ou CMD) :

```powershell
# Aller sur le Bureau ou un dossier de votre choix
cd C:\Users\VOTRE_NOM\Desktop

# Créer le dossier du projet complet
mkdir lybok-projet
cd lybok-projet

# Créer le dossier backend
mkdir backend
cd backend
```

### 1.2 — Initialiser le projet Node.js

```powershell
npm init -y
```

### 1.3 — Installer les dépendances

```powershell
npm install express cors mssql dotenv bcryptjs jsonwebtoken
npm install -D nodemon
```

**Ce que chaque package fait :**
| Package | Rôle |
|---------|------|
| `express` | Serveur web API |
| `cors` | Autorise le frontend à appeler l'API |
| `mssql` | Connexion à SQL Server |
| `dotenv` | Variables d'environnement (.env) |
| `bcryptjs` | Hashage des mots de passe |
| `jsonwebtoken` | Tokens d'authentification |
| `nodemon` | Redémarrage auto en développement |

### 1.4 — Créer le fichier .env

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Connexion SQL Server
DB_SERVER=DESKTOP-FABINHO\\SAGEX3
DB_DATABASE=lybok
DB_USER=
DB_PASSWORD=
DB_TRUST_SERVER_CERTIFICATE=true
DB_ENCRYPT=false

# Si vous utilisez l'authentification Windows (pas de user/password)
DB_AUTH_TYPE=windows

# JWT Secret (changez cette valeur !)
JWT_SECRET=lybok_secret_key_2024_changez_moi

# Port du serveur
PORT=3001

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **IMPORTANT** : Si vous utilisez l'authentification Windows dans SSMS 
> (pas de login/mot de passe), laissez `DB_USER` et `DB_PASSWORD` vides 
> et gardez `DB_AUTH_TYPE=windows`

### 1.5 — Créer le serveur (server.js)

Créez le fichier `backend/server.js` — **le contenu est dans le fichier 
`deploy/backend/server.js` de ce projet.**

### 1.6 — Modifier package.json

Dans `backend/package.json`, ajoutez les scripts :

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 1.7 — Tester le backend

```powershell
cd backend
npm run dev
```

Vous devriez voir :
```
✅ Connexion à SQL Server (lybok) réussie !
🚀 API Lybok démarrée sur http://localhost:3001
📊 Tables disponibles: membres, cagnottes, cotisations, messages...
```

**Testez dans le navigateur :** http://localhost:3001/api/membres

---

## ÉTAPE 2 : PRÉPARER LE FRONTEND

### 2.1 — Copier le projet frontend

```powershell
# Retourner au dossier principal
cd C:\Users\VOTRE_NOM\Desktop\lybok-projet

# Copier le dossier frontend (ce projet actuel)
# OU cloner depuis Git si vous l'avez poussé
```

### 2.2 — Configurer l'URL de l'API

Créez un fichier `.env` dans le dossier frontend :

```env
VITE_API_URL=http://localhost:3001/api
```

### 2.3 — Installer les dépendances frontend

```powershell
cd frontend
npm install
```

### 2.4 — Tester en local

```powershell
npm run dev
```

Ouvrez http://localhost:5173 dans le navigateur.

### 2.5 — Générer le build de production

```powershell
npm run build
```

Le dossier `dist/` contient les fichiers à déployer.

---

## ÉTAPE 3 : DÉPLOIEMENT EN PRODUCTION

### Option A : Déploiement sur VOTRE serveur Windows (réseau local)

#### 3A.1 — Installer Node.js sur le serveur

Téléchargez depuis https://nodejs.org et installez.

#### 3A.2 — Copier les fichiers

```powershell
# Copier le dossier backend/ sur le serveur
# Copier le dossier frontend/dist/ sur le serveur
```

#### 3A.3 — Configurer le backend pour servir le frontend

Le fichier `server.js` est déjà configuré pour servir le frontend.
Copiez le contenu de `frontend/dist/` dans `backend/public/`.

```powershell
# Sur le serveur
mkdir backend\public
xcopy frontend\dist\* backend\public\ /E /Y
```

#### 3A.4 — Installer PM2 (garde le serveur en marche)

```powershell
npm install -g pm2
cd backend
pm2 start server.js --name lybok-api
pm2 save
pm2 startup
```

#### 3A.5 — Ouvrir le port dans le pare-feu Windows

```powershell
# En tant qu'administrateur
netsh advfirewall firewall add rule name="Lybok API" dir=in action=allow protocol=tcp localport=3001
```

#### 3A.6 — Accéder à l'application

- Depuis le serveur : http://localhost:3001
- Depuis le réseau : http://IP_DU_SERVEUR:3001

---

### Option B : Déploiement sur Internet (Hébergement Cloud)

#### Étape B.1 — Créer un compte sur Railway (gratuit)

1. Allez sur https://railway.app
2. Connectez-vous avec GitHub
3. Cliquez "New Project"

#### Étape B.2 — Déployer le backend

1. Poussez le code sur GitHub
2. Dans Railway, choisissez "Deploy from GitHub"
3. Sélectionnez le dossier backend
4. Ajoutez les variables d'environnement (.env)

#### Étape B.3 — Déployer le frontend

**Option Vercel (recommandé, gratuit) :**

1. Allez sur https://vercel.com
2. Connectez-vous avec GitHub
3. Importez le projet frontend
4. Ajoutez `VITE_API_URL` = URL de votre API Railway
5. Déployez

**Option Netlify (alternatif, gratuit) :**

1. Allez sur https://netlify.com
2. Drag & drop le dossier `dist/`
3. C'est déployé !

---

### Option C : Tout-en-un avec Docker

#### C.1 — Créer le Dockerfile (backend)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .
COPY frontend/dist/ ./public/
EXPOSE 3001
CMD ["node", "server.js"]
```

#### C.2 — Build et run

```powershell
docker build -t lybok-app .
docker run -p 3001:3001 --env-file backend/.env lybok-app
```

---

## ÉTAPE 4 : CONFIGURER SQL SERVER POUR L'ACCÈS DISTANT

> Nécessaire si le backend et SQL Server sont sur des machines différentes.

### 4.1 — Activer TCP/IP

1. Ouvrez **SQL Server Configuration Manager**
2. Allez dans **SQL Server Network Configuration** → **Protocols for SAGEX3**
3. Activez **TCP/IP**
4. Double-cliquez TCP/IP → Onglet **IP Addresses**
5. En bas, **IPAll** → **TCP Port** = `1433`
6. Redémarrez le service SQL Server

### 4.2 — Ouvrir le port 1433

```powershell
# En tant qu'administrateur
netsh advfirewall firewall add rule name="SQL Server" dir=in action=allow protocol=tcp localport=1433
```

### 4.3 — Activer l'authentification SQL Server

1. Dans SSMS, clic droit sur le serveur → **Propriétés**
2. → **Sécurité** → **Mode d'authentification SQL Server et Windows**
3. Créez un login SQL :

```sql
USE [master]
GO
CREATE LOGIN [lybok_user] WITH PASSWORD = 'VotreMotDePasse123!'
GO
USE [lybok]
GO
CREATE USER [lybok_user] FOR LOGIN [lybok_user]
GO
ALTER ROLE [db_owner] ADD MEMBER [lybok_user]
GO
```

4. Mettez à jour le `.env` :

```env
DB_AUTH_TYPE=sql
DB_USER=lybok_user
DB_PASSWORD=VotreMotDePasse123!
```

---

## ÉTAPE 5 : VÉRIFICATION FINALE

### Checklist ✅

```
[ ] SQL Server lybok — tables créées et peuplées
[ ] Backend démarre sans erreur (npm run dev)
[ ] API répond sur http://localhost:3001/api/membres
[ ] Frontend build généré (npm run build)
[ ] Frontend se connecte au backend
[ ] Page de connexion fonctionne
[ ] Chat envoie et affiche les messages
[ ] Cotisations s'enregistrent dans la base
[ ] Les membres s'affichent correctement
```

### Tester l'API manuellement

```powershell
# PowerShell — tester les endpoints
Invoke-RestMethod http://localhost:3001/api/membres
Invoke-RestMethod http://localhost:3001/api/cagnottes
Invoke-RestMethod http://localhost:3001/api/cotisations
Invoke-RestMethod http://localhost:3001/api/messages
```

---

## 🆘 RÉSOLUTION DE PROBLÈMES

| Problème | Solution |
|----------|----------|
| `ECONNREFUSED` | SQL Server n'est pas démarré ou TCP/IP désactivé |
| `Login failed` | Vérifiez DB_USER/DB_PASSWORD dans .env |
| `CORS error` | Vérifiez FRONTEND_URL dans .env du backend |
| `Port already in use` | Changez PORT dans .env ou tuez le processus |
| `Module not found` | Relancez `npm install` |
| `Build failed` | Vérifiez que Node.js 18+ est installé |

### Commandes utiles

```powershell
# Voir les ports utilisés
netstat -an | findstr 3001
netstat -an | findstr 1433

# Tuer un processus sur un port
npx kill-port 3001

# Vérifier si SQL Server tourne
Get-Service -Name 'MSSQL*'

# Redémarrer SQL Server
Restart-Service -Name 'MSSQL$SAGEX3'
```

---

**Version** : 1.0
**Dernière mise à jour** : 11/05/2026
**Auteur** : Lybok Team
