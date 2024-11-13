import { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { PerformanceTracker } from 'react-native-performance-tracker';

PerformanceTracker.init({
  persistToFile: false,
});

export default function App() {
  const [showPTView, setShowPTView] = useState(false);
  const [res, _] = useState(0);

  const getLogsFromNative = async () => {
    await PerformanceTracker.getLogs();
  };
  return (
    <View>
      <Button
        title="Toggle Native View Display "
        onPress={(e) => {
          PerformanceTracker.send('Button_onPress', e.nativeEvent.timestamp);
          setShowPTView(!showPTView);
        }}
      />
      <Button title="GET ALL EVENTS" onPress={getLogsFromNative} />
      {showPTView && (
        <View style={styles.container}>
          <PerformanceTracker
            style={{ borderWidth: 1, flex: 1 }}
            tagName={'Parent Tracker'}
            eventTimeStamp={Date.now()}
            onDrawEnd={() => {}}
          >
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: 'pink',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>First View: {res}</Text>
            </View>
          </PerformanceTracker>
        </View>
      )}
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
