package com.performancetracker

import PerformanceTrackerWriter
import android.content.Context
import com.facebook.react.bridge.ReadableMap

object PerformanceTracker {

    /**
     * Tracks an event with optional logging to a file.
     *
     * @param tagName The tag name for the event.
     * @param timeStamp The timestamp of the event.
     * @param writeLogInFile Whether to write the log to a file.
     * @param meta Optional metadata related to the event.
     * @param context The Android context used for file operations.
     */
    @JvmStatic
    fun track(
        tagName: String,
        timeStamp: Long,
        meta: ReadableMap? = null,
        writeLogInFile: Boolean = true,
        context: Context? = null
    ) {
        // Store the event in the performance tracker store
        PerformanceTrackerStore.addEvent(tagName, timeStamp.toDouble(), meta)

        // If logging to a file is requested and context is provided, write to file
        if (writeLogInFile && context != null) {
            PerformanceTrackerWriter.writeLogsInFile(
                tagName,
                timeStamp.toString(),
                meta,
                context,
                true
            )
        }
    }
}