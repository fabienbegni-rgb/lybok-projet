# 🚀 GUIDE COMPLET DE DÉPLOIEMENT — LYBOK
## Pour débutant absolu — De A à Z

> ⏱️ Temps estimé : 30 à 45 minutes
> 💻 Système : Windows 10/11
> ✅ Prérequis : Base de données lybok déjà créée sur SQL Server

---

## 📌 CE QUE VOUS ALLEZ FAIRE

```
ÉTAPE 1  → Installer Node.js (le moteur qui fait tourner l'application)
ÉTAPE 2  → Créer les dossiers du projet
ÉTAPE 3  → Créer les fichiers du backend (le serveur)
ÉTAPE 4  → Configurer la connexion à votre base lybok
ÉTAPE 5  → Installer les dépendances (les outils nécessaires)
ÉTAPE 6  → Copier le frontend (l'interface web)
ÉTAPE 7  → Démarrer l'application
ÉTAPE 8  → Accéder à Lybok dans le navigateur
ÉTAPE 9  → Faire en sorte que ça reste allumé (optionnel)
ÉTAPE 10 → Partager avec les autres membres (optionnel)
```

---

# ÉTAPE 1 : INSTALLER NODE.JS

Node.js est le programme qui permet de faire tourner le serveur de votre application.

### 1.1 — Télécharger Node.js

1. Ouvrez votre navigateur (Chrome, Edge, Firefox...)
2. Allez sur : **https://nodejs.org/fr**
3. Cliquez sur le gros bouton vert **"Télécharger Node.js (LTS)"**
4. Un fichier `.msi` va se télécharger (exemple : `node-v20.11.0-x64.msi`)

### 1.2 — Installer Node.js

1. Double-cliquez sur le fichier téléchargé
2. Cliquez **"Next"** (Suivant)
3. Cochez **"I accept the terms"** (J'accepte)
4. Cliquez **"Next"** → **"Next"** → **"Next"**
5. Cliquez **"Install"** (Installer)
6. Si Windows demande "Voulez-vous autoriser cette application...", cliquez **"Oui"**
7. Cliquez **"Finish"** (Terminer)

### 1.3 — Vérifier que ça marche

1. Appuyez sur les touches **Windows + R** en même temps
2. Tapez **cmd** et appuyez sur Entrée
3. Une fenêtre noire s'ouvre (l'invite de commande)
4. Tapez cette commande et appuyez sur Entrée :

```
node --version
```

5. Vous devriez voir quelque chose comme : `v20.11.0`
6. Tapez aussi :

```
npm --version
```

7. Vous devriez voir : `10.2.4` (ou un autre numéro)

✅ **Si vous voyez des numéros de version, Node.js est installé !**
❌ **Si vous voyez une erreur, redémarrez votre PC et réessayez.**

---

# ÉTAPE 2 : CRÉER LES DOSSIERS DU PROJET

### 2.1 — Ouvrir l'invite de commande

1. Appuyez sur **Windows + R**
2. Tapez **cmd** et appuyez sur Entrée

### 2.2 — Aller sur le Bureau

Tapez cette commande exactement comme écrite, puis appuyez sur Entrée :

```
cd %USERPROFILE%\Desktop
```

### 2.3 — Créer le dossier principal

Tapez ces commandes une par une (appuyez sur Entrée après chaque ligne) :

```
mkdir lybok
cd lybok
mkdir backend
mkdir backend\public
```

### 2.4 — Vérifier

Tapez :

```
dir
```

Vous devriez voir un dossier **backend**. 

✅ **Vous avez maintenant cette structure sur votre Bureau :**
```
Bureau/
  └── lybok/
      └── backend/
          └── public/
```

---

# ÉTAPE 3 : CRÉER LES FICHIERS DU BACKEND

Le backend est le "cerveau" qui connecte votre site web à la base de données lybok.

### 3.1 — Ouvrir le Bloc-notes

1. Appuyez sur **Windows + R**
2. Tapez **notepad** et appuyez sur Entrée

### 3.2 — Créer le fichier package.json

1. Dans le Bloc-notes, copiez-collez **exactement** ce texte :

