// import RNFS from 'react-native-fs';
import * as FileSystem from 'expo-file-system';
import { load, save } from './storage/storage';


interface SensorData {
    x: number;
    y: number;
    z: number;
    timestamp: number; // Time in ticks
    elapsedTime: number; // Seconds elapsed since reading started
}

interface RotationSensor {
  alpha: number;
  beta: number;
  gamma: number;
  timestamp: number; // Time in ticks
  elapsedTime: number; // Seconds elapsed since reading started
}


export const appendDataToCSV = async (data: SensorData[] | RotationSensor[], filename: string): Promise<void> => {

    const state = String((await load('ReadState')));
    if (state != null){
        filename = state + filename;
    }
    console.log(filename);
    // const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
    const path = `${FileSystem.documentDirectory}/${filename}`;
    let csvContent = '';

    data.forEach((item) => {
      if ('x' in item && 'y' in item && 'z' in item && 'timestamp' in item && 'elapsedTime' in item) {
          // If item is SensorData
          const { x, y, z, timestamp, elapsedTime } = item as SensorData;
          const csvLine = `${timestamp},${elapsedTime},${x},${y},${z}\n`;
          csvContent += csvLine;
      } else if ('alpha' in item && 'beta' in item && 'gamma' in item && 'timestamp' in item && 'elapsedTime' in item) {
          // If item is RotationSensor
          const { alpha, beta, gamma, timestamp, elapsedTime } = item as RotationSensor;
          const csvLine = `${timestamp},${elapsedTime},${alpha},${beta},${gamma}\n`;
          csvContent += csvLine;
      } else {
          // Handle unknown type or log error
          console.error('Unknown type encountered:', item);
      }
  });

    // Append the new content to the file
    // await RNFS.appendFile(path, csvContent, 'utf8').catch((err) => console.log(err.message));
    try {
        await FileSystem.writeAsStringAsync(path, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
    } catch (err: any) {
        console.log(err.message);
    }
};

