#ifdef RCT_NEW_ARCH_ENABLED
#import "PerformanceTrackerView.h"
#import "../PerformanceTrackerStore.h"
#import <React/RCTConversions.h>

#import "../generated/RNPerformanceTrackerSpec/ComponentDescriptors.h"
#import "../generated/RNPerformanceTrackerSpec/EventEmitters.h"
#import "../generated/RNPerformanceTrackerSpec/Props.h"
#import "../generated/RNPerformanceTrackerSpec/RCTComponentViewHelpers.h"

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation PerformanceTrackerView {
    UIView * _view;
    BOOL _alreadyLogged;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<PerformanceTrackerViewComponentDescriptor>();
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _alreadyLogged = NO;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<PerformanceTrackerViewProps const>();
        _props = defaultProps;
    }
    
    return self;
}

- (void)didMoveToWindow {
    [super didMoveToWindow];
    
    
    if (!self.window) {
        return;
    }
    
    if (_alreadyLogged) {
        return;
    }
    
    _alreadyLogged = YES;
    
    if (self.isEnabled) {
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
            
            std::dynamic_pointer_cast<PerformanceTrackerViewEventEmitter const>(self->_eventEmitter)->onDrawEnd({
                .drawTime = currentTime,
                .renderTime = renderTime,
                .diffTime = diffTime,
                .tagName = std::string([self.tagName UTF8String])
            });
            printf("::: PerformanceTrackerView onDrawEnd event fired for tag: %s\n", [self.tagName UTF8String]);
        });
    }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<PerformanceTrackerViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<PerformanceTrackerViewProps const>(props);
    if (oldViewProps.tagName != newViewProps.tagName) {
        self.tagName = RCTNSStringFromString(newViewProps.tagName);
    }
    
    if (oldViewProps.eventTimeStamp != newViewProps.eventTimeStamp) {
        self.eventTimeStamp = newViewProps.eventTimeStamp;
    }
    
    if (oldViewProps.isEnabled != newViewProps.isEnabled) {
        self.isEnabled = newViewProps.isEnabled;
    }
    
    if (oldViewProps.startMarker != newViewProps.startMarker) {
        self.startMarker = RCTNSStringFromString(newViewProps.startMarker);
    }
    
    [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> PerformanceTrackerViewCls(void)
{
    return PerformanceTrackerView.class;
}

@end
#endif
