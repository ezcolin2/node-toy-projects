// import express from 'express';
// import path from 'path';
// import { isAuthenticated, isNotAuthenticated } from '../middlewares/viewAuthMiddleware.js';
// import expose from './expose.cjs';
// const {__dirname} = expose;
// const router = express.Router();

// router.get('/join', isNotAuthenticated, (req, res)=>{
//     const parentDir = path.resolve(__dirname, '..');
//     res.sendFile(path.join(parentDir, 'views', 'join.html'))
// })
// router.get('/login', isNotAuthenticated, (req, res)=>{
//     const parentDir = path.resolve(__dirname, '..');
//     res.sendFile(path.join(parentDir, 'views', 'login.html'))
// })
// router.get('/room', isAuthenticated, (req, res)=>{
//     const parentDir = path.resolve(__dirname, '..');
//     res.sendFile(path.join(parentDir, 'views', 'rooms.html'))
// })
// router.get('/room/:roomId', isAuthenticated, (req, res)=>{
//     const parentDir = path.resolve(__dirname, '..');
//     res.sendFile(path.join(parentDir, 'views', 'room.html'))
// })


// export default router;