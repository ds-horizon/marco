#import <Foundation/Foundation.h>
#import "PerformanceTrackerWriter.h"

@implementation PerformanceTrackerWriter

+ (instancetype)sharedInstance {
    static PerformanceTrackerWriter *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[PerformanceTrackerWriter alloc] init];
        sharedInstance.persistToFile = NO; // Default value
    });
    return sharedInstance;
}

- (void)writeLogsWithTag:(NSString *)tag time:(double)time meta:(NSDictionary *)meta {
    if (!self.persistToFile) {
        return;
    }
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
        @try {
            NSString *folderName = @"PerformanceTracker";
            NSString *fileName = @"log.json";
            
            // Get the Documents directory path
            NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
            NSString *documentsDirectory = [paths firstObject];
            
            // Create folder path
            NSString *folderPath = [documentsDirectory stringByAppendingPathComponent:folderName];
            
            NSError *folderError = nil;
            
            // Create folder if it doesn't exist
            if (![[NSFileManager defaultManager] fileExistsAtPath:folderPath]) {
                [[NSFileManager defaultManager] createDirectoryAtPath:folderPath
                                          withIntermediateDirectories:YES
                                                           attributes:nil
                                                                error:&folderError];
                if (folderError) {
                    NSLog(@"Error creating folder: %@", folderError.localizedDescription);
                    return;
                }
            }
            
            // Create file path
            NSString *filePath = [folderPath stringByAppendingPathComponent:fileName];
            
            // Read existing logs
            NSMutableArray *logsArray = [NSMutableArray array];
            if ([[NSFileManager defaultManager] fileExistsAtPath:filePath]) {
                NSData *data = [NSData dataWithContentsOfFile:filePath];
                if (data) {
                    NSArray *existingLogs = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
                    if (existingLogs) {
                        [logsArray addObjectsFromArray:existingLogs];
                    }
                }
            }
            
            // Add new log entry with meta if available
            NSMutableDictionary *logEntry = [@{
                @"tagName": tag,
                @"timestamp": @(time)
            } mutableCopy];
            
            if (meta) {
                logEntry[@"meta"] = meta;
            }
            
            [logsArray addObject:logEntry];
            
            // Write updated logs back to file
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:logsArray options:NSJSONWritingPrettyPrinted error:nil];
            BOOL success = [jsonData writeToFile:filePath atomically:YES];
            if (success) {
                NSLog(@"Log written successfully.");
            } else {
                NSLog(@"Failed to write log file.");
            }
        } @catch (NSException *exception) {
            NSLog(@"Exception in logging: %@", exception.reason);
        }
    });
}

- (void)clearLogs {
    if (self.persistToFile && self.shouldClearFiles) {
        printf("::: clearing files");
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
            @try {
                NSString *folderName = @"PerformanceTracker";
                NSString *fileName = @"log.json";
                
                // Get the Documents directory path
                NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
                NSString *documentsDirectory = [paths firstObject];
                
                // Create folder path
                NSString *folderPath = [documentsDirectory stringByAppendingPathComponent:folderName];
                NSString *filePath = [folderPath stringByAppendingPathComponent:fileName];
                
                NSLog(@"Clearing logs at: %@", filePath);
                
                // Write empty JSON array to the file
                NSArray *emptyArray = @[];
                NSData *jsonData = [NSJSONSerialization dataWithJSONObject:emptyArray options:NSJSONWritingPrettyPrinted error:nil];
                BOOL success = [jsonData writeToFile:filePath atomically:YES];
                
                if (success) {
                    NSLog(@"Log file cleared successfully.");
                } else {
                    NSLog(@"Failed to clear log file.");
                }
            } @catch (NSException *exception) {
                NSLog(@"Exception while clearing logs: %@", exception.reason);
            }
        });
    }
}


@end
