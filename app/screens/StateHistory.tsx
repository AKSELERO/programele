import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, FlatList, StyleSheet, ViewStyle } from 'react-native';
import { clear, load, remove } from '../utils/storage/storage';
import { colors, spacing } from "../theme"
import { Button, ListItem, Screen, Text } from "../components"
import { NativeModules } from 'react-native';
import { stopBackgroundService } from '../utils/BackGroundTask'
import Setstate from './SetState'

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
        const fetchedData: StoredData[] = [];
        for (let i = prevEntryCount + 1; i <= count; i++) {
          const key = `dataKey${i}`;
          const storedData = await load(key);

          if (storedData) {
            fetchedData.push(storedData as StoredData);
            console.log(`Read data from key ${key}:`, storedData);
          } else {
            console.log(`No data found for key ${key}`);
          }
        }

        if (fetchedData.length > 0) {
          console.log('New entries found. Updating data...');
          setData((prevData) => [...prevData, ...fetchedData]);
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

  async function StopDataRecording(){
    console.log(11111111);
    SensorService.stopService();
    await stopBackgroundService();
  }

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 15000);
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
      <Text preset="heading" text="Debug" />
      <Button text="Stop Sensor recording" preset='reversed' onPress={StopDataRecording} style={$buttonStyle}/>
      <Button text="Clear All" preset='reversed' onPress={clearAllData} style={$buttonStyle}/>
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
}

const $buttonStyle: ViewStyle = {
  flex: 1,
  padding: spacing.xl,
  backgroundColor: colors.palette.secondary500,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#fff', // Ensure a light background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Ensure a light background
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#000', // Set text color to black for visibility against a light background
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
    color: '#000', // Set header text color to black for visibility
  },
});


export default DataDisplay;





