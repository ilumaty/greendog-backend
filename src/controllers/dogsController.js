/* ════════════════════════════════════════
controllers/dogsController.js
/════════════════════════════════════════ */

// ** IMPORTS **
import Breed from '../models/Breed.js'
import User from '../models/User.js'
import { AppError } from '../middleware/errorHandler.js'

// GET /api/dogs/breeds
export const getBreeds = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const breeds = await Breed.find()
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)

    const total = await Breed.countDocuments()

    res.json({
      success: true,
      data: {
        breeds,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/dogs/breeds/search
export const searchBreeds = async (req, res, next) => {
  try {
    const { query } = req.body

    if (!query || query.trim().length === 0) {
      return next (new AppError('La recherche est requise', 400))
    }

    const breeds = await Breed.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } })

    res.json({
      success: true,
      data: { breeds }
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/dogs/breeds/filter
export const filterBreeds = async (req, res, next) => {
  try {
    const { size, temperament, activityLevel } = req.body

    const filter = {}
    if (size) filter['characteristics.size'] = size
    if (activityLevel) filter['characteristics.activityLevel'] = activityLevel
    if (temperament) filter['characteristics.temperament'] = temperament

    const breeds = await Breed.find(filter)

    res.json({
      success: true,
      data: { breeds }
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/dogs/breeds/:id
export const getBreedById = async (req, res, next) => {
  try {
    const breed = await Breed.findById(req.params.id)

    if (!breed) {
      return next (new AppError('Race non trouvé', 404))
    }

    res.json({
      success: true,
      data: { breed }
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/dogs/favorites/:breedId
export const addFavorite = async (req, res, next) => {
  try {
    const { breedId } = req.params

    // Verify breed exists
    const breed = await Breed.findById(breedId)
    if (!breed) {
      return next (new AppError('Race non trouvé', 404))
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { favorites: breedId } },
      { new: true }
    )

    // Increment favorite count
    await Breed.findByIdAndUpdate(breedId, { $inc: { favoriteCount: 1 } })

    res.json({
      success: true,
      message: 'Ajout au favoris',
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/dogs/favorites/:breedId
export const removeFavorite = async (req, res, next) => {
  try {
    const { breedId } = req.params

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { favorites: breedId } },
      { new: true }
    )

    // Décrémentation des favoris /Race/
    await Breed.findByIdAndUpdate(breedId, { $inc: { favoriteCount: -1 } })

    res.json({
      success: true,
      message: 'Retirer des favoris',
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/dogs/favorites
export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('favorites')

    if (!user) {
      return next (new AppError('Utilisateur non trouvé', 404))
    }

    res.json({
      success: true,
      data: { favorites: user.favorites }
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getBreeds,
  searchBreeds,
  filterBreeds,
  getBreedById,
  addFavorite,
  removeFavorite,
  getFavorites
}
