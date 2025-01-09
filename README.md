<img src="docs/public/banner.png" width="100%" alt="Marco banner" />

<div align="center">

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/dream-sports-labs/react-native-performance-tracker/blob/main/LICENSE)

</div>

A powerful React Native library to track and log performance metrics for screens and components. It leverages the new architecture with **TurboModules** and **Fabric** for improved efficiency. The library provides insights into render times, draw times, and helps identify performance bottlenecks in your app.

## Documentation

All information about marco is available on our [website](https://github.com/dream-sports-labs/react-native-performance-tracker).

- [Installation](https://github.com/dream-sports-labs/react-native-performance-tracker)

- [Guides](https://github.com/dream-sports-labs/react-native-performance-tracker)

- [Tooling](https://github.com/dream-sports-labs/react-native-performance-tracker)

## Roadmap

**marco** is under active development! Expect a lot of new features to appear soon🔥

- Expo support
- Realtime monitoring of events
- Support for multiple events selection in dashbaord
- Native event logging mechanism

## Community Discord

Join the [DreamSportsLabs Community](https://discord.com/channels/1317172052179943504/1317172052179943507) to chat about marco or other DreamSportsLabs libraries.

## Created by DreamSportsLabs

<img src="media/logo.png" width="40" alt="Genshi banner" />

DreamSportsLabs is committed to building open-source tools that empower developers and businesses. Learn more about us at our website.

# <<<<<<< Updated upstream

## 🛠 API Reference

### **Native Module Methods**

| Method      | Description                                                 | Parameters                    | Returns                        |
| ----------- | ----------------------------------------------------------- | ----------------------------- | ------------------------------ | --- |
| `track`     | Sends a custom performance marker with a tag and timestamp. | `tag: string`, `time: number` | `void`                         |
| `getLogs`   | Retrieves all performance logs asynchronously.              | None                          | `Promise<Record<string, any>>` |
| `resetLogs` | Clears all performance logs.                                | None                          | `void`                         |
| `configure` | Initializes the tracker with optional configuration.        | `config?: InitConfig`         | `void`                         |
| `meta`      | Additional data to be passed.                               | `{[key: string]: string}`     | `undefined`                    | No  |

---

### **Component Props**

| Prop             | Description                                       | Type                                  | Default      | Required |
| ---------------- | ------------------------------------------------- | ------------------------------------- | ------------ | -------- |
| `tagName`        | Unique tag for identifying the tracked component. | `string`                              | `required`   | Yes      |
| `isEnabled`      | Enables or disables performance tracking.         | `boolean`                             | `true`       | No       |
| `eventTimeStamp` | Timestamp when the event is triggered.            | `number`                              | `Date.now()` | No       |
| `onTrackingEnd`  | Callback when the screen has finished rendering.  | `DirectEventHandler<FinishEventType>` | `undefined`  | No       |
| `meta`           | Additional data to be passed.                     | `{[key: string]: string}`             | `undefined`  | No       |

---

### **Event Object (`onTrackingEnd` Callback)**

| Key          | Description                             | Type     |
| ------------ | --------------------------------------- | -------- |
| `tagName`    | The tag name associated with the event. | `string` |
| `drawTime`   | Time taken to draw the component.       | `number` |
| `renderTime` | Time taken to render the component.     | `number` |

> > > > > > > Stashed changes

## 🙌 Contributions

Contributions are welcome! Feel free to submit a PR or raise issues for any bugs or feature requests.
