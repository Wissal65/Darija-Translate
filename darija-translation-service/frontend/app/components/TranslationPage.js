import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  ScrollView, Alert, SafeAreaView, StatusBar, Modal, Platform, Dimensions
} from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from '../css/styles';
import { API_URL } from '../config/api';

const CONTEXTS = [
  { id: 'casual', name: 'Casual', icon: '💬', desc: 'Informal conversations with friends' },
  { id: 'formal', name: 'Formal', icon: '👔', desc: 'Official and professional settings' },
  { id: 'medical', name: 'Medical', icon: '🏥', desc: 'Health-related discussions' },
  { id: 'business', name: 'Business', icon: '💼', desc: 'Business negotiations' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', desc: 'Retail and marketplace' },
  { id: 'restaurant', name: 'Restaurant', icon: '🍽️', desc: 'Food ordering and dining' },
  { id: 'travel', name: 'Travel', icon: '✈️', desc: 'Transportation and tourism' },
  { id: 'emergency', name: 'Emergency', icon: '🚨', desc: 'Urgent situations' },
  { id: 'social', name: 'Social', icon: '🎉', desc: 'Social events and celebrations' }
];

export default function TranslationPage({
  sessionId,
  user,
  isAuthenticated,
  onLogout,
  onBackToHome,
  onAuthRequired
}) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [selectedContext, setSelectedContext] = useState(null);
  const [detectedContext, setDetectedContext] = useState(null);
  const [contextConfidence, setContextConfidence] = useState(null);
  const [showContextModal, setShowContextModal] = useState(false);
  const [audioSignals, setAudioSignals] = useState(null);
  
  const [direction, setDirection] = useState('en-to-darija');
  const [windowWidth] = useState(Dimensions.get('window').width);
  const useWebLayout = Platform.OS === 'web' && windowWidth >= 640;

  useEffect(() => {
    requestAudioPermission();
    
    return () => {
      if (isSpeaking) Speech.stop();
    };
  }, []);

  const requestAudioPermission = async () => {
    if (Platform.OS === 'web') {
      setHasPermission(true);
      return;
    }

    try {
      const { granted } = await Audio.requestPermissionsAsync();
      setHasPermission(granted);
      if (!granted) {
        Alert.alert('Permission Required', 'Please grant microphone permission.');
      }
    } catch (error) {
      console.error('Error requesting audio permission:', error);
    }
  };

  const swapLanguages = () => {
    setDirection(prev => prev === 'en-to-darija' ? 'darija-to-en' : 'en-to-darija');
    const temp = inputText;
    setInputText(translatedText);
    setTranslatedText(temp);
    setDetectedContext(null);
    setContextConfidence(null);
    setAudioSignals(null);
  };

  const translateText = async () => {
    if (!inputText.trim()) {
      const errorMsg = 'Please enter some text!';
      Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
      return;
    }

    if (!isAuthenticated) {
      const errorMsg = 'Please sign in to use translation';
      Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Authentication Required', errorMsg);
      onAuthRequired();
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = { text: inputText, direction };
      if (selectedContext) requestBody.context = selectedContext;

      const response = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setTranslatedText(data.data.translatedText);
        setDetectedContext(data.data.context);
        setContextConfidence(data.data.contextConfidence);
        setAudioSignals(null);
      } else {
        if (response.status === 401) {
          onLogout();
          const errorMsg = 'Session expired. Please sign in again.';
          Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
          onAuthRequired();
        } else {
          const errorMsg = data.error || 'Translation failed';
          Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
        }
      }
    } catch (error) {
      const errorMsg = 'Cannot connect to server';
      Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
  if (!isAuthenticated) {
    const errorMsg = 'Please sign in to use voice translation';
    Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Authentication Required', errorMsg);
    onAuthRequired();
    return;
  }

  if (Platform.OS === 'web') {
    try {
      // Check if browser supports required APIs
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support audio recording. Please use Chrome, Firefox, or Edge.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });

      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: mimeType });
        await sendAudioToBackend(audioBlob, true, mimeType);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (error) => {
        console.error('MediaRecorder error:', error);
        alert('Recording error occurred');
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording({ mediaRecorder, stream });
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
      if (error.name === 'NotAllowedError') {
        alert('Microphone permission denied. Please allow microphone access in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        alert('No microphone found. Please connect a microphone and try again.');
      } else {
        alert('Failed to start recording: ' + error.message);
      }
    }
    return;
  }

  if (!hasPermission) {
    Alert.alert('Permission Required', 'Microphone permission required.');
    await requestAudioPermission();
    return;
  }

  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    setRecording(recording);
    setIsRecording(true);
  } catch (error) {
    console.error('Failed to start recording', error);
    Alert.alert('Error', 'Failed to start recording');
  }
};

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);

      if (Platform.OS === 'web') {
        recording.mediaRecorder.stop();
      } else {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        
        if (uri) {
          await sendAudioToBackend(uri, false);
        }
      }
      
      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const sendAudioToBackend = async (audioData, isBlob = false, mimeType = 'audio/wav') => {
  setIsLoading(true);

  try {
    const formData = new FormData();
    
    if (isBlob) {
      // Extract file extension from mimeType
      const extension = mimeType.includes('webm') ? 'webm' : 
                       mimeType.includes('ogg') ? 'ogg' : 
                       mimeType.includes('mp4') ? 'mp4' : 'wav';
      formData.append('audio', audioData, `recording.${extension}`);
    } else {
      formData.append('audio', {
        uri: audioData,
        type: 'audio/wav',
        name: 'recording.wav',
      });
    }
    
    if (selectedContext) formData.append('context', selectedContext);
    formData.append('direction', direction);

    const response = await fetch(`${API_URL}/translate-voice`, {
      method: 'POST',
      body: formData,
      headers: { 
        'Authorization': `Bearer ${sessionId}`
        // Don't set Content-Type for FormData - browser sets it automatically with boundary
      },
    });

    const data = await response.json();

    if (data.success) {
      if (direction === 'en-to-darija') {
        setInputText(data.data.englishText);
        setTranslatedText(data.data.darijaTranslation);
      } else {
        setInputText(data.data.darijaText || data.data.englishText);
        setTranslatedText(data.data.englishTranslation || data.data.darijaTranslation);
      }
      setDetectedContext(data.data.context);
      setContextConfidence(data.data.contextConfidence);
      setAudioSignals(data.data.audioSignals);
    } else {
      if (response.status === 401) {
        onLogout();
        const errorMsg = 'Session expired. Please sign in again.';
        Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
        onAuthRequired();
      } else {
        const errorMsg = data.error || 'Voice translation failed';
        Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
      }
    }
  } catch (error) {
    const errorMsg = 'Cannot connect to server';
    Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

const speakText = async (text, lang) => {
  if (!text) {
    const errorMsg = 'No text to speak';
    Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
    return;
  }

  if (isSpeaking) {
    if (Platform.OS === 'web') {
      window.speechSynthesis.cancel();
    } else {
      Speech.stop();
    }
    setIsSpeaking(false);
    return;
  }

  try {
    setIsSpeaking(true);
    
    if (Platform.OS === 'web') {
      if (!window.speechSynthesis) {
        alert('Text-to-speech is not supported in your browser');
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();

      const getVoicesWithRetry = () => {
        return new Promise((resolve) => {
          let voices = window.speechSynthesis.getVoices();
          
          if (voices.length > 0) {
            resolve(voices);
          } else {
            let attempts = 0;
            const checkVoices = () => {
              voices = window.speechSynthesis.getVoices();
              if (voices.length > 0 || attempts > 10) {
                resolve(voices);
              } else {
                attempts++;
                setTimeout(checkVoices, 100);
              }
            };
            
            window.speechSynthesis.onvoiceschanged = () => {
              voices = window.speechSynthesis.getVoices();
              resolve(voices);
            };
            
            checkVoices();
          }
        });
      };

      const voices = await getVoicesWithRetry();
      console.log('Available voices:', voices.length);

      const utterance = new SpeechSynthesisUtterance(text);
      const targetLang = lang === 'en' ? 'en-US' : 'ar-SA';
      utterance.lang = targetLang;
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (voices.length > 0) {
        let matchingVoice = voices.find(v => 
          v.name.includes('Google') && v.lang.startsWith(lang === 'en' ? 'en' : 'ar')
        );
        
        if (!matchingVoice) {
          matchingVoice = voices.find(v => 
            !v.name.includes('Microsoft') && v.lang.startsWith(lang === 'en' ? 'en' : 'ar')
          );
        }
        
        if (!matchingVoice) {
          matchingVoice = voices.find(v => v.lang.startsWith(lang === 'en' ? 'en' : 'ar'));
        }
        
        if (matchingVoice) {
          utterance.voice = matchingVoice;
          console.log('Using voice:', matchingVoice.name, matchingVoice.lang);
        } else {
          console.log('No matching voice found, using default');
        }
      }
      
      utterance.onstart = () => {
        console.log('Speech started');
      };

      utterance.onend = () => {
        console.log('Speech finished');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event.error, event);
        setIsSpeaking(false);
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          alert('Speech error: ' + event.error + '. Try a different browser or check audio settings.');
        }
      };

      window.speechSynthesis.speak(utterance);
      
      setTimeout(() => {
        window.speechSynthesis.resume();
      }, 100);
      
      const resumeInterval = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        } else {
          clearInterval(resumeInterval);
        }
      }, 5000);
      
      utterance.addEventListener('end', () => {
        clearInterval(resumeInterval);
      });
      
      console.log('Speech command sent');

    } else {
      await Speech.speak(text, {
        language: lang === 'en' ? 'en-US' : 'ar-SA',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  } catch (error) {
    console.error('TTS error:', error);
    setIsSpeaking(false);
    const errorMsg = 'Text-to-speech not available';
    Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
  }
};

  const clearAll = () => {
    setInputText('');
    setTranslatedText('');
    setDetectedContext(null);
    setContextConfidence(null);
    setAudioSignals(null);
    if (isSpeaking) {
      if (Platform.OS === 'web') {
        window.speechSynthesis.cancel();
      } else {
        Speech.stop();
      }
      setIsSpeaking(false);
    }
  };

  const getContextDisplay = () => {
    const context = selectedContext || detectedContext;
    if (!context) return 'Auto-detect';
    const ctx = CONTEXTS.find(c => c.id === context);
    return ctx ? ctx.name : context;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={[styles.content, useWebLayout && styles.contentWeb]}>
        <View style={useWebLayout && styles.containerWeb}>
          
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.logoSmall}>
              <Text style={styles.logoBlack}>Darija </Text>
              <Text style={styles.logoOrange}>Translate</Text>
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {isAuthenticated && (
                <View style={styles.userBadgeSmall}>
                  <Ionicons name="person-circle" size={16} color="#8B5CF6" />
                  <Text style={styles.userBadgeSmallText}>{user?.username}</Text>
                </View>
              )}
              <TouchableOpacity 
                style={styles.homeButton}
                onPress={onBackToHome}>
                <Ionicons name="home" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Context Selector */}
          <TouchableOpacity 
            style={styles.contextSelector}
            onPress={() => setShowContextModal(true)}>
            <View style={styles.contextIconContainer}>
              <Ionicons name="chatbubble-outline" size={24} color="#6B7280" />
            </View>
            <View style={styles.contextInfo}>
              <Text style={styles.contextValue}>{getContextDisplay()}</Text>
              {detectedContext && contextConfidence && !selectedContext && (
                <Text style={styles.contextSubtext}>
                  Detected: {CONTEXTS.find(c => c.id === detectedContext)?.name}{' '}
                  <Text style={[
                    styles.confidenceText,
                    { color: contextConfidence > 0.8 ? '#16A34A' : contextConfidence > 0.6 ? '#D97706' : '#DC2626' }
                  ]}>
                    {(contextConfidence * 100).toFixed(0)}%
                  </Text>
                </Text>
              )}
            </View>
            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Audio Signals */}
          {audioSignals && (
            <View style={styles.signalsContainer}>
              <View style={styles.signalBadge}>
                <Text style={styles.signalEmoji}>😊</Text>
                <Text style={styles.signalText}>{audioSignals.emotion}</Text>
              </View>
              <View style={styles.signalBadge}>
                <Text style={styles.signalEmoji}>🗣️</Text>
                <Text style={styles.signalText}>{audioSignals.tone}</Text>
              </View>
              <View style={styles.signalBadge}>
                <Ionicons name="flash" size={16} color="#F59E0B" style={{ marginRight: 4 }} />
                <Text style={styles.signalText}>{audioSignals.urgency}</Text>
              </View>
            </View>
          )}

          {/* Input Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>
                {direction === 'en-to-darija' ? 'ENGLISH' : 'DARIJA'}
              </Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}>
                  <Ionicons 
                    name={isRecording ? "stop" : "mic"} 
                    size={22} 
                    color="#4B5563" 
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => speakText(inputText, direction === 'en-to-darija' ? 'en' : 'ar')}
                  disabled={!inputText || isLoading}>
                  <Ionicons name="volume-high" size={22} color="#4B5563" />
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder={isRecording ? "Recording..." : "Type or record..."}
              placeholderTextColor="#D1D5DB"
              value={inputText}
              onChangeText={setInputText}
              multiline
              editable={!isRecording && !isLoading}
              maxLength={5000}
            />
            <Text style={styles.counter}>{inputText.length} / 5000</Text>
          </View>

          {/* Swap Arrow */}
          <View style={styles.swapArrowContainer}>
            <TouchableOpacity 
              style={styles.swapArrowButton} 
              onPress={swapLanguages}
              disabled={isLoading}>
              <MaterialIcons name="swap-vert" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Output Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>
                {direction === 'en-to-darija' ? 'DARIJA' : 'ENGLISH'}
              </Text>
              {translatedText && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => speakText(translatedText, direction === 'en-to-darija' ? 'ar' : 'en')}
                  disabled={isLoading}>
                  <Ionicons name="volume-high" size={22} color="#4B5563" />
                </TouchableOpacity>
              )}
            </View>
            
            {isLoading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#8B5CF6" />
                <Text style={styles.loadingText}>
                  {isRecording ? 'Processing audio...' : 'Translating...'}
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.output, !translatedText && styles.outputPlaceholder]}>
                  {translatedText || 'Translation will appear here...'}
                </Text>
                {translatedText && (
                  <Text style={styles.counter}>{translatedText.length} chars</Text>
                )}
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.clearButton]}
              onPress={clearAll}
              disabled={isLoading || isRecording}>
              <Ionicons name="refresh" size={24} color="#4B5563" />
              <Text style={styles.buttonLabel}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.translateButton]}
              onPress={translateText}
              disabled={isLoading || isRecording || !inputText.trim()}>
              <Ionicons name="sparkles" size={24} color="#FFFFFF" />
              <Text style={styles.buttonLabelWhite}>Translate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.homeActionButton]}
              onPress={onBackToHome}
              disabled={isLoading || isRecording}>
              <Ionicons name="home" size={24} color="#4B5563" />
              <Text style={styles.buttonLabel}>Home</Text>
            </TouchableOpacity>
          </View>

          {/* Context Modal */}
          <Modal
            visible={showContextModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowContextModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, useWebLayout && styles.modalContentWeb]}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Select Context</Text>
                
                <TouchableOpacity
                  style={[styles.contextOption, !selectedContext && styles.contextOptionActive]}
                  onPress={() => {
                    setSelectedContext(null);
                    setShowContextModal(false);
                  }}>
                  <View style={styles.contextOptionIcon}>
                    <Ionicons name="planet-outline" size={28} color="#6B7280" />
                  </View>
                  <View style={styles.contextTextBox}>
                    <Text style={styles.contextName}>Auto-detect</Text>
                    <Text style={styles.contextDesc}>AI detects context automatically</Text>
                  </View>
                </TouchableOpacity>

                <ScrollView style={styles.contextList} showsVerticalScrollIndicator={false}>
                  {CONTEXTS.map(context => (
                    <TouchableOpacity
                      key={context.id}
                      style={[
                        styles.contextOption,
                        selectedContext === context.id && styles.contextOptionActive
                      ]}
                      onPress={() => {
                        setSelectedContext(context.id);
                        setShowContextModal(false);
                      }}>
                      <View style={styles.contextOptionIcon}>
                        <Text style={styles.contextIcon}>{context.icon}</Text>
                      </View>
                      <View style={styles.contextTextBox}>
                        <Text style={styles.contextName}>{context.name}</Text>
                        <Text style={styles.contextDesc}>{context.desc}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowContextModal(false)}>
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}