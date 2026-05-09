import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddExpenseStack from './AddExpenseStack';
import HistoryScreen from '../screens/HistoryScreen';
import FloatingMenu from './FloatingMenu';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingMenu {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={AddExpenseStack} />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          headerShown: true,
          headerTitle: 'Expense History',
          headerStyle: { backgroundColor: COLORS.card },
          headerTitleStyle: { color: COLORS.text },
        }}
      />
    </Tab.Navigator>
  );
}
