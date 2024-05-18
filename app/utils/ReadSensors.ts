import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState, useRef } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { gyroscope } from 'react-native-sensors';
import { Asset } from 'expo-asset';

  import AsyncStorageUpdater from './StoreState';
  import { load, save } from './storage/storage';
import RNFS, { write } from 'react-native-fs';
import loadModelFromCloud from './loadModel'

import { Tensor , InferenceSession } from 'onnxruntime-react-native';

import { appendDataToCSV } from './WriteToCSV';
import BackgroundService from 'react-native-background-actions';
import { DeviceEventEmitter, EventSubscription } from 'react-native';
import { Mutex } from 'async-mutex';
import PushNotification from 'react-native-push-notification';
import { format } from 'date-fns'; 

interface DataEntry {
  content: string;
  date: string;
}

interface SensorData {
  x: number;
  y: number;
  z: number;
  timestamp: number; // Time in ticks
  elapsedTime: number; // Seconds elapsed since reading started
}

class ModelManager {
  private static instance: ModelManager;
  private modelSession: InferenceSession | null = null;

  private constructor() { }

  public static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();

    }
    return ModelManager.instance;
  }

  public async loadModel(modelUrl: string): Promise<void> {
    if (this.modelSession === null) {
      try {
        const session = await loadModelFromCloud(modelUrl) ?? null;
        if (session === null) {
          throw new Error('Failed to load the model from the cloud.');
        }
        console.log('Model session is ready for inference.');
        this.modelSession = session;
      } catch (error) {
        console.error('Failed to load model:', error);
        this.modelSession = null;
      }
    }
  }

  // Modified getPrediction to return prediction result
  public async getPrediction(inputData: Float32Array): Promise<any> { // Use a more specific type than any if possible
    if (!this.modelSession) {
      console.error('Model session is not initialized. Please load the model first.');
      return null; // Indicate failure or invalid session
    }

    const inputTensor = new Tensor("float32", inputData, [1, 48]); // Adjust shape as necessary
    const feeds = { "X": inputTensor };

    try {
      const output = await this.modelSession.run(feeds, ["output_label"]);
      const predictionResult = output.output_label.data;
      console.log("Prediction result: ", predictionResult);

      return predictionResult; // Return the prediction result
    } catch (error) {
      console.error('Error during inference:', error);
      return null; // Indicate error condition
    }
  }

  

  
}

export default class SensorDataManager {
  private static instance: SensorDataManager;
  private accelerometerData: SensorData[] = [];
  private gyroscopeData: SensorData[] = [];
  // private accelerometerSubscription: any;
  // private gyroscopeSubscription: any;
  private accelerometerSubscription: EventSubscription | null = null;
  private gyroscopeSubscription: EventSubscription | null = null;
  private modelLoaded: boolean;
  private modelUrl: string;
  private startTime : number;
  private mutex : Mutex;
  private sitCount : number;

  private constructor() {
    this.sitCount = 0;
    this.modelLoaded = false;
    this.modelUrl = 'https://drive.google.com/uc?export=download&id=1j8t-4VPG4s-ow4TvWzo5zr1CYVxRrJF8'; // onnx
    // const modelUrl = 'https://drive.google.com/uc?export=download&id=1_pTQnQgPkpj89kH9HePESt1ansr7HsPV'; //ort
    this.startTime = Date.now();
    this.mutex = new Mutex();
    PushNotification.createChannel(
      {
        channelId: "your-channel-id", // Replace 'your-channel-id' with your channel ID
        channelName: "Your Channel Name", // Replace 'Your Channel Name' with the name of your channel
        channelDescription: "A channel to categorise your notifications", // Optional
        soundName: "default", // Optional
        importance: 4, // Default is 4
        vibrate: true, // Default is true
      },
      (created) => console.log(`CreateChannelsit returned '${created}'`) // Optional callback returns whether the channel was created successfully
    );
  }

  public static getInstance(): SensorDataManager {
    if (!SensorDataManager.instance) {
      SensorDataManager.instance = new SensorDataManager();
    }
    return SensorDataManager.instance;
  }

