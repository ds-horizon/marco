package com.performancetracker

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap


class PerformanceTrackerModule internal constructor(val context: ReactApplicationContext) :
    NativePerformanceTrackerSpec(context) {
    private val performanceTrackerModuleImpl: PerformanceTrackerModuleImpl =
        PerformanceTrackerModuleImpl()

    override fun getName(): String {
        return performanceTrackerModuleImpl.getName()
    }

    @ReactMethod
    override fun track(tag: String, time: Double, meta: ReadableMap?) {
        performanceTrackerModuleImpl.track(tag, time, context, meta)
    }

    @ReactMethod
    override fun getLogs(promise: Promise?) {
        if (promise != null) {
            performanceTrackerModuleImpl.getLogs(promise)
        }
    }

    @ReactMethod
    override fun configure(config: ReadableMap?) {
        performanceTrackerModuleImpl.configure(config)
    }

    @ReactMethod
    override fun resetLogs(config: ReadableMap?) {
        performanceTrackerModuleImpl.resetLogs(config, context)
    }
}
