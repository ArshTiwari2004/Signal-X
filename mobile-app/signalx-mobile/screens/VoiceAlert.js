import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Replace with your Gemini API key
import { GEMINI_API_KEY } from '../config/apiConfig';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [processedResult, setProcessedResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [recording, setRecording] = useState(null);
  
  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Setup audio recording permissions
  useEffect(() => {
    (async () => {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      } catch (error) {
        console.error('Failed to get audio recording permissions', error);
      }
    })();
  }, []);

  // Animation for pulse effect
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isListening]);

  // Animation for alert
  useEffect(() => {
    if (showAlert) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowAlert(false));
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const startRecording = async () => {
    try {
      setIsListening(true);
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error('Failed to start recording', error);
      setIsListening(false);
    }
  };

  const stopRecordingAndTranscribe = async () => {
    try {
      console.log('Stopping recording..');
      if (!recording) return;
      
      await recording.stopAndUnloadAsync();
      setRecording(null);
      setIsListening(false);
      simulateTranscription();
    } catch (error) {
      console.error('Failed to stop recording', error);
      setIsListening(false);
    }
  };

  const simulateTranscription = () => {
    const demoTexts = [
      "Be aware there are ambulances behind",
      "Patient reporting chest pain and difficulty breathing",
      "Traffic is heavy on the main road",
      "Emergency vehicles approaching from the north",
    ];
    
    const text = demoTexts[Math.floor(Math.random() * demoTexts.length)];
    setTranscription(text);
    processWithGemini(text);
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecordingAndTranscribe();
    } else {
      startRecording();
    }
  };

  const processWithGemini = async (text) => {
    try {
      setIsProcessing(true);
      
      // Use the correct model name
      const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
      
      const prompt = `
        Analyze the following text from an ambulance driver report and identify the emergency situation.
        If it mentions "ambulances behind" or any similar emergency vehicle alert, flag it as an EMERGENCY VEHICLE ALERT.
        If it mentions a medical emergency, categorize it appropriately.
        Return ONLY the categorized alert in ALL CAPS, with no additional text.
        
        Text: "${text}"
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const processedText = response.text().trim();
      
      setProcessedResult(processedText);
      
      if (text.toLowerCase().includes('ambulances behind') || 
          processedText.includes('EMERGENCY VEHICLE ALERT')) {
        setShowAlert(true);
        
        Speech.speak(processedText || 'EMERGENCY VEHICLE ALERT', {
          rate: 1.2,
          pitch: 1.1,
          volume: 1.0,
        });
      }
      
    } catch (error) {
      console.error('Error processing with Gemini:', error);
      Alert.alert('Error', 'Failed to process voice command with Gemini API. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#3949ab', '#3f51b5']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <Text style={styles.headerText}>Ambulance Voice Alert</Text>
      </View>
      
      {showAlert && (
        <Animated.View style={[styles.alertContainer, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#d50000', '#ff1744']}
            style={styles.alertGradient}
          >
            <Icon name="ambulance" size={40} color="#ffffff" style={styles.alertIcon} />
            <Text style={styles.alertText}>
              {processedResult || 'AMBULANCES BEHIND'}
            </Text>
          </LinearGradient>
        </Animated.View>
      )}
      
      <View style={styles.transcriptionContainer}>
        {transcription ? (
          <Text style={styles.transcriptionText}>{transcription}</Text>
        ) : (
          <Text style={styles.placeholderText}>
            Press the microphone button and speak...
          </Text>
        )}
      </View>
      
      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}
      
      <Animated.View style={[styles.micButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity
          style={[
            styles.micButton,
            isListening ? styles.micButtonActive : null,
          ]}
          onPress={toggleListening}
          activeOpacity={0.7}
        >
          <Icon
            name={isListening ? 'microphone' : 'microphone-outline'}
            size={40}
            color={isListening ? '#ffffff' : '#3f51b5'}
          />
        </TouchableOpacity>
      </Animated.View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isListening ? 'Listening...' : 'Ready'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  alertContainer: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  alertGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: 15,
  },
  alertText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  transcriptionContainer: {
    flex: 1,
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    justifyContent: 'center',
  },
  transcriptionText: {
    fontSize: 18,
    color: '#212121',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  processingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  processingText: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 16,
  },
  micButtonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  micButtonActive: {
    backgroundColor: '#f44336',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 16,
  }
});

export default App;