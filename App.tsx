import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ExpenseProvider } from './src/context/ExpenseContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <ExpenseProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </ExpenseProvider>
  );
}
