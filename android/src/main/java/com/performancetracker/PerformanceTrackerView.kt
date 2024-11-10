package com.performancetracker

import android.content.Context
import android.graphics.Canvas
import android.util.Log
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.view.ReactViewGroup

class PerformanceTrackerView(context: Context) : ReactViewGroup(context) {
  var tagName = ""
  var eventTimeStamp = 0.0
  var enabledFlag = true;

  override fun onDraw(canvas: Canvas) {
    super.onDraw(canvas)

    if (enabledFlag) {
      val reactContext: ReactContext = context as ReactContext
      val reactTag: Int = id

      val time = System.currentTimeMillis().toDouble()
      PerformanceTrackerStore.addEvent(tagName, time)
      val renderTime = time - eventTimeStamp
      Log.d("::: Shubham ", "onDraw $tagName $time")
      UIManagerHelper.getEventDispatcherForReactTag(reactContext, reactTag)?.dispatchEvent(DrawEndEvent(reactTag, tagName, time, renderTime))
      
      PerformanceTrackerWriter.writeLogsInFile(tagName, time.toString())
    }
  }
}
