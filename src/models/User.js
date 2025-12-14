/* ════════════════════════════════════════
models/User.js
/════════════════════════════════════════ */

// ** IMPORTS **
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Merci de mettre un email valide']
  },
  
  password: {
    type: String,
    required: [true, 'Mot de passe requis'],
    minlength: [6, 'Il faut minimum 6 caractères'],
    select: false
  },
  
  firstName: {
    type: String,
    required: [true, 'Prénom requis'],
    trim: true,
    minlength: [2, 'Minimum 2 caractères pour le prénom']
  },
  
  lastName: {
    type: String,
    required: [true, 'Le nom de famille est requis'],
    trim: true,
    minlength: [2, 'Le nom de famille doit contenir 2 caractères']
  },
  
  avatar: {
    type: String,
    default: null
  },
  
  bio: {
    type: String,
    default: '',
    maxlength: [500, 'Vous devez ajoutez au maximum 500 caractères']
  },
  
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Breed'
  }],
  
  lastLogin: Date
}, { timestamps: true })

// Hook pre pour hasher le password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  // hash le password avec salt de 12x
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare les passwords du login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}


// Index pour performances de MongoDB
userSchema.index({ createdAt: -1 })
userSchema.index({ role: 1 })

export default mongoose.model('User', userSchema)
