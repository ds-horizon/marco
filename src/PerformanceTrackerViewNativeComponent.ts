import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';
import type {
  DirectEventHandler,
  Double,
} from 'react-native/Libraries/Types/CodegenTypes';

interface FinishEventType {
  tagName: string;
  drawTime: Double;
  renderTime: Double;
}

export interface NativeProps extends ViewProps {
  tagName: string;
  isEnabled?: boolean;
  eventTimeStamp?: Double;
  meta?: ReadonlyArray<Readonly<{ name: string; value: string }>>;
  onTrackingEnd?: DirectEventHandler<FinishEventType>;
}

export default codegenNativeComponent<NativeProps>('PerformanceTrackerView');
