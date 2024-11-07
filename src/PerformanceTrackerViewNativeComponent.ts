import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';

interface NativeProps extends ViewProps {
  color?: string;
  contentDescription: string;
  isGlobalSupportEnabled?: boolean;
  label?: string;
  eventTimeStamp: string;
  isLogEnabled?: boolean;
}

export default codegenNativeComponent<NativeProps>('PerformanceTrackerView');
