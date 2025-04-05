// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   StyleSheet, 
//   Dimensions, 
//   TouchableOpacity, 
//   ScrollView, 
//   Image,
//   Platform 
// } from 'react-native';
// import { 
//   Text, 
//   TextInput, 
//   Button, 
//   Chip 
// } from 'react-native-paper';
// import * as Location from 'expo-location';
// import * as ImagePicker from 'expo-image-picker';
// import MapView, { Marker } from 'react-native-maps';
// import { Ionicons } from '@expo/vector-icons';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { colors } from '../constants/colors';
// import { API_URL } from '../config/apiConfig';

// const { width, height } = Dimensions.get('window');

// const IncidentReportScreen = ({ navigation }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [severity, setSeverity] = useState('Medium');
//   const [location, setLocation] = useState(null);
//   const [mediaFiles, setMediaFiles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Location and Permission Setup
//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status === 'granted') {
//         const location = await Location.getCurrentPositionAsync({});
//         setLocation({
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         });
//       }
//     })();
//   }, []);

//   // Media Capture Handler
//   const handleMediaCapture = async (type) => {
//     let result;
  
//     if (type === 'photo') {
//       result = await ImagePicker.launchCameraAsync({
//         mediaTypes: [ImagePicker.MediaType.IMAGE],
//         allowsEditing: true,
//         quality: 0.7,
//       });
//     } else if (type === 'video') {
//       result = await ImagePicker.launchCameraAsync({
//         mediaTypes: [ImagePicker.MediaType.VIDEO],
//         allowsEditing: true,
//         quality: 0.7,
//       });
//     }
  
//     if (!result.canceled && result.assets?.length > 0) {
//       const file = result.assets[0];
//       setMediaFiles(prev => [...prev, {
//         uri: file.uri,
//         type: file.type,
//       }]);
//     }
//   };
  

//   // Submit Incident Report
//   // const handleSubmit = async () => {
//   //   if (!title || !description) {
//   //     alert('Please fill in all required fields');
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);
//   //     // Simulated submission
//   //     await new Promise(resolve => setTimeout(resolve, 2000));
      
//   //     // Reset form or navigate
//   //     navigation.navigate('Dashboard');
//   //   } catch (error) {
//   //     alert('Submission failed');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSubmit = async () => {
//     if (!title || !description) {
//       alert('Please fill in all required fields');
//       return;
//     }
  
//     if (!location) {
//       alert('Location is still being fetched');
//       return;
//     }
  
//     const formData = new FormData();
  
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('severity', severity);
//     formData.append('latitude', location.latitude);
//     formData.append('longitude', location.longitude);
  
//     mediaFiles.forEach((file, index) => {
//       const fileType = file.uri.split('.').pop();
//       formData.append('media', {
//         uri: file.uri,
//         type: file.type === 'video' ? `video/${fileType}` : `image/${fileType}`,
//         name: `media_${index}.${fileType}`
//       });
//     });
  
//     try {
//       setLoading(true);
  
//       const response = await fetch(`${API_URL}/report-incident`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         alert('Incident reported successfully!');
//         navigation.navigate('MainTabs');
//       } else {
//         console.log('Server error:', data);
//         alert('Failed to submit: ' + data?.message || 'Unknown error');
//       }
//     } catch (error) {
//       console.error('Error submitting incident:', error);
//       alert('Submission failed');
//     } finally {
//       setLoading(false);
//     }
//   };  

//   // Remove Media File
//   const removeMediaFile = (index) => {
//     setMediaFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   return (

//       <ScrollView 
//         style={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Screen Title */}
//         <View style={styles.headerContainer}>
//           <Ionicons 
//             name="warning-outline" 
//             size={24} 
//             color={colors.primary} 
//             style={styles.headerIcon}
//           />
//           <Text style={styles.headerTitle}>Report Incident</Text>
//         </View>

//         {/* Incident Title Input */}
//         <TextInput
//           label="Incident Title"
//           value={title}
//           onChangeText={setTitle}
//           mode="outlined"
//           style={styles.input}
//           theme={{ 
//             colors: { 
//               primary: '#0A84FF',
//               background: 'white' 
//             } 
//           }}
//         />

//         {/* Description Input */}
//         <TextInput
//           label="Describe the Incident"
//           value={description}
//           onChangeText={setDescription}
//           mode="outlined"
//           multiline
//           numberOfLines={4}
//           style={styles.input}
//           theme={{ 
//             colors: { 
//               primary: '#0A84FF',
//               background: 'white' 
//             } 
//           }}
//         />

