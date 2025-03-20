import { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button, TextInput, Text, Title, Surface, Divider } from 'react-native-paper';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Add authentication logic here
    // For now, we'll simulate authentication based on role
    if (email && password) {
      switch (role) {
        case 'admin':
          router.replace('/(admin)' as any);
          break;
        case 'mentor':
          router.replace('/(mentor)' as any);
          break;
        case 'visitor':
          router.replace('/(visitor)' as any);
          break;
        default:
          router.replace('/(visitor)' as any);
      }
    }
  };

  const roleTitle = () => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'mentor': return 'Mentor';
      case 'visitor': return 'Visitor';
      default: return 'User';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Surface style={styles.loginCard} elevation={2}>
        <Surface style={styles.logoContainer} elevation={0}>
          <Image 
            source={require('../../assets/images/depauw-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Surface>
        
        <Title style={styles.title}>Login as {roleTitle()}</Title>
        <Text style={styles.subtitle}>DePauw Pre-College Program</Text>
        
        <Divider style={styles.divider} />
        
        <TextInput
          mode="outlined"
          style={styles.input}
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          outlineColor={Colors.light.primary}
          activeOutlineColor={Colors.light.headerBackground}
          theme={{ roundness: 8 }}
          left={<TextInput.Icon icon="email" color={Colors.light.icon} />}
        />
        
        <TextInput
          mode="outlined"
          style={styles.input}
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          outlineColor={Colors.light.primary}
          activeOutlineColor={Colors.light.headerBackground}
          theme={{ roundness: 8 }}
          left={<TextInput.Icon icon="lock" color={Colors.light.icon} />}
          right={<TextInput.Icon 
            icon={showPassword ? "eye-off" : "eye"} 
            onPress={() => setShowPassword(!showPassword)}
            color={Colors.light.icon}
          />}
        />
        
        <Button 
          mode="contained" 
          buttonColor={Colors.light.primary}
          textColor={Colors.light.headerBackground}
          style={styles.button}
          onPress={handleLogin}
          disabled={!email || !password}
        >
          Login
        </Button>
        
        <Button 
          mode="text"
          textColor={Colors.light.primary}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Back to Role Selection
        </Button>

        <Text style={styles.footerText}>
          © 2025 DePauw University. All rights reserved.
        </Text>
      </Surface>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 12,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  logo: {
    width: 180,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.light.headerBackground,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.light.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 20,
    backgroundColor: Colors.light.primary,
    height: 1,
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.light.background,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backButton: {
    marginTop: 8,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
}); 