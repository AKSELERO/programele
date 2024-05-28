package com.akselerometroprogramele

import android.app.Service
import android.content.pm.ServiceInfo
import android.content.Intent
import android.content.Context
import android.os.IBinder
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import androidx.core.app.NotificationCompat
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.ReactApplication
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Arguments
import android.app.PendingIntent
import android.app.ActivityOptions
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import kotlin.math.pow
import kotlin.math.sqrt
import java.io.File
import java.io.PrintWriter
import java.io.IOException
import java.text.DecimalFormat
import java.io.FileOutputStream
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import android.content.SharedPreferences
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.math.*


class SensorService : Service(), SensorEventListener {

    private lateinit var sensorManager: SensorManager
    private var accelerometer: Sensor? = null
    private var gyroscope: Sensor? = null
    private var uncalibratedMagnetometer: Sensor? = null
    private var motionDetection: Sensor? = null
    private lateinit var handler: Handler
    private lateinit var runnable: Runnable
    private var accelerometerData: MutableList<SensorData> = mutableListOf()
    private var gyroscopeData: MutableList<SensorData> = mutableListOf()
    private var uncalibratedMagnetometerData: MutableList<SensorData> = mutableListOf()
    private var motionDetectionData: MutableList<Float> = mutableListOf()
    private var initTime: Long = 0L
    private lateinit var sharedPreferences: SharedPreferences

    data class SensorData(val x: Float, val y: Float, val z: Float, val timestamp: Long, val initTime: Double)

    companion object {
        private const val SERVICE_NOTIFICATION_ID = 1
        private const val CHANNEL_ID = "ForegroundServiceChannel"
        private const val INTERVAL: Long = 15000
        private const val ACTION_STOP_SERVICE = "com.akselerometroprogramele.STOP_SERVICE"
    }

