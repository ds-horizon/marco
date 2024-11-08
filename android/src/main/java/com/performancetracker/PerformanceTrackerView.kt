package com.performancetracker

import android.content.Context
import android.graphics.Canvas
import android.util.Log
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.view.ReactViewGroup

class PerformanceTrackerView(context: Context) : ReactViewGroup(context) {
  var tagName = ""

  override fun onDraw(canvas: Canvas) {
    super.onDraw(canvas)
    Log.d("::: Shubham ", "onDraw called $tagName")

    val reactContext: ReactContext = context as ReactContext
    val reactTag: Int = id

    val time = System.currentTimeMillis().toString()
    UIManagerHelper.getEventDispatcherForReactTag(reactContext, reactTag)?.dispatchEvent(DrawEndEvent(reactTag, time))
  }
}
