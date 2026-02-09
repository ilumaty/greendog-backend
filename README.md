<div align="center">
  <img src="docs/Logo_W.png" alt="Green Dog Logo" width="200"/>
  <h1>Backend API</h1>
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
│   │   ├── User.js            # Schéma user
│   │   ├── Breed.js           # Schéma race de chien
│   │   ├── Post.js            # Schéma post
│   │   └── Comment.js         # Schéma commentaire
│   ├── controllers/
│   │   ├── authController.js  # Logique authentification
│   │   ├── dogsController.js  # Logique races
│   │   ├── postsController.js # Logique posts/commentaires
│   │   └── adminController.js # Gestion utilisateurs (admin)
│   ├── routes/
│   │   ├── authRoutes.js      # Routes authentification
│   │   ├── dogsRoutes.js      # Routes races
│   │   └── postsRoutes.js     # Routes posts
│   ├── middleware/
│   │   ├── auth.js            # Vérification JWT
│   │   └── errorHandler.js    # Gestion centralisée des erreurs
│   └── server.js              # Configuration Express
├── scripts/
│   └── seedDatabase.js        # Script BDD
├── package.json
├── .env.example
└── README.md
```

## Endpoints

### Authentification
| Méthode | Route                       | Accès  | Description                    |
|---------|-----------------------------|--------|--------------------------------|
| POST    | `/api/auth/signup`          | Public | Inscription nouvel utilisateur |
| POST    | `/api/auth/login`           | Public | Connexion utilisateur          |
| GET     | `/api/auth/profile`         | Privé  | Obtenir le profil              |
| PUT     | `/api/auth/profile`         | Privé  | Modifier le profil             |
| POST    | `/api/auth/change-password` | Privé  | Changer le mot de passe        |
| POST    | `/api/auth/logout`          | Privé  | Déconnexion                    |

> L’endpoint POST `/change-password` est pleinement fonctionnel côté backend mais n’est pas encore exposé dans l’interface front-end dans le périmètre actuel du projet.
> Il est prévu pour une future évolution du profil utilisateur (sécurité et gestion du compte).

### Races de chiens
| Méthode | Route                     | Accès   | Description                   |
|---------|---------------------------|---------|-------------------------------|
| GET     | `/api/dogs/breeds`        | Public  | Liste des races (paginée)     |
| GET     | `/api/dogs/breeds/:id`    | Public  | Détail d'une race             |
| POST    | `/api/dogs/breeds/search` | Public  | Recherche textuelle           |
| POST    | `/api/dogs/breeds/filter` | Public  | Filtrage par caractéristiques |
| POST    | `/api/dogs/breeds`        | Admin   | Créer une nouvelle race       |
| PUT     | `/api/dogs/breeds/:id`    | Admin   | Modifier une race             |
| DELETE  | `/api/dogs/breeds/:id`    | Admin   | Supprimer une race            |

Le filtrage peut être réalisé côté API (routes dédiées) ou côté client selon le contexte d’utilisation.

### Favoris
| Méthode | Route                          | Accès  | Description                   |
|---------|--------------------------------|--------|-------------------------------|
| GET     | `/api/dogs/favorites`          | Privé  | Liste des races favorites     |
| POST    | `/api/dogs/favorites/:breedId` | Privé  | Ajouter une race aux favoris  |
| DELETE  | `/api/dogs/favorites/:breedId` | Privé  | Retirer une race des favoris  |

### Communauté (Posts)
| Méthode | Route            | Accès  | Description                         |
|---------|------------------|--------|-------------------------------------|
| GET     | `/api/posts`     | Public | Liste des posts (paginée)           |
| POST    | `/api/posts`     | Privé  | Créer un post                       |
| GET     | `/api/posts/:id` | Public | Détail d'un post                    |
| PUT     | `/api/posts/:id` | Privé  | Modifier un post (auteur ou admin)  |
| DELETE  | `/api/posts/:id` | Privé  | Supprimer un post (auteur ou admin) |

### Commentaires (API prête – intégration front-end partielle)

| Méthode | Route                                | Accès  | Description            |
|---------|--------------------------------------|--------|------------------------|
| GET     | `/api/posts/:id/comments`            | Public | Liste des commentaires |
| POST    | `/api/posts/:id/comments`            | Privé  | Ajouter un commentaire |
| PUT     | `/api/posts/:id/comments/:commentId` | Privé  | Modifier (auteur)      |
| DELETE  | `/api/posts/:id/comments/:commentId` | Privé  | Supprimer (auteur)     |

Les routes de gestion des commentaires sont entièrement implémentées côté backend.
Les appels API correspondants (ajout et suppression de commentaires) sont également préparés côté front-end
(service layer).

L’interface utilisateur complète pour l’affichage et la gestion des commentaires n’a pas été intégrée
dans le périmètre actuel du projet, mais l’architecture est prête pour une activation future.

## Authentification

Les endpoints privés nécessitent un header `Authorization` :
```
Authorization: Bearer {JWT_TOKEN}
```

Le token est retourné lors du login/signup.

## Admin (gestion utilisateurs)

| Méthode | Route                         | Accès | Description                       |
|---------|-------------------------------|-------|-----------------------------------|
| GET     | `/api/admin/users`            | Admin | Liste des utilisateurs            |
| PATCH   | `/api/admin/users/:id/role`   | Admin | Modifier le rôle d’un utilisateur |

- Ces routes sont protégées par JWT (`Authorization: Bearer {token}`) + contrôle du rôle `admin`.
- Un administrateur ne peut pas modifier son propre rôle.


## Base de données

MongoDB

### Modèles
- **users** : Comptes utilisateurs et authentification
- **breeds** : Informations sur les races de chiens
- **posts** : Publications de la communauté
- **comments** : Commentaires sur les posts

### Races pré-configurées (seed)
- Staffordshire Bull Terrier
- Labrador Retriever
- Berger Allemand
- Golden Retriever
- Bouledogue Français
- Beagle

## Variables d'environnement

```env
# Base de données
MONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>/<DB_NAME>?retryWrites=true&w=majority

