import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { AddExpenseStackParamList } from '../navigation/AddExpenseStack';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES, Category } from '../types/expense';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<AddExpenseStackParamList, 'AddCategory'>;
  route: RouteProp<AddExpenseStackParamList, 'AddCategory'>;
};

export default function AddCategoryScreen({ navigation, route }: Props) {
  const { amount } = route.params;
  const { dispatch } = useExpenses();

  function handleSelect(category: Category) {
    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        id: uuid.v4() as string,
        amount,
        category,
        createdAt: new Date().toISOString(),
      },
    });
    navigation.popToTop();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.amountBadge}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>${amount.toFixed(2)}</Text>
        </View>

        <Text style={styles.prompt}>Select a category</Text>

        <View style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryCard,
                { borderColor: COLORS.categoryColors[cat] },
              ]}
              onPress={() => handleSelect(cat)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: COLORS.categoryColors[cat] },
                ]}
              />
              <Text style={styles.categoryName}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  amountBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  amountValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  prompt: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.subtext,
    fontWeight: '500',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
});
