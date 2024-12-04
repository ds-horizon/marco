#ifndef RCT_NEW_ARCH_ENABLED

#import "PerformanceTrackerView.h"
#import "../PerformanceTrackerStore.h"

@implementation PerformanceTrackerView {
    UIView * _view;
    BOOL _alreadyLogged;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        //        _storage = [[PerformanceTrackerView alloc] init];
    }
    return self;
}

- (void)setTagName:(NSString *)tagName {
    _tagName = tagName;
}

- (void)setIsEnabled:(BOOL)isEnabled {
    _isEnabled = isEnabled;
}

- (void)setStartMarker:(NSString *)startMarker {
    _startMarker = startMarker;
}

- (void)setEventTimeStamp:(double)eventTimeStamp {
    eventTimeStamp = eventTimeStamp;
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
    
    // However, we cannot do it right now: the views were just mounted but pixels
    // were not drawn on the screen yet.
    // They will be drawn for sure before the next tick of the main run loop.
    // Let's wait for that and then report.
    dispatch_async(dispatch_get_main_queue(), ^{
        double currentTime = [[NSDate date] timeIntervalSince1970] * 1000; // Current time in milliseconds
        double diffTime = 0;
        
        if (self.startMarker.length > 0) {
            NSNumber *startTime = [[PerformanceTrackerStore sharedInstance] getEventValueWithTagName:self.startMarker];
            if (startTime) {
                diffTime = currentTime - startTime.doubleValue;
            }
        }
        
        // Log the event in PerformanceTrackerStore
        [[PerformanceTrackerStore sharedInstance] addEventWithTagName:self.tagName timestamp:currentTime];
        
        // Calculate render time
        double renderTime = currentTime - self.eventTimeStamp;
        self.onDrawEnd(@{
            @"drawTime": @(currentTime),
            @"renderTime": @(renderTime),
            @"diffTime": @(diffTime),
            @"tagName": self->_tagName
        });
    });
}

@end

#endif