```json
{
  "name": "lybok-api",
  "version": "1.0.0",
  "description": "Serveur Lybok - Tontine des Anciens",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "jsonwebtoken": "^9.0.2",
    "mssql": "^11.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

2. Cliquez sur **Fichier** → **Enregistrer sous...**
3. En bas, dans **"Type"**, choisissez **"Tous les fichiers (*.*)"**
4. Naviguez vers : **Bureau → lybok → backend**
5. Dans **"Nom du fichier"**, tapez : **package.json**
6. Cliquez **Enregistrer**

### 3.3 — Créer le fichier .env

1. Dans le Bloc-notes, cliquez **Fichier** → **Nouveau**
2. Copiez-collez ce texte :

```
DB_SERVER=DESKTOP-FABINHO\SAGEX3
DB_DATABASE=lybok
DB_AUTH_TYPE=windows
DB_TRUST_SERVER_CERTIFICATE=true
DB_ENCRYPT=false
JWT_SECRET=lybok_secret_2024_mon_association
PORT=3001
FRONTEND_URL=http://localhost:3001
```

> ⚠️ **IMPORTANT** : La ligne DB_SERVER doit contenir le MÊME nom 
> que vous voyez en haut de SQL Server Management Studio (SSMS).
> Regardez dans la barre de titre de SSMS, vous verrez quelque chose comme :
> "DESKTOP-FABINHO\SAGEX3" — c'est ça qu'il faut mettre.

3. Cliquez **Fichier** → **Enregistrer sous...**
4. **"Type"** : choisissez **"Tous les fichiers (*.*)"**
5. Naviguez vers : **Bureau → lybok → backend**
6. **"Nom du fichier"** : tapez **.env** (avec le point devant !)
7. Cliquez **Enregistrer**

### 3.4 — Créer le fichier server.js

C'est le fichier le plus important. Il contient tout le code du serveur.

1. Dans le Bloc-notes, cliquez **Fichier** → **Nouveau**
2. Copiez-collez le contenu du fichier **server.js** (voir section en bas de ce guide)
3. **Fichier** → **Enregistrer sous...**
4. **"Type"** : **"Tous les fichiers (*.*)"**
5. Naviguez vers : **Bureau → lybok → backend**
6. **"Nom du fichier"** : **server.js**
7. Cliquez **Enregistrer**

✅ **Vous devriez maintenant avoir ces fichiers :**
```
Bureau/
  └── lybok/
      └── backend/
          ├── package.json
          ├── .env
          ├── server.js
          └── public/
```

> 💡 **Astuce** : Pour voir le fichier .env, ouvrez l'Explorateur de fichiers,
> allez dans le dossier backend, puis cliquez sur **Affichage** → cochez 
> **"Éléments masqués"**

---

# ÉTAPE 4 : CONFIGURER LA CONNEXION À VOTRE BASE LYBOK

### 4.1 — Trouver le nom de votre serveur SQL

1. Ouvrez **SQL Server Management Studio (SSMS)**
2. Regardez en haut de la fenêtre, dans la barre de titre
3. Vous verrez quelque chose comme :
   **DESKTOP-FABINHO\SAGEX3**
4. C'est votre nom de serveur

### 4.2 — Vérifier le type de connexion

Quand vous vous connectez à SSMS :

- **Si vous choisissez "Authentification Windows"** (pas de login/mot de passe) :
  → Gardez `DB_AUTH_TYPE=windows` dans le fichier .env ✅

- **Si vous tapez un login et mot de passe** :
  → Changez le fichier .env :
  ```
  DB_AUTH_TYPE=sql
  DB_USER=votre_login
  DB_PASSWORD=votre_mot_de_passe
  ```

### 4.3 — Vérifier que la base lybok existe

1. Dans SSMS, dans le panneau de gauche, dépliez **"Bases de données"**
2. Vérifiez que **lybok** apparaît dans la liste ✅
3. Dépliez **lybok** → **Tables**
4. Vérifiez que vous voyez vos tables (dbo.membres, dbo.cagnottes, etc.) ✅

---

# ÉTAPE 5 : INSTALLER LES DÉPENDANCES

Les dépendances sont les "outils" dont le serveur a besoin pour fonctionner.

### 5.1 — Ouvrir l'invite de commande dans le bon dossier

1. Ouvrez l'**Explorateur de fichiers**
2. Allez dans : **Bureau → lybok → backend**
3. Cliquez dans la **barre d'adresse** en haut (là où il y a écrit le chemin)
4. Tapez **cmd** et appuyez sur **Entrée**
5. Une fenêtre noire s'ouvre, déjà dans le bon dossier !

**OU** utilisez la méthode classique :

```
cd %USERPROFILE%\Desktop\lybok\backend
```

### 5.2 — Installer les packages

Tapez cette commande et appuyez sur Entrée :

```
npm install
```

⏳ **Attendez** — ça peut prendre 1 à 3 minutes. Vous allez voir plein de texte défiler.

Quand c'est fini, vous verrez quelque chose comme :
```
added 150 packages in 45s
```

✅ **Un nouveau dossier `node_modules` est apparu dans le dossier backend.**

> ⚠️ Si vous voyez des erreurs rouges avec "ERR!", vérifiez que :
> - Vous êtes bien dans le dossier backend
> - Le fichier package.json existe et est correct
> - Vous avez une connexion Internet

---

# ÉTAPE 6 : COPIER LE FRONTEND

Le frontend est la partie visible de l'application (les pages web, les boutons, etc.).

### 6.1 — Récupérer le fichier du frontend

Le fichier du frontend est **dist/index.html** qui a été généré par le build.

1. Trouvez le fichier **index.html** dans le dossier **dist/** du projet
2. **Copiez** ce fichier
3. **Collez-le** dans : **Bureau → lybok → backend → public**

✅ **Votre structure finale doit être :**
```
Bureau/
  └── lybok/
      └── backend/
          ├── node_modules/     (créé automatiquement)
          ├── public/
          │   └── index.html    ← LE SITE WEB
          ├── package.json
          ├── .env
          └── server.js
