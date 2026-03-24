import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, fontFamilies, typeScale, shadows, gradients } from '../../tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number; lineHeight: number; iconGap: number }> = {
  sm: { height: 36, paddingHorizontal: 16, fontSize: typeScale.sm.fontSize, lineHeight: typeScale.sm.lineHeight, iconGap: 6 },
  md: { height: 44, paddingHorizontal: 20, fontSize: typeScale.base.fontSize, lineHeight: typeScale.base.lineHeight, iconGap: 8 },
  lg: { height: 52, paddingHorizontal: 24, fontSize: typeScale.base.fontSize, lineHeight: typeScale.base.lineHeight, iconGap: 10 },
};

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  onPress,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    height: s.height,
    borderRadius: radius.m,
    overflow: 'hidden',
    opacity: isDisabled ? 0.5 : 1,
  };

  const innerStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s.paddingHorizontal,
    gap: s.iconGap,
  };

  const textColor = variant === 'primary'
    ? colors.primaryForeground
    : variant === 'secondary'
    ? colors.primary
    : colors.foreground;

  const textStyle: TextStyle = {
    fontFamily: fontFamilies.semibold,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    color: textColor,
  };

  const content = (
    <View style={innerStyle}>
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {leftIcon}
          <Text style={textStyle}>{label}</Text>
          {rightIcon}
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          containerStyle,
          pressed && { opacity: 0.8 },
          shadows.card,
        ]}
      >
        <LinearGradient
          colors={gradients.primaryButton.colors as unknown as readonly [string, string, ...string[]]}
          start={gradients.primaryButton.start}
          end={gradients.primaryButton.end}
          style={StyleSheet.absoluteFill}
        />
        {content}
      </Pressable>
    );
  }

  const variantBg: ViewStyle = variant === 'secondary'
    ? { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.primary }
    : { backgroundColor: colors.transparent };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        containerStyle,
        variantBg,
        pressed && { opacity: 0.7 },
      ]}
    >
      {content}
    </Pressable>
  );
}
