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

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  override fun multiply(a: Double, b: Double, promise: Promise) {
    Log.d("::: Shubham multiply",  "" + Thread.currentThread())
    promise.resolve(a*b);
  }

  companion object {
    const val NAME = "PerformanceTracker"
  }
}
