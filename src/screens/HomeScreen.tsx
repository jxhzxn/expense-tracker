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
      <View style={styles.content}>
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryAmount}>${total.toFixed(2)}</Text>
          <Text style={styles.summaryCount}>
            {state.expenses.length} expense{state.expenses.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddAmount')}
          activeOpacity={0.85}
        >
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.subtext,
    marginBottom: SPACING.xs,
  },
  summaryAmount: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  summaryCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.subtext,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonIcon: {
    fontSize: FONT_SIZE.xxl,
    color: COLORS.white,
    fontWeight: '300',
    lineHeight: FONT_SIZE.xxl + 2,
  },
  addButtonText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.white,
  },
});
