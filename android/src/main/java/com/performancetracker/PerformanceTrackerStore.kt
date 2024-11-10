package com.performancetracker

object PerformanceTrackerStore {

    private val eventSequence: MutableList<Map<String, Any>> = mutableListOf()

    fun addEvent(tagName: String, timestamp: Double) {
        val eventDetails = mapOf("tagName" to tagName, "timestamp" to timestamp)
        eventSequence.add(eventDetails)
    }

    fun getAll(): MutableList<Map<String, Any>> {
        return eventSequence
    }

    fun getLastEvent(): Map<String, Any>? {
        return if (eventSequence.isNotEmpty()) eventSequence.last() else null
    }

    fun clear() {
        eventSequence.clear()
    }

    fun removeLastEvent(): Map<String, Any>? {
        return if (eventSequence.isNotEmpty()) eventSequence.removeAt(eventSequence.size - 1) else null
    }

    fun containsEvent(tagName: String): Boolean {
        return eventSequence.any { it["tagName"] == tagName }
    }

    override fun toString(): String {
        return eventSequence.joinToString(
            prefix = "[ ",
            postfix = " ]",
            separator = ", "
        ) { event -> "{ tagName: ${event["tagName"]}, timestamp: ${event["timestamp"]} }" }
    }
}
