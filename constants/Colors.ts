/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * DePauw University theme colors
 * Based on branding guidelines
 */

// DePauw University colors
const depaulGold = '#FFC72C';  // Primary gold
const depaulBlack = '#000000'; // Black
const depaulWhite = '#FFFFFF'; // White

export const Colors = {
  light: {
    text: depaulBlack,
    background: depaulWhite,
    tint: depaulGold,
    primary: depaulGold,
    icon: depaulBlack,
    tabIconDefault: '#687076',
    tabIconSelected: depaulGold,
    accent: '#F8F3E6',  // Light gold/cream for accent backgrounds
    cardBackground: '#F8F8F8',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#F57C00',
    headerBackground: depaulBlack,
    headerText: depaulWhite,
  },
  dark: {
    text: depaulWhite,
    background: '#212121',
    tint: depaulGold,
    primary: depaulGold,
    icon: depaulGold,
    tabIconDefault: '#9BA1A6',
    tabIconSelected: depaulGold,
    accent: '#2C2C2C',  // Dark accent for cards
    cardBackground: '#2C2C2C',
    error: '#EF5350',
    success: '#4CAF50',
    warning: '#FFA726',
    headerBackground: depaulBlack,
    headerText: depaulGold,
  },
};
