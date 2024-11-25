#import "PerformanceTracker.h"
#import "PerformanceTrackerStore.h"

@implementation PerformanceTracker
RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    
    return self;
}

RCT_EXPORT_METHOD(send:(NSString *)tag time:(double)time)
{
    [[PerformanceTrackerStore sharedInstance] addEventWithTagName:tag timestamp:time];
}

// Reset all logged events
RCT_EXPORT_METHOD(resetLogs)
{
    [[PerformanceTrackerStore sharedInstance] clearEvents];
}

// Retrieve all logged events
RCT_EXPORT_METHOD(getLogs:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    NSArray *logs = [[PerformanceTrackerStore sharedInstance] getAllEvents];
    resolve(logs);
}

#ifdef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_METHOD(init: (JS::NativePerformanceTracker::InitConfig &)config) {
    printf("::: Send called init ");
}
#else
RCT_EXPORT_METHOD(init:(NSDictionary *)config) {
    printf("::: Send called init ");
}
#endif

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativePerformanceTrackerSpecJSI>(params);
}
#endif

@end
