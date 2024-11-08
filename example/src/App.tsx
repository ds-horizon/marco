import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import {
  PerformanceTracker,
} from 'react-native-performance-tracker';


export default function App() {
  const [showPTView, setShowPTView] = useState(false);
  const [res, setRes] = useState(0);
  return (
    <View>
      <Button
        title="Toggle Native View Display "
        onPress={() => {
          PerformanceTracker.send("Button_onPress", Date.now());
          setShowPTView(!showPTView);
        }}
      />
      {showPTView && (
        <View style={styles.container}>
          <PerformanceTracker
            style={{ borderWidth: 1, flex: 1 }}
            tagName={'Parent Tracker'}
            eventTimeStamp={Date.now().toString()}
            onDrawEnd={(data) => {
              console.log(`::: Shubham DrawTime: ${data.nativeEvent.drawTime} RenderTime: ${data.nativeEvent.renderTime} TagName: ${data.nativeEvent.tagName}`)
            }}
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
  }
});