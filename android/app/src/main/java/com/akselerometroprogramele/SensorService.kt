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


class SensorService : Service(), SensorEventListener {

    private lateinit var sensorManager: SensorManager
    private var accelerometer: Sensor? = null
    private var gyroscope: Sensor? = null
    private var motionDetection: Sensor? = null
    private lateinit var handler: Handler
    private lateinit var runnable: Runnable
    private var accelerometerData: MutableList<SensorData> = mutableListOf()
    private var gyroscopeData: MutableList<SensorData> = mutableListOf()
    private var motionDetectionData: MutableList<Float> = mutableListOf()
    private var initTime: Long = 0L
    private lateinit var sharedPreferences: SharedPreferences

    data class SensorData(val x: Float, val y: Float, val z: Float, val timestamp: Long, val initTime: Double)

    companion object {
        private const val SERVICE_NOTIFICATION_ID = 1
        private const val CHANNEL_ID = "ForegroundServiceChannel"
        private const val INTERVAL: Long = 15000
    }

    override fun onCreate() {
        super.onCreate()
        initTime = System.currentTimeMillis()
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        gyroscope = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)
        motionDetection =sensorManager.getDefaultSensor(Sensor.TYPE_MOTION_DETECT)
        if (motionDetection == null) {
            Log.d("DataLogger", "Motion detection sensor not available")
        } else {
            Log.d("DataLogger", "Motion detection sensor is available")
        }
        // accelerometer?.let {
        //     sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        // }
        // gyroscope?.let {
        //     sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        // }
        sensorManager.registerListener(this, accelerometer, 50000)
        sensorManager.registerListener(this, gyroscope, 50000)
        sensorManager.registerListener(this, motionDetection, 50000)
        // ortEnv = OrtEnvironment.getEnvironment()
        // loadModel()
        
