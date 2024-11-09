package com.performancetracker

import android.os.Environment
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.BufferedWriter
import java.io.File
import java.io.FileWriter

object PerformanceTrackerWriter {
    fun writeLogsInFile(tag: String, time: String) {

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val folderName = "D11PerformanceProfiler"
                val fileName = "log.txt"
                val folder = File(Environment.getExternalStorageDirectory(), folderName)
                if (!folder.exists()) {
                    folder.mkdirs()
                }
                val logFile = File(
                    Environment.getExternalStorageDirectory().toString() + "/" + folderName,
                    fileName
                )
                if (!logFile.exists()) {
                    logFile.createNewFile()
                }
                val buf = BufferedWriter(FileWriter(logFile, true))
                buf.append("$tag,$time")
                buf.newLine()
                buf.close()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}

