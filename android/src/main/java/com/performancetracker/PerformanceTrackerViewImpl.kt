package com.performancetracker

import com.facebook.react.bridge.ReadableMap

class PerformanceTrackerViewImpl {
    fun getName(): String {
        return NAME
    }

    fun setIsEnabled(view: PerformanceTrackerView, value: Boolean) {
        view.isTrackingEnabled = value
    }

    fun setTagName(view: PerformanceTrackerView, value: String?) {
        view.tagName = value ?: ""
    }

    fun setEventTimeStamp(view: PerformanceTrackerView, value: Double) {
        view.eventTimeStamp = value
    }

    fun setMeta(view: PerformanceTrackerView, value: ReadableMap?) {
        view.meta = value
    }

    companion object {
        const val NAME = "PerformanceTrackerView"
    }
}
