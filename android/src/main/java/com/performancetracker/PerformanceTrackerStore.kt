package com.performancetracker

import com.facebook.react.bridge.ReadableMap

object PerformanceTrackerStore {

    private val eventSequence: MutableList<MutableMap<String, Any>> = mutableListOf()

    /**
     * Adds a new event to the store.
     * @param tagName The name of the event.
     * @param timestamp The timestamp of the event.
     * @param meta Additional metadata associated with the event.
     */
    fun addEvent(tagName: String, timestamp: Double, meta: ReadableMap?) {
        val eventDetails = mutableMapOf<String, Any>(
            "tagName" to tagName,
            "timestamp" to timestamp
        )
        if (meta != null) {
            eventDetails["meta"] = meta
        }
        eventSequence.add(eventDetails)
    }

    /**
     * Retrieves all events stored.
     * @return A list of all stored events.
     */
    fun getAll(): List<Map<String, Any>> {
        return eventSequence.toList() // Return an immutable copy to avoid unintended modifications
    }

    /**
     * Clears all events from the store.
     */
    fun clear() {
        eventSequence.clear()
    }

    /**
     * Retrieves the timestamp of the most recent event with the specified tag name.
     * @param tagName The name of the event to search for.
     * @return The timestamp of the event, or null if not found.
     */
    fun getEventValue(tagName: String): Double? {
        for (i in eventSequence.size - 1 downTo 0) {
            val event = eventSequence[i]
            if (event["tagName"] == tagName) {
                return event["timestamp"] as? Double
            }
        }
        return null
    }

    /**
     * Converts the store's contents to a string representation.
     * @return A string representation of the stored events.
     */
    override fun toString(): String {
        return eventSequence.joinToString(
            prefix = "[ ",
            postfix = " ]",
            separator = ", "
        ) { event ->
            val tagName = event["tagName"]
            val timestamp = event["timestamp"]
            "{ tagName: $tagName, timestamp: $timestamp }"
        }
    }
}

