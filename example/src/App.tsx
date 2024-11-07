import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PerformanceTrackerView, multiply } from 'react-native-performance-tracker';

export default function App() {

  const [result, setResult] = useState<number | undefined>();

  useEffect(() => {
    multiply(3,7).then(setResult)
  }, []);


  return (
    <View style={styles.container}>
      <PerformanceTrackerView color="red" style={styles.box} contentDescription='MyView' eventTimeStamp='time'/>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