# JWT
JWT_SECRET=votre_secret_jwt_securise
JWT_EXPIRES_IN=7d

# Serveur
PORT=5000
NODE_ENV=development

# Frontend (CORS)
CLIENT_URL=http://localhost:5173
```
Veiller à aligner `CLIENT_URL` avec l’URL réelle du frontend.

## Configuration MongoDB
- **Atlas** : créer un cluster, un utilisateur, autoriser l’IP, puis copier l’URI dans `.env`
- **Local** : `mongodb://127.0.0.1:27017/greendog`
- **Docker** : MongoDB via container, même URI locale
> En environnement de développement, le backend autorise plusieurs ports Vite (`5173`, `5174`, `5179`) afin de faciliter les tests frontend.

## Format des réponses

Les réponses API retournent systématiquement un champ `success` (`true/false`).
Selon l’endpoint, les données peuvent être retournées sous forme de champs dédiés
(ex: `users`, `user`, `posts`, etc..).

### Exemples

```json
{
  "success": true,
  "users": [],
  "count": 0
}
```
```json
{
"success": true,
"message": "Rôle modifié",
"user": {}
}
```
```json
{
"success": false,
"message": "Description de l'erreur"
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

- Mots de passe hashés avec bcryptjs
- Authentification par JWT
- Validation des entrées sur tous les endpoints
- CORS configurés pour le frontend
- Middleware de gestion d'erreurs centralisé

## Scripts disponibles

```bash
# Développement avec rechargement automatique
npm run dev

# Production
npm start

# Initialiser la base de données
npm run seed
```

## License
MIT License


## Frontend

Le frontend React est disponible ici : [greendog-frontend](https://github.com/ilumaty/greendog-frontend)

---
Projet SAE Institute Geneva - 5FSC0XF101.1

