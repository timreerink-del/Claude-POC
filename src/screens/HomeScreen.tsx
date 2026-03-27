import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from 'react-native';
import { Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ONBOARDING_KEY } from '../navigation';
import { filterState } from './filterState';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { JobCard } from '../components/features/JobCard';
import { EngagementCard } from '../components/features/EngagementCard';
import { DateSelectorFilter } from '../components/features/DateSelectorFilter';
import { Icon, Button } from '../components/ui';
import { MeshGradient } from '../components/ui/MeshGradient';
import { colors, fontFamilies, typeScale, typography, spacing, radius, sizes } from '../tokens';
import {
  WORK_NOW_JOBS,
  VACANCY_JOBS,
  PICKED_FOR_YOU,
} from '../data/mockJobs';
import { ENGAGEMENT_CARDS } from '../data/engagementCards';

// ── Types ────────────────────────────────────────────────

type JobType = 'work-now' | 'vacancies';

// ── Job Type Toggle ──────────────────────────────────────

function JobTypeToggle({
  value,
  onChange,
}: {
  value: JobType;
  onChange: (v: JobType) => void;
}) {
  const indicatorX = useSharedValue(value === 'work-now' ? 0 : 1);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${indicatorX.value * 50}%` as any,
  }));

  const handleToggle = (newValue: JobType) => {
    indicatorX.value = withSpring(newValue === 'work-now' ? 0 : 1, {
      stiffness: 300,
      damping: 25,
    });
    onChange(newValue);
  };

  return (
    <View style={toggleStyles.container}>
      <Pressable
        testID="toggle-work-now"
        style={toggleStyles.tab}
        onPress={() => handleToggle('work-now')}
      >
        <View style={toggleStyles.labelRow}>
          <Icon name="zap" size={16} color={value === 'work-now' ? colors.primaryContrast : colors.textMuted} />
          <Text
            style={[
              toggleStyles.label,
              value === 'work-now' ? toggleStyles.labelActive : toggleStyles.labelInactive,
            ]}
          >
            work now
          </Text>
        </View>
        <View style={value === 'work-now' ? toggleStyles.activeIndicator : toggleStyles.inactiveIndicator} />
      </Pressable>
      <Pressable
        testID="toggle-vacancies"
        style={toggleStyles.tab}
        onPress={() => handleToggle('vacancies')}
      >
        <View style={toggleStyles.labelRow}>
          <Icon name="bookmark" size={16} color={value === 'vacancies' ? colors.primaryContrast : colors.textMuted} />
          <Text
            style={[
              toggleStyles.label,
              value === 'vacancies' ? toggleStyles.labelActive : toggleStyles.labelInactive,
            ]}
          >
            vacancies
          </Text>
        </View>
        <View style={value === 'vacancies' ? toggleStyles.activeIndicator : toggleStyles.inactiveIndicator} />
      </Pressable>
    </View>
  );
}

const toggleStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 48,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
  },
  labelActive: {
    color: colors.primaryContrast,
  },
  labelInactive: {
    color: colors.textMuted,
  },
  activeIndicator: {
    width: '100%',
    height: 3,
    backgroundColor: colors.primaryContrast,
    borderRadius: radius.pill,
  },
  inactiveIndicator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
  },
});

// ── Filter Chip ─────────────────────────────────────────

function FilterChip({
  label,
  selected,
  icon,
  onPress,
}: {
  label: string;
  selected?: boolean;
  icon?: string;
  onPress?: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.93, { damping: 15, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 200 }); }}
        style={[
          filterChipStyles.chip,
          selected && filterChipStyles.chipSelected,
        ]}
      >
        {icon && <Text style={filterChipStyles.chipIcon}>{icon}</Text>}
        <Text
          style={[
            filterChipStyles.label,
            selected && filterChipStyles.labelSelected,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const filterChipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.m,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.input,
    backgroundColor: colors.card,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.tertiary,
  },
  chipIcon: {
    fontSize: 14,
  },
  label: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.foreground,
  },
  labelSelected: {
    fontFamily: fontFamilies.medium,
    color: colors.primary,
  },
});

// ── Distance Chip ───────────────────────────────────────

function DistanceChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={animStyle}>
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.93, { damping: 15, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 200 }); }}
      style={[
        distanceChipStyles.chip,
        selected && distanceChipStyles.chipSelected,
      ]}
    >
      <Text
        style={[
          distanceChipStyles.label,
          selected && distanceChipStyles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
    </Animated.View>
  );
}

const distanceChipStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.s,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.input,
    backgroundColor: colors.card,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.tertiary,
  },
  label: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
    color: colors.textMuted,
  },
  labelSelected: {
    fontFamily: fontFamilies.medium,
    color: colors.primary,
  },
});

// ── Time Chip ───────────────────────────────────────────

function TimeChip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon?: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        timeChipStyles.chip,
        selected && timeChipStyles.chipSelected,
      ]}
    >
      {icon && <Icon name={icon as any} size={16} color={selected ? colors.primary : colors.textMuted} />}
      <Text
        style={[
          timeChipStyles.label,
          selected && timeChipStyles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const timeChipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.s,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.input,
    backgroundColor: colors.card,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.tertiary,
  },
  label: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.foreground,
  },
  labelSelected: {
    fontFamily: fontFamilies.medium,
    color: colors.primary,
  },
});

// ── Language Chip ────────────────────────────────────────

function LanguageChip({
  label,
  flag,
  selected,
  onPress,
}: {
  label: string;
  flag: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        langChipStyles.chip,
        selected && langChipStyles.chipSelected,
      ]}
    >
      <Text style={langChipStyles.flag}>{flag}</Text>
      <Text
        style={[
          langChipStyles.label,
          selected && langChipStyles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const langChipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.s,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.input,
    backgroundColor: colors.card,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.tertiary,
  },
  flag: {
    fontSize: 16,
  },
  label: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.foreground,
  },
  labelSelected: {
    fontFamily: fontFamilies.medium,
    color: colors.primary,
  },
});

// ── Slider Track ────────────────────────────────────────

function SimpleSlider({
  value,
  min,
  max,
  step,
  onChange,
  labels,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  labels?: string[];
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.track}>
        <View style={[sliderStyles.filled, { width: `${pct}%` }]} />
        <Pressable
          style={[sliderStyles.thumb, { left: `${pct}%` }]}
          onPress={() => {}}
        />
      </View>
      {labels && (
        <View style={sliderStyles.labelRow}>
          {labels.map((l, i) => (
            <Text key={i} style={sliderStyles.label}>{l}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  track: {
    height: 6,
    backgroundColor: colors.input,
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  filled: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginLeft: -10,
    top: -7,
    borderWidth: 3,
    borderColor: colors.white,
    ...({ boxShadow: '0 2px 4px rgba(0,0,0,0.15)' } as any),
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  label: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.xs.fontSize,
    color: colors.textMuted,
  },
});

// ── Rating Dots ─────────────────────────────────────────

function RatingSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const steps = [0, 1, 2, 3, 4, 5];
  const pct = (value / 5) * 100;
  return (
    <View style={ratingStyles.container}>
      <View style={ratingStyles.track}>
        <View style={[ratingStyles.filled, { width: `${pct}%` }]} />
      </View>
      <View style={ratingStyles.dotsRow}>
        {steps.map((s) => (
          <Pressable key={s} onPress={() => onChange(s)} hitSlop={8}>
            <View
              style={[
                ratingStyles.dot,
                s <= value && ratingStyles.dotActive,
              ]}
            />
          </Pressable>
        ))}
      </View>
      <View style={ratingStyles.labelRow}>
        <Text style={ratingStyles.label}>0</Text>
        <Text style={ratingStyles.label}>2.5</Text>
        <Text style={ratingStyles.label}>5</Text>
      </View>
    </View>
  );
}

const ratingStyles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  track: {
    height: 4,
    backgroundColor: colors.input,
    borderRadius: 2,
    position: 'relative',
  },
  filled: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.input,
    backgroundColor: colors.card,
  },
  dotActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  label: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.xs.fontSize,
    color: colors.textMuted,
  },
});

// ── Filter Bottom Sheet ─────────────────────────────────

const WORK_TYPES = [
  { label: 'Healthcare', icon: '🏥' },
  { label: 'Hospitality', icon: '🍽️' },
  { label: 'Logistics', icon: '📦' },
  { label: 'Education', icon: '📚' },
  { label: 'Retail', icon: '🛍️' },
];

const DISTANCES = ['<5 km', '+10 km', '+15 km', '+20 km', '+25 km', 'more than 25 km'];

const TIME_SLOTS = [
  { label: '06:00 - 12:00', icon: 'sunrise' },
  { label: '12:00 - 18:00', icon: 'sun' },
  { label: '18:00 - 24:00', icon: 'sunset' },
  { label: '00:00 - 06:00', icon: 'moon' },
];

const LANGUAGES = [
  { label: 'English', flag: '🇬🇧' },
  { label: 'Francais', flag: '🇫🇷' },
  { label: 'Italiano', flag: '🇮🇹' },
  { label: 'Deutsch', flag: '🇩🇪' },
  { label: 'Bargoens', flag: '🟣' },
];

function FilterBottomSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const filterNav = useNavigation<any>();
  const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>({
    Healthcare: true,
    Hospitality: true,
  });
  const [selectedLocation, setSelectedLocation] = useState<string | null>(filterState.getLocation());
  const [selectedEmployer, setSelectedEmployer] = useState<string | null>(filterState.getEmployer());
  const [selectedDistance, setSelectedDistance] = useState('<5 km');

  // Sync with shared filter state when returning from search screens
  useEffect(() => {
    return filterState.subscribe(() => {
      setSelectedLocation(filterState.getLocation());
      setSelectedEmployer(filterState.getEmployer());
    });
  }, []);
  const [minWage, setMinWage] = useState(15);
  const [minRating, setMinRating] = useState(0);
  const [selectedTimes, setSelectedTimes] = useState<Record<string, boolean>>({});
  const [dayPref, setDayPref] = useState<'weekdays' | 'weekends' | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<Record<string, boolean>>({});

  // ── Entry / exit animation ──
  const [shouldRender, setShouldRender] = useState(false);
  const slideY = useSharedValue(1000);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      slideY.value = withSpring(0, { stiffness: 280, damping: 28, mass: 0.8 });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else if (shouldRender) {
      slideY.value = withTiming(1000, { duration: 250 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
      const t = setTimeout(() => setShouldRender(false), 280);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));
  const backdropAnimStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const toggleType = (label: string) =>
    setSelectedTypes((p) => ({ ...p, [label]: !p[label] }));
  const toggleTime = (label: string) =>
    setSelectedTimes((p) => ({ ...p, [label]: !p[label] }));
  const toggleLanguage = (label: string) =>
    setSelectedLanguages((p) => ({ ...p, [label]: !p[label] }));

  const handleReset = () => {
    setSelectedTypes({});
    filterState.setLocation('Amsterdam, Noord Holland');
    filterState.setEmployer(null);
    setSelectedDistance('<5 km');
    setMinWage(15);
    setMinRating(0);
    setSelectedTimes({});
    setDayPref(null);
    setSelectedLanguages({});
  };

  if (!shouldRender) return null;

  return (
    <View style={fStyles.overlayWrap}>
      <Animated.View style={[fStyles.backdrop, backdropAnimStyle]} />
      <Animated.View style={[fStyles.overlay, sheetAnimStyle]}>
      <SafeAreaView style={fStyles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={fStyles.header}>
          <Pressable onPress={onClose} style={fStyles.backBtn} hitSlop={12}>
            <Icon name="arrow-left" size={24} color={colors.foreground} />
          </Pressable>
          <Text style={fStyles.headerTitle}>filters</Text>
          <Pressable onPress={handleReset} hitSlop={8}>
            <Text style={fStyles.resetText}>reset</Text>
          </Pressable>
        </View>

        <ScrollView
          style={fStyles.scroll}
          contentContainerStyle={fStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Type of work */}
          <View style={fStyles.section}>
            <Text style={fStyles.sectionTitle}>Type of work</Text>
            <View style={fStyles.chipWrap}>
              {WORK_TYPES.map((t) => (
                <FilterChip
                  key={t.label}
                  label={t.label}
                  icon={t.icon}
                  selected={selectedTypes[t.label]}
                  onPress={() => toggleType(t.label)}
                />
              ))}
            </View>
          </View>

          {/* Where are you looking for work */}
          <Pressable
            style={fStyles.section}
            onPress={() => filterNav.navigate('LocationSearch', { initialLocation: selectedLocation })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={fStyles.sectionTitle}>Where are you looking for work</Text>
                <Text style={fStyles.filterValue}>{selectedLocation ?? 'Any location'}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.textMuted} />
            </View>
          </Pressable>

          {/* Max distance from location */}
          <View style={fStyles.section}>
            <Text style={fStyles.sectionTitle}>Max. distance from location</Text>
            <View style={fStyles.chipWrap}>
              {DISTANCES.map((d) => (
                <DistanceChip
                  key={d}
                  label={d}
                  selected={selectedDistance === d}
                  onPress={() => setSelectedDistance(d)}
                />
              ))}
            </View>
          </View>

          {/* Minimum Wage */}
          <View style={fStyles.section}>
            <View style={fStyles.sectionHeaderRow}>
              <Text style={fStyles.sectionTitle}>Minimum Wage</Text>
              <Text style={fStyles.valueText}>€{minWage}</Text>
            </View>
            <SimpleSlider
              value={minWage}
              min={7.35}
              max={50}
              onChange={setMinWage}
              labels={['€7,35', '€25', '€50']}
            />
          </View>

          {/* Minimum Rating */}
          <View style={fStyles.section}>
            <View style={fStyles.sectionHeaderRow}>
              <Text style={fStyles.sectionTitle}>Minimum Rating</Text>
              <Text style={fStyles.valueText}>{minRating}</Text>
            </View>
            <RatingSelector value={minRating} onChange={setMinRating} />
          </View>

          {/* Employer */}
          <Pressable
            style={fStyles.section}
            onPress={() => filterNav.navigate('EmployerSearch', { initialEmployer: selectedEmployer })}
          >
            <View style={fStyles.sectionHeaderRow}>
              <Text style={fStyles.sectionTitle}>Employer</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={fStyles.filterValue}>{selectedEmployer ?? 'Any employer'}</Text>
                <Icon name="chevron-right" size={20} color={colors.textMuted} />
              </View>
            </View>
          </Pressable>

          {/* Time preferences */}
          <View style={fStyles.section}>
            <View style={fStyles.sectionHeaderRow}>
              <Text style={fStyles.sectionTitle}>Time preferences</Text>
              <Pressable hitSlop={8}>
                <Icon name="minus" size={20} color={colors.foreground} />
              </Pressable>
            </View>
            <Text style={fStyles.subLabel}>Time of Day</Text>
            <View style={fStyles.chipWrap}>
              {TIME_SLOTS.map((t, i) => (
                <TimeChip
                  key={`${t.label}-${i}`}
                  label={t.label}
                  icon={t.icon}
                  selected={selectedTimes[`${t.label}-${i}`]}
                  onPress={() => toggleTime(`${t.label}-${i}`)}
                />
              ))}
            </View>
            <Text style={[fStyles.subLabel, { marginTop: spacing.m }]}>Time of Day</Text>
            <View style={fStyles.chipWrap}>
              <TimeChip
                label="Weekdays"
                selected={dayPref === 'weekdays'}
                onPress={() => setDayPref(dayPref === 'weekdays' ? null : 'weekdays')}
              />
              <TimeChip
                label="Weekends"
                selected={dayPref === 'weekends'}
                onPress={() => setDayPref(dayPref === 'weekends' ? null : 'weekends')}
              />
            </View>
          </View>

          {/* Language */}
          <View style={fStyles.section}>
            <View style={fStyles.sectionHeaderRow}>
              <Text style={fStyles.sectionTitle}>Language</Text>
              <Pressable hitSlop={8}>
                <Icon name="minus" size={20} color={colors.foreground} />
              </Pressable>
            </View>
            <View style={fStyles.chipWrap}>
              {LANGUAGES.map((l) => (
                <LanguageChip
                  key={l.label}
                  label={l.label}
                  flag={l.flag}
                  selected={selectedLanguages[l.label]}
                  onPress={() => toggleLanguage(l.label)}
                />
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* CTA */}
        <View style={fStyles.ctaContainer}>
          <Button
            variant="primary"
            size="lg"
            label="See 76 jobs"
            onPress={onClose}
          />
        </View>
      </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const fStyles = StyleSheet.create({
  overlayWrap: {
    ...(Platform.OS === 'web'
      ? { position: 'fixed' as any, top: 0, left: 0, right: 0, bottom: 0 }
      : { ...StyleSheet.absoluteFillObject }),
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlay: {
    ...(Platform.OS === 'web'
      ? { position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0 }
      : { ...StyleSheet.absoluteFillObject }),
    zIndex: 9999,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h5,
  },
  resetText: {
    ...typography.label,
    color: colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.m,
  },
  section: {
    paddingVertical: spacing.m,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.input,
  },
  sectionTitle: {
    ...typography.h5,
    marginBottom: spacing.s,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  subLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.m,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.foreground,
    backgroundColor: colors.card,
  },
  locationText: {
    ...typography.label,
    color: colors.foreground,
  },
  filterValue: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  valueText: {
    ...typography.emphasis,
    color: colors.primary,
  },
  ctaContainer: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.s,
    paddingBottom: Platform.OS === 'web' ? 96 : spacing.xs,
    borderTopWidth: 0.5,
    borderTopColor: colors.input,
    backgroundColor: colors.background,
  },
});

// ── Main Screen ──────────────────────────────────────────

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const [jobType, setJobType] = useState<JobType>('work-now');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({
    'wn-2': true,
    'vc-1': true,
  });
  const [visibleWorkNowCount, setVisibleWorkNowCount] = useState(10);
  const [visibleVacancyCount, setVisibleVacancyCount] = useState(10);
  const [engagementIndex, setEngagementIndex] = useState(0);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const currentEngagement = engagementIndex < ENGAGEMENT_CARDS.length
    ? ENGAGEMENT_CARDS[engagementIndex]
    : null;

  // Triple-tap to reset onboarding (prototype testing)
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleGreetingTap = useCallback(() => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      AsyncStorage.removeItem(ONBOARDING_KEY);
    } else {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 600);
    }
  }, []);

  const { height: screenHeight } = useWindowDimensions();
  const [searchSticky, setSearchSticky] = useState(false);
  const [dateFilterSticky, setDateFilterSticky] = useState(false);
  const searchRowY = useRef(0);
  const carouselBottomY = useRef(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday =
    selectedDate.getFullYear() === today.getFullYear() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getDate() === today.getDate();

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleJobPress = useCallback(
    (jobId: string) => {
      navigation?.navigate?.('ShiftDetail', { jobId });
    },
    [navigation]
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      setSearchSticky(y > searchRowY.current);
      setDateFilterSticky(y > carouselBottomY.current);
    },
    []
  );

  const onSearchRowLayout = useCallback((e: LayoutChangeEvent) => {
    searchRowY.current = e.nativeEvent.layout.y;
  }, []);

  const onCarouselLayout = useCallback((e: LayoutChangeEvent) => {
    carouselBottomY.current = e.nativeEvent.layout.y + e.nativeEvent.layout.height;
  }, []);

  const dateLabel = isToday
    ? 'Today'
    : selectedDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

  const allWorkNowJobs = isToday ? WORK_NOW_JOBS : WORK_NOW_JOBS.slice(0, 3);
  const workNowJobs = allWorkNowJobs.slice(0, visibleWorkNowCount);
  const hasMoreWorkNow = visibleWorkNowCount < allWorkNowJobs.length;
  const remainingWorkNow = allWorkNowJobs.length - visibleWorkNowCount;

  const allVacancyJobs = VACANCY_JOBS;
  const vacancyJobs = allVacancyJobs.slice(0, visibleVacancyCount);
  const hasMoreVacancies = visibleVacancyCount < allVacancyJobs.length;
  const remainingVacancies = allVacancyJobs.length - visibleVacancyCount;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── MESH GRADIENT — absolute overlay, top 30% ── */}
      <MeshGradient height={screenHeight * 0.30} />

      {/* ── STICKY SEARCH (appears when inline search scrolls away) ── */}
      {searchSticky && (
        <View style={styles.stickySearchContainer}>
          <View style={styles.stickySearchRow}>
            <Pressable style={styles.searchInputWrap}>
              <Icon name="search" size={20} color={colors.textMuted} />
              <Text style={styles.searchPlaceholder}>Search Job...</Text>
            </Pressable>
            <Pressable style={styles.filterIconBtn} onPress={() => setFilterVisible(true)}>
              <Icon name="sliders" size={20} color={colors.primaryContrast} />
            </Pressable>
          </View>
          {/* ── STICKY DATE FILTER (stacks below sticky search) ── */}
          {dateFilterSticky && jobType === 'work-now' && (
            <DateSelectorFilter
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          )}
        </View>
      )}

      {/* ── SCROLLABLE CONTENT ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* ── HEADER (scrolls away) ── */}
        <View style={styles.header}>
          <Pressable style={styles.avatar} onPress={() => navigation?.navigate?.('ProfileView')}>
            <Text style={styles.avatarText}>JD</Text>
          </Pressable>
          <Pressable style={styles.headerLeft} onPress={handleGreetingTap}>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.subtitle}>Find your next shift</Text>
          </Pressable>
          <Pressable style={styles.notificationBtn} hitSlop={8}>
            <Text style={{ fontFamily: 'feather', fontSize: 24, color: colors.foreground }}>{String.fromCharCode(61726)}</Text>
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        {/* ── TAB TOGGLE (scrolls with header) ── */}
        <JobTypeToggle value={jobType} onChange={setJobType} />

        {/* ── SEARCH + FILTER (scrolls, then sticks) ── */}
        <View style={styles.searchRow} onLayout={onSearchRowLayout}>
          <Pressable style={styles.searchInputWrap}>
            <Icon name="search" size={20} color={colors.textMuted} />
            <Text style={styles.searchPlaceholder}>Search Job...</Text>
          </Pressable>
          <Pressable style={styles.filterIconBtn} onPress={() => setFilterVisible(true)}>
            <Icon name="sliders" size={20} color={colors.primaryContrast} />
          </Pressable>
        </View>

        {/* ── SECTION 4: PICKED FOR YOU CAROUSEL ── */}
        <View onLayout={onCarouselLayout}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Picked for you</Text>
            <Pressable>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            snapToInterval={280 + 12}
            snapToAlignment="start"
            decelerationRate="fast"
            onScroll={(e) => {
              const offset = e.nativeEvent.contentOffset.x;
              const idx = Math.round(offset / (280 + 12));
              setActiveCarouselIndex(idx);
            }}
            scrollEventThrottle={16}
          >
            {PICKED_FOR_YOU.map((job, index) => (
              <JobCard
                key={job.id}
                variant="photo"
                title={job.title}
                company={job.company}
                location={job.distance}
                time={job.time}
                hourlyRate={job.hourlyRate}
                rating={job.rating}
                reviewCount={job.reviewCount}
                image={job.image}
                video={job.video}
                isActive={index === activeCarouselIndex}
                dateLabel={job.dateLabel}
                onPress={() => handleJobPress(job.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Count Row ── */}
        <View style={styles.countRow}>
          <Text style={styles.countLabel}>
            {jobType === 'work-now' ? 'Open shifts' : 'Vacancies'}
          </Text>
          <View style={styles.countActions}>
            <Pressable
              style={styles.mapBtn}
              hitSlop={8}
              onPress={() => navigation?.navigate?.('MapView')}
            >
              <Icon name="map" size={20} color={colors.primaryContrast} />
            </Pressable>
          </View>
        </View>

        {/* ── SECTION 5: DATE SELECTOR (inline, work-now only) ── */}
        {jobType === 'work-now' && !dateFilterSticky && (
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
          >
            <DateSelectorFilter
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </Animated.View>
        )}

        {/* ── SECTION 6: JOB FEED ── */}
        {jobType === 'work-now' ? (
          <Animated.View
            key="work-now-feed"
            entering={FadeIn.duration(150)}
            style={styles.feedContainer}
          >
            {workNowJobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <Animated.View
                entering={FadeIn.delay(Math.min(index, 5) * 50).duration(150)}
                style={index > 0 ? styles.cardGap : undefined}
              >
                <JobCard
                  variant="compact"
                  title={job.title}
                  company={job.company}
                  location={job.distance}
                  time={job.time}
                  hourlyRate={job.hourlyRate}
                  rating={job.rating}
                  reviewCount={job.reviewCount}
                  image={job.image}
                  isBookmarked={bookmarks[job.id] ?? job.isBookmarked}
                  onBookmark={() => toggleBookmark(job.id)}
                  onPress={() => handleJobPress(job.id)}
                />
              </Animated.View>
              {/* EngagementCard after the 5th card */}
              {index === 4 && currentEngagement && (
                <View key={`engagement-wn-${currentEngagement.id}`} style={styles.cardGap}>
                  <EngagementCard
                    data={currentEngagement}
                    onDismiss={() => setEngagementIndex((i) => i + 1)}
                  />
                </View>
              )}
            </React.Fragment>
            ))}
            {/* See more button */}
            {hasMoreWorkNow && (
              <Pressable
                style={styles.seeMoreBtn}
                onPress={() => setVisibleWorkNowCount((c) => c + 10)}
              >
                <Text style={styles.seeMoreText}>
                  See {Math.min(remainingWorkNow, 10)} more jobs
                </Text>
              </Pressable>
            )}
          </Animated.View>
        ) : (
          <Animated.View
            key="vacancies-feed"
            entering={FadeIn.duration(150)}
            style={styles.feedContainer}
          >
            {vacancyJobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <Animated.View
                entering={FadeIn.delay(Math.min(index, 5) * 50).duration(150)}
                style={index > 0 ? styles.cardGap : undefined}
              >
                <JobCard
                  variant="compact"
                  title={job.title}
                  company={job.company}
                  location={job.distance}
                  hourlyRate={job.salary}
                  rating={job.rating}
                  reviewCount={job.reviewCount}
                  image={job.image}
                  isBookmarked={bookmarks[job.id] ?? job.isBookmarked}
                  onBookmark={() => toggleBookmark(job.id)}
                  onPress={() => handleJobPress(job.id)}
                  badge={job.contractType}
                />
              </Animated.View>
              {/* EngagementCard after the 5th card */}
              {index === 4 && currentEngagement && (
                <View key={`engagement-vc-${currentEngagement.id}`} style={styles.cardGap}>
                  <EngagementCard
                    data={currentEngagement}
                    onDismiss={() => setEngagementIndex((i) => i + 1)}
                  />
                </View>
              )}
            </React.Fragment>
            ))}
            {/* See more button */}
            {hasMoreVacancies && (
              <Pressable
                style={styles.seeMoreBtn}
                onPress={() => setVisibleVacancyCount((c) => c + 10)}
              >
                <Text style={styles.seeMoreText}>
                  See {Math.min(remainingVacancies, 10)} more jobs
                </Text>
              </Pressable>
            )}
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── FILTER BOTTOM SHEET ── */}
      <FilterBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: spacing.xs,
    gap: spacing.l,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    ...typography.h3,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.sm.fontSize,
    color: colors.white,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#F7F8FA',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.destructive,
    borderWidth: 2,
    borderColor: colors.white,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    gap: spacing.s,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.m,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.input,
  },
  searchPlaceholder: {
    flex: 1,
    ...typography.body,
    color: colors.textMuted,
  },
  filterIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.input,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickySearchContainer: {
    backgroundColor: Platform.OS === 'web' ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.85)',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.input,
    zIndex: 2,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(20px)' } : {}),
  } as any,
  stickySearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    gap: spacing.s,
  },
  stickyDateFilter: {
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.input,
    zIndex: 1,
  },
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    marginTop: spacing.xl,
    marginBottom: spacing.s,
  },
  sectionTitle: {
    ...typography.h4,
  },
  seeAll: {
    ...typography.label,
    color: colors.primary,
  },
  carouselContent: {
    paddingHorizontal: spacing.m,
    gap: spacing.xxl,
  },
  divider: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
  },
  dividerLine: {
    height: 1,
    backgroundColor: colors.input,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.s,
  },
  countLabel: {
    ...typography.h4,
  },
  countActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  mapBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedContainer: {
    paddingHorizontal: spacing.m,
  },
  cardGap: {
    marginTop: spacing.l,
  },
  seeMoreBtn: {
    alignSelf: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.s,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  seeMoreText: {
    ...typography.emphasisSmall,
    color: colors.primary,
  },
});
