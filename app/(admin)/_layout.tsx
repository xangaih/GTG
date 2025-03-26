import { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Appbar, useTheme, Text, Drawer, Avatar, IconButton, Divider } from 'react-native-paper';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
// @ts-ignore
import Icon from 'react-native-vector-icons/Entypo';

// Replace with actual auth check in your app
const isAuthenticated = () => true;

export default function AdminLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/(auth)/role-selection');
    }
  }, [router]);

  const handleLogout = () => {
    router.replace('/(auth)/role-selection');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header 
        style={styles.header} 
        theme={{ colors: { surface: Colors.light.headerBackground } }}
      >
        <Appbar.Action 
          icon="menu" 
          color={Colors.light.primary}
          onPress={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        <Image 
          source={require('../../assets/images/depauw-logo.png')} 
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Appbar.Content title="Admin Dashboard" color={Colors.light.headerText} />
      </Appbar.Header>
      
      <View style={styles.content}>
        {/* Overlay to close sidebar when clicking outside */}
        {!isSidebarCollapsed && (
          <TouchableOpacity 
            style={styles.overlay} 
            activeOpacity={0.2}
            onPress={() => setIsSidebarCollapsed(true)}
          />
        )}
        
        <Drawer.Section style={[
          styles.drawer, 
          { width: isSidebarCollapsed ? 80 : 280 }
        ]}>
          <View style={styles.drawerContent}>
            <Drawer.Section style={styles.drawerSection}>
              <Drawer.Item
                icon="view-dashboard"
                label="Dashboard"
                active={isActive('/')}
                style={styles.expandedItem}
                onPress={() => router.push('/')}
              />
              <Drawer.Item
                icon="account-group"
                label="Manage Visitors"
                active={isActive('/user-management')}
                style={styles.expandedItem}
                onPress={() => router.push('/user-management')}
              />
              <Drawer.Item
                icon="account-tie"
                label="Manage Mentors"
                active={isActive('/manage-mentors')}
                style={styles.expandedItem}
                onPress={() => router.push('/manage-mentors')}
              />
              <Drawer.Item
                icon="clipboard-list"
                label="Program Schedule"
                active={isActive('/activities')}
                style={styles.expandedItem}
                onPress={() => router.push('/activities')}
              />
              <Drawer.Item
                icon="cog"
                label="Settings"
                active={isActive('/settings')}
                style={styles.expandedItem}
                onPress={() => router.push('/')}
              />
            </Drawer.Section>
            
            <Divider style={styles.divider} />
            
            <Drawer.Item
              icon="logout"
              label="Logout"
              style={styles.expandedItem}
              onPress={handleLogout}
            />

            <IconButton
              icon={isSidebarCollapsed ? 'chevron-right' : 'chevron-left'}
              size={24}
              onPress={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={styles.collapseButton}
            />
          </View>
        </Drawer.Section>
        
        <View style={styles.mainContent}>
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
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.light.background,
    zIndex: 2,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  drawerContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  drawerSection: {
    width: '100%',
  },
  expandedItem: {
    marginVertical: 4,
    paddingHorizontal: 16,
    width: '100%',
    height: 50,
  },
  collapseButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  mainContent: {
    flex: 1,
    marginLeft: 80, // Adjust based on collapsed width
  },
  divider: {
    marginVertical: 8,
    width: '90%',
    alignSelf: 'center',
  },
});