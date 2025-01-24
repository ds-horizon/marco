package com.performancetracker

import PerformanceTrackerWriter
import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap

class PerformanceTrackerModuleImpl {

    fun getName(): String {
        return NAME
    }

    fun track(tag: String, time: Double, context: Context, meta: ReadableMap?) {
        PerformanceTrackerStore.addEvent(tag, time, meta)
        PerformanceTrackerWriter.writeLogsInFile(tag, time.toLong().toString(), meta, context)
    }

    fun getLogs(promise: Promise) {
        val writableArray = WritableNativeArray()

        // Iterate over the event sequence
        for (event in PerformanceTrackerStore.getAll()) {
            val writableMap = WritableNativeMap()

            // Adding tagName and timestamp to the map
            writableMap.putString("tagName", event["tagName"] as String)
            writableMap.putDouble("timestamp", event["timestamp"] as Double)
            if (event["meta"] != null) {
                writableMap.putMap("meta", event["meta"] as ReadableMap?)
            }
            // Add this map to the writable array
            writableArray.pushMap(writableMap)
        }

        // Resolve the promise with the writable array containing event data
        promise.resolve(writableArray)
    }

    fun resetLogs(config: ReadableMap?, context: Context) {
        val shouldClearFiles = config?.getBoolean("clearFiles") ?: false
        PerformanceTrackerWriter.shouldClearFiles = shouldClearFiles;
        PerformanceTrackerStore.clear()
        PerformanceTrackerWriter.clearLogFile(context)
    }

    fun configure(config: ReadableMap?) {
        val persistToFile = config?.getBoolean("persistToFile") ?: false
        PerformanceTrackerWriter.globalPersistenceEnabled = persistToFile;
    }

    companion object {
        const val NAME = "PerformanceTrackerModule"
    }
}
