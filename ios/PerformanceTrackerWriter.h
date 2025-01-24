#import <Foundation/Foundation.h>

@interface PerformanceTrackerWriter : NSObject

- (void)writeLogsWithTag:(NSString *)tag time:(double)time meta: (NSDictionary *)meta writeLogToFileEnabled: (BOOL)writeLogToFileEnabled;
- (void)clearLogs;

+ (instancetype)sharedInstance;

@property (nonatomic, assign) BOOL globalPersistenceEnabled;
@property (nonatomic, assign) BOOL shouldClearFiles;

@end
