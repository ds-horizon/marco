import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { PerformanceTracker } from '@d11/react-native-performance-tracker';

PerformanceTracker.init({
  persistToFile: true,
});

interface ItemProps {
  index: number;
}

const ItemCard = ({ index }: ItemProps) => {
  const [endMarkers, setEndMarkers] = useState({
    drawTime: '',
    renderTime: '',
    diffTime: '',
  });

  const isEnabled = index === 0 || index === 1;
  return (
    <PerformanceTracker
      isEnabled={isEnabled}
      startMarker="Screen_Mount"
      tagName={`Item-${index}`}
      style={{
        margin: 20,
      }}
      onDrawEnd={({ nativeEvent }) => {
        setEndMarkers({
          drawTime: nativeEvent.drawTime.toString(),
          renderTime: nativeEvent.renderTime.toString(),
          diffTime: nativeEvent.diffTime?.toString() ?? '',
        });
      }}
    >
      <View
        style={{
          elevation: 1,
          backgroundColor: 'white',
          padding: 10,
          height: 150,
          width: '100%',
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={styles.text}>{`Card: ${index}`}</Text>
        {isEnabled && (
          <Text
            style={styles.text}
          >{`onDraw Timestamp: ${endMarkers.drawTime}`}</Text>
        )}
        {isEnabled && (
          <Text
            style={styles.text}
          >{`Render Time: ${endMarkers.renderTime}ms`}</Text>
        )}
        {endMarkers.diffTime && (
          <Text
            style={styles.text}
          >{`(Draw - Mount) Time: ${endMarkers.diffTime}ms`}</Text>
        )}
      </View>
    </PerformanceTracker>
  );
};

const DATA = new Array(100).fill(null);

export default function App() {
  const getLogsFromNative = async () => {
    const data = await PerformanceTracker.getLogs();
    console.log(`Platform: ${Platform.OS} All events ${JSON.stringify(data)}`);
  };

  const resetEvents = async () => {
    PerformanceTracker.resetLogs();
  };

  useEffect(() => {
    // Set Mount as T0 marker
    PerformanceTracker.send('Screen_Mount', Date.now());
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
      >
        <Button title="Get All Events" onPress={getLogsFromNative} />
        <Button title="Reset" onPress={resetEvents} />
        <View
          style={{
            flex: 1,
            backgroundColor: '#D3D3D3',
          }}
        >
          <FlatList
            initialNumToRender={10}
            data={DATA}
            renderItem={({ index }) => {
              return <ItemCard index={index} />;
            }}
          />
        </View>
      </View>
    </SafeAreaView>
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
  text: {
    fontSize: 18,
  },
});
