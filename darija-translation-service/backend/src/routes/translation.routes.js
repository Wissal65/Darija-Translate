import express from 'express';
import multer from 'multer';
import translationController from '../controllers/translation.controller.js';
import { authenticateBasic } from '../middlewares/auth.middleware.js';
import {
  validateTranslationInput,
  validateQueryParameter,
  validateAudioInput
} from '../middlewares/validator.middleware.js';

const router = express.Router();

// Configure multer for audio processing
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});


router.post(
  '/translate',
  authenticateBasic,  // AUTHENTICATION REQUIRED
  validateTranslationInput,
  translationController.translate.bind(translationController)
);

router.get(
  '/translate',
  authenticateBasic,  
  validateQueryParameter,
  translationController.translate.bind(translationController)
);


router.post(
  '/translate-voice',
  authenticateBasic,  
  upload.single('audio'),
  validateAudioInput,
  translationController.translateVoice.bind(translationController)
);

router.get(
  '/contexts',
  translationController.getContexts.bind(translationController)
);

export default router;