  public execute(){

  }

  // public startSubscriptions(): void {
  //   const startTime = Date.now();

  //   this.accelerometerSubscription = Accelerometer.addListener(data => {
  //     const currentTime = Date.now();
  //     const elapsedTime = (currentTime - startTime) / 1000;
  //     this.accelerometerData.push({ ...data, timestamp: currentTime, elapsedTime });
  //   });

  //   this.gyroscopeSubscription = Gyroscope.addListener(data => {
  //     const currentTime = Date.now();
  //     const elapsedTime = (currentTime - startTime) / 1000;
  //     this.gyroscopeData.push({ ...data, timestamp: currentTime, elapsedTime });
  //   });
  // }

  // public stopSubscriptions(): void {
  //   this.accelerometerSubscription?.remove();
  //   this.gyroscopeSubscription?.remove();
  // }

  public startListeningToSensorData(): void {
    this.accelerometerSubscription = DeviceEventEmitter.addListener(
      'Accelerometer',
      this.handleAccelerometerData
    );

    this.gyroscopeSubscription = DeviceEventEmitter.addListener(
      'Gyroscope',
      this.handleGyroscopeData
    );
}

public stopListeningToSensorData(): void {
    this.accelerometerSubscription?.remove();
    this.gyroscopeSubscription?.remove();

    // Reset subscriptions to null after removing them
    this.accelerometerSubscription = null;
    this.gyroscopeSubscription = null;
}

  
  private handleAccelerometerData = (data: any) => {
    const elapsedTime = (data.timestamp - this.startTime) / 1000; // Assuming timestamp is in milliseconds
    this.accelerometerData.push({ ...data, timestamp: this.startTime, elapsedTime });
  }
  
  private handleGyroscopeData = (data: any) => {
    const elapsedTime = (data.timestamp - this.startTime) / 1000; // Assuming timestamp is in milliseconds
    this.gyroscopeData.push({ ...data, timestamp: this.startTime, elapsedTime });
  }

  public async processSensorData(): Promise<void> {
    console.log(this.accelerometerData.length);
    console.log(this.gyroscopeData.length);
    await appendDataToCSV(this.accelerometerData, 'accData.csv');
    await appendDataToCSV(this.gyroscopeData, 'gyroData.csv');
    const combinedData = this.calculateCombinedData(this.accelerometerData, this.gyroscopeData);
    console.log(combinedData.length);
    if (combinedData.length > 0) {
      this.runInference(combinedData);
    }
    // Process your data here, e.g., append to CSV or run inference
    // This method could be called periodically, similar to your setInterval logic

    // Example:
    // await appendDataToCSV(this.accelerometerData, 'accData.csv');
    // Reset data arrays after processing
    this.accelerometerData = [];
    this.gyroscopeData = [];
  }

