#ifdef RCT_NEW_ARCH_ENABLED
#import "PerformanceTrackerView.h"
#import "PerformanceTrackerStore.h"
#import <React/RCTConversions.h>
#import "PerformanceTrackerWriter.h"

#import "react/renderer/components/RNPerformanceTrackerSpec/ComponentDescriptors.h"
#import "react/renderer/components/RNPerformanceTrackerSpec/EventEmitters.h"
#import "react/renderer/components/RNPerformanceTrackerSpec/Props.h"
#import "react/renderer/components/RNPerformanceTrackerSpec/RCTComponentViewHelpers.h"

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
        dispatch_async(dispatch_get_main_queue(), ^{
            double currentTimeInDouble = [[NSDate date] timeIntervalSince1970] * 1000; // Current time in milliseconds
            long long currentTime = (long long) currentTimeInDouble;
            [[PerformanceTrackerStore sharedInstance] addEventWithTagName:self.tagName timestamp:currentTime meta: self.meta];
            
            // Calculate render time
            double renderTime = currentTime - self.eventTimeStamp;
            
            std::dynamic_pointer_cast<PerformanceTrackerViewEventEmitter const>(self->_eventEmitter)->onTrackingEnd({
                .drawTime = static_cast<double>(currentTime),
                .renderTime = renderTime,
                .tagName = std::string([self.tagName UTF8String])
            });
            [[PerformanceTrackerWriter sharedInstance] writeLogsWithTag:self.tagName time:currentTime meta: self.meta writeLogToFileEnabled:NO];
        });
    }
}

bool areMetaDataEqual(const PerformanceTrackerViewMetaStruct& lhs, const PerformanceTrackerViewMetaStruct& rhs) {
  return lhs.name == rhs.name &&
    lhs.value == rhs.value;
}

bool haveMetaDataChanged(const std::vector<PerformanceTrackerViewMetaStruct>& oldItems,
                         const std::vector<PerformanceTrackerViewMetaStruct>& newItems) {

  if (oldItems.size() != newItems.size()) {
    return true;
  }

  for (size_t i = 0; i < oldItems.size(); ++i) {
    if (!areMetaDataEqual(oldItems[i], newItems[i])) {
      return true;
    }
  }

  return false;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
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
    
    if (haveMetaDataChanged(oldViewProps.meta, newViewProps.meta)) {
        NSMutableDictionary* meta = [[NSMutableDictionary alloc] init];
        for (auto & element : newViewProps.meta) {
            [meta setValue:RCTNSStringFromString(element.value) forKey:RCTNSStringFromString(element.name)];
        }
        if (meta.count > 0) {
            self.meta = meta;
        }
    }
    
    [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> PerformanceTrackerViewCls(void)
{
    return PerformanceTrackerView.class;
}

@end
#endif
