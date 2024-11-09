package com.performancetracker

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContextBaseJavaModule

class PerformanceTrackerModule internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun send(tag: String, time: Double) {
    Log.d("::: Shubham send called",  "$tag $time " + Thread.currentThread());
    PerformanceTrackerStore.put(tag, time)

    PerformanceTrackerWriter.writeLogsInFile(tag, time.toString())
  }

  companion object {
    const val NAME = "PerformanceTracker"
  }
}