  public runInference = async (combinedData: number[]) => {
    try {


        const modelManager = ModelManager.getInstance();
        if (!this.modelLoaded) {
          await modelManager.loadModel(this.modelUrl);
          this.modelLoaded = true;
        }
        const inputData = new Float32Array(combinedData);
        const predictionResult = await modelManager.getPrediction(inputData);
        const valueMap: Record<string, string> = {
          'D': 'sėdėjimas',
          'B': 'bėgimas',
          'A': 'ėjimas',
          'E': 'stovėjimas',
        };

        if (predictionResult !== null) {
          console.log('Received prediction:', predictionResult);
          const state = valueMap[predictionResult];
          await this.writeData(state);
        } else {
          console.log('Failed to get prediction.');
        }

        
        
        

        
    } catch (error) {
        console.error('Error during inference:', error);
    }
};

public runInference2 = async (combinedData: number[], time: string) => {
  try {


      const modelManager = ModelManager.getInstance();
      if (!this.modelLoaded) {
        await modelManager.loadModel(this.modelUrl);
        this.modelLoaded = true;
      }
      if (combinedData.length === 24) {
        console.log("Combined data length too short. Gyroscope is probably missing.")
        const newCombinedData = combinedData;
        combinedData.forEach((num) => {newCombinedData.push(num)})
        combinedData = newCombinedData
        
      }
      if (combinedData.length == 48){
        const inputData = new Float32Array(combinedData);
        const predictionResult = await modelManager.getPrediction(inputData);
        const valueMap: Record<string, string> = {
          'D': 'sėdėjimas',
          'B': 'bėgimas',
          'A': 'ėjimas',
          'E': 'stovėjimas',
        };

        if (predictionResult !== null) {
          console.log('Received prediction:', predictionResult);
          const state = valueMap[predictionResult];
          await this.writeData2(state, time);
        } else {
          console.log('Failed to get prediction.');
        }
      }
      

      
      
      

      
  } catch (error) {
      console.error('Error during inference:', error);
  }
};

public writeData = async (initialContent : string) => {
    try {
      // Get the current date and time
      const currentDate = new Date();
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: 'Europe/Vilnius', // Set the time zone to Lithuania
      };
      
      const formattedDate = currentDate.toLocaleString('lt-LT', options);

      // Load the current count from AsyncStorage and explicitly cast it to a number
      const count = Number((await load('entryCount')) || 0);

      // Create the key dynamically based on the count
      const key = `dataKey${count + 1}`;

      // Create the new entry
      const newDataEntry = {
        date: formattedDate,
        content: initialContent,
      };

      // Save data to AsyncStorage using the dynamically generated key
      const success = await save(key, newDataEntry);

      if (success) {
        console.log('Data successfully written to AsyncStorage:', newDataEntry);

        // Increment the count and save it back to AsyncStorage
        await save('entryCount', count + 1);

      } else {
        console.error('Failed to write data to AsyncStorage');
      }
    } catch (error) {
      console.error('Error writing data to AsyncStorage:', error);
    }
  };

  public writeData2 = async (initialContent : string, formattedDate: string) => {
    const release = await this.mutex.acquire();
    try {
      // Get the current date and time
      // const currentDate = new Date();
      // const options: Intl.DateTimeFormatOptions = {
      //   year: 'numeric',
      //   month: 'numeric',
      //   day: 'numeric',
      //   hour: 'numeric',
      //   minute: 'numeric',
      //   second: 'numeric',
      //   hour12: false,
      //   timeZone: 'Europe/Vilnius', // Set the time zone to Lithuania
      // };
      
      // const formattedDate = currentDate.toLocaleString('lt-LT', options);

      // Load the current count from AsyncStorage and explicitly cast it to a number
      const count = Number((await load('entryCount')) || 0);

      const prev = await load(`dataKey${count}`) as DataEntry;

      var prevEntryIsSameDay = true;

      if (prev){
        prevEntryIsSameDay = !this.checkIfToday(prev)
      }
      console.log(prevEntryIsSameDay);
      if (prevEntryIsSameDay){
        var todaySitCount = Number((await load('todaySitCount')) || 0);
        var todaySitCountNotInterupted = Number((await load('todaySitCountNotInterupted')) || 0);
        var todayStandCount = Number((await load('todayStandCount')) || 0);
        var todayWalkCount = Number((await load('todayWalkCount')) || 0);
        var todayRunCount = Number((await load('todayRunCount')) || 0);
        var todayLayCount = Number((await load('todayLayCount')) || 0);
        todaySitCount = 0;
        todaySitCountNotInterupted = 0;
        todayStandCount = 0;
        todayWalkCount = 0;
        todayRunCount = 0;
        todayLayCount = 0;
        await save('todaySitCount', todaySitCount);
        await save('todaySitCountNotInterupted', todaySitCountNotInterupted);
        await save('todayStandCount', todayStandCount);
        await save('todayWalkCount', todayWalkCount);
        await save('todayRunCount', todayRunCount);
        await save('todayLayCount', todayLayCount);

      }

      switch (initialContent){
        case 'sėdėjimas':
          var todaySitCount = Number((await load('todaySitCount')) || 0);
          todaySitCount++;
          await save('todaySitCount', todaySitCount);
          var todaySitCountNotInterupted = Number((await load('todaySitCountNotInterupted')) || 0);
          todaySitCountNotInterupted++;
          await save('todaySitCountNotInterupted', todaySitCountNotInterupted);
          break;
        case 'bėgimas':
          var todayRunCount = Number((await load('todayRunCount')) || 0);
          todayRunCount++;
          await save('todayRunCount', todayRunCount);
          var todaySitCountNotInterupted = Number((await load('todaySitCountNotInterupted')) || 0);
          todaySitCountNotInterupted = 0;
          await save('todaySitCountNotInterupted', todaySitCountNotInterupted);
          break;
        case 'ėjimas':
          var todayWalkCount = Number((await load('todayWalkCount')) || 0);
          todayWalkCount++;
          await save('todayWalkCount', todayWalkCount);
          var todaySitCountNotInterupted = Number((await load('todaySitCountNotInterupted')) || 0);
          todaySitCountNotInterupted = 0;
          await save('todaySitCountNotInterupted', todaySitCountNotInterupted);
          break;
        case 'stovėjimas':
          var todayStandCount = Number((await load('todayStandCount')) || 0);
          todayStandCount++;
          await save('todayStandCount', todayStandCount);
          var todaySitCountNotInterupted = Number((await load('todaySitCountNotInterupted')) || 0);
          todaySitCountNotInterupted = 0;
          await save('todaySitCountNotInterupted', todaySitCountNotInterupted);
          break;

      }

      // Create the key dynamically based on the count
      const key = `dataKey${count + 1}`;

      // Create the new entry
      const newDataEntry = {
        date: formattedDate,
        content: initialContent,
      };

      // Save data to AsyncStorage using the dynamically generated key
      const success = await save(key, newDataEntry);

      if (success) {
        console.log('Data successfully written to AsyncStorage:', newDataEntry, ' key: ', key);

        // Increment the count and save it back to AsyncStorage
        await save('entryCount', count + 1);

      } else {
        console.error('Failed to write data to AsyncStorage');
      }
      // if (initialContent == 'sėdėjimas' || initialContent == 'Nejuda'){
      //   this.sitCount++;
        
      // }
      // else {
      //   this.sitCount = 0;
      // }
      //this.checkForNotifications();
    } catch (error) {
      console.error('Error writing data to AsyncStorage:', error);
    }
    finally {
      release(); // Always release the mutex
    }
  };

  private checkIfToday(entry: DataEntry): boolean {
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, 'yyyy-MM-dd'); // Format today's date as "YYYY-MM-DD"
    const entryDateOnly = entry.date.split(' ')[0]; // Extract only the date part from "YYYY-MM-DD HH:mm:ss"
  
    return entryDateOnly === formattedCurrentDate;
  }

  private checkForNotifications = async () => {
    console.log(this.sitCount);
    var walkCount = 0;
    var sitCount = 0;
    var sendBreakSittingNotification = false;
    const count = Number((await load('entryCount')) || 0);
    for (let i = count; i > 0; i--) {
      const key = `dataKey${i}`;
      const entry = await load(key) as DataEntry;
      if (this.checkIfToday(entry)){
        switch (entry.content){
          case 'sėdėjimas':
            sitCount++;
            break;
          case 'ėjimas':
            walkCount++
            break;
          default: //pridėti kitom būsenom
            break;
        }
        if (walkCount > 0){
          console.log(sitCount)
          const breakAfterSitting = 30 //min
          if (sitCount / 4 >= breakAfterSitting){
            sendBreakSittingNotification = true;
          }
        }
      }
      else {
        break;
      }
    }

    //sitting
    if (sendBreakSittingNotification){
      PushNotification.localNotification({
        channelId: "your-channel-id",
        title: "Metas Pajudėti!", // Title of the notification
        message: Math.floor(sitCount / 4) + " minutes praleidote sėdėdami", // Message in the notification
        playSound: true, // Sound to play on receipt of notification
        soundName: "default", // Sound file name to play; use 'default' to play the default notification sound
        vibration: 300, // Vibration duration in milliseconds, null to disable
      });
      // this.sitCount = 0;
    }

    const walkGoal = 30 //min

    if (walkGoal > walkCount / 4){
      PushNotification.localNotification({
        channelId: "your-channel-id",
        title: "Nepasiduokite ant savo tikslo", // Title of the notification
        message: "Iki pasiekto tikslo jums dar trūksta " + (walkGoal-(walkCount / 4)) + " minučių ėjimo", // Message in the notification
        playSound: true, // Sound to play on receipt of notification
        soundName: "default", // Sound file name to play; use 'default' to play the default notification sound
        vibration: 300, // Vibration duration in milliseconds, null to disable
      });
      // this.sitCount = 0;
    }
  }

  public calculateCombinedData = (accelerometerData: { x: number; y: number; z: number; }[], gyroscopeData: { x: number; y: number; z: number; }[]) => {
      console.log("Calculating combined data...");
      const combinedData: number[] = [];
      // console.log("Accelerometer data: ")
      // accelerometerData.forEach((ob) => {
      //   console.log(`X: ${ob.x}, Y: ${ob.y}, Z: ${ob.z}`)
      // })

      // Calculate statistics for accelerometer data
      if (accelerometerData.length > 0) {
          const accX = accelerometerData.map(data => data.x);
          const accY = accelerometerData.map(data => data.y);
          const accZ = accelerometerData.map(data => data.z);

          const accStatsX = this.calculateAxisStats(accX);
          const accStatsY = this.calculateAxisStats(accY);
          const accStatsZ = this.calculateAxisStats(accZ);

          combinedData.push(...accStatsX, ...accStatsY, ...accStatsZ);



          // console.log(1)
          // console.log(combinedData)

      }

      // Calculate statistics for gyroscope data
      // gyroscopeData = accelerometerData
      // gyroscopeData.forEach((ob) => {
      //   console.log(`X: ${ob.x}, Y: ${ob.y}, Z: ${ob.z}`)
      // })
      if (gyroscopeData.length > 0) {
          const gyroX = gyroscopeData.map(data => data.x);
          const gyroY = gyroscopeData.map(data => data.y);
          const gyroZ = gyroscopeData.map(data => data.z);

          const gyroStatsX = this.calculateAxisStats(gyroX);
          const gyroStatsY = this.calculateAxisStats(gyroY);
          const gyroStatsZ = this.calculateAxisStats(gyroZ);

          combinedData.push(...gyroStatsX, ...gyroStatsY, ...gyroStatsZ);
          // console.log(2)
          // console.log(combinedData)
      }

      

      // loadModelFromCloud(modelUrl)
      //   .then((session) => {
      //     if (session) {
      //       console.log('Model session is ready for inference.');
      //       const inputData = new Float32Array(combinedData); // Populate with your actual data

      //       const inputTensor = new Tensor("float32", inputData, [1, 48]); // Assuming input shape is [1, 48]

      //       const feeds = {"X": inputTensor };
      //       console.log(session.outputNames);
      //       const result = session.run(feeds, ["output_label"]);
          
      //       result.then(output => {
      //         // Access and log the actual inference results here
      //         console.log("Prediction result: " + output.output_label.data);
      //       }).catch(error => {
      //         console.error('Error during inference:', error);
      //       });
            
      //     }
      //   })
      //   .catch((error) => console.error(error));

      return combinedData;
  };

  public calculateAxisStats = (data: number[]) => {
      const sum = data.reduce((acc, val) => acc + val, 0);
      const mean = sum / data.length;
      const max = Math.max(...data);
      const min = Math.min(...data);
      const median = this.calculateMedian(data);
      const skewness = this.calculateSkewness(data, mean);
      const std = this.calculateStandardDeviation(data, mean);
      const variance = std ** 2;

      return [sum, mean, max, min, median, skewness, std, variance];
  };

  public calculateMedian = (data: number[]) => {
      const sortedData = [...data].sort((a, b) => a - b);
      const mid = Math.floor(sortedData.length / 2);
      return sortedData.length % 2 !== 0 ? sortedData[mid] : (sortedData[mid - 1] + sortedData[mid]) / 2;
  };

  public calculateSkewness = (data: number[], mean: number) => {
      const n = data.length;
      const skewSum = data.reduce((acc, val) => acc + ((val - mean) ** 3), 0);
      const std = this.calculateStandardDeviation(data, mean);
      return (n / ((n - 1) * (n - 2) * (std ** 3))) * skewSum;
  };

  public calculateStandardDeviation = (data: number[], mean: number) => {
      const variance = data.reduce((acc, val) => acc + ((val - mean) ** 2), 0) / data.length;
      return Math.sqrt(variance);
  };
}

