# 🎓 DAN — Assistant Pédagogique IA

> Générez des plans pédagogiques complets avec évaluations en quelques secondes grâce à l'IA Gemini.

---

## ✨ Fonctionnalités

- **Authentification JWT** — Inscription / Connexion avec rôles (enseignant / admin)
- **Génération IA** — Plan pédagogique complet (titre, objectifs, prérequis, introduction, plan détaillé, activités, matériel, conclusion)
- **Évaluations automatiques** — QCM, questions ouvertes, exercice pratique, corrigé détaillé
- **Export PDF** — Mise en page professionnelle prête à imprimer
- **Gestion des plans** — Sauvegarde, favoris, suppression, recherche
- **Design moderne** — Interface sombre, responsive, adaptée aux enseignants

---

## 🏗 Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Python 3.11+, Django 4.2, Django REST Framework |
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Base de données | PostgreSQL 15+ |
| IA | Google Gemini 1.5 Flash |
| Auth | JWT (SimpleJWT) |
| PDF | ReportLab |

---

## 📁 Structure du projet

```
dan/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env                  ← Variables d'environnement
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── apps/
│       ├── users/            ← Auth, modèle User
│       ├── plans/            ← Modèle + API plans pédagogiques
│       └── ai_generator/     ← Service Gemini + génération PDF
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── .env
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── index.css
        ├── types/            ← Types TypeScript
        ├── context/          ← AuthContext
        ├── services/         ← Appels API (axios)
        ├── pages/            ← Pages React
        └── components/       ← Composants réutilisables
```

---

## 🚀 Installation & Lancement

### Prérequis

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Clé API Gemini : https://aistudio.google.com/app/apikey

---

### 1️⃣ Base de données PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base et l'utilisateur
CREATE DATABASE dan_db;
CREATE USER dan_user WITH PASSWORD 'dan_password';
GRANT ALL PRIVILEGES ON DATABASE dan_db TO dan_user;
\q
```

---

### 2️⃣ Backend Django

```bash
cd backend

# Créer et activer l'environnement virtuel
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
# Ouvrez .env et remplacez :
#   - GEMINI_API_KEY  → votre vraie clé Gemini
#   - DB_PASSWORD     → mot de passe PostgreSQL
#   - SECRET_KEY      → une chaîne aléatoire sécurisée

# Appliquer les migrations
python manage.py migrate

# (Optionnel) Créer un super-utilisateur admin
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

Le backend tourne sur **http://localhost:8000**

---

### 3️⃣ Frontend React

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application est accessible sur **http://localhost:5173**

---

## 🔌 API Endpoints

### Authentification

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/auth/register/` | Inscription |
| POST | `/api/auth/login/` | Connexion (retourne JWT) |
| POST | `/api/auth/token/refresh/` | Rafraîchir le token |
| GET/PUT | `/api/auth/me/` | Profil utilisateur |

### Plans pédagogiques

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/generate-plan/` | Générer un plan avec IA |
| GET | `/api/plans/` | Liste de tous mes plans |
| GET | `/api/plans/{id}/` | Détail d'un plan |
| PATCH | `/api/plans/{id}/` | Modifier (ex: favoris) |
| DELETE | `/api/plans/{id}/` | Supprimer un plan |
| GET | `/api/plans/{id}/pdf/` | Télécharger le PDF |

---

## ⚙️ Variables d'environnement

### `backend/.env`

| Variable | Description | Exemple |
|----------|-------------|---------|
| `SECRET_KEY` | Clé secrète Django | `abc123...` |
| `DEBUG` | Mode debug | `True` / `False` |
| `DB_NAME` | Nom de la base | `dan_db` |
| `DB_USER` | Utilisateur PostgreSQL | `dan_user` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `mot_de_passe` |
| `DB_HOST` | Hôte PostgreSQL | `localhost` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `GEMINI_API_KEY` | **Clé API Gemini** ⚠️ | `AIza...` |
| `GEMINI_MODEL` | Modèle Gemini | `gemini-1.5-flash` |
| `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` | Durée token d'accès | `60` |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | Durée token de rafraîchissement | `7` |
| `CORS_ALLOWED_ORIGINS` | URLs frontend autorisées | `http://localhost:5173` |

---

## 🔐 Sécurité en production

1. **SECRET_KEY** : Générer avec `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
2. **DEBUG=False** en production
3. **ALLOWED_HOSTS** : Ajouter votre domaine réel
4. **CORS_ALLOWED_ORIGINS** : Mettre uniquement l'URL de votre frontend
5. Utiliser **HTTPS** en production
6. Ne jamais committer le fichier `.env` (il est dans `.gitignore`)

---

## 🌐 Administration Django

Accédez à **http://localhost:8000/admin/** avec les identifiants du superutilisateur créé.

---

## 📦 Build production frontend

```bash
cd frontend
npm run build
# Les fichiers sont générés dans frontend/dist/
```

---

## 🐛 Résolution de problèmes courants

**Erreur `psycopg2`** → Vérifiez que PostgreSQL est démarré et que les identifiants dans `.env` sont corrects.

**Erreur Gemini API** → Vérifiez que `GEMINI_API_KEY` est correctement défini dans `backend/.env`.

**CORS error** → Vérifiez que `CORS_ALLOWED_ORIGINS` contient bien `http://localhost:5173`.

**`ModuleNotFoundError`** → Vérifiez que le virtualenv est activé : `source venv/bin/activate`.

---

## 👨‍💻 Développé avec ❤️ par DAN
