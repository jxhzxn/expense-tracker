import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useExpenses } from '../context/ExpenseContext';
import { SortOption } from '../types/expense';
import ExpenseCard from '../components/ExpenseCard';
import SortPicker from '../components/SortPicker';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

export default function HistoryScreen() {
  const { state } = useExpenses();
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const sorted = useMemo(() => {
    const copy = [...state.expenses];
    switch (sortBy) {
      case 'newest':
        return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case 'oldest':
        return copy.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      case 'highest':
        return copy.sort((a, b) => b.amount - a.amount);
      case 'lowest':
        return copy.sort((a, b) => a.amount - b.amount);
    }
  }, [state.expenses, sortBy]);

  return (
    <SafeAreaView style={styles.container}>
      <SortPicker value={sortBy} onChange={setSortBy} />
      {sorted.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No expenses yet</Text>
          <Text style={styles.emptySubtext}>
            Tap "Add Expense" on the Home tab to get started.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExpenseCard expense={item} />}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  separator: {
    height: SPACING.sm,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.md,
    color: COLORS.subtext,
    textAlign: 'center',
  },
});
