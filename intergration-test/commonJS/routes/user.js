const express = require('express')
const router = express.Router()
const {joinUser, loginUser, logoutUser} = require('../controllers/user');
const {isAuthenticated, isNotAuthenticated} = require('../middlewares/apiAuthMiddleware')

router.post('/join', isNotAuthenticated, joinUser)
router.post('/login', isNotAuthenticated, loginUser)
router.get('/logout', isAuthenticated, logoutUser)

module.exports = router