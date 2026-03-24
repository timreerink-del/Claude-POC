import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Icon } from './Icon';
import { colors, fontFamilies, typeScale, typography, spacing, radius } from '../../tokens';

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ComponentProps<typeof Icon>['name'];
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  icon,
  defaultExpanded = false,
  children,
}: CollapsibleSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const chevronRotation = useSharedValue(defaultExpanded ? 1 : 0);
  const contentHeight = useSharedValue(defaultExpanded ? 1 : 0);

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    chevronRotation.value = withSpring(next ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
    contentHeight.value = withTiming(next ? 1 : 0, {
      duration: 250,
      easing: Easing.out(Easing.ease),
    });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value * 180}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentHeight.value,
    maxHeight: contentHeight.value === 0 ? 0 : 2000,
    overflow: 'hidden' as const,
  }));

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleExpanded} style={styles.header} hitSlop={4}>
        <View style={styles.headerLeft}>
          {icon && (
            <Icon name={icon} size={20} color={colors.foreground} />
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Animated.View style={chevronStyle}>
          <Icon name="chevron-down" size={20} color={colors.icon} />
        </Animated.View>
      </Pressable>
      <Animated.View style={contentStyle}>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.input,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  title: {
    ...typography.h5,
  },
  content: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
  },
});
