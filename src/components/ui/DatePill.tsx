import React, { useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';
import { colors, radius, fontFamilies, typeScale } from '../../tokens';

interface DatePillProps {
  day: string;
  date: number;
  active?: boolean;
  isToday?: boolean;
  isPast?: boolean;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DatePill({
  day,
  date,
  active = false,
  isToday = false,
  isPast = false,
  onPress,
}: DatePillProps) {
  const pressScale = useSharedValue(1);
  const activeProgress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    if (active) {
      // Spring scale up slightly when becoming active
      activeProgress.value = withSpring(1, { damping: 14, stiffness: 300 });
      pressScale.value = withSequence(
        withSpring(1.08, { damping: 8, stiffness: 400 }),
        withSpring(1, { damping: 12, stiffness: 200 })
      );
    } else {
      // Spring back when deselected
      activeProgress.value = withSpring(0, { damping: 16, stiffness: 250 });
    }
  }, [active]);

  const containerStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      activeProgress.value,
      [0, 1],
      [colors.transparent, colors.primary]
    );
    return {
      backgroundColor: bgColor,
      transform: [{ scale: pressScale.value }],
    };
  });

  const dayColor = isPast
    ? colors.disabled
    : active
    ? colors.primaryForeground
    : colors.textMuted;

  const dateColor = isPast
    ? colors.disabled
    : active
    ? colors.primaryForeground
    : colors.foreground;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        pressScale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, { damping: 12, stiffness: 200 });
      }}
      style={[styles.container, containerStyle]}
      disabled={isPast}
    >
      <Text style={[styles.day, { color: dayColor }]}>{day}</Text>
      <Text style={[styles.date, { color: dateColor }]}>{date}</Text>
      {isToday && !active && <Animated.View style={styles.todayDot} />}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 64,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  day: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
    textTransform: 'uppercase',
  },
  date: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.lg.fontSize,
    lineHeight: typeScale.lg.lineHeight,
  },
  todayDot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