```

---

# ÉTAPE 7 : DÉMARRER L'APPLICATION 🚀

### 7.1 — Ouvrir l'invite de commande

Si vous l'avez fermée :
1. Explorateur de fichiers → Bureau → lybok → backend
2. Cliquez dans la barre d'adresse → tapez **cmd** → Entrée

### 7.2 — Lancer le serveur

Tapez cette commande :

```
npm start
```

### 7.3 — Lire le résultat

Si tout va bien, vous verrez :

```
=====================================================
  ✅ Connexion à SQL Server (lybok) réussie !
  🚀 API Lybok démarrée sur http://localhost:3001
=====================================================
  📊 Base de données : lybok
  🖥️  Serveur SQL    : DESKTOP-FABINHO\SAGEX3
  🌐 Frontend       : http://localhost:3001
  📡 API            : http://localhost:3001/api
=====================================================
```

✅ **Le serveur tourne ! Ne fermez PAS cette fenêtre noire !**

### 🔴 Si vous voyez des erreurs :

**Erreur : "Cannot find module 'express'"**
→ Vous n'avez pas fait `npm install`. Retournez à l'ÉTAPE 5.

**Erreur : "Erreur de connexion SQL Server"**
→ Vérifiez que :
- SQL Server est démarré (ouvrez SSMS pour vérifier)
- Le nom du serveur dans .env est correct
- La base lybok existe

**Erreur : "EADDRINUSE port 3001"**
→ Le port est déjà utilisé. Changez `PORT=3002` dans le .env

---

# ÉTAPE 8 : ACCÉDER À LYBOK 🎉

### 8.1 — Ouvrir le navigateur

1. Ouvrez **Chrome**, **Edge**, ou **Firefox**
2. Dans la barre d'adresse, tapez :

```
http://localhost:3001
```

3. Appuyez sur **Entrée**

### 8.2 — Vous devriez voir

La page de connexion de **Lybok** avec :
- Le logo LB
- Le formulaire de connexion
- L'indicateur "Base lybok — SQL Server connecté"

### 8.3 — Se connecter

Utilisez ces identifiants de test :
- **Email** : amadou.diallo@email.com
- **Mot de passe** : demo1234

✅ **FÉLICITATIONS ! Lybok est déployé et fonctionne ! 🎊**

---

# ÉTAPE 9 : GARDER LE SERVEUR ALLUMÉ (Optionnel)

Quand vous fermez la fenêtre noire (cmd), le serveur s'arrête.
Voici comment le garder allumé en permanence.

### Option A : Avec PM2 (recommandé)

PM2 est un outil qui garde le serveur allumé même si vous fermez la fenêtre.

1. Ouvrez une NOUVELLE invite de commande (Windows + R → cmd)
2. Tapez :

```
npm install -g pm2
```

3. Allez dans le dossier backend :

```
cd %USERPROFILE%\Desktop\lybok\backend
```

4. Démarrez avec PM2 :

```
pm2 start server.js --name lybok
```

5. Pour que ça redémarre automatiquement au démarrage de Windows :

```
pm2 save
pm2-startup install
```

**Commandes utiles PM2 :**
```
pm2 status          → Voir si Lybok tourne
pm2 logs lybok      → Voir les messages du serveur
pm2 restart lybok   → Redémarrer
pm2 stop lybok      → Arrêter
```

### Option B : Créer un raccourci de démarrage

1. Faites un clic droit sur le Bureau → **Nouveau** → **Raccourci**
2. Dans "Emplacement", tapez :
```
cmd /k "cd %USERPROFILE%\Desktop\lybok\backend && npm start"
```
3. Cliquez **Suivant**
4. Nommez-le : **Démarrer Lybok**
5. Cliquez **Terminer**

Maintenant, double-cliquez sur ce raccourci pour démarrer Lybok !

---

# ÉTAPE 10 : PARTAGER AVEC LES AUTRES MEMBRES (Optionnel)

### 10.1 — Accès depuis le même réseau Wi-Fi

Si les autres membres sont connectés au MÊME réseau Wi-Fi :

1. Trouvez votre adresse IP :
   - Ouvrez cmd
   - Tapez : `ipconfig`
   - Cherchez **"Adresse IPv4"** (exemple : 192.168.1.45)

2. Les autres membres ouvrent leur navigateur et tapent :
```
http://192.168.1.45:3001
```
(Remplacez par VOTRE adresse IP)

3. Si ça ne marche pas, ouvrez le pare-feu :
   - Ouvrez cmd **en tant qu'Administrateur**
   - Tapez :
```
netsh advfirewall firewall add rule name="Lybok" dir=in action=allow protocol=tcp localport=3001
```

### 10.2 — Accès depuis Internet (avancé)

Pour que les membres puissent se connecter de n'importe où :

**Option 1 : Utiliser ngrok (le plus simple)**
1. Allez sur https://ngrok.com et créez un compte gratuit
2. Téléchargez ngrok
3. Ouvrez une nouvelle invite de commande
4. Tapez :
```
ngrok http 3001
```
5. Vous recevrez une URL publique (exemple : https://abc123.ngrok.io)
6. Partagez cette URL avec les membres !

**Option 2 : Hébergement cloud (permanent)**
→ Voir le guide GUIDE_DEPLOIEMENT.md pour Railway/Vercel

---

# ❓ QUESTIONS FRÉQUENTES

### "Comment j'arrête le serveur ?"
→ Dans la fenêtre noire, appuyez sur **Ctrl + C**

### "Comment je redémarre le serveur ?"
→ Dans la fenêtre noire, tapez `npm start` et Entrée

### "Le site ne s'affiche plus"
→ Vérifiez que la fenêtre noire (serveur) est toujours ouverte
→ Vérifiez que SQL Server est démarré

### "J'ai modifié le fichier .env"
→ Vous devez redémarrer le serveur (Ctrl + C puis npm start)

### "Comment je mets à jour le site ?"
→ Remplacez le fichier `public/index.html` par le nouveau
→ Redémarrez le serveur

### "Comment ajouter un vrai membre ?"
→ Ouvrez SSMS
→ Exécutez :
```sql
USE lybok;
INSERT INTO dbo.membres (nom, prenom, email, telephone, mot_de_passe, role)
VALUES (N'Nom', N'Prénom', N'email@test.com', N'+224600000000', N'hash_mot_de_passe', N'membre');
```

### "Comment sauvegarder ma base de données ?"
→ Dans SSMS :
   1. Clic droit sur **lybok** → **Tâches** → **Sauvegarder...**
   2. Choisissez un emplacement
   3. Cliquez **OK**

---

# 🛟 EN CAS DE PROBLÈME

| Ce que vous voyez | Quoi faire |
|---|---|
| "node n'est pas reconnu" | Redémarrez le PC après l'installation de Node.js |
| "Cannot find module" | Retournez dans le dossier backend et tapez `npm install` |
| "ECONNREFUSED" | SQL Server n'est pas démarré. Ouvrez SSMS pour vérifier |
| "Login failed" | Vérifiez DB_SERVER dans le .env |
| Page blanche | Vérifiez que index.html est dans le dossier public/ |
| "EADDRINUSE" | Le port 3001 est pris. Changez PORT=3002 dans .env |
| Erreur CORS | Vérifiez FRONTEND_URL dans .env |

### Commande de diagnostic

Si rien ne marche, ouvrez cmd et tapez ces commandes :

```
node --version
npm --version
cd %USERPROFILE%\Desktop\lybok\backend
dir
type .env
npm start
```

Copiez tout ce qui s'affiche et envoyez-le à quelqu'un qui peut vous aider.

---

# 📝 RÉCAPITULATIF RAPIDE

```
1. Installer Node.js      → https://nodejs.org
2. Créer les dossiers      → Bureau/lybok/backend/public
3. Créer les 3 fichiers    → package.json, .env, server.js
4. Configurer .env         → Nom de votre serveur SQL
5. npm install             → Installe les outils
6. Copier index.html       → Dans le dossier public/
7. npm start               → Démarre le serveur
8. http://localhost:3001    → Ouvrir dans le navigateur
```

C'est tout ! 🎉
