
/* ════════════════════════════════════════
src/routes/authRoutes.js
/════════════════════════════════════════ */

// ** IMPORTS **
import express from 'express'

import { verifyToken } from '../middleware/auth.js'

import {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/authController.js'

const router = express.Router()

// Public routes

/**
 * POST /api/auth/signup
 * PUBLIC
 * Inscription d'un nouvel user
 * Body: { email: "string", password: "string", firstName: "string", lastName: "string" }
 * Response: { success: true, data: { user, token } }
 */
router.post('/signup', signup)

/**
 * POST /api/auth/login
 * PUBLIC
 * Connexion d'un user existant
 * Body: { email: "string", password: "string" }
 * Response: { success: true, data: { user, token } }
 */
router.post('/login', login)

// Routes privées

/**
 * GET /api/auth/profile
 * PRIVATE
 * Récupère le profil de l'user connecté
 * Headers: Authorization: Bearer <token>
 * Response: { success: true, data: { user } }
 */
router.get('/profile', verifyToken, getProfile)

/**
 * PUT /api/auth/profile
 * PRIVATE
 * Met a jour le profil de l'user connecté
 * Headers: Authorization: Bearer <token>
 * Body: { firstName?: "string", lastName?: "string", avatar?: "string" }
 * Response: { success: true, data: { user } }
 */
router.put('/profile', verifyToken, updateProfile)

/**
 * POST /api/auth/change-password
 * PRIVATE
 * Modifie le mot de passe de l'user connecté
 * Headers: Authorization: Bearer <token>
 * Body: { currentPassword: "string", newPassword: "string" }
 * Response: { success: true, message: "Password updated" }
 */
router.post('/change-password', verifyToken, changePassword)

/**
 * POST /api/auth/logout
 * PRIVATE
 * Déconnexion de l'user
 * Headers: Authorization: Bearer <token>
 * Response: { success: true, message: "Logged out" }
 */
router.post('/logout', verifyToken, logout)

export default router