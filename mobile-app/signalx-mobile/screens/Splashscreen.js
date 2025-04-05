import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native';
import { colors } from '../constants/colors';
import { styles } from '../constants/styles';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(0.8)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Create spinning animation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Animated pulse effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Spinning animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, [pulseAnim, spinValue]);

  useEffect(() => {
    // Initial animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigation timeout
    const timer = setTimeout(() => {
      // Fade out before navigation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        navigation.navigate('Login');
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={[styles.container, localStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Background design elements */}
      <Animated.View 
        style={[
          localStyles.backgroundDesign,
          {
            transform: [{ rotate: spin }],
            opacity: 0.1
          }
        ]}
      />
      
      <Animated.View 
        style={[
          localStyles.contentContainer,
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Logo with pulse effect */}
        <View style={localStyles.logoWrapper}>
          <Animated.View 
            style={[
              localStyles.logoGlow,
              { 
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.6],
                }),
                transform: [{ scale: pulseAnim }]
              }
            ]} 
          />
          <View style={localStyles.logo}>
            <Text style={localStyles.logoText}>SX</Text>
          </View>
        </View>
        
        <Text style={localStyles.title}>Signal-X SOS</Text>
        <Text style={[styles.subtitle, localStyles.subtitle]}>Helping emergency vehicles save time</Text>
        
        {/* Custom animated activity indicator */}
        <View style={localStyles.loaderContainer}>
          <ActivityIndicator size="small" color={colors.accent || "#ffffff"} />
          <Animated.View 
            style={[
              localStyles.progressBar, 
              { 
                transform: [
                  { 
                    scaleX: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1]
                    })
                  }
                ]
              }
            ]} 
          />
        </View>
        
        {/* Decorative elements */}
        <Animated.View 
          style={[
            localStyles.circleDecoration,
            {
              top: screenHeight * 0.25,
              right: screenWidth * 0.15,
              transform: [{scale: pulseAnim.interpolate({
                inputRange: [0.8, 1.2],
                outputRange: [1.0, 0.7]
              })}]
            }
          ]} 
        />
        
        <Animated.View 
          style={[
            localStyles.circleDecoration,
            {
              bottom: screenHeight * 0.3,
              left: screenWidth * 0.1,
              opacity: 0.3,
              transform: [{scale: pulseAnim.interpolate({
                inputRange: [0.8, 1.2],
                outputRange: [0.6, 1.0]
              })}]
            }
          ]} 
        />
      </Animated.View>
      
      {/* Additional decorative elements */}
      <Animated.View 
        style={[
          localStyles.emergencyStripe,
          {
            top: screenHeight * 0.12,
            transform: [
              { 
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-screenWidth, 0]
                })
              }
            ]
          }
        ]} 
      />
      
      <Animated.View 
        style={[
          localStyles.emergencyStripe,
          {
            bottom: screenHeight * 0.12,
            transform: [
              { 
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [screenWidth, 0]
                })
              }
            ]
          }
        ]} 
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background || '#04102D', // Deep blue background
    overflow: 'hidden',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 10,
  },
  backgroundDesign: {
    position: 'absolute',
    width: Dimensions.get('window').width * 1.5,
    height: Dimensions.get('window').width * 1.5,
    borderWidth: 40,
    borderColor: colors.primaryLight || 'rgba(255, 59, 48, 0.1)',
    borderRadius: Dimensions.get('window').width * 0.75,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary || '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: colors.primary || '#FF3B30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.primary || '#FF3B30',
    zIndex: -1,
  },
  logoText: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 60,
    letterSpacing: 0.2,
    fontWeight: '400',
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  progressBar: {
    height: 2,
    width: Dimensions.get('window').width * 0.4,
    backgroundColor: colors.accent || '#FFFFFF',
    marginLeft: 10,
    transformOrigin: 'left',
  },
  circleDecoration: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary || '#FF3B30',
    opacity: 0.4,
    zIndex: -1,
  },
  emergencyStripe: {
    position: 'absolute',
    height: 6,
    width: '100%',
    backgroundColor: colors.primary || '#FF3B30',
    opacity: 0.6,
  },
});

export default SplashScreen;