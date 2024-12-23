package com.performancetracker

import android.content.Context
import android.graphics.Canvas
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.view.ReactViewGroup

class PerformanceTrackerView(context: Context) : ReactViewGroup(context) {
    var tagName: String = ""
    var eventTimeStamp = 0.0
    var isTrackingEnabled = true;
    var flag = true
    var meta: ReadableMap? = null;

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        if (isTrackingEnabled && flag) {
            flag = false
            val reactContext: ReactContext = context as ReactContext
            val reactTag: Int = id
            val time = System.currentTimeMillis()

            PerformanceTrackerStore.addEvent(tagName, time.toDouble(), meta)
            val renderTime = time - eventTimeStamp
            UIManagerHelper.getEventDispatcherForReactTag(reactContext, reactTag)
                ?.dispatchEvent(DrawEndEvent(reactTag, tagName, time.toDouble(), renderTime))

            PerformanceTrackerWriter.writeLogsInFile(tagName, time.toString(), meta, context)
        }
    }
}
