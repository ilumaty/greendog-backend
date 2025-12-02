<div align="center">
  <img src="docs/Logo_W.png" alt="Green Dog Logo" width="200"/>
  <h2>Backend API</h2>
</div>

API Node.js/Express - Plateforme Wiki de partage sur les chiens

## Démarrage rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer l'environnement
```bash
cp .env.example .env
# Editer .env avec votre URI MongoDB et secrets JWT
```

### 3. Démarrer le serveur de développement
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### 4. Initialiser la base de données
```bash
npm run seed
```

Ajoute des races de chiens et données de démonstration

## Structure du projet

```
green-dog-backend/
├── src/
│   ├── config/
│   │   └── database.js        # Connexion MongoDB
│   ├── models/
│   │   ├── User.js            # Schema user
│   │   ├── Breed.js           # Schema race de chien
│   │   ├── Post.js            # Schema post
│   │   └── Comment.js         # Schema commentaire
│   ├── controllers/
│   │   ├── authController.js  # Logique authentification
│   │   ├── dogsController.js  # Logique races
│   │   └── postsController.js # Logique posts/commentaires
│   ├── routes/
│   │   ├── authRoutes.js      # Routes authentification
│   │   ├── dogsRoutes.js      # Routes races
│   │   └── postsRoutes.js     # Routes posts
│   ├── middleware/
│   │   ├── auth.js            # Verification JWT
│   │   └── errorHandler.js    # Gestion centralisée des erreurs
│   └── server.js              # Configuration Express
├── scripts/
│   └── seedDatabase.js        # Script BDD
├── package.json
├── .env.example
└── README.md
```

## Endpoints disponibles

### Authentification
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | `/api/auth/signup` | Public | Inscription nouvel utilisateur |
| POST | `/api/auth/login` | Public | Connexion utilisateur |
| GET | `/api/auth/profile` | Privé | Obtenir le profil |
| PUT | `/api/auth/profile` | Privé | Modifier le profil |
| POST | `/api/auth/change-password` | Privé | Changer le mot de passe |
| POST | `/api/auth/logout` | Privé | Déconnexion |

### Races de chiens
| Methode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | `/api/dogs/breeds` | Public | Liste des races (paginee) |
| GET | `/api/dogs/breeds/:id` | Public | Detail d'une race |
| POST | `/api/dogs/breeds/search` | Public | Recherche textuelle |
| POST | `/api/dogs/breeds/filter` | Public | Filtrage par caracteristiques |
| POST | `/api/dogs/favorites/:id` | Privé | Ajouter aux favoris |
| DELETE | `/api/dogs/favorites/:id` | Privé | Retirer des favoris |
| GET | `/api/dogs/favorites` | Privé | Liste des favoris |

### Communauté (Posts)
| Methode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | `/api/posts` | Public | Liste des posts (paginée) |
| POST | `/api/posts` | Privé | Créer un post |
| GET | `/api/posts/:id` | Public | Détail d'un post |
| PUT | `/api/posts/:id` | Privé | Modifier un post (auteur) |
| DELETE | `/api/posts/:id` | Privé | Supprimer un post (auteur) |

### Commentaires
| Methode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | `/api/posts/:id/comments` | Public | Liste des commentaires |
| POST | `/api/posts/:id/comments` | Privé | Ajouter un commentaire |
| PUT | `/api/posts/:id/comments/:commentId` | Privé | Modifier (auteur) |
| DELETE | `/api/posts/:id/comments/:commentId` | Privé | Supprimer (auteur) |

## Authentification

Les endpoints privés nécessitent un header `Authorization` :
```
Authorization: Bearer {JWT_TOKEN}
```

Le token est retourné lors du login/signup.

## Base de données

MongoDB

### Modèles
- **users** : Comptes utilisateurs et authentification
- **breeds** : Informations sur les races de chiens
- **posts** : Publications de la communauté
- **comments** : Commentaires sur les posts

### Races pre-configurées (seed)
- Staffordshire Bull Terrier
- Labrador Retriever
- Berger Allemand
- Golden Retriever
- Bouledogue Francais
- Beagle

## Variables d'environnement

```env
# Base de données
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greendog

# JWT
JWT_SECRET=votre_secret_jwt_securise
JWT_EXPIRES_IN=7d

# Serveur
PORT=5000
NODE_ENV=development

# Frontend (CORS)
CLIENT_URL=http://localhost:3000
```

## Gestion des erreurs

Toutes les réponses suivent la structure :
```json
{
  "success": true/false,
  "message": "Message descriptif",
  "data": {}
}
```

### Codes HTTP
| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Crée |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Non trouvé |
| 500 | Erreur serveur |

## Sécurité

- Mots de passe hashes avec bcryptjs
- Authentification par JWT
- Validation des entrées sur tous les endpoints
- CORS configuré pour le frontend
- Middleware de gestion d'erreurs centralisé

## Scripts disponibles

```bash
# Développement avec rechargement automatique
npm run dev

# Production
npm start

# Initialiser la base de données
npm run seed

---

**Projet** : Green Dog - SAE Institute Geneva  
**Module** : 5FSC0XF101.1 - App Project  
**Auteur** : Leo Maxime  
**Version** : 1.0.0  
**Date** : Novembre 2025