//         {/* Severity Selection */}
//         <View style={styles.severityContainer}>
//           <Text style={styles.sectionTitle}>Severity Level</Text>
//           <View style={styles.chipContainer}>
//             {['Low', 'Medium', 'High'].map((level) => (
//               <Chip
//                 key={level}
//                 selected={severity === level}
//                 onPress={() => setSeverity(level)}
//                 style={[
//                   styles.severityChip,
//                   severity === level && styles[`${level.toLowerCase()}Severity`]
//                 ]}
//                 textStyle={styles.chipText}
//               >
//                 {level}
//               </Chip>
//             ))}
//           </View>
//         </View>

//         {/* Media Capture */}
//         <View style={styles.mediaCaptureContainer}>
//           <Text style={styles.sectionTitle}>Add Media</Text>
//           <View style={styles.mediaButtonContainer}>
//             <TouchableOpacity 
//               style={styles.mediaButton}
//               onPress={() => handleMediaCapture('photo')}
//             >
//               <Ionicons name="camera" size={24} color="#0A84FF" />
//               <Text style={styles.mediaButtonText}>Photo</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.mediaButton}
//               onPress={() => handleMediaCapture('video')}
//             >
//               <Ionicons name="videocam" size={24} color="#0A84FF" />
//               <Text style={styles.mediaButtonText}>Video</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Media Preview */}
//           <ScrollView 
//             horizontal 
//             style={styles.mediaPreviewContainer}
//             showsHorizontalScrollIndicator={false}
//           >
//             {mediaFiles.map((media, index) => (
//               <View key={index} style={styles.mediaPreviewItem}>
//                 <Image 
//                   source={{ uri: media.uri }} 
//                   style={styles.mediaPreview}
//                 />
//                 <TouchableOpacity 
//                   style={styles.removeMediaButton}
//                   onPress={() => removeMediaFile(index)}
//                 >
//                   <Ionicons name="close" size={16} color="white" />
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </View>

//         {/* Location */}
//         {location && (
//           <View style={styles.locationContainer}>
//             <Text style={styles.sectionTitle}>Location</Text>
//             <MapView
//               style={styles.map}
//               region={location}
//             >
//               <Marker 
//                 coordinate={{
//                   latitude: location.latitude,
//                   longitude: location.longitude
//                 }} 
//               />
//             </MapView>
//             <Text style={styles.locationText}>
//               {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
//             </Text>
//           </View>
//         )}

//         {/* Submit Button */}
//         <Button 
//           mode="contained" 
//           onPress={handleSubmit}
//           style={styles.submitButton}
//           loading={loading}
//           disabled={loading}
//         >
//           Submit Incident Report
//         </Button>
//       </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   scrollContainer: {
//     paddingHorizontal: 20,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   headerIcon: {
//     marginRight: 10,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: colors.primary,
//   },
//   input: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#333',
//   },
//   severityContainer: {
//     marginBottom: 20,
//   },
//   chipContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   severityChip: {
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   chipText: {
//     fontWeight: '600',
//   },
//   lowSeverity: {
//     backgroundColor: '#E6F3E6',
//   },
//   mediumSeverity: {
//     backgroundColor: '#FFF3E0',
//   },
//   highSeverity: {
//     backgroundColor: '#FFEBEE',
//   },
//   mediaCaptureContainer: {
//     marginBottom: 20,
//   },
//   mediaButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   mediaButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0F4F8',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     width: '48%',
//   },
//   mediaButtonText: {
//     marginLeft: 10,
//     color: '#0A84FF',
//     fontWeight: '600',
//   },
//   mediaPreviewContainer: {
//     marginTop: 10,
//   },
//   mediaPreviewItem: {
//     position: 'relative',
//     marginRight: 10,
//   },
//   mediaPreview: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//   },
//   removeMediaButton: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 15,
//     padding: 2,
//   },
//   locationContainer: {
//     marginBottom: 20,
//   },
//   map: {
//     height: 200,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   locationText: {
//     marginTop: 10,
//     textAlign: 'center',
//     color: '#666',
//   },
//   submitButton: {
//     marginTop: 20,
//     marginBottom: 40,
//     backgroundColor: colors.primary,
//   },
// });

// export default IncidentReportScreen;

import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Platform,
  Alert
} from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Chip,
  ActivityIndicator
} from 'react-native-paper';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { API_URL } from '../config/apiConfig';
import { GEMINI_API_KEY } from '../config/apiConfig'; // Add this to your config file

