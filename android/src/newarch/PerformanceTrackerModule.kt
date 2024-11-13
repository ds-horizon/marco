package com.performancetracker

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap


class PerformanceTrackerModule internal constructor(context: ReactApplicationContext) :
    NativePerformanceTrackerSpec(context) {
    private val performanceTrackerModuleImpl: PerformanceTrackerModuleImpl =
        PerformanceTrackerModuleImpl()

    override fun getName(): String {
        return performanceTrackerModuleImpl.getName()
    }

    @ReactMethod
    override fun send(tag: String, time: Double) {
        performanceTrackerModuleImpl.send(tag, time)
    }

    @ReactMethod
    override fun getLogs(promise: Promise?) {
        if (promise != null) {
            performanceTrackerModuleImpl.getLogs(promise)
        }
    }

    @ReactMethod
    override fun init(config: ReadableMap?) {
        performanceTrackerModuleImpl.init(config)
    }

    @ReactMethod
    override fun resetLogs() {
        performanceTrackerModuleImpl.resetLogs()
    }
}
