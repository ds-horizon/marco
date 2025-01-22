
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNPerformanceTrackerSpec.h"

@interface PerformanceTrackerModule : NSObject <NativePerformanceTrackerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface PerformanceTrackerModule : NSObject <RCTBridgeModule>
#endif

@end
