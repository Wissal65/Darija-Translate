export const MAX_TEXT_LENGTH = 5000;
export const MAX_AUDIO_SIZE = 10 * 1024 * 1024;

export const LANGUAGE_CODES = {
  SOURCE: 'en',
  TARGET: 'ary'
};

export const ALLOWED_CONTEXTS = [
  'casual',
  'formal', 
  'medical',
  'business',
  'shopping',
  'restaurant',
  'travel',
  'emergency',
  'social'
];

export const ERROR_MESSAGES = {
  TEXT_REQUIRED: 'Text parameter is required and cannot be empty',
  TEXT_TOO_LONG: `Text is too long. Maximum length is ${MAX_TEXT_LENGTH} characters`,
  AUDIO_REQUIRED: 'Audio file is required',
  AUDIO_TOO_LARGE: `Audio file is too large. Maximum size is ${MAX_AUDIO_SIZE / (1024 * 1024)} MB`,
  INVALID_CONTEXT: `Invalid context. Allowed contexts: ${ALLOWED_CONTEXTS.join(', ')}`,
  API_KEY_NOT_CONFIGURED: 'API key not configured',
  INVALID_API_KEY: 'Invalid API key',
  TRANSLATION_FAILED: 'Translation failed. Please try again later.',
  VOICE_TRANSLATION_FAILED: 'Voice translation failed. Please try again later.',
  INTERNAL_ERROR: 'Internal server error'
};

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_ERROR: 500,
  TOO_MANY_REQUESTS: 429
};