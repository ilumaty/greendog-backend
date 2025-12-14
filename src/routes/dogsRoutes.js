
/* ════════════════════════════════════════
src/routes/dogsRoutes.js
/════════════════════════════════════════ */

// ** IMPORTS **
import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import {
  getBreeds,
  getBreedById,
  searchBreeds,
  filterBreeds,
  addFavorite,
  removeFavorite,
  getFavorites
} from '../controllers/dogsController.js'

const router = express.Router()

/**
 * GET /api/dogs/favorites
 * Récupère toutes les races favorites de l'user
 * PRIVATE
 * params:
 */
router.get('/favorites', verifyToken, getFavorites)


/**
 * GET /api/dogs/breeds
 * PUBLIC
 * Récupère toutes races avec pagination [voir controller]
 * Query: ?page=1&limit=10
 */
router.get('/breeds', getBreeds)

/**
 * POST /api/dogs/breeds/search
 * Recherche les races par texte
 * PUBLIC
 * Body: { query: "string" }
 */
router.post('/breeds/search', searchBreeds)

/**
 * POST /api/dogs/breeds/filter
 * Filtre les races par caractéristiques
 * PUBLIC
 * Body: { size: "string", temperament: "string", activityLevel: "string" }
 */
router.post('/breeds/filter', filterBreeds)

/**
 * GET /api/dogs/breeds/:id
 * Obtient une race par son ID
 * PUBLIC
 * params: id
 */
router.get('/breeds/:id', getBreedById)

/**
 * POST /api/dogs/favorites/:breedId
 * Ajoute une race aux favoris de l'user
 * PRIVATE
 * params: breedId
 */
router.post('/favorites/:breedId', verifyToken, addFavorite)

/**
 * DELETE /api/dogs/favorites/:breedId
 * Retire une race des favoris de l'user
 * PRIVATE
 * params: breedId
 *
 */
router.delete('/favorites/:breedId', verifyToken, removeFavorite)


export default router
