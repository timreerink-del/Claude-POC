import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { colors, fontFamilies, typography, spacing } from '../../tokens';

const TAB_BAR_HEIGHT = 60;

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

export function BottomNavBar({
  state,
  navigation,
}: {
  state: any;
  descriptors?: any;
  navigation: any;
}) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'web' ? 0 : Math.max(insets.bottom, 8);

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottomPadding },
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
