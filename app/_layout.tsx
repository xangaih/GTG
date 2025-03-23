import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useCallback } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import { theme } from '../constants/theme';
import { View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      // Hide the splash screen once assets are loaded
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Handle initial routing after layout is mounted
  useEffect(() => {
    if (!loaded) return;

    // We need to wait until after the first render to safely navigate
    const timer = setTimeout(() => {
      const firstSegment = segments[0];
      if (!firstSegment) {
        router.replace('/(auth)/role-selection');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [loaded, segments, router]);

  if (!loaded) {
    return <View />;
  }

  // Select the appropriate themes based on color scheme
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <SafeAreaProvider onLayout={onLayoutRootView}>
          <ThemeProvider value={navigationTheme}>
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
            <StatusBar style="auto" />
          </ThemeProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
