import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddAmountScreen from '../screens/AddAmountScreen';
import AddCategoryScreen from '../screens/AddCategoryScreen';
import { COLORS } from '../constants/theme';

export type AddExpenseStackParamList = {
  Home: undefined;
  AddAmount: undefined;
  AddCategory: { amount: number };
};

const Stack = createNativeStackNavigator<AddExpenseStackParamList>();

export default function AddExpenseStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.card },
        headerTintColor: COLORS.primary,
        headerTitleStyle: { color: COLORS.text },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Expense Tracker' }}
      />
      <Stack.Screen
        name="AddAmount"
        component={AddAmountScreen}
        options={{ title: 'Enter Amount' }}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
        options={{ title: 'Select Category' }}
      />
    </Stack.Navigator>
  );
}
