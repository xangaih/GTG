import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { Button, Text, MD3LightTheme } from 'react-native-paper';

export default function TestImport() {
  console.log('MD3LightTheme:', MD3LightTheme);
  
  return (
    <View style={styles.container}>
      <RNText>Native Text</RNText>
      <Text>Paper Text</Text>
      <Button mode="contained" onPress={() => console.log('Pressed')}>
        Press me
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
}); 