import { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { Appbar, Text } from 'react-native-paper';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';

// Mock authentication check - in a real app, this would check an auth state
const isAuthenticated = () => true; // Replace with actual auth check

export default function VisitorLayout() {
  const router = useRouter();

  // Check if user is authenticated as visitor
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/role-selection' as any);
    }
  }, [router]);

  const handleLogout = () => {
    // In a real app, perform logout operations
    router.replace('/(auth)/role-selection' as any);
  };

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header 
        style={styles.header} 
        theme={{ colors: { surface: Colors.light.headerBackground } }}
      >
        <Image 
          source={require('../../assets/images/depauw-logo.png')} 
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Appbar.Content title="Visitor Portal" color={Colors.light.headerText} />
        <Appbar.Action 
          icon="account-circle" 
          color={Colors.light.primary}
          onPress={() => {}} 
        />
        <Appbar.Action 
          icon="logout" 
          color={Colors.light.primary}
          onPress={handleLogout} 
        />
      </Appbar.Header>
      
      <View style={styles.content}>
        <Slot />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.light.headerBackground,
    elevation: 4,
  },
  headerLogo: {
    width: 100,
    height: 32,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  }
}); 