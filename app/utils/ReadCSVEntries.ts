import { NativeModules } from 'react-native';
import SensorDataManager from './ReadSensors'

const { SharedPreferences } = NativeModules;

const sensorDataManager = SensorDataManager.getInstance();

interface SharedPreferencesEntry {
  list: string;
  timestamp: string;
}

interface SharedPreferencesEntries {
  [key: string]: SharedPreferencesEntry;
}

// Function to start the data fetching process
let isProcessing = false;

export function startDataFetchingProcess(): void {
  const intervalId = setInterval(async () => {
    if (isProcessing) {
      return;
    }

    isProcessing = true;

    try {
      const data: string = await SharedPreferences.getAllDataEntries();
      const entries: SharedPreferencesEntries = JSON.parse(data);
      //console.log('Received data:', entries);

      // Processing each entry
      for (const key of Object.keys(entries).sort((a, b) => {
        return new Date(entries[a].timestamp).getTime() - new Date(entries[b].timestamp).getTime();
      })) {
        const { list, timestamp } = entries[key];

        if (list === 'Nejuda') {
          await sensorDataManager.writeData2('sėdėjimas', timestamp);
        } else {
          const dataList = list.split(',').map(Number);
          await sensorDataManager.runInference2(dataList, timestamp);
        }
      }

      // Clear all preferences after processing all entries
      await SharedPreferences.clearAllPreferences();
    } catch (error) {
      console.error('Error fetching SharedPreferences data:', error);
    } finally {
      isProcessing = false;
    }
  }, 5000); // Fetch every 5000 milliseconds (5 seconds)
}




