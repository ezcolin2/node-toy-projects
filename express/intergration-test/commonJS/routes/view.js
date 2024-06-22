const express = require('express')
const path = require('path')
const router = express.Router()
const {isAuthenticated, isNotAuthenticated} = require('../middlewares/viewAuthMiddleware')
router.get('/join', isNotAuthenticated, (req, res)=>{
    const parentDir = path.resolve(__dirname, '..');
    res.sendFile(path.join(parentDir, 'views', 'join.html'))
})
router.get('/login', isNotAuthenticated, (req, res)=>{
    const parentDir = path.resolve(__dirname, '..');
    res.sendFile(path.join(parentDir, 'views', 'login.html'))
})
router.get('/room', isAuthenticated, (req, res)=>{
    const parentDir = path.resolve(__dirname, '..');
    res.sendFile(path.join(parentDir, 'views', 'rooms.html'))
})
router.get('/room/:roomId', isAuthenticated, (req, res)=>{
    const parentDir = path.resolve(__dirname, '..');
    res.sendFile(path.join(parentDir, 'views', 'room.html'))
})


module.exports = router