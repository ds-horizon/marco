package com.performancetracker

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

class DrawEndEvent(viewTag: Int, private val tagName: String, private  val drawTime: Double, private val renderTime: Double) : Event<DrawEndEvent>(viewTag) {

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
        eventData.putString("tagName", tagName)
        eventData.putDouble("drawTime", drawTime)
        eventData.putDouble("renderTime", renderTime)
        return eventData
    }

    companion object {
        const val EVENT_NAME = "onTrackingEnd"
    }
}