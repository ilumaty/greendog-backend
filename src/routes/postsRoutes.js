
/* ════════════════════════════════════════
        src/routes/postsRoutes.js
/════════════════════════════════════════ */

// ** IMPORTS **
import express from 'express'

import { verifyToken } from '../middleware/auth.js'
import {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getComments,
  addComment,
  updateComment,
  deleteComment
} from '../controllers/postsController.js'

const router = express.Router()

// ***** POSTS ROUTES *****

/**
 * GET /api/posts
 * PUBLIC
 * Récupère tous les posts avec pagination
 * Query: ?page=1&limit=10&breedId=optional
 */
router.get('/', getPosts)

/**
 * POST /api/posts
 * PRIVATE
 * Crée un nouveau post
 * Body: { title: "string", content: "string", breed?: "string", tags: [] }
 */
router.post('/', verifyToken, createPost)

/**
 * GET /api/posts/:id
 * PUBLIC
 * Récupère un post par son ID
 * params: id
 */
router.get('/:id', getPostById)

/**
 * PUT /api/posts/:id
 * PRIVATE
 * Modifie un post (owner uniquement)
 * params: id
 * Body: { title?: "string", content?: "string", tags?: [] }
 */
router.put('/:id', verifyToken, updatePost)

/**
 * DELETE /api/posts/:id
 * PRIVATE
 * Supprime un post (owner uniquement)
 * params: id
 */
router.delete('/:id', verifyToken, deletePost)

/**
 * GET /api/posts/:id/comments
 * PUBLIC
 * Récupère tous les commentaires d'un post
 * params: id
 */
router.get('/:id/comments', getComments)

/**
 * POST /api/posts/:id/comments
 * PRIVATE
 * Ajoute un commentaire à un post
 * params: id
 * Body: { content: "string" }
 */
router.post('/:id/comments', verifyToken, addComment)

/**
 * PUT /api/posts/:id/comments/:commentId
 * PRIVATE
 * Modifie un commentaire (author uniquement)
 * params: id, commentId
 * Body: { content: "string" }
 */
router.put('/:id/comments/:commentId', verifyToken, updateComment)

/**
 * DELETE /api/posts/:id/comments/:commentId
 * PRIVATE
 * Supprime un commentaire (author uniquement)
 * params: id, commentId
 */
router.delete('/:id/comments/:commentId', verifyToken, deleteComment)


export default router
