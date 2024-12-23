package com.performancetracker

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap

class PerformanceTrackerModule internal constructor(val context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {
    private val performanceTrackerModuleImpl: PerformanceTrackerModuleImpl =
        PerformanceTrackerModuleImpl()

    override fun getName(): String {
        return performanceTrackerModuleImpl.getName()
    }

    @ReactMethod
    fun track(tag: String, time: Double, meta: ReadableMap?) {
        performanceTrackerModuleImpl.track(tag, time, context, meta)
    }

    @ReactMethod
    fun getLogs(promise: Promise?) {
        if (promise != null) {
            performanceTrackerModuleImpl.getLogs(promise)
        }
    }

    @ReactMethod
    fun resetLogs(config: ReadableMap?) {
        performanceTrackerModuleImpl.resetLogs(config, context)
    }

    @ReactMethod
    fun configure(config: ReadableMap?) {
        performanceTrackerModuleImpl.configure(config)
    }
}
