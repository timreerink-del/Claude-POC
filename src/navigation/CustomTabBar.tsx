import React, { useRef, useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fontFamilies, typeScale, typography, spacing } from '../tokens';

const TAB_BAR_HEIGHT = 60;
const ONBOARDING_KEY = '@dmp_onboarding_complete';

interface TabConfig {
  name: string;
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
}

const TABS: TabConfig[] = [
  { name: 'Discovery', label: 'discovery', icon: 'search' },
  { name: 'Planning', label: 'planning', icon: 'calendar' },
  { name: 'Connect', label: 'connect', icon: 'message-circle' },
  { name: 'Profile', label: 'my work', icon: 'briefcase' },
];

// Animated tab item with spring scale on selection
function AnimatedTab({
  tab,
  isFocused,
  onPress,
}: {
  tab: TabConfig;
  isFocused: boolean;
  onPress: () => void;
}) {
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (isFocused) {
      // Spring pop on becoming active
      iconScale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 400 }),
        withSpring(1, { damping: 10, stiffness: 250 })
      );
    }
  }, [isFocused]);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const color = isFocused ? colors.primary : colors.textMuted;

  return (
    <Pressable
      onPress={onPress}
      style={styles.tab}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
    >
      <Animated.View style={iconAnimStyle}>
        <Feather name={tab.icon} size={22} color={color} />
      </Animated.View>
      <Text style={[styles.label, { color }]}>{tab.label}</Text>
    </Pressable>
  );
}

export function CustomTabBar({
  state,
  navigation,
}: {
  state: any;
  descriptors?: any;
  navigation: any;
}) {
  const insets = useSafeAreaInsets();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTripleTap = useCallback(() => {
    tapCountRef.current += 1;

    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      AsyncStorage.removeItem(ONBOARDING_KEY).then(() => {
        Alert.alert('Resetting to onboarding...', '', [
          {
            text: 'OK',
            onPress: () => {
              navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: 'Onboarding' }],
              });
            },
          },
        ]);
      });
      return;
    }

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 500);
  }, [navigation]);

  return (
    <Pressable onPress={handleTripleTap}>
      <View
        style={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, 8) },
        ]}
      >
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;

          return (
            <AnimatedTab
              key={tab.name}
              tab={tab}
              isFocused={isFocused}
              onPress={() => {
                if (!isFocused) {
                  navigation.navigate(tab.name);
                }
              }}
            />
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingTop: spacing.xs,
    height: TAB_BAR_HEIGHT + 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    ...typography.nav,
  },
});
