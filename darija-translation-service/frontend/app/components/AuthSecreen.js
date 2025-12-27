import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  ScrollView, Alert, SafeAreaView, StatusBar, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authStyles } from '../css/styles';
import { API_URL } from '../config/api';

export default function AuthScreen({ onAuthSuccess, onBack }) {
  console.log('API_URL in AuthScreen:', API_URL);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  // Focus states
  const [focusedField, setFocusedField] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!isLogin) {
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin
        ? { username, password }
        : { username, email, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        const { sessionId, user } = data.data;
        
        // Store session
        if (Platform.OS === 'web') {
          localStorage.setItem('sessionId', sessionId);
          localStorage.setItem('user', JSON.stringify(user));
        }

        const message = isLogin
          ? `Welcome back, ${user.username}!`
          : `Account created! Welcome, ${user.username}!`;

        Platform.OS === 'web' ? alert(message) : Alert.alert('Success', message);
        
        onAuthSuccess({ sessionId, user });
      } else {
        const errorMsg = data.error || 'Authentication failed';
        Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
      }
    } catch (error) {
      const errorMsg = 'Cannot connect to server';
      Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setPassword('');
    if (isLogin) setEmail('');
  };

  return (
    <SafeAreaView style={authStyles.authContainer}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled">
        
        <View style={authStyles.authCard}>
          {/* Back Button */}
          <TouchableOpacity 
            style={authStyles.backButtonIcon}
            onPress={onBack}
            disabled={isLoading}>
            <Ionicons name="arrow-back" size={24} color="#6B7280" />
          </TouchableOpacity>

          {/* Logo */}
          <Text style={authStyles.authLogo}>
            <Text style={{ color: '#2C2C2E' }}>Darija </Text>
            <Text style={{ color: '#FF6B35' }}>Translate</Text>
          </Text>
          <Text style={authStyles.authSubtitle}>
            {isLogin ? 'Sign in to continue' : 'Create your account'}
          </Text>

          {/* Username */}
          <View style={authStyles.inputGroup}>
            <Text style={authStyles.inputLabel}>Username</Text>
            <View style={authStyles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#9CA3AF" style={authStyles.inputIcon} />
              <TextInput
                style={[
                  authStyles.inputField,
                  focusedField === 'username' && authStyles.inputFieldFocused,
                  errors.username && authStyles.inputError,
                ]}
                placeholder="Enter username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username) setErrors({ ...errors, username: null });
                }}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {errors.username && (
              <Text style={authStyles.errorText}>{errors.username}</Text>
            )}
          </View>

          {/* Email */}
          {!isLogin && (
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.inputLabel}>Email</Text>
              <View style={authStyles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={authStyles.inputIcon} />
                <TextInput
                  style={[
                    authStyles.inputField,
                    focusedField === 'email' && authStyles.inputFieldFocused,
                    errors.email && authStyles.inputError,
                  ]}
                  placeholder="Enter email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
              {errors.email && (
                <Text style={authStyles.errorText}>{errors.email}</Text>
              )}
            </View>
          )}

          {/* Password */}
          <View style={authStyles.inputGroup}>
            <Text style={authStyles.inputLabel}>Password</Text>
            <View style={authStyles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={authStyles.inputIcon} />
              <TextInput
                style={[
                  authStyles.inputField,
                  focusedField === 'password' && authStyles.inputFieldFocused,
                  errors.password && authStyles.inputError,
                ]}
                placeholder="Enter password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={authStyles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              authStyles.submitButton,
              (isLoading || (!username || !password || (!isLogin && !email))) &&
                authStyles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading || !username || !password || (!isLogin && !email)}>
            {isLoading ? (
              <View style={authStyles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={authStyles.loadingText}>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </Text>
              </View>
            ) : (
              <Text style={authStyles.submitButtonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Switch Mode */}
          <View style={authStyles.switchContainer}>
            <Text style={authStyles.switchText}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <TouchableOpacity onPress={switchMode} disabled={isLoading}>
              <Text style={authStyles.switchLink}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={authStyles.divider}>
            <View style={authStyles.dividerLine} />
            <Text style={authStyles.dividerText}>OR</Text>
            <View style={authStyles.dividerLine} />
          </View>

          {/* Continue Without Account */}
          <TouchableOpacity
            style={authStyles.continueButton}
            onPress={onBack}
            disabled={isLoading}>
            <Text style={authStyles.continueButtonText}>
              Continue without account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}