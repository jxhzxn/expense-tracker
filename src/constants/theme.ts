import { Category } from '../types/expense';

export const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  subtext: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
  categoryColors: {
    Food: '#F59E0B',
    Transport: '#3B82F6',
    Shopping: '#EC4899',
    Health: '#10B981',
    Entertainment: '#8B5CF6',
    Utilities: '#F97316',
    Other: '#6B7280',
  } as Record<Category, string>,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const FONT_SIZE = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 999,
};
