import { MD3LightTheme } from 'react-native-paper';
import { Colors } from './Colors';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.primary,
    secondary: Colors.light.tint,
    error: Colors.light.error,
    background: Colors.light.background,
    surface: Colors.light.white,
    text: Colors.light.text,
    onSurface: Colors.light.text,
    notification: Colors.light.notification,
    success: Colors.light.success,
  },
  roundness: 8,
}; 