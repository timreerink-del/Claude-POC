import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '../ui';
import { colors, fontFamilies, typeScale, typography, spacing, radius, shadows } from '../../tokens';
import { EngagementCardData } from '../../data/engagementCards';

// ── Pill ─────────────────────────────────────────────────

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Pill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        scale.value = withSpring(0.92, { damping: 12, stiffness: 400 });
        setTimeout(() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 200 });
        }, 80);
        onPress();
      }}
      style={[
        pillStyles.pill,
        selected && pillStyles.pillSelected,
        animatedStyle,
      ]}
    >
      <Text
        style={[
          pillStyles.pillText,
          selected && pillStyles.pillTextSelected,
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const pillStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.input,
    backgroundColor: colors.white,
  },
  pillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.tertiary,
  },
  pillText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
  },
  pillTextSelected: {
    color: colors.primary,
  },
});

// ── Engagement Card ──────────────────────────────────────

interface EngagementCardProps {
  data: EngagementCardData;
  onDismiss?: () => void;
  onCtaPress?: () => void;
}

export function EngagementCard({ data, onDismiss, onCtaPress }: EngagementCardProps) {
  const [dismissed, setDismissed] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const hasPills = !!data.pills && data.pills.length > 0;

  const togglePill = (label: string) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((i) => i !== label)
        : [...prev, label]
    );
  };

  const handleCta = () => {
    if (hasPills && selected.length === 0) return;
    if (hasPills) {
      setSaved(true);
      setTimeout(() => {
        setDismissed(true);
        onDismiss?.();
      }, 2000);
    } else {
      onCtaPress?.();
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  if (saved) {
    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        style={cardStyles.savedCard}
      >
        <Icon name="check-circle" size={32} color={colors.successIcon} />
        <Text style={cardStyles.savedText}>Preferences saved!</Text>
        <Text style={cardStyles.savedSubtext}>
          We'll show you more relevant jobs.
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={cardStyles.wrapper}
    >
      {/* ── 3D illustration breaking out of the card ── */}
      <View style={cardStyles.illustrationContainer}>
        {data.illustration ? (
          <Image
            source={data.illustration}
            style={cardStyles.illustrationImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={cardStyles.illustrationEmoji}>{data.emoji}</Text>
        )}
      </View>

      {/* ── The card itself ── */}
      <LinearGradient
        colors={data.gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyles.card}
      >
        {/* Spacer for the overflowing illustration */}
        <View style={cardStyles.illustrationSpacer} />

        {/* Dismiss button */}
        <Pressable
          style={cardStyles.dismissBtn}
          onPress={handleDismiss}
          hitSlop={12}
        >
          <Icon name="x" size={18} color="#9CA3AF" />
        </Pressable>

        {/* Content */}
        <Text style={cardStyles.heading}>{data.heading}</Text>
        {data.body && <Text style={cardStyles.body}>{data.body}</Text>}

        {/* Pills (optional) */}
        {hasPills && (
          <View style={cardStyles.pillsContainer}>
            {data.pills!.map((pill) => (
              <Pill
                key={pill}
                label={pill}
                selected={selected.includes(pill)}
                onPress={() => togglePill(pill)}
              />
            ))}
          </View>
        )}

        {/* CTA button */}
        <Pressable
          style={[
            cardStyles.ctaBtn,
            hasPills && selected.length === 0 && cardStyles.ctaBtnDisabled,
          ]}
          onPress={handleCta}
          disabled={hasPills && selected.length === 0}
        >
          <Text
            style={[
              cardStyles.ctaText,
              hasPills && selected.length === 0 && cardStyles.ctaTextDisabled,
            ]}
          >
            {data.ctaLabel}
          </Text>
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
}

const ILLUSTRATION_SIZE = 140;
const BREAKOUT = 60;

const cardStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginTop: BREAKOUT, // space for the breakout above
    ...(Platform.OS === 'web' ? { overflow: 'visible' as any } : {}),
  },
  illustrationContainer: {
    position: 'absolute',
    top: -BREAKOUT,
    alignSelf: 'center',
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...(Platform.OS === 'web'
      ? { left: '50%', marginLeft: -(ILLUSTRATION_SIZE / 2) }
      : {} as any),
  },
  illustrationImage: {
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
  },
  illustrationEmoji: {
    fontSize: 80,
    ...(Platform.OS === 'web'
      ? { textShadow: '0 8px 24px rgba(0,0,0,0.12)' }
      : {} as any),
  },
  card: {
    borderRadius: 20,
    paddingTop: ILLUSTRATION_SIZE - BREAKOUT + 8,
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'visible' as any,
    ...shadows.card,
  },
  illustrationSpacer: {
    height: 0,
  },
  dismissBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  heading: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: 6,
  },
  body: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'center',
    marginBottom: spacing.m,
  },
  ctaBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnDisabled: {
    backgroundColor: colors.disabled,
  },
  ctaText: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.white,
  },
  ctaTextDisabled: {
    color: colors.textMuted,
  },
  savedCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 120,
    ...shadows.card,
  },
  savedText: {
    ...typography.emphasis,
    color: colors.successText,
  },
  savedSubtext: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});
