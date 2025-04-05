import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </>
  );
}