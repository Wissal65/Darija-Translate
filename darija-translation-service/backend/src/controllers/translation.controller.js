import translationService from '../services/translation.service.js';
import { LANGUAGE_CODES, HTTP_STATUS } from '../utils/constants.js';
import { ALLOWED_CONTEXTS } from '../utils/prompts.js';

class TranslationController {
  async translate(req, res, next) {
    try {
      const { text, context, direction = 'en-to-darija' } = req.body;

      if (context && !ALLOWED_CONTEXTS.includes(context)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: `Invalid context. Allowed: ${ALLOWED_CONTEXTS.join(', ')}`
        });
      }

      if (direction && !['en-to-darija', 'darija-to-en'].includes(direction)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Invalid direction. Allowed: en-to-darija, darija-to-en'
        });
      }

      const result = await translationService.translate(text, context || null, direction);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          originalText: text,
          translatedText: result.translation,
          context: result.contextData.context,
          contextConfidence: result.contextData.confidence,
          contextReasoning: result.contextData.reasoning,
          direction: direction,
          sourceLanguage: direction === 'en-to-darija' ? LANGUAGE_CODES.SOURCE : LANGUAGE_CODES.TARGET,
          targetLanguage: direction === 'en-to-darija' ? LANGUAGE_CODES.TARGET : LANGUAGE_CODES.SOURCE,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async translateVoice(req, res, next) {
    try {
      const audioBuffer = req.file.buffer;
      const mimeType = req.file.mimetype;
      const userContext = req.body.context || null;
      const direction = req.body.direction || 'en-to-darija';

      if (userContext && !ALLOWED_CONTEXTS.includes(userContext)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: `Invalid context. Allowed: ${ALLOWED_CONTEXTS.join(', ')}`
        });
      }

      if (!['en-to-darija', 'darija-to-en'].includes(direction)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Invalid direction. Allowed: en-to-darija, darija-to-en'
        });
      }

      const result = await translationService.translateVoice(
        audioBuffer, 
        mimeType, 
        userContext,
        direction
      );

      const responseData = {
        context: result.contextData.context,
        contextConfidence: result.contextData.confidence,
        contextReasoning: result.contextData.reasoning,
        audioSignals: result.audioSignals,
        direction: direction,
        sourceLanguage: direction === 'en-to-darija' ? LANGUAGE_CODES.SOURCE : LANGUAGE_CODES.TARGET,
        targetLanguage: direction === 'en-to-darija' ? LANGUAGE_CODES.TARGET : LANGUAGE_CODES.SOURCE,
        timestamp: new Date().toISOString(),
        method: 'voice'
      };

      if (direction === 'darija-to-en') {
        responseData.darijaText = result.darijaText;
        responseData.englishTranslation = result.englishTranslation;
      } else {
        responseData.englishText = result.englishText;
        responseData.darijaTranslation = result.darijaTranslation;
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  }

  getContexts(req, res) {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        contexts: ALLOWED_CONTEXTS,
        descriptions: {
          casual: 'Informal conversations with friends and family',
          formal: 'Official and professional settings',
          medical: 'Health-related discussions and symptoms',
          business: 'Business negotiations and meetings',
          shopping: 'Retail and marketplace transactions',
          restaurant: 'Food ordering and dining',
          travel: 'Transportation and tourism',
          emergency: 'Urgent and critical situations',
          social: 'Social events and celebrations'
        }
      }
    });
  }

  getApiInfo(req, res) {
    res.status(HTTP_STATUS.OK).json({
      message: 'Context-Aware Bidirectional Darija Translation API',
      version: '3.0.0',
      features: [
        'Automatic context detection from text',
        'Audio signal extraction (emotion, tone, urgency)',
        'Context-aware translation adaptation',
        'Manual context override support',
        'Bidirectional translation (English ⇄ Darija)',
        'Voice-to-voice translation',
        'Text-to-speech support'
      ],
      endpoints: {
        translate_post: {
          method: 'POST',
          path: '/api/translate',
          body: {
            text: 'required string',
            context: 'optional string (one of allowed contexts)',
            direction: 'optional string (en-to-darija or darija-to-en, default: en-to-darija)'
          }
        },
        translate_get: {
          method: 'GET',
          path: '/api/translate?text=your_text&context=optional_context&direction=optional_direction'
        },
        translate_voice: {
          method: 'POST',
          path: '/api/translate-voice',
          body: 'multipart/form-data with audio file, optional context field, and optional direction field'
        },
        get_contexts: {
          method: 'GET',
          path: '/api/contexts',
          description: 'Get list of available contexts'
        }
      },
      allowedContexts: ALLOWED_CONTEXTS,
      allowedDirections: ['en-to-darija', 'darija-to-en'],
      documentation: {
        sourceLanguages: ['English (en)', 'Moroccan Arabic Darija (ary)'],
        targetLanguages: ['Moroccan Arabic Darija (ary)', 'English (en)'],
        maxTextLength: 5000,
        maxAudioSize: '10MB',
        supportedAudioFormats: ['audio/wav', 'audio/mp3', 'audio/m4a', 'audio/webm'],
        model: 'Google Gemini 2.5 Flash',
        contextDetection: 'Automatic with confidence scoring',
        audioSignals: ['emotion', 'tone', 'urgency', 'speechRate']
      }
    });
  }
}

export default new TranslationController();