/* ════════════════════════════════════════
middleware/auth.js
/════════════════════════════════════════ */

// ** IMPORTS **
import jwt from 'jsonwebtoken'

/** Vérification du JSONWEBT
* Injecte userId et user dans req si valide
*/
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant ou invalide',
        code: 'NO_TOKEN'
      })
    }

    // Extrait du token après 'Bearer'
    const token = authHeader.split(' ')[1]

    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    req.userId = decoded.userId
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token a expiré',
        code: 'TOKEN_EXPIRED'
      })
    }
    res.status(401).json({
      success: false,
      message: 'Token non-valide',
      code: 'INVALID_TOKEN'
    })
  }
}

/**
 * Contrôle du role admin
 * Prérequis : verifyToken executé avant
 */
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès ADMIN requis',
      code: 'ADMIN_REQUIRED'
    })
  }
  next()
}

export default { verifyToken, requireAdmin }
