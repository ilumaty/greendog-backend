/* ════════════════════════════════════════
src/routes/adminRoutes.js
/════════════════════════════════════════ */

import express from 'express'
import { verifyToken, requireAdmin } from '../middleware/auth.js'
import { getAllUsers, updateUserRole } from '../controllers/adminController.js'

const router = express.Router()

router.get('/users', verifyToken, requireAdmin, getAllUsers)
router.patch('/users/:id/role', verifyToken, requireAdmin, updateUserRole)

export default router
