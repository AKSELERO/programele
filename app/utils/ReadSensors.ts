import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState, useRef } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { gyroscope } from 'react-native-sensors';
import { Asset } from 'expo-asset';

  import AsyncStorageUpdater from './StoreState';
  import { load, save } from './storage/storage';
import { write } from 'react-native-fs';
import loadModelFromCloud from './loadModel'
import RNFS from 'react-native-fs';
import { Tensor } from 'onnxruntime-react-native';
import { InferenceSession } from 'onnxruntime-react-native';

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
      const predictionResult = output["output_label"].data;
      console.log("Prediction result: ", predictionResult);

      return predictionResult; // Return the prediction result
    } catch (error) {
      console.error('Error during inference:', error);
      return null; // Indicate error condition
    }
  }
}

const SensorDataRecorder: React.FC = () => {
    const [accelerometerData, setAccelerometerData] = useState<{ x: number; y: number; z: number; }[]>([]);
    const accelerometerDataRef = useRef(accelerometerData);
    const [gyroscopeData, setGyroscopeData] = useState<{ x: number; y: number; z: number; }[]>([]);
    const gyroscopeDataRef = useRef(accelerometerData);
    const modelUrl = 'https://drive.google.com/uc?export=download&id=1j8t-4VPG4s-ow4TvWzo5zr1CYVxRrJF8'; //onnx
    //const modelUrl = 'https://drive.google.com/uc?export=download&id=1_pTQnQgPkpj89kH9HePESt1ansr7HsPV'; //ort
    const [modelLoaded, setModelLoaded] = useState(false);

    useEffect(() => {
      // Retrieve the singleton instance of ModelManager here
      const modelManager = ModelManager.getInstance();

      const loadModelAsync = async () => {
          if (!modelLoaded) {
              await modelManager.loadModel(modelUrl);
              setModelLoaded(true); // Indicate that the model is loaded
          }
      };

      loadModelAsync();
    }, [modelLoaded]);

    useEffect(() => {
        let accelerometerSubscription: { remove: () => void };
        let gyroscopeSubscription: { remove: () => void };
  
        const startSubscriptions = () => {
            Accelerometer.setUpdateInterval(50);
            Gyroscope.setUpdateInterval(50);
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

        const intervalId = setInterval(async () => {
            const combinedData = calculateCombinedData(accelerometerDataRef.current, gyroscopeDataRef.current);
            if (combinedData.length > 0) {
                runInference(combinedData);
            }
            setAccelerometerData([]);
            setGyroscopeData([]);
        }, 15000);
      

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


        const modelManager = ModelManager.getInstance();
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
          await writeData(state);
        } else {
          console.log('Failed to get prediction.');
        }

        
        
        

        
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

        const accStatsX = calculateAxisStats(accX);
        const accStatsY = calculateAxisStats(accY);
        const accStatsZ = calculateAxisStats(accZ);

        combinedData.push(...accStatsX, ...accStatsY, ...accStatsZ);


        // console.log(1)
        // console.log(combinedData)
    }

    

    // Calculate statistics for gyroscope data
    //gyroscopeData = accelerometerData
    // gyroscopeData.forEach((ob) => {
    //   console.log(`X: ${ob.x}, Y: ${ob.y}, Z: ${ob.z}`)
    // })

    if (gyroscopeData.length <= 0) {
        gyroscopeData = accelerometerData
        console.log("No gyroscope found:(")
    }

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










