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

// POST /api/dogs/breeds
export const createBreed = async (req, res, next) => {
  try {
    const { name, description, characteristics } = req.body

    // Vérifie si les champs obligatoires sont présents
    if (!name || !description || !characteristics?.size) {
      return next(new AppError('name, description et characteristics.size sont requis', 400))
    }

    // Créer la race par nom et description dans la BDD
    const breed = await Breed.create({
      ...req.body,
      name: name.trim(),
      description: description.trim()
    })

    return res.status(201).json({
      success: true,
      message: 'Race ajoutée',
      data: { breed }
    })
  } catch (error) {
    next(error)
  }
}

// PUT /api/dogs/breeds/:id (ADMIN)
export const updateBreed = async (req, res, next) => {
  try {
    const { name, description, characteristics, images, origin, lifespan } = req.body

    const breed = await Breed.findById(req.params.id)
    if (!breed) {
      return next(new AppError('Race non trouvée', 404))
    }

    // MàJ des champs
    if (name) breed.name = name.trim()
    if (description) breed.description = description.trim()
    if (characteristics) breed.characteristics = { ...breed.characteristics, ...characteristics }
    if (images) breed.images = images
    if (origin) breed.origin = origin
    if (lifespan) breed.lifespan = lifespan

    await breed.save()

    res.json({
      success: true,
      message: 'Race modifiée avec succès',
      data: { breed }
    })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/dogs/breeds/:id (Admin only)
export const deleteBreed = async (req, res, next) => {
  try {
    const breed = await Breed.findById(req.params.id)
    if (!breed) {
      return next(new AppError('Race non trouvée', 404))
    }

    // Retire la race des favoris de tous les users
    await User.updateMany(
        { favorites: req.params.id },
        { $pull: { favorites: req.params.id } }
    )

    await Breed.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Race supprimée avec succès'
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
    await Breed.findByIdAndUpdate(breedId, { $max: { favoriteCount: 0 } })

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
  createBreed,
  updateBreed,
  deleteBreed,
  addFavorite,
  removeFavorite,
  getFavorites
}
