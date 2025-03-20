import { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { Appbar, Avatar, Text, List, Divider } from 'react-native-paper';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';

// Mock authentication check - in a real app, this would check an auth state
const isAuthenticated = () => true; // Replace with actual auth check

export default function MentorLayout() {
  const router = useRouter();

  // Check if user is authenticated as mentor
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
        <Appbar.Content title="Mentor Portal" color={Colors.light.headerText} />
        <Appbar.Action 
          icon="logout" 
          color={Colors.light.primary}
          onPress={handleLogout} 
        />
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={styles.sidebar}>
          <View style={styles.mentorProfile}>
            <Avatar.Icon 
              size={60} 
              icon="account-star" 
              color={Colors.light.headerBackground}
              style={{ backgroundColor: Colors.light.primary }}
            />
            <Text style={styles.mentorName}>Dr. Sarah Reynolds</Text>
            <Text style={styles.mentorDepartment}>Computer Science</Text>
          </View>

          <Divider />
          
          <List.Section>
            <List.Item
              title="Dashboard"
              left={props => <List.Icon {...props} icon="view-dashboard" />}
              style={styles.menuItem}
              titleStyle={styles.menuItemText}
              onPress={() => {}}
            />
            <List.Item
              title="My Students"
              left={props => <List.Icon {...props} icon="account-group" />}
              style={styles.menuItem}
              titleStyle={styles.menuItemText}
              onPress={() => {}}
            />
            <List.Item
              title="Schedule"
              left={props => <List.Icon {...props} icon="calendar" />}
              style={styles.menuItem}
              titleStyle={styles.menuItemText}
              onPress={() => {}}
            />
            <List.Item
              title="Resources"
              left={props => <List.Icon {...props} icon="book-open-variant" />}
              style={styles.menuItem}
              titleStyle={styles.menuItemText}
              onPress={() => {}}
            />
            <List.Item
              title="Messages"
              left={props => <List.Icon {...props} icon="message" />}
              style={styles.menuItem}
              titleStyle={styles.menuItemText}
              right={props => <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>}
              onPress={() => {}}
            />
            <List.Item
              title="Profile"
              left={props => <List.Icon {...props} icon="account-cog" />}
              style={styles.menuItem}
              titleStyle={styles.menuItemText}
              onPress={() => {}}
            />
          </List.Section>
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
  mentorProfile: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  mentorName: {
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  mentorDepartment: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.7,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuItemText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.light.headerBackground,
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 