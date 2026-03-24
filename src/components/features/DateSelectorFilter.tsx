import React, { useRef, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DatePill } from '../ui';
import { colors, spacing } from '../../tokens';

interface DateSelectorFilterProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

function getDayAbbr(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function generateDateRange(today: Date, count: number = 30): Date[] {
  const dates: Date[] = [];
  const pastDays = 7; // show 7 days in the past
  for (let i = -pastDays; i < count - pastDays; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    dates.push(d);
  }
  return dates;
}

const PILL_WIDTH = 48; // 44px pill + 4px gap
const EDGE_FADE_WIDTH = 32;

export function DateSelectorFilter({
  selectedDate,
  onDateSelect,
}: DateSelectorFilterProps) {
  const scrollRef = useRef<ScrollView>(null);
  const today = useRef(new Date()).current;
  today.setHours(0, 0, 0, 0);

  const dates = useRef(generateDateRange(today, 30)).current;

  // Find index of today to center scroll
  const todayIndex = dates.findIndex((d) => isSameDay(d, today));

  useEffect(() => {
    // Scroll to center today on mount
    if (scrollRef.current && todayIndex >= 0) {
      const scrollX = Math.max(0, todayIndex * PILL_WIDTH - 150);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: scrollX, animated: false });
      }, 100);
    }
  }, [todayIndex]);

  const handleSelect = useCallback(
    (date: Date) => {
      onDateSelect(date);
    },
    [onDateSelect]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={PILL_WIDTH}
      >
        {dates.map((date, i) => {
          const isPast = date < today;
          const isToday_ = isSameDay(date, today);
          const isActive = isSameDay(date, selectedDate);

          return (
            <DatePill
              key={date.toISOString()}
              day={getDayAbbr(date)}
              date={date.getDate()}
              active={isActive}
              isToday={isToday_}
              isPast={isPast}
              onPress={() => handleSelect(date)}
            />
          );
        })}
      </ScrollView>

      {/* Left edge fade */}
      <View style={styles.fadeLeft} pointerEvents="none">
        <LinearGradient
          colors={[colors.background, colors.background + '00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Right edge fade */}
      <View style={styles.fadeRight} pointerEvents="none">
        <LinearGradient
          colors={[colors.background + '00', colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    gap: spacing.xxs,
    paddingTop: spacing.m,
    paddingBottom: spacing.xs,
  },
  fadeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: EDGE_FADE_WIDTH,
  },
  fadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: EDGE_FADE_WIDTH,
  },
});