    override fun onCreate() {
        super.onCreate()
        initTime = System.currentTimeMillis()
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        gyroscope = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)
        uncalibratedMagnetometer = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD_UNCALIBRATED)
        motionDetection = sensorManager.getDefaultSensor(Sensor.TYPE_MOTION_DETECT)
        if (motionDetection == null) {
            Log.d("DataLogger", "Motion detection sensor not available")
        } else {
            Log.d("DataLogger", "Motion detection sensor is available")
        }

        sensorManager.registerListener(this, accelerometer, 50000)
        sensorManager.registerListener(this, gyroscope, 50000)
        sensorManager.registerListener(this, uncalibratedMagnetometer, 50000)
        sensorManager.registerListener(this, motionDetection, 50000)

        createNotificationChannel()
        sharedPreferences = getSharedPreferences("MyAppData", Context.MODE_PRIVATE)
        handler = Handler(Looper.getMainLooper())
        runnable = Runnable {
            processAndResetData()
            handler.postDelayed(runnable, INTERVAL)
        }
    }

    private fun processAndResetData() {
        Log.d("DataLogger", "Starting data processing...")
        
        var combinedData = calculateCombinedData(accelerometerData, gyroscopeData, uncalibratedMagnetometerData)
        var moved = isPhoneMoving(combinedData)
        Log.d("DataLogger", "moved $moved")
        if ((motionDetectionData.isEmpty() && motionDetection != null) || !moved){
            saveNoMotionMessageWithTimestamp(sharedPreferences, "CombinedData", "Nejuda")
        } else {
            Log.d("DataLogger", "Combined Data: $combinedData")
            saveListOfDoublesWithTimestamp(sharedPreferences, "CombinedData", combinedData)
        }
        
        synchronized(accelerometerData) { accelerometerData.clear() }
        synchronized(gyroscopeData) { gyroscopeData.clear() }
        synchronized(uncalibratedMagnetometerData) { uncalibratedMagnetometerData.clear() }
        synchronized(motionDetectionData) { motionDetectionData.clear() }
    }

    fun writeCsvFile(context: Context, data: List<SensorData>, fileName: String) {
        val file = File(context.getExternalFilesDir(null), fileName)
        Log.d("WriteCsvFile", "File path: ${file.absolutePath}")
        try {
            // Check if the file already exists
            val fileExists = file.exists()
    
            // PrintWriter with the append flag set to true
            PrintWriter(FileOutputStream(file, true)).use { out ->
                if (!fileExists) {
                    // Write the header if the file does not exist
                    out.println("Timestamp (ms),Initialization Time (ms),X,Y,Z")
                }
    
                // Append data to the CSV
                data.forEach { item ->
                    val csvLine = "${item.timestamp},${item.initTime},${item.x},${item.y},${item.z}"
                    out.println(csvLine)
                }
            }
            Log.d("WriteCsvFile", "Data appended successfully")
        } catch (e: IOException) {
            Log.e("WriteCsvFile", "Error writing file", e)
        }
    }

    fun saveListOfDoublesWithTimestamp(sharedPrefs: SharedPreferences, baseKey: String, list: List<Double>) {
        // Formatting the list of doubles into a comma-separated string
        val listAsString = list.joinToString(separator = ",")
    
        // Creating a date format for the timestamp that will be part of the key
        val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        val currentDateTime = dateFormat.format(Date())
    
        // Generating the unique key by combining the base key with the current timestamp
        val uniqueKey = "${baseKey}_$currentDateTime"
    
        // Storing the list and timestamp in SharedPreferences
        sharedPrefs.edit().apply {
            putString("${uniqueKey}_list", listAsString)
            putString("${uniqueKey}_timestamp", currentDateTime)
            apply()  // Applying changes asynchronously
        }
    }

    fun saveNoMotionMessageWithTimestamp(sharedPrefs: SharedPreferences, baseKey: String, message: String) {
        // Formatting the list of doubles into a comma-separated string
        //val listAsString = list.joinToString(separator = ",")
    
        // Creating a date format for the timestamp that will be part of the key
        val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        val currentDateTime = dateFormat.format(Date())
    
        // Generating the unique key by combining the base key with the current timestamp
        val uniqueKey = "${baseKey}_$currentDateTime"
    
        // Storing the list and timestamp in SharedPreferences
        sharedPrefs.edit().apply {
            putString("${uniqueKey}_list", message)
            putString("${uniqueKey}_timestamp", currentDateTime)
            apply()  // Applying changes asynchronously
        }
    }
    

    fun retrieveListOfDoublesWithTimestamp(sharedPrefs: SharedPreferences, key: String): Pair<List<Double>, String>? {
        val listAsString = sharedPrefs.getString("${key}_list", null) // Corrected key usage
        val timestamp = sharedPrefs.getString("${key}_timestamp", null) // Corrected key usage
    
        if (listAsString != null && timestamp != null) {
            val list = listAsString.split(",").map { it.toDouble() }
            return Pair(list, timestamp)
        }
        return null
    }

    fun writeCombinedData(context: Context, values: List<Double>) {
        val fileName = "combinedData.csv"
        val file = File(context.getExternalFilesDir(null), fileName)
        Log.d("WriteCsvFile", "File path: ${file.absolutePath}")

        try {
            // Check if the file already exists
            val fileExists = file.exists()

            // PrintWriter with the append flag set to true
            PrintWriter(FileOutputStream(file, true)).use { out ->
                if (!fileExists) {
                    // Write the header if the file does not exist
                    out.println("Date, Values")
                }

                // Format for the current date
                val currentDate = LocalDateTime.now()
                val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                val formattedDate = currentDate.format(formatter)

                // Build the line to be written
                val lineBuilder = StringBuilder("$formattedDate")
                values.forEach { value ->
                    lineBuilder.append(", $value")
                }

                // Append the line to the CSV
                out.println(lineBuilder.toString())
            }
            Log.d("WriteCsvFile", "Data appended successfully")
        } catch (e: IOException) {
            Log.e("WriteCsvFile", "Error writing file", e)
        }
    }

    private fun sendCurrentSensorData() {
        // Here, you would handle collecting and sending the latest sensor data
        // For demonstration, this might just log an output or update a UI element
        Log.d("SensorService", "Sending sensor data...")
    }

    override fun onSensorChanged(event: SensorEvent?) {
        event ?: return
    
        val currentTime = System.currentTimeMillis()
    
        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                val accelerometerData = SensorData(event.values[0], event.values[1], event.values[2], currentTime, (currentTime - initTime) / 1000.0)
                synchronized(this.accelerometerData) {
                    this.accelerometerData.add(accelerometerData)
                }
            }
            Sensor.TYPE_GYROSCOPE -> {
                val gyroscopeData = SensorData(event.values[0], event.values[1], event.values[2], currentTime, (currentTime - initTime) / 1000.0)
                synchronized(this.gyroscopeData) {
                    this.gyroscopeData.add(gyroscopeData)
                }
            }
            Sensor.TYPE_MAGNETIC_FIELD_UNCALIBRATED -> {
                val uncalibratedMagnetometerData = SensorData(event.values[0], event.values[1], event.values[2], currentTime, (currentTime - initTime) / 1000.0)
                synchronized(this.uncalibratedMagnetometerData) {
                    this.uncalibratedMagnetometerData.add(uncalibratedMagnetometerData)
                }
            }
            Sensor.TYPE_MOTION_DETECT -> {
                Log.d("DataLogger", "Motion Detected")
                synchronized(motionDetectionData) {
                    this.motionDetectionData.add(1.0f)
                }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Handle accuracy changes
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP_SERVICE) {
            stopSelf()
            return START_NOT_STICKY
        }

        val stopIntent = Intent(this, SensorService::class.java).apply {
            action = ACTION_STOP_SERVICE
        }
        val stopPendingIntent = PendingIntent.getService(this, 0, stopIntent, PendingIntent.FLAG_IMMUTABLE)

        val builder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Sensor Service")
            .setContentText("Collecting sensor data")
            .setSmallIcon(android.R.drawable.stat_notify_sync)
            .addAction(android.R.drawable.ic_delete, "Stop", stopPendingIntent)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)

        val notification = builder.build()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            startForeground(SERVICE_NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC)
        } else {
            startForeground(SERVICE_NOTIFICATION_ID, notification)
        }
        handler.post(runnable)
        // TODO: Add your sensor data collection logic here

        return START_STICKY
    }

    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    private fun createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Sensor Service Channel"
            val descriptionText = "Channel for Sensor Service notifications"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            // Register the channel with the system
            val notificationManager: NotificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun sendEventToReactNative(eventType: String, data: Map<String, Any>) {
    (applicationContext as ReactApplication)
        .reactNativeHost
        .reactInstanceManager
        .currentReactContext
        ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        ?.emit(eventType, Arguments.makeNativeMap(data))
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(runnable) // Stop the periodic task
        sensorManager.unregisterListener(this)
    }

    private fun calculateCombinedData(accelerometerData: List<SensorData>, gyroscopeData: List<SensorData>, uncalibratedMagnetometerData: List<SensorData>): List<Double> {
        val combinedData = mutableListOf<Double>()
    
        if (accelerometerData.isNotEmpty()) {
            val accX = accelerometerData.map { it.x.toDouble() }
            val accY = accelerometerData.map { it.y.toDouble() }
            val accZ = accelerometerData.map { it.z.toDouble() }
    
            combinedData += calculateAxisStats(accX)
            combinedData += calculateAxisStats(accY)
            combinedData += calculateAxisStats(accZ)
        }
    
        if (gyroscopeData.isNotEmpty()) {
            val gyroX = gyroscopeData.map { it.x.toDouble() }
            val gyroY = gyroscopeData.map { it.y.toDouble() }
            val gyroZ = gyroscopeData.map { it.z.toDouble() }
    
            combinedData += calculateAxisStats(gyroX)
            combinedData += calculateAxisStats(gyroY)
            combinedData += calculateAxisStats(gyroZ)
        }

        if (uncalibratedMagnetometerData.isNotEmpty()) {
            val magX = uncalibratedMagnetometerData.map { it.x.toDouble() }
            val magY = uncalibratedMagnetometerData.map { it.y.toDouble() }
            val magZ = uncalibratedMagnetometerData.map { it.z.toDouble() }
    
            combinedData += calculateAxisStats(magX)
            combinedData += calculateAxisStats(magY)
            combinedData += calculateAxisStats(magZ)
        }
    
        return combinedData
    }

    private fun calculateAxisStats(data: List<Double>): List<Double> {
        val mean = data.mean()
        val std = data.std(mean)
        val aad = data.meanAbsoluteDeviation(mean)
        val max = data.maxOrNull() ?: Double.NaN
        val min = data.minOrNull() ?: Double.NaN
        val maxMin = max - min
        val median = data.median()
        val mad = data.medianAbsoluteDeviation(median)
        val iqr = data.interquartileRange()
        val posCount = data.count { it > 0 }.toDouble()
        val negCount = data.count { it < 0 }.toDouble()
        val aboveMean = data.count { it > mean }.toDouble()
        val skewness = data.skewness(mean, std)
        val kurtosis = data.kurtosis(mean, std)
        val energy = data.sumOf { it * it } / 100
    
        return listOf(mean, std, aad, max, min, maxMin, median, mad, iqr, posCount, negCount, aboveMean, skewness, kurtosis, energy)
    }
    
    private fun List<Double>.mean(): Double = this.sum() / this.size
    
    private fun List<Double>.std(mean: Double): Double {
        val variance = this.sumOf { (it - mean) * (it - mean) } / this.size
        return sqrt(variance)
    }
    
    private fun List<Double>.meanAbsoluteDeviation(mean: Double): Double {
        return this.map { abs(it - mean) }.mean()
    }
    
    private fun List<Double>.median(): Double {
        val sortedData = this.sorted()
        val mid = sortedData.size / 2
        return if (sortedData.size % 2 != 0) sortedData[mid] else (sortedData[mid - 1] + sortedData[mid]) / 2
    }
    
    private fun List<Double>.medianAbsoluteDeviation(median: Double): Double {
        return this.map { abs(it - median) }.median()
    }
    
    private fun List<Double>.interquartileRange(): Double {
        val sortedData = this.sorted()
        val q75 = sortedData[(0.75 * (sortedData.size - 1)).toInt()]
        val q25 = sortedData[(0.25 * (sortedData.size - 1)).toInt()]
        return q75 - q25
    }
    
    private fun List<Double>.skewness(mean: Double, std: Double): Double {
        val n = this.size
        val skewSum = this.sumOf { (it - mean).pow(3.0) }
        return (n / ((n - 1) * (n - 2).toDouble())) * (skewSum / std.pow(3.0))
    }
    
    private fun List<Double>.kurtosis(mean: Double, std: Double): Double {
        val n = this.size
        val kurtosisSum = this.sumOf { (it - mean).pow(4.0) }
        return (n * (n + 1) * kurtosisSum) / ((n - 1) * (n - 2) * (n - 3) * std.pow(4.0)) - (3 * (n - 1).toDouble().pow(2.0)) / ((n - 2) * (n - 3))
    }

    private fun isPhoneMoving(combinedData: List<Double>): Boolean {
        // Check if the list has all required elements
        if (combinedData.size != 135) {
            return false
        }
    
        // Calculate indices for the standard deviation and variance of each axis for all sensors
        val stdDevAccZ = combinedData[13]
        val varAccZ = stdDevAccZ * stdDevAccZ
        
        val stdDevGyroZ = combinedData[65]
        val varGyroZ = stdDevGyroZ * stdDevGyroZ

        val stdDevMagZ = combinedData[117]
        val varMagZ = stdDevMagZ * stdDevMagZ
        
        val stdDevThresholdAcc = 0.5 / 4  // Standard deviation threshold for accelerometer Z-axis
        val varThresholdAcc = 0.25 / 4    // Variance threshold for accelerometer Z-axis
        
        val stdDevThresholdGyro = 1.0 / 4  // Standard deviation threshold for gyroscope Z-axis
        val varThresholdGyro = 1.0 / 4     // Variance threshold for gyroscope Z-axis
        
        return stdDevAccZ > stdDevThresholdAcc ||
               stdDevGyroZ > stdDevThresholdGyro
    }
}




