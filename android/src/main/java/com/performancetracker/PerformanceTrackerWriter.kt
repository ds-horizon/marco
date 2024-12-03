package com.performancetracker

import android.content.ContentValues
import android.content.Context
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.BufferedWriter
import java.io.File
import java.io.FileWriter
import java.io.OutputStreamWriter

object PerformanceTrackerWriter {
    var persistToFile = false
    fun writeLogsInFile(tag: String, time: String, context: Context) {
        if (persistToFile) {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val folderName = "PerformanceTracker"
                    val fileName = "log.txt"
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        // Query for existing file in the Documents directory
                        val uri =
                            getFileUri(
                                context,
                                folderName,
                                fileName,
                                Environment.DIRECTORY_DOCUMENTS
                            )
                        Log.d("::: LoggingTracker ", "uri path $uri")
                        if (uri != null) {
                            // File exists, append to it
                            context.contentResolver.openOutputStream(uri, "wa")
                                ?.use { outputStream ->
                                    val writer = BufferedWriter(OutputStreamWriter(outputStream))
                                    writer.append("$tag,$time")
                                    writer.newLine()
                                    writer.close()
                                    Log.d("::: LoggingTracker", "Log entry appended: $tag,$time")
                                }
                        } else {
                            // File does not exist, create a new one
                            val contentValues = ContentValues().apply {
                                put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                                put(MediaStore.MediaColumns.MIME_TYPE, "text/plain")
                                put(
                                    MediaStore.MediaColumns.RELATIVE_PATH,
                                    "${Environment.DIRECTORY_DOCUMENTS}/$folderName"
                                )
                            }
                            val newUri = context.contentResolver.insert(
                                MediaStore.Files.getContentUri("external"),
                                contentValues
                            )
                            Log.d("::: LoggingTracker ", "New uri path $uri")
                            newUri?.let {
                                context.contentResolver.openOutputStream(it)?.use { outputStream ->
                                    val writer = BufferedWriter(OutputStreamWriter(outputStream))
                                    writer.append("$tag,$time")
                                    writer.newLine()
                                    writer.close()
                                    Log.d(
                                        "::: LoggingTracker",
                                        "New log file created and entry added: $tag,$time"
                                    )
                                }
                            } ?: Log.e("::: LoggingTracker", "Failed to create MediaStore entry")
                        }
                    }
                    else {
                        // For Android 9 and below, direct file access in external storage DOCUMENTS directory
                        val folder = File(
                            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS),
                            folderName
                        )
                        if (!folder.exists()) {
                            folder.mkdirs()
                        }
                        val logFile = File(
                            folder,
                            fileName
                        )

                        Log.d("::: LoggingTracker", logFile.absolutePath + logFile.createNewFile())
                        if (!logFile.exists()) {
                            val created = logFile.createNewFile()
                            if (created) {
                                Log.d("LoggingTracker", "New log file created: ${logFile.absolutePath}")
                            } else {
                                Log.e("LoggingTracker", "Failed to create new log file")
                            }
                        }
                        val buf = BufferedWriter(FileWriter(logFile, true))
                        buf.append("$tag,$time")
                        buf.newLine()
                        buf.close()
                        Log.d("::: LoggingTracker", "Log entry added to file: $tag,$time")
                    }
                } catch (e: Exception) {
                    Log.d("LoggingTracker", e.toString())
                    e.printStackTrace()
                }
            }
        }
    }

    // Helper function to get the URI of an existing file in the MediaStore
    private fun getFileUri(
        context: Context,
        folderName: String,
        fileName: String,
        directory: String
    ): android.net.Uri? {
        val collection = MediaStore.Files.getContentUri("external")
        val projection = arrayOf(MediaStore.MediaColumns._ID)
        val selection =
            "${MediaStore.MediaColumns.RELATIVE_PATH} = ? AND ${MediaStore.MediaColumns.DISPLAY_NAME} = ?"

        // Log the path to ensure it's formatted correctly
        val relativePath = "$directory/$folderName/"
        Log.d("getFileUri", "Searching in path: $relativePath for file: $fileName")

        val selectionArgs = arrayOf(relativePath, fileName)

        val cursor =
            context.contentResolver.query(collection, projection, selection, selectionArgs, null)
        cursor?.use {
            if (it.moveToFirst()) {
                val id = it.getLong(it.getColumnIndexOrThrow(MediaStore.MediaColumns._ID))
                val uri = Uri.withAppendedPath(collection, id.toString())
                Log.d("getFileUri", "Found file URI: $uri")
                return uri
            }
        }
        Log.d("getFileUri", "File not found")
        return null
    }
}

