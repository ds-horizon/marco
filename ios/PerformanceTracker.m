#import "PerformanceTracker.h"
#import "PerformanceTrackerStore.h"
#import "PerformanceTrackerWriter.h"

@implementation PerformanceTracker

+ (instancetype)sharedInstance {
    static PerformanceTracker *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[PerformanceTracker alloc] init];
    });
    return sharedInstance;
}

- (void)track:(NSString *)tagName
           timestamp:(NSTimeInterval)timestamp
                meta:(NSDictionary * _Nullable)meta
      writeLogInFile:(BOOL)writeLogInFile {
    
    // Add event to the performance tracker store
    [[PerformanceTrackerStore sharedInstance] addEventWithTagName:tagName timestamp:timestamp meta:meta];

    // Write logs to file if required
    if (writeLogInFile) {
        [[PerformanceTrackerWriter sharedInstance] writeLogsWithTag:tagName time:timestamp meta:meta writeLogToFileEnabled:writeLogInFile];
    }
}

@end
