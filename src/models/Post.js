/* ════════════════════════════════════════
        models/Post.js
/════════════════════════════════════════ */

// ** IMPORTS **
import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title must be less than 200 characters']
  },
  
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters']
  },
  
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  breed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Breed',
    default: null
  },
  
  tags: [String],
  
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  views: {
    type: Number,
    default: 0
  },
  
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published'
  },
}, { timestamps: true })

// Index pour performances de MongoDB
postSchema.index({ author: 1, createdAt: -1 })
postSchema.index({ breed: 1 })
postSchema.index({ status: 1, createdAt: -1 })
postSchema.index({ tags: 1 })

export default mongoose.model('Post', postSchema)
