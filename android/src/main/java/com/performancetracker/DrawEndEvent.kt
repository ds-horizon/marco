package com.performancetracker

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

class DrawEndEvent(viewTag: Int, private val timeStamp: String) : Event<DrawEndEvent>(viewTag) {

    override fun getEventName(): String {
        return EVENT_NAME
    }

    override fun canCoalesce(): Boolean {
        return false
    }

    override fun dispatch(rctEventEmitter: RCTEventEmitter) {
        rctEventEmitter.receiveEvent(viewTag, eventName, serializeEventData())
    }

    private fun serializeEventData(): WritableMap {
        val eventData = Arguments.createMap()
        eventData.putString("tagName", "timeStamp")
        eventData.putDouble("drawTime", 44.6)
        eventData.putDouble("renderTime", 44.5)
        return eventData
    }

    companion object {
        const val EVENT_NAME = "onDrawEnd"
    }
}