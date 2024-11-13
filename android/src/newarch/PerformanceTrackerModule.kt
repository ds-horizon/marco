package com.performancetracker

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap


class PerformanceTrackerModule internal constructor(context: ReactApplicationContext) :
  NativePerformanceTrackerSpec(context) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun send(tag: String, time: Double) {
    PerformanceTrackerStore.addEvent(tag, time)

    PerformanceTrackerWriter.writeLogsInFile(tag, time.toString())
  }

  @ReactMethod
  override fun getLogs(promise: Promise?) {
    if (promise != null) {
      val writableArray = WritableNativeArray()

      for (event in PerformanceTrackerStore.getAll()) {
        val writableMap = WritableNativeMap()

        writableMap.putString("tagName", event["tagName"] as String)
        writableMap.putDouble("timestamp", event["timestamp"] as Double)

        writableArray.pushMap(writableMap)
      }

      promise.resolve(writableArray)
    }
  }

  @ReactMethod
  override fun resetLogs() {
    PerformanceTrackerStore.clear()
  }

  companion object {
    const val NAME = "PerformanceTracker"
  }
}
