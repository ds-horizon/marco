package com.performancetracker

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class PerformanceTrackerModule internal constructor(context: ReactApplicationContext) :
  NativePerformanceTrackerSpec(context) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun send(tag: String, time: Double) {
    Log.d("::: Shubham send called",  "$tag $time " + Thread.currentThread());
    PerformanceTrackerStore.put(tag, time)
  }

  companion object {
    const val NAME = "PerformanceTracker"
  }
}
