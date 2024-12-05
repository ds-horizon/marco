import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface InitConfig {
  persistToFile?: boolean;
}

export interface Spec extends TurboModule {
  send(tag: string, time: number): void;
  getLogs(): Promise<Record<string, any>>;
  resetLogs(): void;
  init(config?: InitConfig): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('PerformanceTracker');
