#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCTBridge.h"
#import "PerformanceTrackerView.h"

@interface PerformanceTrackerViewManager : RCTViewManager
@end

@implementation PerformanceTrackerViewManager

RCT_EXPORT_MODULE(PerformanceTrackerView)

- (UIView *)view
{
  return [[PerformanceTrackerView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(tagName, NSString)
RCT_EXPORT_VIEW_PROPERTY(isEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(eventTimeStamp, double)
#ifdef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_VIEW_PROPERTY(meta, NSArray)
#else
RCT_EXPORT_VIEW_PROPERTY(meta, NSDictionary)
#endif
RCT_EXPORT_VIEW_PROPERTY(onTrackingEnd, RCTDirectEventBlock)

@end
