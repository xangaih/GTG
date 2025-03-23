import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TextInput, Button, Text, Title, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { ThemedView } from '../../components/ThemedView';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const role = params.role?.toString() || 'visitor';
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  
  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      setShowSnackbar(true);
      return;
    }
    
    // Normalize email input
    const email = username.trim().toLowerCase();
    
    setLoading(true);
    try {
      const user = await login(email, password);
      
      if (user) {
        // Navigate based on role
        // We'll get the actual role from the AuthContext in the layout component
        // This is just for the initial redirect after login
        switch(role) {
          case 'admin':
            router.push('/(admin)');
            break;
          case 'mentor':
            router.push('/(mentor)');
            break;
          default:
            router.push('/(visitor)');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
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
          
          <Title style={styles.title}>
            {role === 'admin' ? 'Admin Login' : 
             role === 'mentor' ? 'Mentor Login' : 'Student Login'}
          </Title>
          
          <View style={styles.formContainer}>
            <TextInput
              label="Email"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="email-address"
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              mode="outlined"
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
            />
            
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            >
              Log In
            </Button>
            
            <Button
              mode="text"
              onPress={() => router.push('/forgot-password')}
              style={styles.forgotButton}
            >
              Forgot Password?
            </Button>
            
            <Button
              mode="outlined"
              onPress={goBack}
              style={styles.backButton}
            >
              Back
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
        style={styles.snackbar}
      >
        {error}
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: Colors.light.headerBackground,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.light.background,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: Colors.light.primary,
  },
  forgotButton: {
    marginBottom: 16,
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
    backgroundColor: Colors.light.error,
  },
}); 