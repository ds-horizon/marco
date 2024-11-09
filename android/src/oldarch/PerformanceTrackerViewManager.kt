package com.performancetracker

import android.util.Log
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = PerformanceTrackerViewManager.NAME)
class PerformanceTrackerViewManager : ViewGroupManager<PerformanceTrackerView>() {
  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): PerformanceTrackerView {
    return PerformanceTrackerView(context)
  }

  @ReactProp(name = "isEnabled")
  fun setIsEnabled(view: PerformanceTrackerView?, value: Boolean) {
    Log.d("::: Shubham", " setIsEnabled called $value")
    if (view != null) {
      view.enabledFlag = value
    }
  }

  @ReactProp(name = "tagName")
  fun setTagName(view: PerformanceTrackerView?, value: String?) {
    if (value != null) {
      view?.tagName = value
    }
  }

  @ReactProp(name = "eventTimeStamp")
  fun setEventTimeStamp(view: PerformanceTrackerView?, value: Double) {
    Log.d("::: Shubham", " setEventTimeStamp called")
    if (view != null) {
      view.eventTimeStamp = value
    }
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any>? {
    val baseEventTypeConstants: Map<String, Any>? = super.getExportedCustomDirectEventTypeConstants()
    val eventTypeConstants: MutableMap<String, Any> = baseEventTypeConstants?.toMutableMap()
      ?: mutableMapOf()
    eventTypeConstants[DrawEndEvent.EVENT_NAME] = mutableMapOf("registrationName" to "onDrawEnd")

    return eventTypeConstants
  }

  companion object {
    const val NAME = "PerformanceTrackerView"
  }
}
