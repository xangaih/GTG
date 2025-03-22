// import { useEffect } from 'react';
// import { StyleSheet, View, Image } from 'react-native';
// import { Slot, useRouter } from 'expo-router';
// import { Appbar, useTheme, Text, Drawer, Avatar } from 'react-native-paper';
// import { ThemedView } from '../../components/ThemedView';
// import { Colors } from '../../constants/Colors';

// // Mock authentication check - in a real app, this would check an auth state
// const isAuthenticated = () => true; // Replace with actual auth check

// export default function AdminLayout() {
//   const router = useRouter();
//   const theme = useTheme();

//   // Check if user is authenticated as admin
//   useEffect(() => {
//     if (!isAuthenticated()) {
//       // Redirect to login if not authenticated
//       router.replace('/(auth)/role-selection' as any);
//     }
//   }, [router]);

//   const handleLogout = () => {
//     // In a real app, perform logout operations
//     router.replace('/(auth)/role-selection' as any);
//   };

//   return (
//     <ThemedView style={styles.container}>
//       <Appbar.Header 
//         style={styles.header} 
//         theme={{ colors: { surface: Colors.light.headerBackground } }}
//       >
//         <Image 
//           source={require('../../assets/images/depauw-logo.png')} 
//           style={styles.headerLogo}
//           resizeMode="contain"
//         />
//         <Appbar.Content title="Admin Dashboard" color={Colors.light.headerText} />
//         <Appbar.Action 
//           icon="logout" 
//           color={Colors.light.primary}
//           onPress={handleLogout} 
//         />
//       </Appbar.Header>
      
//       <View style={styles.contentContainer}>
//         <View style={styles.sidebar}>
//           <View style={styles.adminProfile}>
//             <Avatar.Icon 
//               size={60} 
//               icon="account" 
//               color={Colors.light.headerBackground}
//               style={{ backgroundColor: Colors.light.primary }}
//             />
//             <Text style={styles.adminName}>Admin User</Text>
//             <Text style={styles.adminEmail}>admin@depauw.edu</Text>
//           </View>
          
//           <Drawer.Section title="Navigation">
//             <Drawer.Item
//               icon="view-dashboard"
//               label="Dashboard"
//               active={true}
//               onPress={() => {}}
//             />
//             <Drawer.Item
//               icon="account-group"
//               label="Manage Campers"
//               onPress={() => {}}
//             />
//             <Drawer.Item
//               icon="account-tie"
//               label="Manage Mentors"
//               onPress={() => {}}
//             />
//             <Drawer.Item
//               icon="calendar"
//               label="Program Schedule"
//               onPress={() => {}}
//             />
//             <Drawer.Item
//               icon="cog"
//               label="Settings"
//               onPress={() => {}}
//             />
//           </Drawer.Section>
//         </View>
        
//         <View style={styles.content}>
//           <Slot />
//         </View>
//       </View>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     backgroundColor: Colors.light.headerBackground,
//     elevation: 4,
//   },
//   headerLogo: {
//     width: 100,
//     height: 32,
//     marginLeft: 8,
//   },
//   contentContainer: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   sidebar: {
//     width: 240,
//     backgroundColor: Colors.light.background,
//     borderRightWidth: 1,
//     borderRightColor: '#E0E0E0',
//   },
//   adminProfile: {
//     padding: 16,
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEEEEE',
//   },
//   adminName: {
//     fontWeight: 'bold',
//     marginTop: 8,
//   },
//   adminEmail: {
//     fontSize: 12,
//     color: Colors.light.text,
//     opacity: 0.7,
//   },
//   content: {
//     flex: 1,
//   },
// }); 

import { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { Appbar, useTheme, Text, Drawer, Avatar, IconButton } from 'react-native-paper';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Entypo';

const isAuthenticated = () => true;

export default function AdminLayout() {
  const router = useRouter();
  const theme = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/(auth)/role-selection' as any);
    }
  }, [router]);

  const handleLogout = () => {
    router.replace('/(auth)/role-selection' as any);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
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
        {/* Backdrop (only visible when sidebar is open) */}
        {!isSidebarCollapsed && (
          <TouchableOpacity
            style={styles.backdrop}
            onPress={toggleSidebar} // Close sidebar when backdrop is pressed
            activeOpacity={1}
          />
        )}

        {/* Sidebar */}
        <View
          style={[
            styles.sidebar,
            { width: isSidebarCollapsed ? 50 : 240 },
            isSidebarCollapsed ? null : styles.sidebarOverlay, // Apply overlay style when sidebar is open
          ]}
        >
          {/* Collapse/Expand Button */}
          <TouchableOpacity onPress={toggleSidebar} style={styles.collapseButton}>
            <Icon
              name={isSidebarCollapsed ? 'menu' : 'menu'}
              size={24}
              color={Colors.light.primary}
            />
          </TouchableOpacity>

          {/* Admin Profile (Hidden when collapsed) */}
          {!isSidebarCollapsed && (
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
          )}
          
          {/* Drawer Items (Hidden when collapsed) */}
          {!isSidebarCollapsed && (
            <Drawer.Section style={styles.drawerSection}>
              <Drawer.Item
                icon="view-dashboard"
                label="Dashboard"
                active={true}
                style={styles.expandedItem}
                onPress={() => {}}
              />
              <Drawer.Item
                icon="account-group"
                label="Manage Campers"
                style={styles.expandedItem}
                onPress={() => {}}
              />
              <Drawer.Item
                icon="account-tie"
                label="Manage Mentors"
                style={styles.expandedItem}
                onPress={() => {}}
              />
              <Drawer.Item
                icon="calendar"
                label="Program Schedule"
                style={styles.expandedItem}
                onPress={() => {}}
              />
              <Drawer.Item
                icon="cog"
                label="Settings"
                style={styles.expandedItem}
                onPress={() => {}}
              />
            </Drawer.Section>
          )}
        </View>
        
        {/* Main Content */}
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
    backgroundColor: Colors.light.background,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    zIndex: 1, // Ensure the sidebar is above the main content
  },
  sidebarOverlay: {
    position: 'absolute', // Overlay the sidebar on top of the main content
    top: 0,
    left: 0,
    bottom: 0,
    elevation: 5, // Add elevation for shadow effect (Android)
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    zIndex: 0, // Ensure it's below the sidebar
  },
  drawerSection: {
    paddingHorizontal: 0,
  },
  expandedItem: {
    paddingLeft: 16,
    height: 48,
  },
  collapseButton: {
    alignItems: 'center',
    padding: 8,
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
    backgroundColor: Colors.light.background, // Ensure the main content has a background color
  },
});