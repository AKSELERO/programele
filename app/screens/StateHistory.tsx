import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Button } from 'react-native';
import { clear, load, remove } from '../utils/storage/storage';

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
    <View style={styles.container}>
      <Button title="Clear All" onPress={clearAllData} />
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
    paddingTop: 40
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




