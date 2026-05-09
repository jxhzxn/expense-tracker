import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS, FONT_SIZE } from '../constants/theme';

const FAB_SIZE = 56;
const ITEM_STEP = 72;

const MENU_TABS = [
  { name: 'HistoryTab', label: 'History', icon: '📋' },
];

export default function FloatingMenu({ state, navigation }: BottomTabBarProps) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const next = !open;
    Animated.spring(anim, {
      toValue: next ? 1 : 0,
      useNativeDriver: true,
      tension: 70,
      friction: 9,
    }).start();
    setOpen(next);
  };

  const close = () => {
    Animated.spring(anim, { toValue: 0, useNativeDriver: true }).start();
    setOpen(false);
  };

  const backdropOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const fabRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '135deg'] });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents={open ? 'auto' : 'none'}
      >
        <TouchableWithoutFeedback onPress={close}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* FAB + menu items */}
      <View style={styles.fabGroup} pointerEvents="box-none">
        {MENU_TABS.map((tab, i) => {
          const isActive = state.routes[state.index].name === tab.name;
          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(ITEM_STEP * (i + 1))],
          });
          const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

          return (
            <Animated.View
              key={tab.name}
              style={[
                styles.menuItem,
                { transform: [{ translateY }, { scale }], opacity: anim },
              ]}
              pointerEvents={open ? 'auto' : 'none'}
            >
              <TouchableOpacity
                style={[styles.menuBubble, isActive && styles.menuBubbleActive]}
                onPress={() => { navigation.navigate(tab.name as never); close(); }}
                activeOpacity={0.8}
              >
                <Text style={styles.menuIcon}>{tab.icon}</Text>
              </TouchableOpacity>
              <Text style={styles.menuLabel}>{tab.label}</Text>
            </Animated.View>
          );
        })}

        {/* Main FAB */}
        <TouchableOpacity style={styles.fab} onPress={toggle} activeOpacity={0.85}>
          <Animated.View style={{ transform: [{ rotate: fabRotate }] }}>
            <Text style={styles.fabIcon}>+</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  fabGroup: {
    position: 'absolute',
    bottom: 28,
    left: 24,
  },
  menuItem: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuBubble: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  menuBubbleActive: {
    backgroundColor: COLORS.primaryLight,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 30,
    color: COLORS.white,
    fontWeight: '300',
    lineHeight: 34,
    includeFontPadding: false,
  },
});
