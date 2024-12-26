package com.performancetracker

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.PerformanceTrackerViewManagerDelegate
import com.facebook.react.viewmanagers.PerformanceTrackerViewManagerInterface

@ReactModule(name = PerformanceTrackerModuleImpl.NAME)
class PerformanceTrackerViewManager :
    ViewGroupManager<PerformanceTrackerView>(),
    PerformanceTrackerViewManagerInterface<PerformanceTrackerView> {
    private val performanceTrackerViewImpl: PerformanceTrackerViewImpl =
        PerformanceTrackerViewImpl()
    private val delegate: PerformanceTrackerViewManagerDelegate<PerformanceTrackerView, PerformanceTrackerViewManager> =
        PerformanceTrackerViewManagerDelegate(this)

    override fun getName(): String {
        return performanceTrackerViewImpl.getName()
    }

    public override fun createViewInstance(context: ThemedReactContext): PerformanceTrackerView {
        return PerformanceTrackerView(context)
    }

    @ReactProp(name = "isEnabled")
    override fun setIsEnabled(view: PerformanceTrackerView?, value: Boolean) {
        if (view != null) {
            performanceTrackerViewImpl.setIsEnabled(view, value)
        }
    }

    @ReactProp(name = "tagName")
    override fun setTagName(view: PerformanceTrackerView?, value: String?) {
        if (view != null && value != null) {
            performanceTrackerViewImpl.setTagName(view, value)
        }
    }

    @ReactProp(name = "eventTimeStamp")
    override fun setEventTimeStamp(view: PerformanceTrackerView?, value: Double) {
        if (view != null) {
            performanceTrackerViewImpl.setEventTimeStamp(view, value)
        }
    }

    @ReactProp(name = "meta")
    override fun setMeta(view: PerformanceTrackerView?, value: ReadableArray?) {
        if (view != null) {
            performanceTrackerViewImpl.setMeta(view, convertReadableArrayToMap(value));
        }
    }

    private fun convertReadableArrayToMap(readableArray: ReadableArray?): ReadableMap? {
        if (readableArray == null) {
            return null // Return null if readableArray is not provided
        }

        val writableMap: WritableMap = Arguments.createMap()

        for (i in 0 until readableArray.size()) {
            val item = readableArray.getMap(i) // Each item in the array is a ReadableMap
            if (item.hasKey("name") && item.hasKey("value")) {
                val key = item.getString("name")
                val value = item.getString("value")
                if (key != null && value != null) {
                    writableMap.putString(key, value)
                }
            }
        }

        return writableMap
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
}
