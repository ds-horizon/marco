import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface InitConfig {
  persistToFile?: boolean;
}

export interface PerformanceTrackerViewStaticMethods {
  send: (tag: string, time: number) => void;
  getLogs(): Promise<Record<string, any>>;
  resetLogs(): void;
  init(config?: InitConfig): void;
}

export interface Spec
  extends TurboModule,
    PerformanceTrackerViewStaticMethods {}

export default TurboModuleRegistry.getEnforcing<Spec>('PerformanceTracker');
