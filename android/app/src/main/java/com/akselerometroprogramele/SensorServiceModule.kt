package com.akselerometroprogramele

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.Manifest
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*
import androidx.core.app.ActivityCompat
import android.os.Build

class SensorServiceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SensorService"
    }

    @ReactMethod
    fun startService(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED) {
                startSensorService()
                promise.resolve(null) // Resolve promise when service starts successfully
            } else {
                if (ActivityCompat.shouldShowRequestPermissionRationale(currentActivity!!, Manifest.permission.POST_NOTIFICATIONS)) {
                    promise.reject("PERMISSION_DENIED_NEEDS_RATIONALE", "Permission denied. Needs rationale.")
                } else {
                    promise.reject("PERMISSION_DENIED", "Permission denied without rationale.")
                }
            }
        } else {
            startSensorService()
            promise.resolve(null) // Resolve promise when service starts successfully on older Android versions
        }
    }

    private fun startSensorService() {
        val serviceIntent = Intent(reactApplicationContext, SensorService::class.java)
        reactApplicationContext.startForegroundService(serviceIntent)
    }

    @ReactMethod
    fun stopService() {
        val serviceIntent = Intent(reactApplicationContext, SensorService::class.java)
        reactApplicationContext.stopService(serviceIntent)
    }
}

