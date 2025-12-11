/* ════════════════════════════════════════
        controllers/authController.js
/════════════════════════════════════════ */

// ** IMPORTS **
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { AppError } from '../middleware/errorHandler.js'

// Génère le JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '24h'
  })
}

// POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return next (new AppError('Tous les champs sont requis', 400))
    }

    if (password.length < 6) {
      return next (new AppError('Le mot de passe doit contenir au moins 6 caractères', 400))
    }

    // Contrôle si l'user est existant
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return next (new AppError('Cet email est déjà utilisé', 400))
    }

    // Création de l'user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    })

    // Génère le token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'Good joy, inscription réussie.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token
      }
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return next (new AppError('Email et password sont requis', 400))
    }

    // Cherche l'user + inclu password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return next (new AppError('Identifiants invalides', 401))
    }

    // Compare le password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return next (new AppError('Identifiants invalides', 401))
    }

    // Update dernière connection
    user.lastLogin = new Date()
    await user.save()

    // Génère le token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Tu es connecté',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token
      }
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/auth/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('favorites', 'name characteristics.size')
    
    if (!user) {
      return next (new AppError('User non trouvé', 404))
    }

    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

// PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, bio, avatar } = req.body
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        ...(firstName && { firstName: firstName.trim() }),
        ...(lastName && { lastName: lastName.trim() }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      { new: true, runValidators: true }
    )

    if (!user) {
      return next (new AppError('User non trouvé', 404))
    }

    res.json({
      success: true,
      message: 'Profile modifié avec grand succès',
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return next (new AppError('Les deux mot de passe sont requis', 400))
    }

    if (newPassword.length < 6) {
      return next (new AppError('Le nouveau mot de passe doit contenir plus de 6 caractères', 400))
    }

    const user = await User.findById(req.userId).select('+password')
    if (!user) {
      return next (new AppError('User non trouvé', 404))
    }

    // Vérifie le mot de passe actuel
    const isValid = await user.comparePassword(currentPassword)

    if (!isValid) {
      return next (new AppError('Mot de passe actuel incorrect', 401))
    }

    // Le hook est en pre-save hash en clair auto
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Mot de passe modifié'
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/logout
export const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Tu es déconnecté'
  })
}

export default {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
}
