import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import LandingPage from './components/LandingPage';
import AuthScreen from './components/AuthSecreen';
import TranslationPage from './components/TranslationPage';
import { API_URL } from './config/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing', 'auth', 'translation'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    if (Platform.OS === 'web') {
      const storedSessionId = localStorage.getItem('sessionId');
      const storedUser = localStorage.getItem('user');
      
      if (storedSessionId && storedUser) {
        try {
          const response = await fetch(`${API_URL}/auth/validate`, {
            headers: { 'Authorization': `Bearer ${storedSessionId}` }
          });
          
          const data = await response.json();
          if (data.success && data.valid) {
            setSessionId(storedSessionId);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('sessionId');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Session validation error:', error);
        }
      }
    }
  };

  const handleAuthSuccess = ({ sessionId: newSessionId, user: newUser }) => {
    setSessionId(newSessionId);
    setUser(newUser);
    setIsAuthenticated(true);
    setCurrentScreen('translation');
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionId}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    if (Platform.OS === 'web') {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
    }

    setSessionId(null);
    setUser(null);
    setIsAuthenticated(false);
    setCurrentScreen('landing');
  };

  const handleStartTranslating = () => {
    if (isAuthenticated) {
      setCurrentScreen('translation');
    } else {
      setCurrentScreen('auth');
    }
  };

  if (currentScreen === 'auth') {
    return (
      <AuthScreen
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setCurrentScreen('landing')}
      />
    );
  }

  if (currentScreen === 'translation') {
    return (
      <TranslationPage
        sessionId={sessionId}
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onBackToHome={() => setCurrentScreen('landing')}
        onAuthRequired={() => setCurrentScreen('auth')}
      />
    );
  }

  // Landing page (default)
  return (
    <LandingPage
      isAuthenticated={isAuthenticated}
      user={user}
      onStartTranslating={handleStartTranslating}
      onSignIn={() => setCurrentScreen('auth')}
      onLogout={handleLogout}
    />
  );
}