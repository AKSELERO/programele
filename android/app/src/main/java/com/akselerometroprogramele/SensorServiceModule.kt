package com.akselerometroprogramele

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SensorServiceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SensorService"
    }

    @ReactMethod
    fun startService() {
        val serviceIntent = Intent(reactApplicationContext, SensorService::class.java)
        reactApplicationContext.startForegroundService(serviceIntent)
    }

    @ReactMethod
    fun stopService() {
        val serviceIntent = Intent(reactApplicationContext, SensorService::class.java)
        reactApplicationContext.stopService(serviceIntent)
    }
}
