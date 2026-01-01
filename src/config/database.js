/* ════════════════════════════════════════
config/database.js
/════════════════════════════════════════ */

// ** IMPORTS **
import mongoose from 'mongoose'

export const connectDB = async () => {
  try {

    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connecté')
    console.log(`  Host: ${conn.connection.host}`)
    console.log(`  Database: ${conn.connection.name}`)

  } catch (error) {
    console.error('Erreur de connexion MongoDB', error.message)
    process.exit(1)
  }

}

export default mongoose
