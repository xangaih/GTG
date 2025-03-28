import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, SplashScreen, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import { theme } from '../constants/theme';
import { View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Root component that handles initial navigation based on auth state
function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const firstSegment = segments[0];
    if (!firstSegment) {
      router.replace('/(auth)/role-selection');
    }
  }, [segments]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen name="(mentor)" options={{ headerShown: false }} />
      <Stack.Screen name="(visitor)" options={{ headerShown: false }} />
      <Stack.Screen name="(loggedIn)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="test-paper" options={{ title: 'Test Paper' }} />
      <Stack.Screen name="test-import" options={{ title: 'Test Import' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Hide splash screen once everything is loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <View />;
  }

  // Select the appropriate themes based on color scheme
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <ThemeProvider value={navigationTheme}>
            <RootLayoutNav />
            <StatusBar style="auto" />
          </ThemeProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
