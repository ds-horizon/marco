#import <Foundation/Foundation.h>

@interface PerformanceTrackerWriter : NSObject

- (void)writeLogsWithTag:(NSString *)tag time:(double)time;

+ (instancetype)sharedInstance;

@property (nonatomic, assign) BOOL persistToFile;
@property (nonatomic, assign) BOOL shouldClearFiles;

@end