// const sensorDataManager = SensorDataManager.getInstance();

// const backgroundTask = async (): Promise<void> => {
//   sensorDataManager.startSubscriptions();

//   // Here, we replace setInterval with a loop that periodically calls processSensorData
//   while (await BackgroundService.isRunning()) {
//     await new Promise(resolve => setTimeout(resolve, 15000)); // Wait for 15 seconds
//     await sensorDataManager.processSensorData();
//   }

//   sensorDataManager.stopSubscriptions();
// };

// let accelerometerSubscription: ReturnType<typeof Accelerometer.addListener>;
// let gyroscopeSubscription: ReturnType<typeof Gyroscope.addListener>;

// const setupSensors = (): void => {
//   const startTime = Date.now();

//   Accelerometer.setUpdateInterval(50);
//   Gyroscope.setUpdateInterval(50);

//   accelerometerSubscription = Accelerometer.addListener(data => {
//     const currentTime = Date.now();
//     const elapsedTime = (currentTime - startTime) / 1000;
//     const dataWithTimestampAndElapsedTime: SensorData = { ...data, timestamp: currentTime, elapsedTime };
//     // Process or store accelerometer data
//   });

//   gyroscopeSubscription = Gyroscope.addListener(data => {
//     const currentTime = Date.now();
//     const elapsedTime = (currentTime - startTime) / 1000;
//     const dataWithTimestampAndElapsedTime: SensorData = { ...data, timestamp: currentTime, elapsedTime };
//     // Process or store gyroscope data
//   });
// };

