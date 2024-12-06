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

- (void)writeLogsWithTag:(NSString *)tag time:(double) time {
    if (!self.persistToFile) {
        return;
    }
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
        @try {
            NSString *folderName = @"PerformanceTracker";
            NSString *fileName = @"log.txt";
            
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
            
            // Log entry
            NSString *logEntry = [NSString stringWithFormat:@"%@,%lf\n", tag, time];
            
            // Append to file
            NSFileHandle *fileHandle = [NSFileHandle fileHandleForWritingAtPath:filePath];
            if (fileHandle) {
                [fileHandle seekToEndOfFile];
                [fileHandle writeData:[logEntry dataUsingEncoding:NSUTF8StringEncoding]];
                [fileHandle closeFile];
            } else {
                // File doesn't exist, create and write
                NSError *fileError = nil;
                BOOL success = [logEntry writeToFile:filePath
                                          atomically:YES
                                            encoding:NSUTF8StringEncoding
                                               error:&fileError];
                if (!success) {
                    NSLog(@"Error writing log file: %@", fileError.localizedDescription);
                }
            }
        } @catch (NSException *exception) {
            NSLog(@"Exception in logging: %@", exception.reason);
        }
    });
}

@end
