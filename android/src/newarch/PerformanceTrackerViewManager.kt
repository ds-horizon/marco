package com.performancetracker

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.PerformanceTrackerViewManagerDelegate
import com.facebook.react.viewmanagers.PerformanceTrackerViewManagerInterface

@ReactModule(name = PerformanceTrackerViewManager.NAME)
class PerformanceTrackerViewManager :
  ViewGroupManager<PerformanceTrackerView>(),
  PerformanceTrackerViewManagerInterface<PerformanceTrackerView> {
  private val delegate: PerformanceTrackerViewManagerDelegate<PerformanceTrackerView, PerformanceTrackerViewManager> =
    PerformanceTrackerViewManagerDelegate(this)
  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): PerformanceTrackerView {
    return PerformanceTrackerView(context)
  }

  @ReactProp(name = "isEnabled")
  override fun setIsEnabled(view: PerformanceTrackerView?, value: Boolean) {
    if (view != null) {
      view.enabledFlag = value
    }
  }

  @ReactProp(name = "tagName")
  override fun setTagName(view: PerformanceTrackerView?, value: String?) {
    if (value != null) {
      view?.tagName = value
    }
  }

  @ReactProp(name = "eventTimeStamp")
  override fun setEventTimeStamp(view: PerformanceTrackerView?, value: Double) {
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
