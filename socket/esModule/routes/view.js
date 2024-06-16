import express from 'express';
import path from 'path';
import { isAuthenticated, isNotAuthenticated } from '../middlewares/viewAuthMiddleware.js';
import dirname from './dirname.cjs';
const {__dirname} = dirname;
const router = express.Router();


router.get('/join', isNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'join.html'));
});

router.get('/login', isNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/room', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'rooms.html'));
});

router.get('/room/:roomId', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'room.html'));
});

export default router;
