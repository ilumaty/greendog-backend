/* ════════════════════════════════════════
        controllers/postsController.js
/════════════════════════════════════════ */

// ** IMPORTS **
import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import { AppError } from '../middleware/errorHandler.js'

// GET /api/posts
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const { breedId } = req.query

    const filter = { status: 'published' }
    if (breedId) filter.breed = breedId

    const posts = await Post.find(filter)
      .populate('author', 'firstName lastName avatar')
      .populate('breed', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Post.countDocuments(filter)

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/posts
export const createPost = async (req, res, next) => {
  try {
    const { title, content, breedId, tags } = req.body

    if (!title || !content) {
      throw new AppError('Title and content are required', 400)
    }

    const post = await Post.create({
      title,
      content,
      author: req.userId,
      breed: breedId || null,
      tags: tags || [],
      status: 'published'
    })

    const populatedPost = await post.populate('author', 'firstName lastName avatar')

    res.status(201).json({
      success: true,
      message: 'Post crée avec succès',
      data: { post: populatedPost }
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/posts/:id
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'firstName lastName avatar')
      .populate('breed', 'name')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'firstName lastName avatar'
        }
      })

    if (!post) {
      throw new AppError('Post non trouvé', 404)
    }

    res.json({
      success: true,
      data: { post }
    })
  } catch (error) {
    next(error)
  }
}

// PUT /api/posts/:id
export const updatePost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body

    const post = await Post.findById(req.params.id)
    if (!post) {
      throw new AppError('Post non trouvé', 404)
    }

    // Contrôle l'autorisation de l'user
    if (post.author.toString() !== req.userId) {
      throw new AppError('Tu n\'es malheureusement pas autorisé à modifier ce post', 403)
    }

    post.title = title || post.title
    post.content = content || post.content
    post.tags = tags || post.tags
    await post.save()

    const updatedPost = await post.populate('author', 'firstName lastName avatar')

    res.json({
      success: true,
      message: 'Post modifié avec succès',
      data: { post: updatedPost }
    })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/posts/:id
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      throw new AppError('Post non trouvé', 404)
    }

    // Contrôle l'autorisation de l'user
    if (post.author.toString() !== req.userId) {
      throw new AppError('Tu n\'es pas autorisé à supprimer ce post', 403)
    }

    await Post.findByIdAndDelete(req.params.id)
    await Comment.deleteMany({ post: req.params.id })

    res.json({
      success: true,
      message: 'Post supprimé avec succès'
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/posts/:id/comments
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id, status: 'approved' })
      .populate('author', 'firstName lastName avatar')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: { comments }
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/posts/:id/comments
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body

    if (!content || content.trim().length === 0) {
      throw new AppError('Commentaire requis', 400)
    }

    // Vérifie les posts existants
    const post = await Post.findById(req.params.id)
    if (!post) {
      throw new AppError('Post non trouvé', 404)
    }

    const comment = await Comment.create({
      content: content.trim(),
      author: req.userId,
      post: req.params.id
    })

    // Ajoute un commentaire au post
    await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment._id } }
    )

    const populatedComment = await comment.populate('author', 'firstName lastName avatar')

    res.status(201).json({
      success: true,
      message: 'Commentaire ajouté avec succès',
      data: { comment: populatedComment }
    })
  } catch (error) {
    next(error)
  }
}

// PUT /api/posts/:id/comments/:commentId
export const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body

    if (!content || content.trim().length === 0) {
      throw new AppError('Commentaire est requis', 400)
    }

    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
      throw new AppError('Commentaire non trouvé', 404)
    }

    // Contrôle-les authorisations
    if (comment.author.toString() !== req.userId) {
      throw new AppError('Tu n\'es pas autorisé à modifier ce commentaire', 403)
    }

    comment.content = content.trim()
    await comment.save()

    const updatedComment = await comment.populate('author', 'firstName lastName avatar')

    res.json({
      success: true,
      message: 'Commentaire modifié avec succès',
      data: { comment: updatedComment }
    })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/posts/:id/comments/:commentId
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
      throw new AppError('Commentaire non trouvé', 404)
    }

    // Contrôle-les autorisations
    if (comment.author.toString() !== req.userId) {
      throw new AppError('Tu n\'es pas autorisé à supprimer ce commentaire', 403)
    }

    await Comment.findByIdAndDelete(req.params.commentId)

    // Retire-les commentaires des posts
    await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { comments: req.params.commentId } }
    )

    res.json({
      success: true,
      message: 'Commentaire supprimé avec succès'
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getComments,
  addComment,
  updateComment,
  deleteComment
}
