#import "PerformanceTrackerModule.h"
#import "PerformanceTrackerStore.h"
#import "PerformanceTrackerWriter.h"

@implementation PerformanceTrackerModule
RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    
    return self;
}

// Passing NO for writeLogToFileEnabled because for modules, we are controlling
// this behavior using the globalPersistentFlag. The writeLogToFileEnabled parameter
// is specifically used to control persistence when interacting directly with
// the iOS native world.
#ifdef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_METHOD(track:(NSString *)tag time:(double)time meta:(NSDictionary *)meta)
{
    [[PerformanceTrackerStore sharedInstance] addEventWithTagName:tag timestamp:time meta: meta];
    [[PerformanceTrackerWriter sharedInstance] writeLogsWithTag: tag time: time meta: meta writeLogToFileEnabled:NO];
}
#else
RCT_EXPORT_METHOD(track:(NSString *)tag time:(double)time meta:(NSDictionary *)meta)
{
    [[PerformanceTrackerStore sharedInstance] addEventWithTagName:tag timestamp:time meta: meta];
    [[PerformanceTrackerWriter sharedInstance] writeLogsWithTag: tag time: time meta: meta writeLogToFileEnabled:NO];
}
#endif

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
    [[PerformanceTrackerStore sharedInstance] clearEvents];
    [[PerformanceTrackerWriter sharedInstance] clearLogs];
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
        [[PerformanceTrackerWriter sharedInstance] setGlobalPersistenceEnabled: config.persistToFile().value()];
    } else {
        [[PerformanceTrackerWriter sharedInstance] setGlobalPersistenceEnabled: NO];
    }
}
#else
RCT_EXPORT_METHOD(configure:(NSDictionary *)config) {
    NSNumber *persistToFileValue = config[@"persistToFile"];
    
    BOOL persistToFile = [persistToFileValue boolValue];
    
    [[PerformanceTrackerWriter sharedInstance] setGlobalPersistenceEnabled:persistToFile];
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
