package com.performancetracker

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = PerformanceTrackerViewImpl.NAME)
class PerformanceTrackerViewManager : ViewGroupManager<PerformanceTrackerView>() {

    private val performanceTrackerViewImpl: PerformanceTrackerViewImpl =
        PerformanceTrackerViewImpl()

    override fun getName(): String {
        return performanceTrackerViewImpl.getName()
    }

    public override fun createViewInstance(context: ThemedReactContext): PerformanceTrackerView {
        return PerformanceTrackerView(context)
    }

    @ReactProp(name = "isEnabled")
    fun setIsEnabled(view: PerformanceTrackerView, value: Boolean) {
        performanceTrackerViewImpl.setIsEnabled(view, value)
    }

    @ReactProp(name = "tagName")
    fun setTagName(view: PerformanceTrackerView, value: String?) {
        performanceTrackerViewImpl.setTagName(view, value)
    }

    @ReactProp(name = "eventTimeStamp")
    fun setEventTimeStamp(view: PerformanceTrackerView, value: Double) {
        performanceTrackerViewImpl.setEventTimeStamp(view, value)
    }

    @ReactProp(name = "meta")
    fun setMeta(view: PerformanceTrackerView, value: ReadableMap?) {
        performanceTrackerViewImpl.setMeta(view, value)
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any>? {
        val baseEventTypeConstants: Map<String, Any>? =
            super.getExportedCustomDirectEventTypeConstants()
        val eventTypeConstants: MutableMap<String, Any> = baseEventTypeConstants?.toMutableMap()
            ?: mutableMapOf()
        eventTypeConstants[DrawEndEvent.EVENT_NAME] =
            mutableMapOf("registrationName" to "onTrackingEnd")

        return eventTypeConstants
    }

    companion object {
        const val NAME = "PerformanceTrackerView"
    }
}
