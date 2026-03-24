import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, fontFamilies, typeScale, spacing } from '../../tokens';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function Chip({ label, active = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        active ? styles.active : styles.inactive,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: active ? colors.primaryForeground : colors.foreground },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    paddingHorizontal: spacing.s,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: colors.primary,
  },
  inactive: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
  },
});
