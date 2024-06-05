import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { isAuthenticated, isNotAuthenticated } from '../middlewares/viewAuthMiddleware.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/join', isNotAuthenticated, (req, res) => {
  const parentDir = path.resolve(__dirname, '..');
  res.sendFile(path.join(parentDir, 'views', 'join.html'));
});

router.get('/login', isNotAuthenticated, (req, res) => {
  const parentDir = path.resolve(__dirname, '..');
  res.sendFile(path.join(parentDir, 'views', 'login.html'));
});

router.get('/room', isAuthenticated, (req, res) => {
  const parentDir = path.resolve(__dirname, '..');
  res.sendFile(path.join(parentDir, 'views', 'rooms.html'));
});

router.get('/room/:roomId', isAuthenticated, (req, res) => {
  const parentDir = path.resolve(__dirname, '..');
  res.sendFile(path.join(parentDir, 'views', 'room.html'));
});

export default router;