// const stopSensors = (): void => {
//   accelerometerSubscription?.remove();
//   gyroscopeSubscription?.remove();
// };

// let modelLoaded = false;

// async function loadModel(modelUrl: string): Promise<boolean> {
//   const modelManager = ModelManager.getInstance();
//   if (!modelLoaded) {
//     await modelManager.loadModel(modelUrl);
//     modelLoaded = true; // Model is loaded
//   }
//   return modelLoaded;
// }
/// //////////////////////////////////////
// const SensorDataRecorder: React.FC = () => {
//     const [accelerometerData, setAccelerometerData] = useState<SensorData[]>([]);
//     const accelerometerDataRef = useRef<SensorData[]>(accelerometerData);
    
//     const [gyroscopeData, setGyroscopeData] = useState<SensorData[]>([]);
//     const gyroscopeDataRef = useRef<SensorData[]>(gyroscopeData);
//     const modelUrl = 'https://drive.google.com/uc?export=download&id=1j8t-4VPG4s-ow4TvWzo5zr1CYVxRrJF8'; //onnx
//     //const modelUrl = 'https://drive.google.com/uc?export=download&id=1_pTQnQgPkpj89kH9HePESt1ansr7HsPV'; //ort
//     const [modelLoaded, setModelLoaded] = useState(false);

