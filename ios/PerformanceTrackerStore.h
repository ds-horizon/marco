#import <Foundation/Foundation.h>

@interface PerformanceTrackerStore : NSObject

+ (instancetype)sharedInstance;

- (void)addEventWithTagName:(NSString *)tagName timestamp:(double)timestamp meta: (NSDictionary *)meta;
- (NSArray<NSDictionary *> *)getAllEvents;
- (void)clearEvents;
- (NSNumber *)getEventValueWithTagName:(NSString *)tagName;

@end
