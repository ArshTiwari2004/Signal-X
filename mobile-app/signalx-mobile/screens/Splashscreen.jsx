import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../constants/colors';
import { styles } from '../constants/styles';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      // navigation.navigate('MainTabs');
      navigation.navigate('Login')
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.primary }}>Signal-X SOS</Text>
      <Text style={styles.subtitle}>Helping emergency vehicles save time</Text>
    </View>
  );
};

export default SplashScreen;