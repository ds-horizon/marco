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
  diffTime?: Double;
}

export interface NativeProps extends ViewProps {
  startMarker?: string;
  tagName: string;
  isEnabled?: boolean;
  eventTimeStamp?: Double;
  onDrawEnd?: DirectEventHandler<FinishEventType>;
}

export default codegenNativeComponent<NativeProps>('PerformanceTrackerView');
