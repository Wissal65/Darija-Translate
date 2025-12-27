
import { getGeminiModel } from '../config/gemini.config.js';
import { 
  createContextDetectionPrompt,
  createContextAwareTranslationPrompt,
  createBidirectionalTranslationPrompt,
  createAudioAnalysisPrompt,
  ALLOWED_CONTEXTS
} from '../utils/prompts.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

class TranslationService {
  constructor() {
    this.model = getGeminiModel();
    this.maxRetries = 3;
    this.retryDelay = 2000;
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async retryWithBackoff(fn, retries = this.maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && retries > 0) {
        const waitTime = this.retryDelay * (this.maxRetries - retries + 1);
        console.log(`Quota exceeded. Retrying in ${waitTime/1000}s... (${retries} retries left)`);
        await this.wait(waitTime);
        return this.retryWithBackoff(fn, retries - 1);
      }
      throw error;
    }
  }

  async detectContext(text, audioSignals = null) {
    try {
      const prompt = createContextDetectionPrompt(text, audioSignals);
      
      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent(prompt);
      });

      const responseText = result.response.text().trim();
      console.log('Context detection response:', responseText);

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid context detection response format');
      }

      const contextData = JSON.parse(jsonMatch[0]);

      if (!ALLOWED_CONTEXTS.includes(contextData.context)) {
        console.warn(`Invalid context detected: ${contextData.context}, defaulting to casual`);
        contextData.context = 'casual';
      }

      return contextData;
    } catch (error) {
      console.error('Context detection error:', error);
      return {
        context: 'casual',
        confidence: 0.3,
        reasoning: 'Failed to detect context, using default'
      };
    }
  }

  async translateWithContext(text, context, direction = 'en-to-darija', audioSignals = null) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
      }

      const prompt = direction === 'darija-to-en' 
        ? createBidirectionalTranslationPrompt(text, context, audioSignals)
        : createContextAwareTranslationPrompt(text, context, audioSignals);
      
      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent(prompt);
      });

      const translation = result.response.text().trim();
      return translation;

    } catch (error) {
      console.error('Translation error:', error);
      throw this.handleTranslationError(error);
    }
  }

  async translate(text, userContext = null, direction = 'en-to-darija') {
    try {
      if (userContext && !ALLOWED_CONTEXTS.includes(userContext)) {
        console.warn(`Invalid user context: ${userContext}, will auto-detect`);
        userContext = null;
      }

      let contextData;
      
      if (userContext) {
        console.log(`Using user-specified context: ${userContext}`);
        contextData = {
          context: userContext,
          confidence: 1.0,
          reasoning: 'User-specified context'
        };
      } else {
        console.log('Auto-detecting context from text...');
        contextData = await this.detectContext(text);
        console.log('Detected context:', contextData);
      }

      const translation = await this.translateWithContext(text, contextData.context, direction);

      return {
        translation,
        contextData
      };

    } catch (error) {
      console.error('Translation service error:', error);
      throw this.handleTranslationError(error);
    }
  }

  async translateVoice(audioBuffer, mimeType, userContext = null, direction = 'en-to-darija') {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
      }

      console.log('Processing audio...');
      console.log('Audio size:', audioBuffer.length, 'bytes');
      console.log('Direction:', direction);

      const base64Audio = audioBuffer.toString('base64');
      let finalMimeType = this.determineMimeType(mimeType);
      console.log('Using MIME type:', finalMimeType);

      const analysisPrompt = createAudioAnalysisPrompt();
      
      const analysisResult = await this.retryWithBackoff(async () => {
        return await this.model.generateContent([
          {
            inlineData: {
              mimeType: finalMimeType,
              data: base64Audio
            }
          },
          { text: analysisPrompt }
        ]);
      });

      const analysisResponse = analysisResult.response.text().trim();
      console.log('Audio analysis response:', analysisResponse);

      const jsonMatch = analysisResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid audio analysis response');
      }

      const audioData = JSON.parse(jsonMatch[0]);
      const { transcription, emotion, tone, urgency, speechRate } = audioData;

      console.log('Transcription:', transcription);
      console.log('Audio signals:', { emotion, tone, urgency, speechRate });

      let contextData;
      
      if (userContext && ALLOWED_CONTEXTS.includes(userContext)) {
        contextData = {
          context: userContext,
          confidence: 1.0,
          reasoning: 'User-specified context'
        };
      } else {
        console.log('Detecting context with audio signals...');
        const audioSignals = { emotion, tone, urgency, speechRate };
        contextData = await this.detectContext(transcription, audioSignals);
        console.log('Detected context:', contextData);
      }

      const translation = await this.translateWithContext(
        transcription,
        contextData.context,
        direction,
        { emotion, tone, urgency, speechRate }
      );

      // Return appropriate fields based on direction
      if (direction === 'darija-to-en') {
        return {
          darijaText: transcription,
          englishTranslation: translation,
          contextData,
          audioSignals: { emotion, tone, urgency, speechRate }
        };
      } else {
        return {
          englishText: transcription,
          darijaTranslation: translation,
          contextData,
          audioSignals: { emotion, tone, urgency, speechRate }
        };
      }

    } catch (error) {
      console.error('Voice translation error:', error);
      throw this.handleVoiceTranslationError(error);
    }
  }

  determineMimeType(mimeType) {
    const mimeTypeMap = {
      'mp4': 'audio/mp4',
      'mpeg': 'audio/mpeg',
      'mp3': 'audio/mpeg',
      'webm': 'audio/webm',
      'wav': 'audio/wav',
      'm4a': 'audio/mp4'
    };

    let finalMimeType = mimeType || 'audio/wav';
    
    for (const [key, value] of Object.entries(mimeTypeMap)) {
      if (mimeType?.includes(key)) {
        finalMimeType = value;
        break;
      }
    }

    return finalMimeType;
  }

  handleTranslationError(error) {
    if (error.message?.includes('API key')) {
      const err = new Error(ERROR_MESSAGES.INVALID_API_KEY);
      err.status = 401;
      return err;
    }

    if (error.status === 429) {
      const err = new Error('API quota exceeded. Please wait and try again.');
      err.status = 429;
      return err;
    }

    if (error.status === 404) {
      const err = new Error('Model not found. Check configuration.');
      err.status = 500;
      return err;
    }

    return new Error(`${ERROR_MESSAGES.TRANSLATION_FAILED}: ${error.message}`);
  }

  handleVoiceTranslationError(error) {
    if (error.message?.includes('API key')) {
      return new Error('Invalid API key configuration.');
    }
    
    if (error.status === 429) {
      return new Error('API quota exceeded. Please wait.');
    }

    if (error.status === 404) {
      return new Error('Model not found.');
    }

    return new Error(`${ERROR_MESSAGES.VOICE_TRANSLATION_FAILED}: ${error.message}`);
  }
}

export default new TranslationService();