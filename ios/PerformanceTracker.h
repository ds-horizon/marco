
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNPerformanceTrackerSpec.h"

@interface PerformanceTracker : NSObject <NativePerformanceTrackerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface PerformanceTracker : NSObject <RCTBridgeModule>
#endif

@end
