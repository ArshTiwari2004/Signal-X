import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { styles } from '../constants/styles';
import { colors } from '../constants/colors';
import ReportBlockageButton from '../components/ReportBlockageButton';
import EmergencyAlert from '../components/EmergencyAlert';
import LiveTrafficLight from '../components/LiveTrafficLight';
import TrustScore from '../components/TrustScore';
import { AppContext } from '../context/AppContext';

const HomeScreen = ({ navigation }) => {
  const { emergencyAlerts, trustScore } = useContext(AppContext);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Signal-X SOS</Text>
      
      {/* Emergency Alerts */}
      {emergencyAlerts.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          {emergencyAlerts.map((alert, index) => (
            <EmergencyAlert key={index} alert={alert} />
          ))}
        </View>
      )}

      {/* Main Report Button */}
      <ReportBlockageButton navigation={navigation} />

      {/* Trust Score */}
      <TrustScore score={trustScore} />

      {/* Live Traffic Light Status */}
      <LiveTrafficLight />
    </ScrollView>
  );
};

export default HomeScreen;