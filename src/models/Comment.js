/* ════════════════════════════════════════
models/Comment.js
/════════════════════════════════════════ */

// ** IMPORTS **
import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Un commentaire est requis'],
    maxlength: [1000, 'Le commentaire doit être moins de 1000 caractères'],
    minlength: [1, 'Ne peux-être vide']
  },
  
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'approved'
  },
}, { timestamps: true })

// Index pour performances de MongoDB
commentSchema.index({ post: 1, createdAt: -1 })
commentSchema.index({ author: 1 })

export default mongoose.model('Comment', commentSchema)
