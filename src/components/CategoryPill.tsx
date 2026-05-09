import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Category } from '../types/expense';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';

type Props = { category: Category };

export default function CategoryPill({ category }: Props) {
  const color = COLORS.categoryColors[category];
  return (
    <View style={[styles.pill, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
});
