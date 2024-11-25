#ifndef RCT_NEW_ARCH_ENABLED

#import <UIKit/UIKit.h>

@interface PerformanceTrackerView : UIView

@property (nonatomic, copy) NSString *tagName;
@property (nonatomic, copy) NSString *startMarker;
@property (nonatomic, assign) BOOL isEnabled;
@property (nonatomic, assign) double eventTimeStamp;
@property (nonatomic, copy, nullable) void (^onDrawEnd)(NSDictionary *eventData);
@end

#endif
