import React from 'react';
import {
  NativeModules,
  requireNativeComponent,
  StyleSheet,
  type ViewProps,
} from 'react-native';
import type { NativeProps } from './PerformanceTrackerViewNativeComponent';
import type { InitConfig } from './NativePerformanceTracker';

const isFabricEnabled = (global as any)?.nativeFabricUIManager != null;
const isTurboModuleEnabled = (global as any).__turboModuleProxy != null;

const PerformanceLoggerModule = isTurboModuleEnabled
  ? require('./NativePerformanceTracker').default
  : NativeModules.PerformanceTracker;

const PerformanceTrackerView = isFabricEnabled
  ? require('./PerformanceTrackerViewNativeComponent').default
  : requireNativeComponent('PerformanceTrackerView');

type PerformanceTrackerViewProps = NativeProps & ViewProps;

type PerformanceTrackerViewStaticMethods = {
  track: (tag: string, time: number) => void;
  getLogs(): Promise<Record<string, any>>;
  resetLogs(): void;
  init(config?: InitConfig): void;
};

const PerformanceTrackerViewBase = ({
  children,
  style,
  eventTimeStamp = Date.now(),
  isEnabled = true,
  ...rest
}: PerformanceTrackerViewProps) => {
  return (
    <PerformanceTrackerView
      {...rest}
      isEnabled={isEnabled}
      eventTimeStamp={eventTimeStamp}
      style={[styles.default, style]}
    >
      {children}
    </PerformanceTrackerView>
  );
};

const styles = StyleSheet.create({
  default: {
    backgroundColor: 'rgba(255, 0, 0, 0)',
  },
});

PerformanceTrackerViewBase.displayName = 'PerformanceTracker';

PerformanceTrackerViewBase.track = (tag: string, time: number) =>
  PerformanceLoggerModule.track(tag, time);
PerformanceTrackerViewBase.getLogs = () => PerformanceLoggerModule.getLogs();
PerformanceTrackerViewBase.resetLogs = () =>
  PerformanceLoggerModule.resetLogs();
PerformanceTrackerViewBase.init = (config?: InitConfig) =>
  PerformanceLoggerModule.init(config);

export const PerformanceTracker: React.ComponentType<PerformanceTrackerViewProps> &
  PerformanceTrackerViewStaticMethods = PerformanceTrackerViewBase;
