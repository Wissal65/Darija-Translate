import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, StatusBar,
  ScrollView, Dimensions, Platform
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import styles from '../css/styles';

export default function LandingPage({
  isAuthenticated,
  user,
  onStartTranslating,
  onSignIn,
  onLogout
}) {
  const [direction, setDirection] = useState('en-to-darija');
  const [windowWidth] = useState(Dimensions.get('window').width);
  const useWebLayout = Platform.OS === 'web' && windowWidth >= 640;

  const swapLanguages = () => {
    setDirection(prev => prev === 'en-to-darija' ? 'darija-to-en' : 'en-to-darija');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={[styles.content, useWebLayout && styles.contentWeb]}>
        <View style={useWebLayout && styles.containerWeb}>
          
          {/* Authentication Status Bar */}
          <View style={styles.authStatusBar}>
            {isAuthenticated ? (
              <View style={styles.authStatusContent}>
                <View style={styles.userBadge}>
                  <Ionicons name="person-circle" size={20} color="#8B5CF6" />
                  <Text style={styles.userBadgeText}>{user?.username}</Text>
                </View>
                <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
                  <Ionicons name="log-out-outline" size={18} color="#DC2626" />
                  <Text style={styles.logoutBtnText}>Logout</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={onSignIn} style={styles.signInBtn}>
                <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
                <Text style={styles.signInBtnText}>Sign In</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Logo & Title */}
          <View style={styles.heroSection}>
            <Text style={styles.logo}>
              <Text style={styles.logoBlack}>Darija </Text>
              <Text style={styles.logoOrange}>Translate</Text>
            </Text>
            <Text style={styles.subtitle}>
              Context-aware translation powered by AI
            </Text>
          </View>

          {/* Language Selection */}
          <View style={styles.languageContainer}>
            <View style={[styles.langButton, useWebLayout && styles.langButtonWeb]}>
              <Text style={styles.langText}>
                {direction === 'en-to-darija' ? 'English' : 'Darija'}
              </Text>
            </View>

            <View style={styles.swapButtonContainer}>
              <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
                <MaterialIcons name="swap-vert" size={36} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={[styles.langButton, useWebLayout && styles.langButtonWeb]}>
              <Text style={[styles.langText, styles.langTextBlue]}>
                {direction === 'en-to-darija' ? 'Darija' : 'English'}
              </Text>
            </View>
          </View>

          {/* Features List */}
          <View style={styles.featuresSection}>
            <View style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <Ionicons name="sparkles" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.featureItemText}>
                AI-powered context detection
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <Ionicons name="mic" size={24} color="#FF6B35" />
              </View>
              <Text style={styles.featureItemText}>
                Voice translation support
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <Ionicons name="chatbubbles" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.featureItemText}>
                Multiple conversation contexts
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <Ionicons name="volume-high" size={24} color="#10B981" />
              </View>
              <Text style={styles.featureItemText}>
                Text-to-speech in both languages
              </Text>
            </View>
          </View>

          {/* Start Button */}
          <View style={styles.startButtonContainer}>
            <TouchableOpacity 
              style={[styles.startButton, useWebLayout && styles.startButtonWeb]}
              onPress={onStartTranslating}>
              <Ionicons name="rocket" size={24} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.startButtonText}>Start Translating</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Note */}
          {!isAuthenticated && (
            <Text style={styles.footerNote}>
              Sign in to save your translation history and preferences
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}