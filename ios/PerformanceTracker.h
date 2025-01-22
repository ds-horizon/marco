@interface PerformanceTracker : NSObject

+ (instancetype _Nullable )sharedInstance;

/**
 Tracks an event with optional logging to a file.

 @param tagName The tag name for the event.
 @param timestamp The timestamp of the event.
 @param meta Optional metadata related to the event.
 @param writeLogInFile Whether to write the log to a file (default: YES).
 */
- (void)track:(NSString *_Nullable)tagName
           timestamp:(NSTimeInterval)timestamp
                meta:(NSDictionary * _Nullable)meta
      writeLogInFile:(BOOL)writeLogInFile;

@end