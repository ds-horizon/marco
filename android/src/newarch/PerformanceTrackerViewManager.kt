package com.performancetracker

import android.graphics.Color
import android.util.Log
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = PerformanceTrackerViewManager.NAME)
class PerformanceTrackerViewManager :
  PerformanceTrackerViewManagerSpec<PerformanceTrackerView>() {
  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): PerformanceTrackerView {
    return PerformanceTrackerView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: PerformanceTrackerView?, color: String?) {
    view?.setBackgroundColor(Color.parseColor(color))
  }

  @ReactProp(name  = "contentDescription")
  override fun setContentDescription(view: PerformanceTrackerView?, value: String?) {
    view?.contentDescription = value
  }

  @ReactProp(name = "isGlobalSupportEnabled")
  override fun setIsGlobalSupportEnabled(view: PerformanceTrackerView?, value: Boolean) {
    Log.d("::: Shubham", " setIsGlobalSupportEnabled called")
  }

  @ReactProp(name = "label")
  override fun setLabel(view: PerformanceTrackerView?, value: String?) {
    Log.d("::: Shubham", " setLabel called")
  }

  @ReactProp(name = "eventTimeStamp")
  override fun setEventTimeStamp(view: PerformanceTrackerView?, value: String?) {
    Log.d("::: Shubham", " setEventTimeStamp called")
  }

  @ReactProp(name = "isLogEnabled")
  override fun setIsLogEnabled(view: PerformanceTrackerView?, value: Boolean) {
    Log.d("::: Shubham", " setIsLogEnabled called")
  }

  companion object {
    const val NAME = "PerformanceTrackerView"
  }
}
