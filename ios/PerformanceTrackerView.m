#ifndef RCT_NEW_ARCH_ENABLED

#import "PerformanceTrackerView.h"
#import "PerformanceTrackerStore.h"
#import "PerformanceTrackerWriter.h"

@implementation PerformanceTrackerView {
    UIView * _view;
    BOOL _alreadyLogged;
}

- (instancetype)init {
    self = [super init];
    return self;
}

- (void)setTagName:(NSString *)tagName {
    _tagName = tagName;
}

- (void)setIsEnabled:(BOOL)isEnabled {
    _isEnabled = isEnabled;
}

- (void)setMeta:(NSDictionary *)meta {
    NSLog(@"Meta in Component: %@", meta);
    _meta = meta;
}

- (void)setEventTimeStamp:(double)eventTimeStamp {
    _eventTimeStamp = eventTimeStamp;
}

- (void)didMoveToWindow {
    [super didMoveToWindow];
    
    if (_alreadyLogged) {
        return;
    }
    
    if (!self.window) {
        return;
    }
    
    _alreadyLogged = YES;
    
    if (_isEnabled) {
        dispatch_async(dispatch_get_main_queue(), ^{
            double currentTimeInDouble = [[NSDate date] timeIntervalSince1970] * 1000; // Current time in milliseconds
            long long currentTime = (long long) currentTimeInDouble;
            
            // Log the event in PerformanceTrackerStore
            [[PerformanceTrackerStore sharedInstance] addEventWithTagName:self.tagName timestamp:currentTime meta:self.meta];
            
            // Calculate render time
            double renderTime = currentTime - self.eventTimeStamp;
            if (self.onTrackingEnd) {
                self.onTrackingEnd(@{
                    @"drawTime": @(currentTime),
                    @"renderTime": @(renderTime),
                    @"tagName": self->_tagName
                });
            }
            [[PerformanceTrackerWriter sharedInstance] writeLogsWithTag: self.tagName time: currentTime meta:self.meta writeLogToFileEnabled:NO];
        });
    }
}

@end

#endif
