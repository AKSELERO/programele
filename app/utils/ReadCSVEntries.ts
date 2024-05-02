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
export function startDataFetchingProcess(): void {
  const intervalId = setInterval(() => {
    SharedPreferences.getAllDataEntries()
      .then((data: string) => {
        const entries: SharedPreferencesEntries = JSON.parse(data);
        console.log('Received data:', entries);

        // Processing each entry
        Object.entries(entries).forEach(([key, { list, timestamp }]) => {
          console.log('list data:', list);
          if (list == 'Nejuda'){
            sensorDataManager.writeData2(list, timestamp);
          }
          else {
            const dataList = list.split(',').map(Number);
            sensorDataManager.runInference2(dataList, timestamp);
          }
          
          // Example of processing each list
        //   dataList.forEach((item, index) => {
        //     console.log(`Item ${index}: ${item} at ${timestamp}`);
        //   });
        });
      })
      .catch((error: Error) => {
        console.error('Error fetching SharedPreferences data:', error);
      });
      SharedPreferences.clearAllPreferences();
  }, 15000); // Fetch every 10000 milliseconds (10 seconds)

  
}




