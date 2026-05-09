import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AddExpenseStackParamList } from '../navigation/AddExpenseStack';
import { useExpenses } from '../context/ExpenseContext';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<AddExpenseStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const { state } = useExpenses();
  const total = state.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.fullScreenButton}
        onPress={() => navigation.navigate('AddAmount')}
        activeOpacity={0.92}
      >
        <View style={styles.content}>
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryAmount}>${total.toFixed(2)}</Text>
            <Text style={styles.summaryCount}>
              {state.expenses.length} expense{state.expenses.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <View style={styles.hint}>
            <Text style={styles.hintIcon}>+</Text>
            <Text style={styles.hintText}>Tap anywhere to add expense</Text>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  fullScreenButton: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.xl,
  },
  summary: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FONT_SIZE.lg,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: SPACING.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  summaryAmount: {
    fontSize: 72,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  summaryCount: {
    fontSize: FONT_SIZE.md,
    color: 'rgba(255,255,255,0.6)',
  },
  hint: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  hintIcon: {
    fontSize: 48,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '200',
    lineHeight: 56,
  },
  hintText: {
    fontSize: FONT_SIZE.md,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
  },
});
