import { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { Appbar, BottomNavigation, Text } from 'react-native-paper';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { useState } from 'react';

// Mock authentication check - in a real app, this would check an auth state
const isAuthenticated = () => true; // Replace with actual auth check

export default function VisitorLayout() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'explore', title: 'Explore', focusedIcon: 'compass', unfocusedIcon: 'compass-outline' },
    { key: 'mentors', title: 'Mentors', focusedIcon: 'account-star', unfocusedIcon: 'account-star-outline' },
    { key: 'schedule', title: 'Schedule', focusedIcon: 'calendar', unfocusedIcon: 'calendar-outline' },
  ]);

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

  const renderScene = BottomNavigation.SceneMap({
    home: () => <Slot />,
    explore: () => <Slot />,
    mentors: () => <Slot />,
    schedule: () => <Slot />,
  });

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
      
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={styles.bottomNavBar}
        activeColor={Colors.light.primary}
        inactiveColor="#888888"
      />
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
  },
  bottomNavBar: {
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
}); 