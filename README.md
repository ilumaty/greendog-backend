<div align="center">
  <img src="docs/Logo_W.png" alt="Green Dog Logo" width="200"/>
  <h2>Backend API</h2>
</div>

API Node.js/Express Green Dog - Plateforme Wiki de partage sur les races de chiens.

## Demarrage rapide

### 1. Installer les dependances
```bash
npm install
```

### 2. Configurer l'environnement
```bash
cp .env.example .env
# Editer .env avec votre URI MongoDB et secrets JWT
```

### 3. Demarrer le serveur de developpement
```bash
npm run dev
```

Le serveur demarre sur `http://localhost:5000`

### 4. Add la base de données avec des données
```bash
npm run seed
```

Ajoute des races de chiens de demonstration dans la base de donnees.

## Structure du projet

```
green-dog-backend/
├── src/
│   ├── config/
│   │   └── database.js        # Connexion MongoDB
│   ├── models/
│   │   ├── User.js            # Schema utilisateur
│   │   ├── Breed.js           # Schema race de chien
│   │   ├── Post.js            # Schema post communaute
│   │   └── Comment.js         # Schema commentaire
│   ├── controllers/
│   │   ├── authController.js  # Logique authentification
│   │   ├── dogsController.js  # Logique races
│   │   └── postsController.js # Logique posts/commentaires
│   ├── routes/
│   │   ├── authRoutes.js      # Routes authentification
│   │   ├── dogsRoutes.js      # Routes races
│   │   └── postsRoutes.js     # Routes communaute
│   ├── middleware/
│   │   ├── auth.js            # Verification JWT
│   │   └── errorHandler.js    # Gestion centralisee des erreurs
│   └── server.js              # Configuration Express
├── scripts/
│   └── seedDatabase.js        # Script de peuplement BDD
├── package.json
├── .env.example
└── README.md
```

## Endpoints disponibles

### Authentification
| Methode | Route | Acces | Description |
|---------|-------|-------|-------------|
| POST | `/api/auth/signup` | Public | Inscription nouvel utilisateur |
| POST | `/api/auth/login` | Public | Connexion utilisateur |
| GET | `/api/auth/profile` | Prive | Obtenir le profil |
| PUT | `/api/auth/profile` | Prive | Modifier le profil |
| POST | `/api/auth/change-password` | Prive | Changer le mot de passe |
| POST | `/api/auth/logout` | Prive | Deconnexion |

### Races de chiens
| Methode | Route | Acces | Description |
|---------|-------|-------|-------------|
| GET | `/api/dogs/breeds` | Public | Liste des races (paginee) |
| GET | `/api/dogs/breeds/:id` | Public | Detail d'une race |
| POST | `/api/dogs/breeds/search` | Public | Recherche textuelle |
| POST | `/api/dogs/breeds/filter` | Public | Filtrage par caracteristiques |
| POST | `/api/dogs/favorites/:id` | Prive | Ajouter aux favoris |
| DELETE | `/api/dogs/favorites/:id` | Prive | Retirer des favoris |
| GET | `/api/dogs/favorites` | Prive | Liste des favoris |

### Communaute (Posts)
| Methode | Route | Acces | Description |
|---------|-------|-------|-------------|
| GET | `/api/posts` | Public | Liste des posts (paginee) |
| POST | `/api/posts` | Prive | Creer un post |
| GET | `/api/posts/:id` | Public | Detail d'un post |
| PUT | `/api/posts/:id` | Prive | Modifier un post (auteur) |
| DELETE | `/api/posts/:id` | Prive | Supprimer un post (auteur) |

### Commentaires
| Methode | Route | Acces | Description |
|---------|-------|-------|-------------|
| GET | `/api/posts/:id/comments` | Public | Liste des commentaires |
| POST | `/api/posts/:id/comments` | Prive | Ajouter un commentaire |
| PUT | `/api/posts/:id/comments/:commentId` | Prive | Modifier (auteur) |
| DELETE | `/api/posts/:id/comments/:commentId` | Prive | Supprimer (auteur) |

## Authentification

Les endpoints prives necessitent un header `Authorization` :
```
Authorization: Bearer {JWT_TOKEN}
```

Le token est retourne lors du login/signup.

## Base de donnees

MongoDB avec Mongoose ODM.

### Modèles
- **users** : Comptes utilisateurs et authentification
- **breeds** : Informations sur les races de chiens
- **posts** : Publications de la communaute
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
# Base de donnees
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

Toutes les reponses suivent la structure :
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
| 200 | Succes |
| 201 | Cree |
| 400 | Requete invalide |
| 401 | Non authentifie |
| 403 | Non autorise |
| 404 | Non trouve |
| 500 | Erreur serveur |

## Securite

- Mots de passe hashes avec bcryptjs (salt: 12)
- Authentification par JWT
- Validation des entrees sur tous les endpoints
- CORS configure pour le frontend
- Middleware de gestion d'erreurs centralise

## Scripts disponibles

```bash
# Développement avec rechargement automatique
npm run dev

# Production
npm start

# add la base de donnees
npm run seed
```

### Configuration production
```bash
NODE_ENV=production npm start
```

---

**Projet** : Green Dog - SAE Institute Geneva  
**Module** : 5FSC0XF101.1 - App Project  
**Auteur** : Leo Maxime  
**Version** : 1.0.0  
**Date** : Novembre 2025
