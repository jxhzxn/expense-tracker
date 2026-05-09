import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import AddExpenseStack from './AddExpenseStack';
import HistoryScreen from '../screens/HistoryScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.subtext,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={AddExpenseStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>,
          headerShown: true,
          headerTitle: 'Expense History',
          headerStyle: { backgroundColor: COLORS.card },
          headerTitleStyle: { color: COLORS.text },
        }}
      />
    </Tab.Navigator>
  );
}
