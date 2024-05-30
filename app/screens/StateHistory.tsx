import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, FlatList, StyleSheet, ViewStyle } from 'react-native';
import { clear, load, save } from '../utils/storage/storage';
import { colors, spacing } from "../theme";
import { Button, Screen, Text } from "../components";
import { NativeModules } from 'react-native';
import { stopBackgroundService } from '../utils/BackGroundTask';

const { SensorService } = NativeModules;

interface StoredData {
  content: string;
  date: string;
}

const DataDisplay: React.FC = () => {
  const [data, setData] = useState<StoredData[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevEntryCount, setPrevEntryCount] = useState(0);

  const fetchData = async () => {
    try {
      const count = Number((await load('entryCount')) || 0);

      if (count > prevEntryCount) {
        const fetchedData: { key: string, data: StoredData }[] = [];
        for (let i = prevEntryCount + 1; i <= count; i++) {
          const key = `dataKey${i}`;
          const storedData = await load(key) as StoredData;

          if (storedData) {
            const today = new Date().toISOString().split('T')[0];
            if (storedData.date.startsWith(today)) {
              fetchedData.push({ key, data: storedData });
              console.log(`Read data from key ${key}:`, storedData);
            }
          } else {
            console.log(`No data found for key ${key}`);
          }
        }

        if (fetchedData.length > 0) {
          console.log('New entries found. Updating data...');
          setData((prevData) => {
            const updatedData = [...prevData, ...fetchedData.map(item => item.data)];
            return updatedData.sort((a, b) => {
              const aKey = fetchedData.find(item => item.data === a)?.key || '';
              const bKey = fetchedData.find(item => item.data === b)?.key || '';
              return bKey.localeCompare(aKey); // Sort by key in descending order
            });
          });
        }

        setPrevEntryCount(count);
      }
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    try {
      clear();
      setData([]);
      setPrevEntryCount(0);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  async function StopDataRecording() {
    const initialContent = "gulėjimas";
    const initialDay = "2024-05-29"; // Define your constant day here
    const numberOfEntries = 10
    // Load the current count
    const count = Number((await load('entryCount')) || 0);

    // Initialize the base date with the constant day
    let currentDate = new Date(`${initialDay}T15:00:00`);

    // Loop to create the specified number of entries
    for (let i = 0; i < numberOfEntries; i++) {
      // Create the key dynamically based on the count
      const key = `dataKey${count + i + 1}`;

      // Format the date as yyyy-mm-dd hh-mm-ss
      const formattedDate = currentDate.toISOString().replace('T', ' ').substring(0, 19);

      // Create the new entry
      const newDataEntry = {
        date: formattedDate,
        content: initialContent,
      };

      // Save data to AsyncStorage using the dynamically generated key
      const success = await save(key, newDataEntry);
      if (success) {
        console.log(`Data saved with key: ${key}`);
      } else {
        console.log(`Failed to save data with key: ${key}`);
      }

      // Increment the date by one second
      currentDate.setSeconds(currentDate.getSeconds() + 5);
    }

    // Update the entry count in AsyncStorage
    await save('entryCount', (count + numberOfEntries).toString());
  }

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [prevEntryCount]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      <Text preset="heading" text="Įrašų istorija" />
      <Button text="Stop Sensor recording" preset='reversed' onPress={StopDataRecording} style={$buttonStyle} />
      <Button text="Ištrinti įrašus" preset='reversed' onPress={clearAllData} style={$buttonStyle} />
      {data.length === 0 ? (
        <Text>No data available</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.date}</Text>
              <Text style={styles.cell}>{item.content}</Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text style={styles.headerText}>Data</Text>
              <Text style={styles.headerText}>Būsena</Text>
            </View>
          )}
        />
      )}
    </Screen>
  );
};

const $screenContentContainer: ViewStyle = {
  flex: 1,
  padding: spacing.lg,
  gap: spacing.md
};

const $buttonStyle: ViewStyle = {
  flex: 1,
  padding: spacing.xl,
  backgroundColor: colors.palette.secondary500,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
});

export default DataDisplay;






