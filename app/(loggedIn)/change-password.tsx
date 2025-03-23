import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { TextInput, Button, Text, Title, Snackbar } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { ThemedView } from '../../components/ThemedView';
import { useAuth } from '../../contexts/AuthContext';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { changePassword } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleUpdatePassword = async () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setMessage('All fields are required');
      setIsError(true);
      setShowSnackbar(true);
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setMessage('New passwords do not match');
      setIsError(true);
      setShowSnackbar(true);
      return;
    }
    
    if (newPassword.length < 8) {
      setMessage('New password must be at least 8 characters long');
      setIsError(true);
      setShowSnackbar(true);
      return;
    }
    
    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setMessage('Password updated successfully!');
      setIsError(false);
      setShowSnackbar(true);
      
      // Clear form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      
      // Redirect back after successful password change
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      console.error('Change password error:', err);
      setMessage(err.message || 'Failed to update password. Please try again.');
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
          <Title style={styles.title}>Change Password</Title>
          <Text style={styles.subtitle}>
            Update your account password
          </Text>
          
          <View style={styles.formContainer}>
            <TextInput
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              mode="outlined"
              style={styles.input}
              right={
                <TextInput.Icon 
                  icon={showCurrentPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                />
              }
            />
            
            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              mode="outlined"
              style={styles.input}
              right={
                <TextInput.Icon 
                  icon={showNewPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowNewPassword(!showNewPassword)}
                />
              }
            />
            
            <TextInput
              label="Confirm New Password"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              secureTextEntry={!showConfirmPassword}
              mode="outlined"
              style={styles.input}
              right={
                <TextInput.Icon 
                  icon={showConfirmPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            
            <Button 
              mode="contained" 
              onPress={handleUpdatePassword}
              style={styles.updateButton}
              loading={loading}
              disabled={loading}
            >
              Update Password
            </Button>
            
            <Button 
              mode="outlined"
              onPress={goBack}
              style={styles.cancelButton}
            >
              Cancel
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 40,
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
  updateButton: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: Colors.light.primary,
  },
  cancelButton: {
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