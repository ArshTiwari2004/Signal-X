import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const EmergencyAlert = ({ alert }) => {
  return (
    <View style={alertStyles.container}>
      <Text style={alertStyles.title}>🚨 EMERGENCY ALERT</Text>
      <Text style={alertStyles.message}>{alert.message}</Text>
    </View>
  );
};

const alertStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.danger,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    color: colors.lightText,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  message: {
    color: colors.lightText,
    fontSize: 16,
  },
});

export default EmergencyAlert;