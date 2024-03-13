
import { loadModel, runInference } from './ML_Model'; 
import React, { useEffect, useState, useRef } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { gyroscope } from 'react-native-sensors';

const SensorDataRecorder: React.FC = () => {
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
            //console.log("Accelerometer data:", gyroscopeDataRef.current);
            calculateCombinedData(accelerometerDataRef.current, gyroscopeDataRef.current)
            setAccelerometerData([]);
            setGyroscopeData([]);
        }, 15000); // Log data every 15 seconds
        
        const calculateCombinedData = async (accelerometerData: { x: number; y: number; z: number; }[], gyroscopeData: { x: number; y: number; z: number; }[]) => {
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
      
          // Perform prediction using combinedData
           //console.log(combinedData);
          // console.log(combinedData.length)
          (async () => {
            const session = await loadModel();
            if (session) {
                const prediction = await runInference(session, combinedData);
                if (prediction) {
                    console.log("Prediction:", prediction);
                } else {
                    console.error("Failed to get prediction.");
                }
            } else {
                console.error("Failed to load the model.");
            }
        })();
      
          // Pass prediction to the parent component
          // onCombinedDataProcessed(prediction);
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

        return () => {
            clearInterval(intervalId); // Cleanup interval on unmount
            stopSubscriptions();
        };
    }, []);

    useEffect(() => {
      accelerometerDataRef.current = accelerometerData;
      gyroscopeDataRef.current = gyroscopeData; // Update the ref value whenever accelerometerData changes
  }, [accelerometerData, gyroscopeData]);

    return null;
};

export default SensorDataRecorder;