//     useEffect(() => {
//       // Retrieve the singleton instance of ModelManager here
//       const modelManager = ModelManager.getInstance();

//       const loadModelAsync = async () => {
//           if (!modelLoaded) {
//               await modelManager.loadModel(modelUrl);
//               setModelLoaded(true); // Indicate that the model is loaded
//           }
//       };

//       loadModelAsync();
//     }, [modelLoaded]);

//     useEffect(() => {
//         let accelerometerSubscription: { remove: () => void };
//         let gyroscopeSubscription: { remove: () => void };
  
//         const startSubscriptions = () => {
//           // Reset or initialize the start time at the beginning of the session
//           const startTime = Date.now();
      
//           Accelerometer.setUpdateInterval(50);
//           Gyroscope.setUpdateInterval(50);
      
//           accelerometerSubscription = Accelerometer.addListener((data) => {
//               const currentTime = Date.now();
//               const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
      
//               const dataWithTimestampAndElapsedTime = {
//                   ...data,
//                   timestamp: currentTime,
//                   elapsedTime: elapsedTime,
//               };
//               setAccelerometerData((prevData) => [...prevData, dataWithTimestampAndElapsedTime]);
//           });
      
//           gyroscopeSubscription = Gyroscope.addListener((data) => {
//               const currentTime = Date.now();
//               const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
      
