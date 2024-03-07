// AsyncStorageUpdater.tsx
import React, { useEffect } from 'react';
import { load, save } from './storage/storage';

const AsyncStorageUpdater: React.FC = () => {
    useEffect(() => {
      const writeData = async () => {
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
            content: 'test',
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
  
      // Set up an interval to write data every minute (60,000 milliseconds)
      const intervalId = setInterval(writeData, 10000);
  
      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }, []);
  
    return null; // You can return null as this component doesn't render any UI
  };
  

export default AsyncStorageUpdater;