        createNotificationChannel()
        sharedPreferences = getSharedPreferences("MyAppData", Context.MODE_PRIVATE)
        handler = Handler(Looper.getMainLooper())
        runnable = Runnable {
            processAndResetData()
            handler.postDelayed(runnable, INTERVAL)
        }
    }

    private fun processAndResetData() {
        // Call your data processing function here
        Log.d("DataLogger", "Starting data processing...")
        //writeCsvFile(this, accelerometerData, "accdata2.csv")
        //writeCsvFile(this, gyroscopeData, "gyrodata2.csv")
        Log.d("DataLogger", "no motion $motionDetectionData")
        
        var combinedData = calculateCombinedData(accelerometerData, gyroscopeData)
        var moved = isPhoneMoving(combinedData)
        Log.d("DataLogger", "moved $moved")
        if ((motionDetectionData.isEmpty() && motionDetection != null) || moved == false){
            saveNoMotionMessageWithTimestamp(sharedPreferences, "CombinedData", "Nejuda")
        }
        else {
            var combinedData = calculateCombinedData(accelerometerData, gyroscopeData)
            Log.d("DataLogger", "Combined Data: $combinedData")
            //writeCombinedData(this, combinedData)
            saveListOfDoublesWithTimestamp(sharedPreferences, "CombinedData", combinedData)
        }
        
        // loadModel()
        // Reset data collections

        synchronized(accelerometerData) { accelerometerData.clear() }
        synchronized(gyroscopeData) { gyroscopeData.clear() }
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
        event ?: return  // If the event is null, return immediately
    
        val currentTime = System.currentTimeMillis()
    
        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                // Extract data for accelerometer
                val accelerometerData = SensorData(event.values[0], event.values[1], event.values[2], currentTime, (currentTime - initTime) / 1000.0)
                synchronized(accelerometerData) {
                    this.accelerometerData.add(accelerometerData)
                }
            }
            Sensor.TYPE_GYROSCOPE -> {
                // Extract data for gyroscope
                val gyroscopeData = SensorData(event.values[0], event.values[1], event.values[2], currentTime, (currentTime - initTime) / 1000.0)
                synchronized(gyroscopeData) {
                    this.gyroscopeData.add(gyroscopeData)
                }
            }
            Sensor.TYPE_MOTION_DETECT -> {
                // Handle motion detect event
                // Typically, we do not get continuous data here, just an event trigger
                //val motionData = SensorData(1.0f, 0f, 0f, currentTime, (currentTime - initTime) / 1000.0) // 1.0f can indicate motion detected
                Log.d("DataLogger", "Motion Detected")
                synchronized(motionDetectionData) {
                    this.motionDetectionData.add(1.0f)
                }
                // Perform action upon motion detection, e.g., alerting or changing state
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Handle accuracy changes
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val intent = Intent(this, SensorService::class.java)
        val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE)

        val optionsBundle: Bundle? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val options = ActivityOptions.makeBasic().apply {
                setPendingIntentBackgroundActivityStartMode(ActivityOptions.MODE_BACKGROUND_ACTIVITY_START_ALLOWED)
            }
            options.toBundle()
        } else {
            null
        }
        val builder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentIntent(pendingIntent)
            .setContentTitle("Sensor Service")
            .setContentText("Collecting sensor data")
            .setSmallIcon(android.R.drawable.stat_notify_sync)
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
            val name = getString(R.string.channel_name)
            val descriptionText = getString(R.string.channel_description)
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                val descriptionText = getString(R.string.channel_description)
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

    private fun calculateCombinedData(accelerometerData: List<SensorData>, gyroscopeData: List<SensorData>): List<Double> {
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

        return combinedData
    }

    private fun calculateAxisStats(data: List<Double>): List<Double> {
        val sum = data.sum()
        val mean = sum / data.size
        val max = data.maxOrNull() ?: Double.NaN
        val min = data.minOrNull() ?: Double.NaN
        val median = calculateMedian(data)
        val skewness = calculateSkewness(data, mean)
        val std = calculateStandardDeviation(data, mean)
        val variance = std * std

        return listOf(sum, mean, max, min, median, skewness, std, variance)
    }

    private fun calculateMedian(data: List<Double>): Double {
        val sortedData = data.sorted()
        val mid = sortedData.size / 2
        return if (sortedData.size % 2 != 0) sortedData[mid] else (sortedData[mid - 1] + sortedData[mid]) / 2
    }

    private fun calculateSkewness(data: List<Double>, mean: Double): Double {
        val n = data.size
        val skewSum = data.sumOf { Math.pow(it - mean, 3.0) }
        val std = calculateStandardDeviation(data, mean)
        return (n / ((n - 1) * (n - 2).toDouble())) * (skewSum / Math.pow(std, 3.0))
    }

    private fun calculateStandardDeviation(data: List<Double>, mean: Double): Double {
        val variance = data.sumOf { (it - mean) * (it - mean) } / data.size
        return Math.sqrt(variance)
    }

    private fun isPhoneMoving(combinedData: List<Double>): Boolean {
        // Check if the list has all required elements
        if (combinedData.size < 48) {
            // Log an error or handle this case appropriately
            return false // or throw an error, depending on your error handling strategy
        }
    
        // Proceed with your existing code if the list is of expected size
        val stdDevAccZ = combinedData[22] // Standard deviation of Accelerometer Z
        val varAccZ = combinedData[23]   // Variance of Accelerometer Z
        
        val stdDevGyroZ = combinedData[46] // Standard deviation of Gyroscope Z
        val varGyroZ = combinedData[47]    // Variance of Gyroscope Z
        
        val stdDevThresholdAcc = 0.5/2  // Standard deviation threshold for accelerometer Z-axis
        val varThresholdAcc = 0.25/2    // Variance threshold for accelerometer Z-axis
        
        val stdDevThresholdGyro = 1.0/2  // Standard deviation threshold for gyroscope Z-axis
        val varThresholdGyro = 1.0/2     // Variance threshold for gyroscope Z-axis
        
        return stdDevAccZ > stdDevThresholdAcc || varAccZ > varThresholdAcc ||
               stdDevGyroZ > stdDevThresholdGyro || varGyroZ > varThresholdGyro
    }
}




