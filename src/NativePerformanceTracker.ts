import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Config {
  persistToFile?: boolean;
}

export interface ResetOptions {
  clearFiles: boolean;
}

export interface Spec extends TurboModule {
  track(tag: string, time: number, meta?: { [key: string]: string }): void;
  getLogs(): Promise<Record<string, any>>;
  resetLogs(options?: ResetOptions): void;
  configure(config?: Config): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'PerformanceTrackerModule'
);
