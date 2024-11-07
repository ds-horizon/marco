import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-performance-tracker' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const PerformanceLoggerModule = isTurboModuleEnabled
  ? require('./NativePerformanceTracker').default
  : NativeModules.PerformanceTracker;

const PerformanceLogger = PerformanceLoggerModule
  ? PerformanceLoggerModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return PerformanceLogger.multiply(a, b);
}

export { default as PerformanceTrackerView } from './PerformanceTrackerViewNativeComponent';
export * from './PerformanceTrackerViewNativeComponent';
