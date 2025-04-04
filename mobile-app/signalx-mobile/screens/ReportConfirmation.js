import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, styles } from '../constants/styles';
import { AppContext } from '../context/AppContext';

const ReportConfirmation = ({ route, navigation }) => {
  const { imageUri, location } = route.params;
  const { addReport, updateTrustScore } = useContext(AppContext);

  const confirmReport = () => {
    const newReport = {
      id: Date.now(),
      imageUri,
      location,
      timestamp: new Date().toISOString(),
      verified: false,
    };
    
    addReport(newReport);
    updateTrustScore(5); // Increase trust score for reporting
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Report</Text>
      
      <Image 
        source={{ uri: imageUri }} 
        style={{ width: '100%', height: 300, borderRadius: 10, marginVertical: 20 }}
      />
      
      <Text style={{ marginBottom: 20 }}>
        Location: {location ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : 'Unknown'}
      </Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.success }]}
        onPress={confirmReport}
      >
        <Text style={styles.buttonText}>CONFIRM REPORT</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.danger }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>CANCEL</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReportConfirmation;