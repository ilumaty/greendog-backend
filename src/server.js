/* ════════════════════════════════════════
src/server.js
/════════════════════════════════════════ */

// ** IMPORTS **
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// load les env.
dotenv.config()

const app = express()


// ** Variables env.
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI
const NODE_ENV = process.env.NODE_ENV

// Middlewares
app.use(helmet())

app.use(cors({
  origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5179'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Parser json
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))


// ***** ROUTES *****

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// API Routes
import authRoutes from './routes/authRoutes.js'
import dogsRoutes from './routes/dogsRoutes.js'
import postsRoutes from './routes/postsRoutes.js'

app.use('/api/auth', authRoutes)
app.use('/api/dogs', dogsRoutes)
app.use('/api/posts', postsRoutes)

// Handler 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Routes non trouvés',
    path: req.path
  })
})


import { errorHandler } from './middleware/errorHandler.js'
app.use(errorHandler)

// Connection avec MongoDB et server

async function startServer() {
  try {
    if (!MONGODB_URI) {
      console.error('MONGODB_URI pas défini dans .env')
      process.exit(1)
    }

    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB est bien connecté')

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB est déco')
    })


// ***** Lancer le SERVER +log *****

const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════╗
║  Green Dog App - Server lancé    ║
╚══════════════════════════════════╝
  Environment: ${process.env.NODE_ENV}
  Port: ${PORT}
  Database: ${process.env.MONGODB_URI?.split('@')[1]?.split('?')[0] || 'not connected'}
  
  Available routes:
    POST   /api/auth/signup
    POST   /api/auth/login
    GET    /api/dogs/breeds
    GET    /api/posts
    
  link pour lancer le back: http://localhost:${PORT}/health
  
  `)
})

// Arrêt serveur graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  server.close(() => {
    console.log('Serveur et data exiting. Bye bye.')
    process.exit(0)
    })
})

  } catch (error) {
    console.error('Failed serveur:', error.message)
    process.exit(1)
  }
}

startServer().catch(() => process.exit(1))


export default app
