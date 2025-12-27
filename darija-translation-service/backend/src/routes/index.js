import express from 'express';
import translationRoutes from './translation.routes.js';
import authRoutes from './auth.routes.js';
import translationController from '../controllers/translation.controller.js';

const router = express.Router();

// Root endpoint - API info
router.get('/', translationController.getApiInfo.bind(translationController));

// Authentication routes (public + protected)
router.use('/api/auth', authRoutes);

// Translation routes (all protected)
router.use('/api', translationRoutes);

export default router;