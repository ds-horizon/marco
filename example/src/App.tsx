/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { PerformanceTracker } from '@d11/marco';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';

PerformanceTracker.configure({
  persistToFile: true,
});

function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    PerformanceTracker.track('HomeScreen_Mounted', Date.now());

    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  }, []);

  if (isLoading) {
    return (
      <PerformanceTracker tagName="LoadingState" style={styles.outerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </PerformanceTracker>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <PerformanceTracker tagName="HomeScreen_Loaded" isEnabled>
        <Text testID="home_screen_text" style={styles.text}>
          Home Screen
        </Text>
      </PerformanceTracker>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
