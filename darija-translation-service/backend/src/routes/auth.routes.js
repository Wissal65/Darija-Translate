import express from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticateBasic } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// Protected routes (require authentication)
router.post('/logout', authenticateBasic, authController.logout.bind(authController));
router.get('/profile', authenticateBasic, authController.getProfile.bind(authController));
router.get('/validate', authenticateBasic, authController.validateSession.bind(authController));

export default router;