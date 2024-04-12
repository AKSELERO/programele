import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { load, save } from '../utils/storage/storage';

const Setstate = () => {
  // Function to handle button press
  const handlePress = async (activity: string) => {
    try {
        const success = await save('ReadState', activity);
      // Optional: Feedback to show the saved value
      Alert.alert('Saved', `Activity ${activity} saved successfully.`);
    } catch (error) {
      // Handling error scenario
      Alert.alert('Error', 'Failed to save the activity.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Button for Sėdėjimas */}
      <Button title="Sėdėjimas" onPress={() => handlePress('Sėdėjimas')} />
      {/* Button for Stovėjimas */}
      <Button title="Stovėjimas" onPress={() => handlePress('Stovėjimas')} />
      {/* Button for Ėjimas */}
      <Button title="Ėjimas" onPress={() => handlePress('Ėjimas')} />
      {/* Button for Bėgimas */}
      <Button title="Bėgimas" onPress={() => handlePress('Bėgimas')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default Setstate;
