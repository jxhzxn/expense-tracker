import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Expense } from '../types/expense';
import CategoryPill from './CategoryPill';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

type Props = { expense: Expense };

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor(
    (now.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) /
      86400000
  );
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ExpenseCard({ expense }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <CategoryPill category={expense.category} />
        <Text style={styles.date}>{formatDate(expense.createdAt)}</Text>
      </View>
      <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  left: {
    gap: SPACING.xs,
  },
  date: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.subtext,
  },
  amount: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
});
