package com.performancetracker

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.io.File

object PerformanceTrackerStore {
    private val dataMap: MutableMap<String, Any> = mutableMapOf()
    private const val fileName = "PerformanceTrackerData.json"

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

    override fun toString(): String {
        return dataMap.entries.joinToString(
            prefix = "{ ",
            postfix = " }",
            separator = ", "
        ) { (key, value) -> "$key: $value" }
    }

}
