package com.performancetracker

import android.content.Context
import android.graphics.Canvas
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.view.ReactViewGroup

class PerformanceTrackerView(context: Context) : ReactViewGroup(context) {
    var tagName: String = ""
    var eventTimeStamp = 0.0
    var isTrackingEnabled = true;
    var startMarker = "";

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        if (isTrackingEnabled) {
            val reactContext: ReactContext = context as ReactContext
            val reactTag: Int = id

            var diffTime: Double? = null;
            val time = System.currentTimeMillis().toDouble()

            if (startMarker != "") {
                val startTime = PerformanceTrackerStore.getEventValue(startMarker) as Double
                diffTime = time - startTime;
            }

            PerformanceTrackerStore.addEvent(tagName, time)
            val renderTime = time - eventTimeStamp
            UIManagerHelper.getEventDispatcherForReactTag(reactContext, reactTag)
                ?.dispatchEvent(DrawEndEvent(reactTag, tagName, time, renderTime, diffTime))

            PerformanceTrackerWriter.writeLogsInFile(tagName, time.toString(), context)
        }
    }
}
