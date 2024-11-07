package com.performancetracker

import android.graphics.Color
import android.util.Log
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = PerformanceTrackerViewManager.NAME)
class PerformanceTrackerViewManager : SimpleViewManager<PerformanceTrackerView>() {
  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): PerformanceTrackerView {
    return PerformanceTrackerView(context)
  }

  @ReactProp(name = "color")
  fun setColor(view: PerformanceTrackerView?, color: String?) {
    view?.setBackgroundColor(Color.parseColor(color))
  }

  @ReactProp(name  = "contentDescription")
  fun setContentDescription(view: PerformanceTrackerView?, value: String?) {
    view?.contentDescription = value
  }

  @ReactProp(name = "isGlobalSupportEnabled")
  fun setIsGlobalSupportEnabled(view: PerformanceTrackerView?, value: Boolean) {
    Log.d("::: Shubham", " setIsGlobalSupportEnabled called")
  }

  @ReactProp(name = "label")
  fun setLabel(view: PerformanceTrackerView?, value: String?) {
    Log.d("::: Shubham", " setLabel called")
  }

  @ReactProp(name = "eventTimeStamp")
  fun setEventTimeStamp(view: PerformanceTrackerView?, value: String?) {
    Log.d("::: Shubham", " setEventTimeStamp called")
  }

  @ReactProp(name = "isLogEnabled")
  fun setIsLogEnabled(view: PerformanceTrackerView?, value: Boolean) {
    Log.d("::: Shubham", " setIsLogEnabled called")
  }

  companion object {
    const val NAME = "PerformanceTrackerView"
  }
}