//               const dataWithTimestampAndElapsedTime = {
//                   ...data,
//                   timestamp: currentTime,
//                   elapsedTime: elapsedTime,
//               };
//               setGyroscopeData((prevData) => [...prevData, dataWithTimestampAndElapsedTime]);
//           });
//       };
      
  
//         const stopSubscriptions = () => {
//             console.log("Stopping accelerometer subscription");
//             accelerometerSubscription.remove();
//             gyroscopeSubscription.remove();
//         };
  
//         startSubscriptions();

//         const intervalId = setInterval(async () => {
//             await appendDataToCSV(accelerometerDataRef.current, 'accData.csv');
//             await appendDataToCSV(gyroscopeDataRef.current, 'gyroData.csv');
//             const combinedData = calculateCombinedData(accelerometerDataRef.current, gyroscopeDataRef.current);
//             if (combinedData.length > 0) {
//                 runInference(combinedData);
//             }
//             setAccelerometerData([]);
//             setGyroscopeData([]);
//         }, 15000);
      

//         return () => {
//             clearInterval(intervalId); // Cleanup interval on unmount
//             stopSubscriptions();
//         };
//     }, []);

//     useEffect(() => {
//       accelerometerDataRef.current = accelerometerData;
//       gyroscopeDataRef.current = gyroscopeData; // Update the ref value whenever accelerometerData changes
//   }, [accelerometerData, gyroscopeData]);


//   const runInference = async (combinedData: number[]) => {
//     try {


//         const modelManager = ModelManager.getInstance();
//         const inputData = new Float32Array(combinedData);
//         const predictionResult = await modelManager.getPrediction(inputData);
//         const valueMap: Record<string, string> = {
//           'D': 'sėdėjimas',
//           'B': 'bėgimas',
//           'A': 'ėjimas',
//           'E': 'stovėjimas',
//         };

//         if (predictionResult !== null) {
//           console.log('Received prediction:', predictionResult);
//           const state = valueMap[predictionResult];
//           await writeData(state);
//         } else {
//           console.log('Failed to get prediction.');
//         }

        
        
        

        
//     } catch (error) {
//         console.error('Error during inference:', error);
//     }
// };

// const writeData = async (initialContent : string) => {
//     try {
//       // Get the current date and time
//       const currentDate = new Date();
//       const options: Intl.DateTimeFormatOptions = {
//         year: 'numeric',
//         month: 'numeric',
//         day: 'numeric',
//         hour: 'numeric',
//         minute: 'numeric',
//         second: 'numeric',
//         hour12: false,
//         timeZone: 'Europe/Vilnius', // Set the time zone to Lithuania
//       };
      
//       const formattedDate = currentDate.toLocaleString('lt-LT', options);

//       // Load the current count from AsyncStorage and explicitly cast it to a number
//       const count = Number((await load('entryCount')) || 0);

//       // Create the key dynamically based on the count
//       const key = `dataKey${count + 1}`;

//       // Create the new entry
//       const newDataEntry = {
//         date: formattedDate,
//         content: initialContent,
//       };

//       // Save data to AsyncStorage using the dynamically generated key
//       const success = await save(key, newDataEntry);

//       if (success) {
//         console.log('Data successfully written to AsyncStorage:', newDataEntry);

//         // Increment the count and save it back to AsyncStorage
//         await save('entryCount', count + 1);

//       } else {
//         console.error('Failed to write data to AsyncStorage');
//       }
//     } catch (error) {
//       console.error('Error writing data to AsyncStorage:', error);
//     }
//   };

