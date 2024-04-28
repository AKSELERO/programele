  
// Update this to match the interface name declared in your .d.ts file
import BackgroundService from 'react-native-background-actions';
import SensorDataManager from './ReadSensors'

const sensorDataManager = SensorDataManager.getInstance();

// const backgroundTask = async (): Promise<void> => {
//   sensorDataManager.startSubscriptions();

//   // Here, we replace setInterval with a loop that periodically calls processSensorData
//   while (await BackgroundService.isRunning()) {
//     await new Promise(resolve => setTimeout(resolve, 15000)); // Wait for 15 seconds
//     await sensorDataManager.processSensorData();
//   }

//   sensorDataManager.stopSubscriptions();
// };

const backgroundTask = async (): Promise<void> => {
  sensorDataManager.startListeningToSensorData();  // Start listening to sensor data events
  // Keep the loop that periodically calls processSensorData
  while (await BackgroundService.isRunning()) {
    await new Promise(resolve => setTimeout(resolve, 15000)); // Wait for 15 seconds
    await sensorDataManager.processSensorData();  // Process the accumulated data
  }

  sensorDataManager.stopListeningToSensorData();  // Stop listening to sensor data events
};

interface BackgroundTaskOptions {
  taskName: string;
  taskTitle: string;
  taskDesc: string;
  taskIcon: {
    name: string;
    type: string;
  };
  color: string;
  parameters: {
    delay: number;
  };
}

export const startBackgroundService = async () => {
    await BackgroundService.start(backgroundTask, options);
    console.log('Background service started');
}

export const stopBackgroundService = async () => {
  try {
    await BackgroundService.stop();
    console.log('Background service stopped');
  } catch (error) {
    console.error('Failed to stop background service:', error);
  }
}

const options: BackgroundTaskOptions = {
  taskName: 'Sensor Data Recording',
  taskTitle: 'Sensor data recording in progress',
  taskDesc: 'The app is collecting sensor data',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ffffff',
  parameters: { delay: 1000 },
};

export default { startBackgroundService, stopBackgroundService };