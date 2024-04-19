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

export const appendDataToCSV = async (data: SensorData[], filename: string): Promise<void> => {

    const state = String((await load('ReadState')));
    if (state != null){
        filename = state + filename;
    }
    console.log(filename);
    // const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
    const path = `${FileSystem.documentDirectory}/${filename}`;
    let csvContent = '';

    // Check if the file exists and create it if it doesn't
    const fileInfo = await FileSystem.getInfoAsync(path);
    const fileExists = fileInfo.exists;
    if (!fileExists) {
        // Adjust the CSV header to reflect your data structure
        csvContent += 'Timestamp (ms),Elapsed Time (s),X,Y,Z\n';
    }

    // Convert each data point to a CSV string
    data.forEach((item) => {
        const { elapsedTime, timestamp, x, y, z } = item;
        const csvLine = `${timestamp},${elapsedTime},${x},${y},${z}\n`;
        csvContent += csvLine;
    });

    // Append the new content to the file
    // await RNFS.appendFile(path, csvContent, 'utf8').catch((err) => console.log(err.message));
    try {
        await FileSystem.writeAsStringAsync(path, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
    } catch (err: any) {
        console.log(err.message);
    }
};

