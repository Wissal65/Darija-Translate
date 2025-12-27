import { 
  MAX_TEXT_LENGTH, 
  MAX_AUDIO_SIZE, 
  ERROR_MESSAGES, 
  HTTP_STATUS,
  ALLOWED_CONTEXTS 
} from '../utils/constants.js';

export const validateTranslationInput = (req, res, next) => {
  const { text, context } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.TEXT_REQUIRED
    });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.TEXT_TOO_LONG
    });
  }

  if (context && !ALLOWED_CONTEXTS.includes(context)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.INVALID_CONTEXT
    });
  }

  next();
};

export const validateQueryParameter = (req, res, next) => {
  const { text, context } = req.query;

  if (!text || text.trim().length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.TEXT_REQUIRED
    });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.TEXT_TOO_LONG
    });
  }

  if (context && !ALLOWED_CONTEXTS.includes(context)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.INVALID_CONTEXT
    });
  }
  
  req.body = { text, context: context || null };
  next();
};

export const validateAudioInput = (req, res, next) => {
  if (!req.file) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.AUDIO_REQUIRED
    });
  }

  if (req.file.size > MAX_AUDIO_SIZE) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.AUDIO_TOO_LARGE
    });
  }

  const { context } = req.body;
  if (context && !ALLOWED_CONTEXTS.includes(context)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.INVALID_CONTEXT
    });
  }

  next();
};