import { useEffect, useState } from 'react';
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
  const [res, _] = useState(0);

  useEffect(() => {
    console.log("::: Shubham useEffect mount called ", Date.now().toString());
    
  }, [])

  const getLogsFromNative = async () => {
    const logs = await PerformanceTracker.getLogs();

    console.log("::: Shubham logs", logs)
  }
  return (
    <View>
      <Button
        title="Toggle Native View Display "
        onPress={(e) => {
          PerformanceTracker.send("Button_onPress", e.nativeEvent.timestamp);
          setShowPTView(!showPTView);
        }}
      />
      <Button
        title="GET ALL EVENTS"
        onPress={getLogsFromNative}
      />
      {showPTView && 
        <View style={styles.container}>
          <PerformanceTracker
            onLayout={(e) => {
              console.log("::: Shubham onLayout called ", e.timeStamp)
            }}
            style={{ borderWidth: 1, flex: 1 }}
            tagName={'Parent Tracker'}
            eventTimeStamp={Date.now()}
            onDrawEnd={(data) => {
              console.log(`::: Shubham Parent DrawTime: ${data.nativeEvent.drawTime} RenderTime: ${data.nativeEvent.renderTime} TagName: ${data.nativeEvent.tagName}`)
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
              {/* <PerformanceTracker tagName='Child Tracker' eventTimeStamp={Date.now()} isEnabled={false} onDrawEnd={(data) => {
                console.log(`::: Shubham Children DrawTime: ${data.nativeEvent.drawTime} RenderTime: ${data.nativeEvent.renderTime} TagName: ${data.nativeEvent.tagName}`)
              }}>
                <View>
                  <Text>Children View</Text>
                </View>
              </PerformanceTracker> */}
            </View>
          </PerformanceTracker>
        </View>
      }
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