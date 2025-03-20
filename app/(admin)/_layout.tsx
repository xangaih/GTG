import { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { Appbar, useTheme, Text, Drawer, Avatar } from 'react-native-paper';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';

// Mock authentication check - in a real app, this would check an auth state
const isAuthenticated = () => true; // Replace with actual auth check

export default function AdminLayout() {
  const router = useRouter();
  const theme = useTheme();

  // Check if user is authenticated as admin
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
        <Appbar.Content title="Admin Dashboard" color={Colors.light.headerText} />
        <Appbar.Action 
          icon="logout" 
          color={Colors.light.primary}
          onPress={handleLogout} 
        />
      </Appbar.Header>
      
      <View style={styles.contentContainer}>
        <View style={styles.sidebar}>
          <View style={styles.adminProfile}>
            <Avatar.Icon 
              size={60} 
              icon="account" 
              color={Colors.light.headerBackground}
              style={{ backgroundColor: Colors.light.primary }}
            />
            <Text style={styles.adminName}>Admin User</Text>
            <Text style={styles.adminEmail}>admin@depauw.edu</Text>
          </View>
          
          <Drawer.Section title="Navigation">
            <Drawer.Item
              icon="view-dashboard"
              label="Dashboard"
              active={true}
              onPress={() => {}}
            />
            <Drawer.Item
              icon="account-group"
              label="Manage Campers"
              onPress={() => {}}
            />
            <Drawer.Item
              icon="account-tie"
              label="Manage Mentors"
              onPress={() => {}}
            />
            <Drawer.Item
              icon="calendar"
              label="Program Schedule"
              onPress={() => {}}
            />
            <Drawer.Item
              icon="cog"
              label="Settings"
              onPress={() => {}}
            />
          </Drawer.Section>
        </View>
        
        <View style={styles.content}>
          <Slot />
        </View>
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
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 240,
    backgroundColor: Colors.light.background,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  adminProfile: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  adminName: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  adminEmail: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
}); 