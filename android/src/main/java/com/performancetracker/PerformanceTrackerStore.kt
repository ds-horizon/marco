package com.performancetracker

object PerformanceTrackerStore {
    private val dataMap: MutableMap<String, Any> = mutableMapOf()

    fun put(key: String, value: Any) {
        dataMap[key] = value
    }

    fun get(key: String): Any? {
        return dataMap[key]
    }

    fun containsKey(key: String): Boolean {
        return dataMap.containsKey(key)
    }

    fun remove(key: String): Any? {
        return dataMap.remove(key)
    }

    fun clear() {
        dataMap.clear()
    }
}
