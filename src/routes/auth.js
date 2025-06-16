const express = require('express');
const { registro, login, getMe, getAdminUsers } = require('../controllers/authController')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()
router.post('/registro', registro)
router.post('/login', login)
router.get('/me', protect, getMe)
router.get('/usuarios/admin', protect, authorize('admin'), getAdminUsers)
module.exports = router

