import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { filterState } from './filterState';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Chip, Button, Icon } from '../components/ui';
import { colors, fontFamilies, typeScale, spacing, radius, shadows, sizes } from '../tokens';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.78;

const JOB_TYPES = [
  'Hospitality',
  'Retail',
  'Logistics',
  'Events',
  'Kitchen',
  'Delivery',
  'Office',
  'Cleaning',
];

const SALARY_RANGES = [
  '€15 – €20',
  '€20 – €25',
  '€25 – €30',
  '€30+',
];

export function FilterSheetContent({
  onClose,
  navigation: navProp,
}: {
  onClose: () => void;
  navigation?: any;
}) {
  const navigation = navProp ?? useNavigation<any>();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Hospitality', 'Events']);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(filterState.getLocation());
  const [selectedEmployer, setSelectedEmployer] = useState<string | null>(filterState.getEmployer());
  const [selectedSalary, setSelectedSalary] = useState('€20 – €25');

  // Sync with shared filter state when returning from search screens
  useEffect(() => {
    return filterState.subscribe(() => {
      setSelectedLocation(filterState.getLocation());
      setSelectedEmployer(filterState.getEmployer());
    });
  }, []);

  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    // Spring in with specified physics
    translateY.value = withSpring(0, {
      stiffness: 280,
      damping: 28,
      mass: 0.8,
    });
    backdropOpacity.value = withTiming(1, { duration: 300 });
  }, []);

  const dismiss = () => {
    translateY.value = withTiming(SHEET_HEIGHT, {
      duration: 250,
      easing: Easing.in(Easing.ease),
    });
    backdropOpacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropAnimStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, sheetAnimStyle]}>
        {/* Handle bar */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filters</Text>
          <Pressable onPress={dismiss} hitSlop={12}>
            <Icon name="x" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Job type section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job type</Text>
            <View style={styles.chipGrid}>
              {JOB_TYPES.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  active={selectedTypes.includes(type)}
                  onPress={() => toggleType(type)}
                />
              ))}
            </View>
          </View>

          {/* Location row */}
          <Pressable
            style={styles.filterRow}
            onPress={() => navigation.navigate('LocationSearch', { initialLocation: selectedLocation })}
          >
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.filterRowRight}>
              <Text style={[styles.filterRowValue, !selectedLocation && styles.filterRowPlaceholder]}>
                {selectedLocation ?? 'Any location'}
              </Text>
              <Icon name="chevron-right" size={20} color={colors.textMuted} />
            </View>
          </Pressable>

          {/* Employer row */}
          <Pressable
            style={styles.filterRow}
            onPress={() => navigation.navigate('EmployerSearch', { initialEmployer: selectedEmployer })}
          >
            <Text style={styles.sectionTitle}>Employer</Text>
            <View style={styles.filterRowRight}>
              <Text style={[styles.filterRowValue, !selectedEmployer && styles.filterRowPlaceholder]}>
                {selectedEmployer ?? 'Any employer'}
              </Text>
              <Icon name="chevron-right" size={20} color={colors.textMuted} />
            </View>
          </Pressable>

          {/* Salary range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Salary range</Text>
            <View style={styles.salaryGrid}>
              {SALARY_RANGES.map((range) => (
                <Pressable
                  key={range}
                  style={[
                    styles.salaryOption,
                    selectedSalary === range && styles.salaryOptionActive,
                  ]}
                  onPress={() => setSelectedSalary(range)}
                >
                  <Text
                    style={[
                      styles.salaryText,
                      selectedSalary === range && styles.salaryTextActive,
                    ]}
                  >
                    {range}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Availability section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.chipGrid}>
              {['Morning', 'Afternoon', 'Evening', 'Night'].map((slot) => (
                <Chip
                  key={slot}
                  label={slot}
                  active={slot === 'Evening'}
                  onPress={() => {}}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <SafeAreaView edges={['bottom']} style={styles.ctaContainer}>
          <View style={styles.ctaRow}>
            <Pressable onPress={() => {}} style={styles.resetBtn}>
              <Text style={styles.resetText}>Reset all</Text>
            </Pressable>
            <View style={styles.applyBtnWrapper}>
              <Button
                variant="primary"
                size="lg"
                label="Show 24 results"
                onPress={dismiss}
              />
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

// Keep the navigation-based version for native
export function FilterSheet({ navigation }: { navigation?: any }) {
  return <FilterSheetContent onClose={() => navigation?.goBack?.()} navigation={navigation} />;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.l,
    borderTopRightRadius: radius.l,
    ...shadows.modal,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: spacing.s,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.input,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
  },
  headerTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.xl.fontSize,
    lineHeight: typeScale.xl.lineHeight,
    color: colors.foreground,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
  },

  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.foreground,
    marginBottom: spacing.s,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },

  // Filter rows (Location, Employer)
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.m,
    marginBottom: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.input,
  },
  filterRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filterRowValue: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    color: colors.foreground,
  },
  filterRowPlaceholder: {
    color: colors.textMuted,
  },

  // Salary
  salaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  salaryOption: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: radius.m,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.input,
  },
  salaryOptionActive: {
    backgroundColor: colors.tertiary,
    borderColor: colors.primary,
  },
  salaryText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    color: colors.foreground,
  },
  salaryTextActive: {
    color: colors.primary,
  },

  // CTA
  ctaContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.input,
    backgroundColor: colors.card,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.xs,
    gap: spacing.m,
  },
  resetBtn: {
    paddingVertical: spacing.s,
  },
  resetText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.base.fontSize,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
  applyBtnWrapper: {
    flex: 1,
  },
});