// const calculateCombinedData = (accelerometerData: { x: number; y: number; z: number; }[], gyroscopeData: { x: number; y: number; z: number; }[]) => {
//     console.log("Calculating combined data...");
//     const combinedData: number[] = [];
//     //console.log("Accelerometer data: ")
//     // accelerometerData.forEach((ob) => {
//     //   console.log(`X: ${ob.x}, Y: ${ob.y}, Z: ${ob.z}`)
//     // })

//     // Calculate statistics for accelerometer data
//     if (accelerometerData.length > 0) {
//         const accX = accelerometerData.map(data => data.x);
//         const accY = accelerometerData.map(data => data.y);
//         const accZ = accelerometerData.map(data => data.z);

//         const accStatsX = calculateAxisStats(accX);
//         const accStatsY = calculateAxisStats(accY);
//         const accStatsZ = calculateAxisStats(accZ);

//         combinedData.push(...accStatsX, ...accStatsY, ...accStatsZ);


//         // console.log(1)
//         // console.log(combinedData)

//     }

//     // Calculate statistics for gyroscope data
//     //gyroscopeData = accelerometerData
//     // gyroscopeData.forEach((ob) => {
//     //   console.log(`X: ${ob.x}, Y: ${ob.y}, Z: ${ob.z}`)
//     // })
//     if (gyroscopeData.length > 0) {
//         const gyroX = gyroscopeData.map(data => data.x);
//         const gyroY = gyroscopeData.map(data => data.y);
//         const gyroZ = gyroscopeData.map(data => data.z);

//         const gyroStatsX = calculateAxisStats(gyroX);
//         const gyroStatsY = calculateAxisStats(gyroY);
//         const gyroStatsZ = calculateAxisStats(gyroZ);

//         combinedData.push(...gyroStatsX, ...gyroStatsY, ...gyroStatsZ);
//         // console.log(2)
//         // console.log(combinedData)
//     }


    

//     // loadModelFromCloud(modelUrl)
//     //   .then((session) => {
//     //     if (session) {
//     //       console.log('Model session is ready for inference.');
//     //       const inputData = new Float32Array(combinedData); // Populate with your actual data

//     //       const inputTensor = new Tensor("float32", inputData, [1, 48]); // Assuming input shape is [1, 48]

//     //       const feeds = {"X": inputTensor };
//     //       console.log(session.outputNames);
//     //       const result = session.run(feeds, ["output_label"]);
        
//     //       result.then(output => {
//     //         // Access and log the actual inference results here
//     //         console.log("Prediction result: " + output.output_label.data);
//     //       }).catch(error => {
//     //         console.error('Error during inference:', error);
//     //       });
          
//     //     }
//     //   })
//     //   .catch((error) => console.error(error));

//     return combinedData;
// };

// const calculateAxisStats = (data: number[]) => {
//     const sum = data.reduce((acc, val) => acc + val, 0);
//     const mean = sum / data.length;
//     const max = Math.max(...data);
//     const min = Math.min(...data);
//     const median = calculateMedian(data);
//     const skewness = calculateSkewness(data, mean);
//     const std = calculateStandardDeviation(data, mean);
//     const variance = std ** 2;

//     return [sum, mean, max, min, median, skewness, std, variance];
// };

// const calculateMedian = (data: number[]) => {
//     const sortedData = [...data].sort((a, b) => a - b);
//     const mid = Math.floor(sortedData.length / 2);
//     return sortedData.length % 2 !== 0 ? sortedData[mid] : (sortedData[mid - 1] + sortedData[mid]) / 2;
// };

// const calculateSkewness = (data: number[], mean: number) => {
//     const n = data.length;
//     const skewSum = data.reduce((acc, val) => acc + ((val - mean) ** 3), 0);
//     const std = calculateStandardDeviation(data, mean);
//     return (n / ((n - 1) * (n - 2) * (std ** 3))) * skewSum;
// };

// const calculateStandardDeviation = (data: number[], mean: number) => {
//     const variance = data.reduce((acc, val) => acc + ((val - mean) ** 2), 0) / data.length;
//     return Math.sqrt(variance);
// };            

// return null;



// };

// export default SensorDataRecorder;












