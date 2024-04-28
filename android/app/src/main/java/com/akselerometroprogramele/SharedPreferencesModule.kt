package com.akselerometroprogramele

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.content.Context
import org.json.JSONObject
import android.util.Log

class SharedPreferencesModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "SharedPreferences"
    }

    @ReactMethod
    fun getValue(key: String, promise: Promise) {
        val sharedPreferences = reactContext.getSharedPreferences("MyAppData", Context.MODE_PRIVATE)
        val value = sharedPreferences.getString(key, null)
        if (value != null) {
            promise.resolve(value)
        } else {
            promise.reject("ERROR", "No value found.")
        }
    }

    @ReactMethod
    fun setValue(key: String, value: String, promise: Promise) {
        val sharedPreferences = reactContext.getSharedPreferences("MyAppData", Context.MODE_PRIVATE)
        sharedPreferences.edit().putString(key, value).apply()
        promise.resolve(null)
    }

    @ReactMethod
    fun getAllDataEntries(promise: Promise) {
        Log.d("SharedPreference", "got here")
        val sharedPreferences = reactContext.getSharedPreferences("MyAppData", Context.MODE_PRIVATE)
        val allEntries = sharedPreferences.getAll()
        val sortedEntries = allEntries.toSortedMap() // This will sort the entries by key

        val result = JSONObject()
        Log.d("SharedPreference", "loaded")
        sortedEntries.forEach { (key, value) ->
            if (key.contains("_list")) {  // Filtering keys that end with "_list"
                val baseKey = key.substringBefore("_list")
                val listValue = value as? String ?: ""
                val timestamp = sharedPreferences.getString("${baseKey}_timestamp", "No timestamp found")

                val entry = JSONObject().apply {
                    put("list", listValue)
                    put("timestamp", timestamp)
                }
                result.put(baseKey, entry)
            }
        }

        promise.resolve(result.toString())
    }

    @ReactMethod
    fun clearAllPreferences() {
        val sharedPreferences = reactContext.getSharedPreferences("MyAppData", Context.MODE_PRIVATE)
        sharedPreferences.edit().clear().apply()
    }
}