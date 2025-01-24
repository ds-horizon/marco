import android.content.ContentValues
import android.content.Context
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

object PerformanceTrackerWriter {
    var globalPersistenceEnabled = false
    var shouldClearFiles = false
    private val executor: ExecutorService = Executors.newSingleThreadExecutor()

    fun writeLogsInFile(tag: String, timestamp: String, meta: ReadableMap?, context: Context, writeLogToFileEnabled: Boolean = false) {
        if (globalPersistenceEnabled || writeLogToFileEnabled) {
            executor.execute {
                try {
                    val folderName = "PerformanceTracker"
                    val fileName = "log.json"

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        val uri = getFileUri(
                            context,
                            folderName,
                            fileName,
                            Environment.DIRECTORY_DOCUMENTS
                        )

                        val updatedLogs = if (uri != null) {
                            context.contentResolver.openInputStream(uri)?.use { inputStream ->
                                val existingLogs =
                                    BufferedReader(InputStreamReader(inputStream)).readText()
                                if (existingLogs.isNotBlank()) {
                                    JSONArray(existingLogs)
                                } else {
                                    JSONArray()
                                }
                            } ?: JSONArray()
                        } else {
                            val contentValues = ContentValues().apply {
                                put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                                put(MediaStore.MediaColumns.MIME_TYPE, "application/json")
                                put(
                                    MediaStore.MediaColumns.RELATIVE_PATH,
                                    "${Environment.DIRECTORY_DOCUMENTS}/$folderName"
                                )
                            }
                            context.contentResolver.insert(
                                MediaStore.Files.getContentUri("external"),
                                contentValues
                            )?.let {
                                context.contentResolver.openOutputStream(it)?.use { outputStream ->
                                    OutputStreamWriter(outputStream).apply {
                                        write("[]")
                                        flush()
                                    }
                                }
                            }
                            JSONArray()
                        }

                        // Append the new log
                        updatedLogs.put(JSONObject().apply {
                            put("tagName", tag)
                            put("timestamp", timestamp)
                            meta?.let {
                                put("meta", convertReadableMapToJson(it))
                            }
                        })

                        // Write back the updated JSON array
                        context.contentResolver.openOutputStream(
                            uri ?: getFileUri(
                                context,
                                folderName,
                                fileName,
                                Environment.DIRECTORY_DOCUMENTS
                            )!!
                        )?.use { outputStream ->
                            OutputStreamWriter(outputStream).apply {
                                write(updatedLogs.toString())
                                flush()
                                Log.d(
                                    "::: LoggingTracker",
                                    "Updated log file with entry: $tag, $timestamp, $meta"
                                )
                            }
                        }
                    } else {
                        val folder = File(
                            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS),
                            folderName
                        )
                        if (!folder.exists()) folder.mkdirs()
                        val logFile = File(folder, fileName)

                        val updatedLogs = if (logFile.exists() && logFile.length() > 0) {
                            JSONArray(logFile.readText())
                        } else {
                            JSONArray()
                        }

                        // Append the new log
                        updatedLogs.put(JSONObject().apply {
                            put("tagName", tag)
                            put("timestamp", timestamp)
                            meta?.let {
                                put("meta", convertReadableMapToJson(it))
                            }
                        })

                        // Write back the updated JSON array
                        logFile.writeText(updatedLogs.toString())
                        Log.d(
                            "::: LoggingTracker",
                            "Updated log file with entry: $tag, $timestamp, $meta"
                        )
                    }
                } catch (e: Exception) {
                    Log.e("LoggingTracker", "Error writing logs to file", e)
                }
            }
        }
    }


    fun clearLogFile(context: Context) {
        if (globalPersistenceEnabled && shouldClearFiles) {
            executor.execute {
                try {
                    val folderName = "PerformanceTracker"
                    val fileName = "log.json"

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        val uri = getFileUri(
                            context,
                            folderName,
                            fileName,
                            Environment.DIRECTORY_DOCUMENTS
                        )

                        if (uri != null) {
                            // Open the file for writing and replace the content with an empty JSON array
                            context.contentResolver.openOutputStream(uri, "wt")
                                ?.use { outputStream ->
                                    OutputStreamWriter(outputStream).apply {
                                        write("[]") // Clear file by writing an empty JSON array
                                        flush()
                                    }
                                }
                            Log.d("::: LoggingTracker", "Log file cleared successfully")
                        } else {
                            Log.e("::: LoggingTracker", "File URI not found for clearing logs")
                        }
                    } else {
                        val folder = File(
                            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS),
                            folderName
                        )
                        if (!folder.exists()) folder.mkdirs()

                        val logFile = File(folder, fileName)
                        if (logFile.exists()) {
                            logFile.writeText("[]") // Clear file by writing an empty JSON array
                            Log.d("::: LoggingTracker", "Log file cleared successfully")
                        } else {
                            Log.e("::: LoggingTracker", "Log file not found for clearing")
                        }
                    }
                } catch (e: Exception) {
                    Log.e("::: LoggingTracker", "Error clearing log file", e)
                }
            }
        }
    }

    private fun getFileUri(
        context: Context,
        folderName: String,
        fileName: String,
        directory: String
    ): Uri? {
        val collection = MediaStore.Files.getContentUri("external")
        val projection = arrayOf(MediaStore.MediaColumns._ID)
        val selection =
            "${MediaStore.MediaColumns.RELATIVE_PATH} = ? AND ${MediaStore.MediaColumns.DISPLAY_NAME} = ?"
        val relativePath = "$directory/$folderName/"
        val selectionArgs = arrayOf(relativePath, fileName)

        val cursor =
            context.contentResolver.query(collection, projection, selection, selectionArgs, null)
        cursor?.use {
            if (it.moveToFirst()) {
                val id = it.getLong(it.getColumnIndexOrThrow(MediaStore.MediaColumns._ID))
                return Uri.withAppendedPath(collection, id.toString())
            }
        }
        return null
    }

    private fun convertReadableMapToJson(readableMap: ReadableMap): JSONObject {
        val jsonObject = JSONObject()
        val iterator = readableMap.keySetIterator()
        while (iterator.hasNextKey()) {
            val key = iterator.nextKey()
            val value = readableMap.getDynamic(key)
            when (value.type) {
                ReadableType.Map -> jsonObject.put(key, convertReadableMapToJson(value.asMap()))
                ReadableType.Array -> jsonObject.put(
                    key,
                    convertReadableArrayToJson(value.asArray())
                )

                ReadableType.String -> jsonObject.put(key, value.asString())
                ReadableType.Boolean -> jsonObject.put(key, value.asBoolean())
                ReadableType.Number -> {
                    // Check if the number is an integer or double
                    val number = value.asDouble()
                    if (number % 1 == 0.0) {
                        jsonObject.put(key, number.toInt())
                    } else {
                        jsonObject.put(key, number)
                    }
                }

                ReadableType.Null -> jsonObject.put(key, JSONObject.NULL)
                else -> throw IllegalArgumentException("Unsupported type: ${value.type}")
            }
        }
        return jsonObject
    }

    private fun convertReadableArrayToJson(readableArray: ReadableArray): JSONArray {
        val jsonArray = JSONArray()
        for (i in 0 until readableArray.size()) {
            val value = readableArray.getDynamic(i)
            when (value.type) {
                ReadableType.Map -> jsonArray.put(convertReadableMapToJson(value.asMap()))
                ReadableType.Array -> jsonArray.put(convertReadableArrayToJson(value.asArray()))
                ReadableType.String -> jsonArray.put(value.asString())
                ReadableType.Boolean -> jsonArray.put(value.asBoolean())
                ReadableType.Number -> {
                    val number = value.asDouble()
                    if (number % 1 == 0.0) {
                        jsonArray.put(number.toInt())
                    } else {
                        jsonArray.put(number)
                    }
                }

                ReadableType.Null -> jsonArray.put(JSONObject.NULL)
                else -> throw IllegalArgumentException("Unsupported type: ${value.type}")
            }
        }
        return jsonArray
    }


}
