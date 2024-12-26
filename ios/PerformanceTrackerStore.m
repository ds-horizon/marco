#import "PerformanceTrackerStore.h"

@interface PerformanceTrackerStore ()

@property (nonatomic, strong) NSMutableArray<NSDictionary *> *eventSequence;

@end

@implementation PerformanceTrackerStore

+ (instancetype)sharedInstance {
    static PerformanceTrackerStore *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[PerformanceTrackerStore alloc] init];
        sharedInstance.eventSequence = [NSMutableArray array];
    });
    return sharedInstance;
}

- (void)addEventWithTagName:(NSString *)tagName timestamp:(double)timestamp meta:(NSDictionary *)meta {
    NSMutableDictionary *eventDetails = [@{
        @"tagName": tagName,
        @"timestamp": @(timestamp)
    } mutableCopy];

    // Add meta only if it's not nil
    if (meta) {
        eventDetails[@"meta"] = meta;
    }
    [self.eventSequence addObject:eventDetails];
}

- (NSArray<NSDictionary *> *)getAllEvents {
    return [self.eventSequence copy];
}

- (void)clearEvents {
    [self.eventSequence removeAllObjects];
}

- (NSNumber *)getEventValueWithTagName:(NSString *)tagName {
    for (NSInteger i = self.eventSequence.count - 1; i >= 0; i--) {
        NSDictionary *event = self.eventSequence[i];
        if ([event[@"tagName"] isEqualToString:tagName]) {
            return event[@"timestamp"];
        }
    }
    return nil;
}

@end
