import express from 'express';
import { joinUser, loginUser, logoutUser } from '../controllers/user.js';
import { isAuthenticated, isNotAuthenticated } from '../middlewares/apiAuthMiddleware.js';

const router = express.Router();

router.post('/join', isNotAuthenticated, joinUser);
router.post('/login', isNotAuthenticated, loginUser);
router.get('/logout', isAuthenticated, logoutUser);

export default router;
