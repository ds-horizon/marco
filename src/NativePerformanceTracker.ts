import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  send(tag: string, time: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('PerformanceTracker');
