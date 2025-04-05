import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import SplashScreen from '../screens/Splashscreen';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import ReportConfirmation from '../screens/ReportConfirmation';
import ReportHistory from '../screens/ReportHistory';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TabNavigator } from '../components/TabNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}> 
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
    //     <Stack.Screen name="Splash" component={SplashScreen} />
    //     <Stack.Screen name="Home" component={HomeScreen} />
    //     <Stack.Screen name="Camera" component={CameraScreen} />
    //     <Stack.Screen name="ReportConfirmation" component={ReportConfirmation} />
    //     <Stack.Screen name="ReportHistory" component={ReportHistory} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    // </SafeAreaView>
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="ReportConfirmation" component={ReportConfirmation} />
          <Stack.Screen name="ReportHistory" component={ReportHistory} />
          <Stack.Screen name="Login" component= {LoginScreen} />
          <Stack.Screen name="Register" component= {RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default AppNavigator;