package com.performancetracker

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap

class PerformanceTrackerModule internal constructor(val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun send(tag: String, time: Double) {
    PerformanceTrackerStore.addEvent(tag, time)

    PerformanceTrackerWriter.writeLogsInFile(tag, time.toString(), context)
  }

  @ReactMethod
  fun getLogs(promise: Promise?) {
    if (promise != null) {
      val writableArray = WritableNativeArray()

      // Iterate over the event sequence
      for (event in PerformanceTrackerStore.getAll()) {
        val writableMap = WritableNativeMap()

        // Adding tagName and timestamp to the map
        writableMap.putString("tagName", event["tagName"] as String)
        writableMap.putDouble("timestamp", event["timestamp"] as Double)

        // Add this map to the writable array
        writableArray.pushMap(writableMap)
      }

      // Resolve the promise with the writable array containing event data
      promise.resolve(writableArray)
    }
  }

  @ReactMethod
  fun resetLogs() {
    PerformanceTrackerStore.clear()
  }

  @ReactMethod
  fun init(config: ReadableMap?) {
    val persistToFile = config?.getBoolean("persistToFile") ?: false
    PerformanceTrackerWriter.persistFile = persistToFile;

  }

  companion object {
    const val NAME = "PerformanceTracker"
  }
}
