import React from 'react';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../tokens';

export type IconSize = 16 | 20 | 24 | 32;

const sizeMap: Record<IconSize, number> = {
  16: 16,
  20: 20,
  24: 24,
  32: 32,
};

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

interface IconProps {
  name: FeatherIconName;
  size?: IconSize;
  color?: string;
}

export function Icon({ name, size = 24, color = colors.icon }: IconProps) {
  return <Feather name={name} size={sizeMap[size]} color={color} />;
}
