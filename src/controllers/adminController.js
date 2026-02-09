/* ════════════════════════════════════════
controllers/adminController.js
/════════════════════════════════════════ */


import User from '../models/User.js'

// Récupère la liste de tous les utilisateurs (admin uniquement)
// GET /api/admin/users */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: users.length,
            users
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des utilisateurs'
        })
    }
}

// Modifie le rôle d'un utilisateur (admin uniquement)
// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body

        // Validation du rôle
        const validRoles = ['user', 'moderator', 'admin']
        if (!role || !validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Rôle invalide. Valeurs acceptées : user, moderator, admin'
            })
        }

        // Empêche un admin de modifier son propre rôle
        if (id === req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Vous ne pouvez pas modifier votre propre rôle'
            })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            })
        }

        user.role = role
        await user.save()

        res.status(200).json({
            success: true,
            message: `Rôle de ${user.firstName} ${user.lastName} modifié en "${role}"`,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la modification du rôle'
        })
    }
}