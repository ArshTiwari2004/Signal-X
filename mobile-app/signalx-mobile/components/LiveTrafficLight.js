import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import * as Location from 'expo-location';

const LiveTrafficLight = () => {
  const [lightStatus, setLightStatus] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    // Simulate traffic light status (in a real app, this would come from an API)
    const interval = setInterval(() => {
      const statuses = ['red', 'yellow', 'green'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setLightStatus(randomStatus);
      
      // Simulate distance to nearest traffic light
      setDistance(Math.floor(Math.random() * 100));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!lightStatus || distance > 50) return null;

  return (
    <View style={lightStyles.container}>
      <Text style={lightStyles.title}>NEAREST TRAFFIC LIGHT</Text>
      <View style={lightStyles.lightContainer}>
        <View style={[
          lightStyles.light,
          lightStatus === 'red' && { backgroundColor: colors.danger },
        ]} />
        <View style={[
          lightStyles.light,
          lightStatus === 'yellow' && { backgroundColor: colors.warning },
        ]} />
        <View style={[
          lightStyles.light,
          lightStatus === 'green' && { backgroundColor: colors.success },
        ]} />
      </View>
      <Text style={lightStyles.statusText}>
        {lightStatus.toUpperCase()} - {distance}m away
      </Text>
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  title: {
    color: colors.lightText,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  light: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
    backgroundColor: colors.background,
  },
  statusText: {
    color: colors.lightText,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LiveTrafficLight;