const { width, height } = Dimensions.get('window');

const IncidentReportScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [location, setLocation] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [validated, setValidated] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  // Location and Permission Setup
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  // Reset validation when title or description changes
  useEffect(() => {
    setValidated(false);
    setAnalysisResult(null);
  }, [title, description]);

  // Media Capture Handler
  const handleMediaCapture = async (type) => {
    let result;
  
    if (type === 'photo') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: [ImagePicker.MediaType.IMAGE],
        allowsEditing: true,
        quality: 0.7,
      });
    } else if (type === 'video') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: [ImagePicker.MediaType.VIDEO],
        allowsEditing: true,
        quality: 0.7,
      });
    }
  
    if (!result.canceled && result.assets?.length > 0) {
      const file = result.assets[0];
      setMediaFiles(prev => [...prev, {
        uri: file.uri,
        type: file.type,
      }]);
    }
  };

  // Analyze content with Gemini API
  // const analyzeContent = async () => {
  //   if (!title || !description) {
  //     Alert.alert('Missing Information', 'Please fill in both title and description');
  //     return;
  //   }

  //   try {
  //     setAnalyzing(true);
      
  //     const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         contents: [{
  //           parts: [{
  //             text: `Analyze if the following incident report is relevant to a road blockage scenario. 
  //             Title: ${title}
  //             Description: ${description}
              
  //             Provide feedback in the following JSON format:
  //             {
  //               "isRelevant": boolean (true if it's about a road blockage, otherwise false),
  //               "suggestion": string (brief suggestion for improvement if not relevant),
  //               "summary": string (brief summary of the incident if relevant)
  //             }`
  //           }]
  //         }]
  //       }),
  //     });

  //     const data = await response.json();
      
  //     // Extract the text response
  //     const responseText = data.candidates[0].content.parts[0].text;
      
  //     // Parse the JSON from the response text
  //     let jsonResult;
  //     try {
  //       // Find JSON object in the response text
  //       const jsonMatch = responseText.match(/{[\s\S]*}/);
  //       if (jsonMatch) {
  //         jsonResult = JSON.parse(jsonMatch[0]);
  //       } else {
  //         throw new Error('No valid JSON found in response');
  //       }
  //     } catch (jsonError) {
  //       console.error('Error parsing JSON from Gemini response:', jsonError);
  //       Alert.alert('Analysis Error', 'Unable to analyze the report content. Please try again.');
  //       setAnalyzing(false);
  //       return;
  //     }
      
  //     setAnalysisResult(jsonResult);
  //     setValidated(jsonResult.isRelevant);
      
  //     if (!jsonResult.isRelevant) {
  //       Alert.alert('Not Relevant', 'Your report doesn\'t appear to be about a road blockage. Please revise your description.');
  //     }
  //   } catch (error) {
  //     console.error('Error analyzing content with Gemini:', error);
  //     Alert.alert('Analysis Error', 'Unable to analyze the report content. Please try again.');
  //   } finally {
  //     setAnalyzing(false);
  //   }
  // };

  // First, let's improve the error handling in the analyzeContent function
  const analyzeContent = async () => {
    if (!title || !description) {
      Alert.alert('Missing Information', 'Please fill in both title and description');
      return;
    }
  
    try {
      setAnalyzing(true);
      
      // Check if API key is available
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured');
      }
      
      console.log('Sending request to Gemini API...');
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze if the following incident report is relevant to a road blockage scenario. 
              Title: ${title}
              Description: ${description}
              
              Provide feedback in the following JSON format:
              {
                "isRelevant": boolean (true if it's about a road blockage, otherwise false),
                "suggestion": string (brief suggestion for improvement if not relevant),
                "summary": string (brief summary of the incident if relevant)
              }`
            }]
          }]
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`API returned status ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Gemini API response received:', JSON.stringify(data).substring(0, 200) + '...');
      
      // Check if the response has the expected structure
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
        throw new Error('Unexpected response format from Gemini API');
      }
      
      // Extract the text response
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Parse the JSON from the response text
      let jsonResult;
      try {
        // Find JSON object in the response text
        const jsonMatch = responseText.match(/{[\s\S]*}/);
        if (jsonMatch) {
          jsonResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (jsonError) {
        console.error('Error parsing JSON from Gemini response:', jsonError, 'Response text:', responseText);
        Alert.alert('Analysis Error', 'Unable to analyze the report content. Please try again.');
        setAnalyzing(false);
        return;
      }
      
      setAnalysisResult(jsonResult);
      setValidated(jsonResult.isRelevant);
      
      if (!jsonResult.isRelevant) {
        Alert.alert('Not Relevant', 'Your report doesn\'t appear to be about a road blockage. Please revise your description.');
      } else {
        Alert.alert('Validated', 'Your report has been validated successfully.');
      }
    } catch (error) {
      console.error('Error analyzing content with Gemini:', error);
      Alert.alert('Analysis Error', `Unable to analyze the report content: ${error.message}`);
    } finally {
      setAnalyzing(false);
    }
  };
  
  // New function to summarize description text
  const summarizeDescription = async () => {
    if (!description || description.trim() === '') {
      Alert.alert('Missing Content', 'Please enter a description to summarize');
      return;
    }
  
    try {
      setSummarizing(true);
      
      // Check if API key is available
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured');
      }
      
      console.log('Sending summarization request to Gemini API...');
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Summarize the following road blockage incident description in about 2-3 concise sentences. 
              Keep only the most important details about the location, cause, and impact.
              
              Original Description: ${description}`
            }]
          }]
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`API returned status ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      
      // Check if the response has the expected structure
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
        throw new Error('Unexpected response format from Gemini API');
      }
      
      // Extract the summary text
      const summary = data.candidates[0].content.parts[0].text.trim();
      setDescription(summary);
      
      Alert.alert('Description Summarized', 'Your incident description has been summarized successfully.');
      
    } catch (error) {
      console.error('Error summarizing content with Gemini:', error);
      Alert.alert('Summarization Error', `Unable to summarize the description: ${error.message}`);
    } finally {
      setSummarizing(false);
    }
  };
  
  // Submit Incident Report
  const handleSubmit = async () => {
    if (!validated) {
      Alert.alert(
        'Validation Required', 
        'Please validate your report content before submitting.'
      );
      return;
    }
    
    if (!title || !description) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
  
    if (!location) {
      Alert.alert('Location Required', 'Location is still being fetched');
      return;
    }
  
    const formData = new FormData();
  
    formData.append('title', title);
    formData.append('description', description);
    formData.append('severity', severity);
    formData.append('latitude', location.latitude);
    formData.append('longitude', location.longitude);
    
    // Add the analysis summary if available
    if (analysisResult?.summary) {
      formData.append('summary', analysisResult.summary);
    }
  
    mediaFiles.forEach((file, index) => {
      const fileType = file.uri.split('.').pop();
      formData.append('media', {
        uri: file.uri,
        type: file.type === 'video' ? `video/${fileType}` : `image/${fileType}`,
        name: `media_${index}.${fileType}`
      });
    });
  
    try {
      setLoading(true);
  
      const response = await fetch(`${API_URL}/report-incident`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', 'Incident reported successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('MainTabs') }
        ]);
      } else {
        console.log('Server error:', data);
        Alert.alert('Submission Failed', data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error submitting incident:', error);
      Alert.alert('Submission Failed', 'Could not connect to the server');
    } finally {
      setLoading(false);
    }
  };  
  
  // Remove Media File
  const removeMediaFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <ScrollView 
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Screen Title */}
      <View style={styles.headerContainer}>
        <Ionicons 
          name="warning-outline" 
          size={24} 
          color={colors.primary} 
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>Report Road Blockage</Text>
      </View>
  
      {/* Incident Title Input */}
      <TextInput
        label="Incident Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        theme={{ 
          colors: { 
            primary: '#0A84FF',
            background: 'white' 
          } 
        }}
      />
  
      {/* Description Input */}
      <TextInput
        label="Describe the Road Blockage"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
        theme={{ 
          colors: { 
            primary: '#0A84FF',
            background: 'white' 
          } 
        }}
      />
  
      {/* Summarize and Analyze Buttons */}
      <View style={styles.buttonRow}>
        <Button 
          mode="outlined" 
          onPress={summarizeDescription}
          style={[styles.button, styles.summarizeButton]}
          loading={summarizing}
          disabled={summarizing || !description}
          icon="format-text"
        >
          Summarize
        </Button>
  
        <Button 
          mode="outlined" 
          onPress={analyzeContent}
          style={[styles.button, styles.analyzeButton]}
          loading={analyzing}
          disabled={analyzing || !title || !description}
          icon="check-circle-outline"
        >
          Validate
        </Button>
      </View>
  
      {/* Analysis Result */}
      {analysisResult && (
        <View style={styles.analysisContainer}>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: analysisResult.isRelevant ? '#4CAF50' : '#F44336' }
          ]} />
          <View style={styles.analysisContent}>
            <Text style={styles.analysisTitle}>
              {analysisResult.isRelevant ? 'Valid Report' : 'Invalid Report'}
            </Text>
            <Text style={styles.analysisText}>
              {analysisResult.isRelevant 
                ? analysisResult.summary 
                : analysisResult.suggestion}
            </Text>
          </View>
        </View>
      )}
  
      {/* Severity Selection */}
      <View style={styles.severityContainer}>
        <Text style={styles.sectionTitle}>Severity Level</Text>
        <View style={styles.chipContainer}>
          {['Low', 'Medium', 'High'].map((level) => (
            <Chip
              key={level}
              selected={severity === level}
              onPress={() => setSeverity(level)}
              style={[
                styles.severityChip,
                severity === level && styles[`${level.toLowerCase()}Severity`]
              ]}
              textStyle={styles.chipText}
            >
              {level}
            </Chip>
          ))}
        </View>
      </View>
  
      {/* Media Capture */}
      <View style={styles.mediaCaptureContainer}>
        <Text style={styles.sectionTitle}>Add Media</Text>
        <View style={styles.mediaButtonContainer}>
          <TouchableOpacity 
            style={styles.mediaButton}
            onPress={() => handleMediaCapture('photo')}
          >
            <Ionicons name="camera" size={24} color="#0A84FF" />
            <Text style={styles.mediaButtonText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mediaButton}
            onPress={() => handleMediaCapture('video')}
          >
            <Ionicons name="videocam" size={24} color="#0A84FF" />
            <Text style={styles.mediaButtonText}>Video</Text>
          </TouchableOpacity>
        </View>
  
        {/* Media Preview */}
        <ScrollView 
          horizontal 
          style={styles.mediaPreviewContainer}
          showsHorizontalScrollIndicator={false}
        >
          {mediaFiles.map((media, index) => (
            <View key={index} style={styles.mediaPreviewItem}>
              <Image 
                source={{ uri: media.uri }} 
                style={styles.mediaPreview}
              />
              <TouchableOpacity 
                style={styles.removeMediaButton}
                onPress={() => removeMediaFile(index)}
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
  
      {/* Location */}
      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.sectionTitle}>Location</Text>
          <MapView
            style={styles.map}
            region={location}
          >
            <Marker 
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }} 
            />
          </MapView>
          <Text style={styles.locationText}>
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        </View>
      )}
  
      {/* Submit Button */}
      <Button 
        mode="contained" 
        onPress={handleSubmit}
        style={styles.submitButton}
        loading={loading}
        disabled={loading || !validated}
        icon="send"
      >
        Submit Incident Report
      </Button>
    </ScrollView>
  )};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  input: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  severityContainer: {
    marginBottom: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityChip: {
    flex: 1,
    marginHorizontal: 5,
  },
  chipText: {
    fontWeight: '600',
  },
  lowSeverity: {
    backgroundColor: '#E6F3E6',
  },
  mediumSeverity: {
    backgroundColor: '#FFF3E0',
  },
  highSeverity: {
    backgroundColor: '#FFEBEE',
  },
  mediaCaptureContainer: {
    marginBottom: 20,
  },
  mediaButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '48%',
  },
  mediaButtonText: {
    marginLeft: 10,
    color: '#0A84FF',
    fontWeight: '600',
  },
  mediaPreviewContainer: {
    marginTop: 10,
  },
  mediaPreviewItem: {
    position: 'relative',
    marginRight: 10,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 2,
  },
  locationContainer: {
    marginBottom: 20,
  },
  map: {
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  locationText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: colors.primary,
  },
  // New styles for Gemini integration
  analyzeButton: {
   
    marginBottom: 20,
    borderColor: colors.primary,
  },
  analysisContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
    padding: 30,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 10,
  },
  analysisContent: {
    flex: 1,
  },
  analysisTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  analysisText: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  
  summarizeButton: {
    borderColor: '#FF9500',
  }
});

export default IncidentReportScreen;