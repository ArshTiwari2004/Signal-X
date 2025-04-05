import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const ReportBlockageButton = ({ navigation }) => {
  const handlePress = () => {
    // Provide haptic feedback for button press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('Camera');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Ionicons name="warning" size={32} color="white" />
        <Text style={styles.buttonText}>REPORT BLOCKAGE</Text>
      </TouchableOpacity>
      <Text style={styles.helperText}>
        Tap to report accidents, roadblocks, or broken traffic signals
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#FF3B30', // Ambulance red
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    marginLeft: 12,
  },
  helperText: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  }
});

export default ReportBlockageButton;