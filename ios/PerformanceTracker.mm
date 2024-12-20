#import "PerformanceTracker.h"
#import "PerformanceTrackerStore.h"
#import "PerformanceTrackerWriter.h"

@implementation PerformanceTracker
RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    
    return self;
}

RCT_EXPORT_METHOD(track:(NSString *)tag time:(double)time)
{
    [[PerformanceTrackerStore sharedInstance] addEventWithTagName:tag timestamp:time];
    [[PerformanceTrackerWriter sharedInstance] writeLogsWithTag: tag time: time];
}

// Reset all logged events
#ifdef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_METHOD(resetLogs: (JS::NativePerformanceTracker::ResetOptions &)options)
{
    [[PerformanceTrackerWriter sharedInstance] setShouldClearFiles: options.clearFiles()];
    [[PerformanceTrackerStore sharedInstance] clearEvents];
    [[PerformanceTrackerWriter sharedInstance] clearLogs];
}
#else
RCT_EXPORT_METHOD(resetLogs:(NSDictionary *)options) {
    NSNumber *shouldClearFilesValue = options[@"clearFiles"];
    
    BOOL shouldClearFiles = [shouldClearFilesValue boolValue];
    
    [[PerformanceTrackerWriter sharedInstance] setShouldClearFiles:shouldClearFiles];
}
#endif

// Retrieve all logged events
RCT_EXPORT_METHOD(getLogs:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    NSArray *logs = [[PerformanceTrackerStore sharedInstance] getAllEvents];
    resolve(logs);
}

#ifdef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_METHOD(configure: (JS::NativePerformanceTracker::Config &)config) {
    if (config.persistToFile().has_value()) {
        [[PerformanceTrackerWriter sharedInstance] setPersistToFile: config.persistToFile().value()];
    } else {
        [[PerformanceTrackerWriter sharedInstance] setPersistToFile: NO];
    }
}
#else
RCT_EXPORT_METHOD(configure:(NSDictionary *)config) {
    NSNumber *persistToFileValue = config[@"persistToFile"];
    
    BOOL persistToFile = [persistToFileValue boolValue];
    
    [[PerformanceTrackerWriter sharedInstance] setPersistToFile:persistToFile];
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
