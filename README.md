# react-native-performance-tracker 📊

A powerful React Native library to track and log performance metrics for screens and components. It leverages the new architecture with **TurboModules** and **Fabric** for improved efficiency. The library provides insights into render times, draw times, and helps identify performance bottlenecks in your app.

## ✨ Features
- **Track Render Times**: Measure the time taken to render screens and components.
- **Track Draw Times**: Capture the exact time when content is fully painted on the screen.
- **Custom Markers**: Send custom timestamps for events.
- **Logs Management**: Retrieve and reset logs as needed.
- **Supports New Architecture**: Fully compatible with TurboModules and Fabric.


## 📦 Installation

```bash
yarn add react-native-performance-tracker
cd ios && pod install
```

## 🚀 Usage Example

### 1. **Enable Performance Log Persistence**
Enable performance log persistence globally by setting the configuration during the initialization of the PerformanceTracker.

```tsx
import { PerformanceTracker } from 'react-native-performance-tracker';

PerformanceTracker.init({
  persistToFile: true, // Logs will persist to a file for debugging purposes.
});
```

### 2. **Log File Paths**

When `persistToFile` is enabled, the logs will be saved to a file for later retrieval. The file paths differ between **Android** and **iOS**:

#### Android
The benchmark logs are saved to the following path on the device:

```bash
/sdcard/Documents/PerformanceTracker/log.txt
```
#### iOS

The benchmark logs are saved to the following path on the iOS device or simulator:

```bash
Documents/PerformanceTracker/log.txt
```

To retrieve the file on an iOS simulator, use the following command:

```bash
xcrun simctl get_app_container booted org.reactjs.native.example.RNBottomTabBenchmarks data
```

This command provides the path to the app's data container on the simulator. Navigate to the provided path, then locate the file under:

```bash
Documents/PerformanceTracker/log.txt
```


### 2. **Send Custom Markers**

Send custom performance markers at any point in your app:

```tsx
PerformanceTracker.send('start_event', Date.now());
```

### 3. **Retrieve Logs**
Retrieve performance logs asynchronously:

```tsx
const logs = await PerformanceTracker.getLogs();
console.log('Performance Logs:', logs);
```

### 4. **Reset Logs**
Clear all performance logs:

```tsx
PerformanceTracker.resetLogs();
```

### 5. **Track Screen Rendering with the Component**
Wrap your screen or component with PerformanceTracker to automatically capture render and draw times:

```tsx
import { PerformanceTracker } from 'react-native-performance-tracker';

const MyScreen = () => {
  return (
    <PerformanceTracker
      tagName="MyScreen"
      startMarker="screen_load_start"
      isEnabled={true}
      onDrawEnd={(event) => {
        console.log('Draw Time:', event.nativeEvent.drawTime);
        console.log('Render Time:', event.nativeEvent.renderTime);
        console.log('Diff Time:', event.nativeEvent.diffTime); 
        // Logs the time difference between the start marker and draw time. 
        // If no start marker is provided, the value will be null.
      }}
    >
      {/* Your screen content goes here */}
    </PerformanceTracker>
  );
};

```

## 🛠 API Reference

### **Native Module Methods**

| Method         | Description                                                  | Parameters                                             | Returns                      |
|----------------|--------------------------------------------------------------|--------------------------------------------------------|------------------------------|
| `send`         | Sends a custom performance marker with a tag and timestamp.  | `tag: string`, `time: number`                          | `void`                       |
| `getLogs`      | Retrieves all performance logs asynchronously.               | None                                                   | `Promise<Record<string, any>>` |
| `resetLogs`    | Clears all performance logs.                                  | None                                                   | `void`                       |
| `init`         | Initializes the tracker with optional configuration.         | `config?: InitConfig`                                  | `void`                       |

---

### **Component Props**

| Prop            | Description                                                | Type                           | Default    | Required |
|-----------------|------------------------------------------------------------|--------------------------------|------------|----------|
| `startMarker`   | Name of the initial marker for tracking start time.         | `string`                       | `undefined`| No       |
| `tagName`       | Unique tag for identifying the tracked component.           | `string`                       | `required` | Yes      |
| `isEnabled`     | Enables or disables performance tracking.                  | `boolean`                      | `true`     | No       |
| `eventTimeStamp`| Timestamp when the event is triggered.                     | `number`                       | `Date.now()` | No      |
| `onDrawEnd`     | Callback when the screen has finished rendering.           | `DirectEventHandler<FinishEventType>` | `undefined` | No       |

---

### **Event Object (`onDrawEnd` Callback)**

| Key          | Description                                                  | Type     |
|--------------|--------------------------------------------------------------|----------|
| `tagName`    | The tag name associated with the event.                      | `string` |
| `drawTime`   | Time taken to draw the component.                            | `number` |
| `renderTime` | Time taken to render the component.                          | `number` |
| `diffTime`   | Optional difference between `startMaker` and draw time.           | `number` |

## 🙌 Contributions
Contributions are welcome! Feel free to submit a PR or raise issues for any bugs or feature requests.