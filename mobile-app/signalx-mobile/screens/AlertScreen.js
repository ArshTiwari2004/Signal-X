import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { colors } from '../styles/colors';
import { colors } from '../constants/colors';

const AlertScreen = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      vehicle: 'Ambulance',
      distance: '1.2 km',
      time: '2 mins',
      direction: 'North',
      verified: true,
      critical: true
    },
    {
      id: 2,
      vehicle: 'Fire Truck',
      distance: '3.5 km',
      time: '5 mins',
      direction: 'East',
      verified: true,
      critical: false
    },
    {
      id: 3,
      vehicle: 'Police',
      distance: '0.8 km',
      time: '1 min',
      direction: 'West',
      verified: false,
      critical: true
    }
  ]);

  // Animation for critical alerts
  const pulseAnim = new Animated.Value(1);
  
  useEffect(() => {
    if (alerts.some(alert => alert.critical)) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 500,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          })
        ])
      ).start();
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="alert-circle" size={32} color={colors.danger} />
        <Text style={styles.headerText}>Emergency Alerts</Text>
      </View>

      {alerts.map((alert) => (
        <Animated.View 
          key={alert.id}
          style={[
            styles.alertCard,
            alert.critical && { transform: [{ scale: pulseAnim }] },
            alert.critical && styles.criticalAlert
          ]}
        >
          <View style={styles.alertHeader}>
            <Text style={styles.vehicleText}>{alert.vehicle}</Text>
            {alert.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="white" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          <View style={styles.alertBody}>
            <View style={styles.alertRow}>
              <Ionicons name="location" size={20} color={colors.text} />
              <Text style={styles.alertText}>Approaching from {alert.direction}</Text>
            </View>

            <View style={styles.alertRow}>
              <Ionicons name="speedometer" size={20} color={colors.text} />
              <Text style={styles.alertText}>{alert.distance} away</Text>
            </View>

            <View style={styles.alertRow}>
              <Ionicons name="time" size={20} color={colors.text} />
              <Text style={styles.alertText}>ETA: {alert.time}</Text>
            </View>
          </View>

          {alert.critical && (
            <View style={styles.criticalTag}>
              <Text style={styles.criticalText}>URGENT</Text>
            </View>
          )}
        </Animated.View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Last updated: {new Date().toLocaleTimeString()}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 10,
    color: colors.text,
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  criticalAlert: {
    borderLeftWidth: 5,
    borderLeftColor: colors.danger,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    paddingBottom: 10,
  },
  vehicleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
  },
  alertBody: {
    marginVertical: 10,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  alertText: {
    fontSize: 16,
    marginLeft: 10,
    color: colors.text,
  },
  criticalTag: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: colors.danger,
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 15,
  },
  criticalText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    marginTop: 10,
    alignItems: 'center',
  },
  footerText: {
    color: colors.text,
    opacity: 0.6,
    fontSize: 14,
  },
});

export default AlertScreen;