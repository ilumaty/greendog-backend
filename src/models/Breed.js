/* ════════════════════════════════════════
        models/Breed.js
/════════════════════════════════════════ */

// ** IMPORTS **
import mongoose from 'mongoose'

const breedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Race du chien est requis'],
    unique: true,
    trim: true
  },
  
  description: {
    type: String,
    required: [true, 'Une description est requise'],
  },
  
  characteristics: {
    size: {
      type: String,
      enum: ['small', 'medium', 'large', 'extra-large'],
      required: true
    },
    weight: {
      min: Number,
      max: Number
    },
    height: {
      min: Number,
      max: Number
    },
    temperament: [String],
    activityLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'very-high']
    },
    lifeExpectancy: {
      min: Number,
      max: Number
    }
  },
  
  origin: String,
  
  image: {
    url: String,
    alt: String
  },
  
  care: {
    grooming: String,
    exercise: String,
    diet: String
  },
  
  health: {
    commonIssues: [String],
    preventiveCare: String
  },
  
  favoriteCount: {
    type: Number,
    default: 0
  },
  
  postCount: {
    type: Number,
    default: 0
  },
}, { timestamps: true })

// Txt index pour performances de MongoDB
breedSchema.index({ name: 'text', description: 'text' })
breedSchema.index({ 'characteristics.size': 1 })
breedSchema.index({ 'characteristics.activityLevel': 1 })
breedSchema.index({ favoriteCount: -1 })

export default mongoose.model('Breed', breedSchema)
