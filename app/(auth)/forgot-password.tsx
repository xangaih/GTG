import React, { useState } from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { TextInput, Button, Text, Title, Snackbar } from 'react-native-paper';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Colors } from '../../constants/Colors';
import { ThemedView } from '../../components/ThemedView';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setMessage('Please enter your email address');
      setIsError(true);
      setShowSnackbar(true);
      return;
    }
    
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
      setIsError(false);
      setShowSnackbar(true);
      setEmail('');
    } catch (err) {
      console.error('Reset password error:', err);
      setMessage('Failed to send reset email. Please try again.');
      setIsError(true);
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/depauw-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Title style={styles.title}>Forgot Password</Title>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
          
          <View style={styles.formContainer}>
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            
            <Button 
              mode="contained" 
              onPress={handleResetPassword}
              style={styles.resetButton}
              loading={loading}
              disabled={loading}
            >
              Send Reset Link
            </Button>
            
            <Button 
              mode="outlined"
              onPress={goBack}
              style={styles.backButton}
            >
              Back to Login
            </Button>
          </View>
          
          <Text style={styles.footerText}>
            DePauw University Pre-College Program
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        style={[
          styles.snackbar,
          isError ? styles.errorSnackbar : styles.successSnackbar
        ]}
      >
        {message}
      </Snackbar>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  logo: {
    width: 200,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: Colors.light.headerBackground,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    color: Colors.light.text,
    paddingHorizontal: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 24,
    backgroundColor: Colors.light.background,
  },
  resetButton: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: Colors.light.primary,
  },
  backButton: {
    borderColor: Colors.light.primary,
    borderWidth: 1,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 16,
    fontSize: 12,
    color: Colors.light.text,
  },
  snackbar: {
    marginBottom: 16,
  },
  errorSnackbar: {
    backgroundColor: Colors.light.error,
  },
  successSnackbar: {
    backgroundColor: Colors.light.success,
  },
}); 