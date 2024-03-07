import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { load } from '../utils/storage/storage';

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
        // Load entry count from AsyncStorage
        const count = Number((await load('entryCount')) || 0);
  
        // Check if there are any new entries
        if (count > prevEntryCount) {
          // Fetch data for each new key and append to the array
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
  
          // Update data state with new entries
          if (fetchedData.length > 0) {
            console.log('New entries found. Updating data...');
            setData((prevData) => [...prevData, ...fetchedData]);
          }
  
          // Update the previous entry count
          setPrevEntryCount(count);
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      } finally {
        // Set loading state to false regardless of success or failure
        setLoading(false);
      }
    };
  
    useEffect(() => {
      // Fetch initial data
      fetchData();

    // Set up an interval to periodically fetch new data (e.g., every 1 minute)
    const intervalId = setInterval(fetchData, 10000);

    // Clean up the interval on component unmount
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
      <View style={styles.container}>
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
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
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
  },
});

export default DataDisplay;




