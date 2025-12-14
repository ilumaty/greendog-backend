/* ════════════════════════════════════════
middleware/errorHandler.js
/════════════════════════════════════════ */

// ** Gestion des erreurs **

export const errorHandler = (err, req, res, _next) => {
  console.error('Error:', {
    message: err.message,
    code: err.code,
    statusCode: err.statusCode
  })

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    })
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    })
  }

  // Pour erreur status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }

  // Error génériques
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  })
}

// Gestion erreur
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

export default { errorHandler, AppError }
