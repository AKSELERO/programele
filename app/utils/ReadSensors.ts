import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState, useRef } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { gyroscope } from 'react-native-sensors';
import { Asset } from 'expo-asset';
import {
    Tensor,
    TensorflowModel,
    useTensorflowModel,
    loadTensorflowModel
  } from 'react-native-fast-tflite'
  import AsyncStorageUpdater from './StoreState';
  import { load, save } from './storage/storage';
import { write } from 'react-native-fs';
import loadModel from './loadModel'
import RNFS from 'react-native-fs';

const SensorDataRecorder: React.FC = () => {
    class MockAsset {
  // Define a static method to mock Asset.fromModule
  static fromModule(module: any) {
    // Return an object with a mock downloadAsync method
    return {
      downloadAsync: async () => {
        console.log('Mock asset downloaded:', module);
      }
    };
  }
}
      
    
    const [accelerometerData, setAccelerometerData] = useState<{ x: number; y: number; z: number; }[]>([]);
    const accelerometerDataRef = useRef(accelerometerData);
    const [gyroscopeData, setGyroscopeData] = useState<{ x: number; y: number; z: number; }[]>([]);
    const gyroscopeDataRef = useRef(accelerometerData);
  
    useEffect(() => {
        let accelerometerSubscription: { remove: () => void };
        let gyroscopeSubscription: { remove: () => void };
  
        const startSubscriptions = () => {
            console.log("Starting accelerometer subscription");
            accelerometerSubscription = Accelerometer.addListener((data) => {
                setAccelerometerData((prevData) => [...prevData, data]);
            });
            gyroscopeSubscription = Gyroscope.addListener((data) => {
                setGyroscopeData((prevData) => [...prevData, data]);
            });
        };
  
        const stopSubscriptions = () => {
            console.log("Stopping accelerometer subscription");
            accelerometerSubscription.remove();
            gyroscopeSubscription.remove();
        };
  
        startSubscriptions();

        const intervalId = setInterval(() => {
            const combinedData = calculateCombinedData(accelerometerDataRef.current, gyroscopeDataRef.current);
            if (combinedData.length > 0) {
                runInference(combinedData);
            }
            setAccelerometerData([]);
            setGyroscopeData([]);
        }, 15000);
        
        

    //   const runInference = async (combinedData: number[]) => {
    //     try {
    //         // Load TensorFlow Lite model
    //         const model = await tf.loadGraphModel('model.tflite');
    
    //         // Convert combinedData array to Float32Array
            
    
    //         // Prepare input tensor
    //         const inputTensor = tf.tensor2d([combinedData], [1, combinedData.length]);
    
    //         // Run inference
    //         const outputTensor = model.predict(inputTensor) as tf.Tensor;
    //         const prediction = await outputTensor.data();
    
    //         // Dispose tensors
    //         inputTensor.dispose();
    //         outputTensor.dispose();
    
    //         // Handle prediction
    //         console.log('Prediction:', prediction);
    
    //         // Unload the model to free up memory
    //         model.dispose();
    //     } catch (error) {
    //         console.error('Error during inference:', error);
    //     }
    // };

      

        return () => {
            clearInterval(intervalId); // Cleanup interval on unmount
            stopSubscriptions();
        };
    }, []);

    useEffect(() => {
      accelerometerDataRef.current = accelerometerData;
      gyroscopeDataRef.current = gyroscopeData; // Update the ref value whenever accelerometerData changes
  }, [accelerometerData, gyroscopeData]);


  const runInference = async (combinedData: number[]) => {
    try {

        console.log(combinedData)
        const randomDecimal = Math.random();

  
        const randomNumber = Math.floor(randomDecimal * 4) + 1;

        
        const valueMap: Record<number, string> = {
            1: 'sėdėjimas',
            2: 'bėgimas',
            3: 'ėjimas',
            4: 'gulėjimas',
          };
        const state = valueMap[randomNumber];
        await writeData(state);

        
    } catch (error) {
        console.error('Error during inference:', error);
    }
};

const writeData = async (initialContent : string) => {
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

const calculateCombinedData = (accelerometerData: { x: number; y: number; z: number; }[], gyroscopeData: { x: number; y: number; z: number; }[]) => {
    //console.log("Calculating combined data...");
    const combinedData: number[] = [];
    //console.log(accelerometerData)

    // Calculate statistics for accelerometer data
    if (accelerometerData.length > 0) {
        const accX = accelerometerData.map(data => data.x);
        const accY = accelerometerData.map(data => data.y);
        const accZ = accelerometerData.map(data => data.z);

        const accStatsX = calculateAxisStats(accX);
        const accStatsY = calculateAxisStats(accY);
        const accStatsZ = calculateAxisStats(accZ);

        combinedData.push(...accStatsX, ...accStatsY, ...accStatsZ);


        // console.log(1)
        // console.log(combinedData)

    }

    // Calculate statistics for gyroscope data
    if (gyroscopeData.length > 0) {
        const gyroX = gyroscopeData.map(data => data.x);
        const gyroY = gyroscopeData.map(data => data.y);
        const gyroZ = gyroscopeData.map(data => data.z);

        const gyroStatsX = calculateAxisStats(gyroX);
        const gyroStatsY = calculateAxisStats(gyroY);
        const gyroStatsZ = calculateAxisStats(gyroZ);

        combinedData.push(...gyroStatsX, ...gyroStatsY, ...gyroStatsZ);
        // console.log(2)
        // console.log(combinedData)
    }
    //give input combineddata
    
  //   const modelAsset = Asset.fromModule(require('../assets/ML_Models/model.tflite'));
  //   await modelAsset.downloadAsync();
  //   const model = await loadTensorflowModel(modelAsset.localUri);
    //const model = await rntf.loadTensorflowModel(require('../ML_Models/model.tflite'))
    //console.log(combinedData)
    //make prediction with combinedData
    // try {
    //   const modelAsset = Asset.fromModule(require('app/ML_Models/model.tflite'));
    //   //await modelAsset.downloadAsync();
    //   const modelPath: string = modelAsset.localUri || modelAsset.uri;
    //   console.log(1)
    //   const model = await tf.loadGraphModel(modelPath);
    //   console.log(2)
    //   // Prepare input data
    //   const inputDataTensor = tf.tensor2d([combinedData], [1, combinedData.length]);

    //   // Run inference
    //   const outputTensor = model.predict(inputDataTensor) as tf.Tensor;
    //   const prediction = await outputTensor.data();
    //   console.log('Prediction:', prediction);

    //   // Dispose tensors
    //   inputDataTensor.dispose();
    //   outputTensor.dispose();
    //   } catch (error) {
    //       console.error('Error during prediction:', error);
    //   }
    
    // Perform prediction using combinedData
     //console.log(combinedData);
    // console.log(combinedData.length)



    // const float32Arr = new Float32Array(combinedData.length);
    //   for (let i = 0; i < combinedData.length; i++) {
    //       float32Arr[i] = combinedData[i];
    //   }
    //   const modelPath: string = "../ML_Models/rrandom_forest.onnx";
    //   console.log(1)
    //   const session: InferenceSession = await InferenceSession.create(modelPath);
    //   console.log(2);
      
    

    // Pass prediction to the parent component
    // onCombinedDataProcessed(prediction);

    const assetPath = require('../../assets/ML_Models/random_forest.onnx');
    console.log(assetPath);
    // Call the function
    loadModel()
      .then((session) => {
        if (session) {
          console.log('Model session is ready for inference.');
          // Perform further operations with the session
        }
      })
    .catch((error) => console.error(error));

    return combinedData;
};

const calculateAxisStats = (data: number[]) => {
    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / data.length;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const median = calculateMedian(data);
    const skewness = calculateSkewness(data, mean);
    const std = calculateStandardDeviation(data, mean);
    const variance = std ** 2;

    return [sum, mean, max, min, median, skewness, std, variance];
};

const calculateMedian = (data: number[]) => {
    const sortedData = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sortedData.length / 2);
    return sortedData.length % 2 !== 0 ? sortedData[mid] : (sortedData[mid - 1] + sortedData[mid]) / 2;
};

const calculateSkewness = (data: number[], mean: number) => {
    const n = data.length;
    const skewSum = data.reduce((acc, val) => acc + ((val - mean) ** 3), 0);
    const std = calculateStandardDeviation(data, mean);
    return (n / ((n - 1) * (n - 2) * (std ** 3))) * skewSum;
};

const calculateStandardDeviation = (data: number[], mean: number) => {
    const variance = data.reduce((acc, val) => acc + ((val - mean) ** 2), 0) / data.length;
    return Math.sqrt(variance);
};            

return null;



};

export default SensorDataRecorder;










