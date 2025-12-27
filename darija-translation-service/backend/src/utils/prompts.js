export const ALLOWED_CONTEXTS = [
  'casual', 'formal', 'medical', 'business', 'shopping', 
  'restaurant', 'travel', 'emergency', 'social'
];

/**
 Context Detection Prompt
 */
export const createContextDetectionPrompt = (text, audioSignals = null) => {
  const audioInfo = audioSignals ? `
Audio Signals Available:
- Emotion: ${audioSignals.emotion}
- Tone: ${audioSignals.tone}
- Urgency: ${audioSignals.urgency}
- Speech Rate: ${audioSignals.speechRate}
` : '';

  return `You are a context detection expert for Moroccan communication scenarios.

${audioInfo}
Text: "${text}"

Analyze the text${audioSignals ? ' and audio signals' : ''} to determine the most likely communication context.

ALLOWED CONTEXTS:
- casual: informal conversations, friends/family
- formal: official, professional settings
- medical: health-related discussions, symptoms, treatments
- business: negotiations, meetings, proposals
- shopping: purchasing, bargaining, retail
- restaurant: ordering food, dining experiences
- travel: transportation, directions, tourism
- emergency: urgent help, danger, critical situations
- social: events, gatherings, celebrations

INSTRUCTIONS:
1. Analyze the content, vocabulary, and intent
${audioSignals ? '2. Consider emotion, tone, urgency, and speech patterns from audio\n3. Detect the PRIMARY context' : '2. Detect the PRIMARY context'}
${audioSignals ? '4. Assign a confidence score (0.0 to 1.0)' : '3. Assign a confidence score (0.0 to 1.0)'}

Return ONLY a JSON object in this exact format:
{
  "context": "one_of_the_allowed_contexts",
  "confidence": 0.85,
  "reasoning": "brief explanation"
}`;
};

/**
 Context-Aware Translation Prompt 
 */
export const createContextAwareTranslationPrompt = (text, context, audioSignals = null) => {
  const contextGuidelines = {
    casual: "Use informal Darija with everyday expressions. Be friendly and relaxed.",
    formal: "Use respectful formal Darija. Maintain professional tone and proper address forms.",
    medical: "Use clear medical terminology in Darija. Be precise and compassionate.",
    business: "Use professional business Darija. Be clear, direct, and respectful.",
    shopping: "Use common marketplace Darija. Include bargaining and transaction phrases.",
    restaurant: "Use food service Darija. Include polite ordering and dining expressions.",
    travel: "Use travel-related Darija. Be clear with directions and tourism vocabulary.",
    emergency: "Use urgent, clear Darija. Prioritize immediate understanding and action.",
    social: "Use warm social Darija. Include celebration and gathering expressions."
  };

  const emotionalAdaptation = audioSignals ? `
Consider these audio characteristics:
- Emotion: ${audioSignals.emotion} → Adapt emotional tone in translation
- Urgency: ${audioSignals.urgency} → ${audioSignals.urgency === 'high' ? 'Use direct, immediate language' : 'Use standard pacing'}
- Tone: ${audioSignals.tone} → Match the speaker's tone in Darija
` : '';

  return `You are an expert Moroccan Darija translator specializing in context-aware translations.

Context: ${context.toUpperCase()}
Guidelines: ${contextGuidelines[context]}
${emotionalAdaptation}
English text: "${text}"

TRANSLATION RULES:
1. Adapt vocabulary and phrasing to the ${context} context
2. Use natural Moroccan Darija that natives would actually say
3. Write in Arabic script only
4. Match the formality level to the context
${audioSignals ? '5. Reflect the emotional tone and urgency from the audio\n6. NO explanations or notes - ONLY the Darija translation' : '5. NO explanations or notes - ONLY the Darija translation'}

Provide ONLY the Darija translation:`;
};

export const createBidirectionalTranslationPrompt = (text, context, audioSignals = null) => {
  const contextGuidelines = {
    casual: "Translate to informal, friendly English. Use everyday language.",
    formal: "Translate to professional, respectful English. Maintain formality.",
    medical: "Translate to clear medical English. Be precise with health terminology.",
    business: "Translate to professional business English. Be clear and direct.",
    shopping: "Translate to common shopping/retail English. Include relevant expressions.",
    restaurant: "Translate to food service English. Maintain dining context.",
    travel: "Translate to travel-related English. Be clear with directions and tourism terms.",
    emergency: "Translate to urgent, clear English. Prioritize immediate understanding.",
    social: "Translate to warm social English. Include appropriate celebration expressions."
  };

  const emotionalAdaptation = audioSignals ? `
Consider these audio characteristics:
- Emotion: ${audioSignals.emotion} → Maintain emotional tone in English
- Urgency: ${audioSignals.urgency} → ${audioSignals.urgency === 'high' ? 'Use direct, immediate language' : 'Use standard pacing'}
- Tone: ${audioSignals.tone} → Match the speaker's tone in English
` : '';

  return `You are an expert Moroccan Darija to English translator specializing in context-aware translations.

Context: ${context.toUpperCase()}
Guidelines: ${contextGuidelines[context]}
${emotionalAdaptation}
Darija text (in Arabic script): "${text}"

TRANSLATION RULES:
1. Adapt vocabulary and phrasing to the ${context} context
2. Use natural English that native speakers would say
3. Match the formality level to the context
4. Preserve the meaning and intent of the original Darija
${audioSignals ? '5. Reflect the emotional tone and urgency from the audio\n6. NO explanations or notes - ONLY the English translation' : '5. NO explanations or notes - ONLY the English translation'}

Provide ONLY the English translation:`;
};

/**
 Audio Transcription with Signal Extraction
 */
export const createAudioAnalysisPrompt = () => {
  return `You are an expert in audio transcription and signal analysis. You can understand both English and Moroccan Darija (Arabic).

Listen to this audio carefully and extract:
1. TRANSCRIPTION: What is said (in the original language - English or Arabic script for Darija)
2. EMOTION: detected emotion (options: neutral, happy, sad, angry, worried, excited, frustrated, calm)
3. TONE: speaking tone (options: friendly, professional, urgent, casual, aggressive, polite)
4. URGENCY: urgency level (options: low, medium, high)
5. SPEECH_RATE: speaking speed (options: slow, normal, fast)

Format your response EXACTLY as JSON:
{
  "transcription": "exact text in original language",
  "emotion": "detected_emotion",
  "tone": "detected_tone",
  "urgency": "low|medium|high",
  "speechRate": "slow|normal|fast"
}

Important: Transcribe in the ORIGINAL language spoken (English or Arabic script for Darija).
Respond with ONLY the JSON object, no additional text.`;
};


export const createTranslationPrompt = (text) => {
  return `You are an expert translator specializing in Moroccan Arabic Dialect (Darija).
Translate the following English text to Moroccan Darija. Use Arabic script for the Darija translation.
Keep the translation natural and colloquial, as a native Moroccan speaker would say it.

English text: "${text}"

Provide ONLY the Darija translation without any explanations or additional text.`;
};