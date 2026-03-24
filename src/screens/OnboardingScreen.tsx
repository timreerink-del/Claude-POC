import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ONBOARDING_KEY } from '../navigation';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '../components/ui';
import { colors, fontFamilies, typeScale, typography, spacing, radius } from '../tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Step data ────────────────────────────────────────────

interface OnboardingStep {
  icon: string;
  heading: string;
  body: string;
  gradientColors: readonly [string, string];
  illustrationSource?: any;
}

const STEPS: OnboardingStep[] = [
  {
    icon: 'map-pin',
    heading: 'find jobs\nnear you.',
    body: 'Browse through hundreds of shifts that match your skills and location.',
    gradientColors: ['#FFF0F5', '#F0EEFF'],
    illustrationSource: require('../../assets/illustrations/rocket.png'),
  },
  {
    icon: 'calendar',
    heading: 'manage your\nown schedule.',
    body: 'Know when and where you\'ll be working. Planning made easy, just for you.',
    gradientColors: ['#FFF5EE', '#F5EEFF'],
    illustrationSource: require('../../assets/illustrations/clipboard.png'),
  },
  {
    icon: 'users',
    heading: 'connect with\npeers instantly.',
    body: 'The platform that connects you with companies that need your skills today.',
    gradientColors: ['#EEF5FF', '#EEFFF5'],
    illustrationSource: require('../../assets/illustrations/globe.png'),
  },
  {
    icon: 'user',
    heading: 'build your\nown profile.',
    body: 'Stand out as an individual. Build a profile and apply for the jobs you love.',
    gradientColors: ['#F0EEFF', '#EEF5FF'],
    illustrationSource: require('../../assets/illustrations/profile.png'),
  },
];

// ── Animated progress dot ────────────────────────────────

function ProgressDot({ active }: { active: boolean }) {
  const width = useSharedValue(active ? 24 : 8);
  const bg = useSharedValue(active ? 1 : 0);

  React.useEffect(() => {
    width.value = withSpring(active ? 24 : 8, { damping: 14, stiffness: 300 });
    bg.value = withTiming(active ? 1 : 0, { duration: 200 });
  }, [active]);

  const dotStyle = useAnimatedStyle(() => ({
    width: width.value,
    backgroundColor: bg.value > 0.5 ? colors.primary : colors.input,
  }));

  return <Animated.View style={[styles.dot, dotStyle]} />;
}

// ── Main component ───────────────────────────────────────

export function OnboardingScreen({ navigation }: { navigation?: any }) {
  const [currentStep, setCurrentStep] = useState(0);

  const illustrationX = useSharedValue(0);
  const textX = useSharedValue(0);
  const contentOpacity = useSharedValue(1);
  const isTransitioning = useRef(false);

  const animateToStep = useCallback(
    (nextStep: number) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;

      const direction = nextStep > currentStep ? -1 : 1;

      // Fade out quickly
      contentOpacity.value = withTiming(0, {
        duration: 120,
        easing: Easing.out(Easing.ease),
      });

      // Update step after fade-out
      setTimeout(() => {
        setCurrentStep(nextStep);

        illustrationX.value = -direction * 100;
        textX.value = -direction * 50;

        contentOpacity.value = withTiming(1, {
          duration: 280,
          easing: Easing.out(Easing.ease),
        });
        illustrationX.value = withSpring(0, {
          damping: 18,
          stiffness: 200,
        });
        textX.value = withSpring(0, {
          damping: 20,
          stiffness: 180,
        });

        setTimeout(() => {
          isTransitioning.current = false;
        }, 300);
      }, 140);
    },
    [currentStep, contentOpacity, illustrationX, textX]
  );

  const completeOnboarding = () => {
    AsyncStorage.setItem(ONBOARDING_KEY, 'true').finally(() => {
      navigation?.replace?.('Main');
    });
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      animateToStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      animateToStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const step = STEPS[currentStep];

  const illustrationStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: illustrationX.value }],
    opacity: contentOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: textX.value }],
    opacity: contentOpacity.value,
  }));

  return (
    <View style={styles.root}>
      {/* Full-screen gradient background */}
      <LinearGradient
        colors={step.gradientColors as unknown as readonly [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* Header — Skip only */}
          <View style={styles.header}>
            <View style={{ width: 44 }} />
            {currentStep < STEPS.length - 1 ? (
              <Pressable onPress={handleSkip} hitSlop={12}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            ) : (
              <View style={{ width: 44 }} />
            )}
          </View>

          {/* Illustration area */}
          <Animated.View style={[styles.illustrationArea, illustrationStyle]}>
            {step.illustrationSource ? (
              <Image
                source={step.illustrationSource}
                style={styles.illustrationImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.illustrationIconCircle}>
                <Icon name={step.icon as any} size={40} color={colors.primary} />
              </View>
            )}
          </Animated.View>

          {/* Content card */}
          <Animated.View style={[styles.contentCard, textStyle]}>
            <Text style={styles.heading}>{step.heading}</Text>
            <Text style={styles.body}>{step.body}</Text>
          </Animated.View>

          {/* Bottom: dots + CTA */}
          <View style={styles.bottom}>
            {/* Progress dots */}
            <View style={styles.dotsContainer}>
              {STEPS.map((_, index) => (
                <ProgressDot key={index} active={index === currentStep} />
              ))}
            </View>

            {/* CTA Button */}
            <Pressable style={styles.ctaButton} onPress={handleNext}>
              <Text style={styles.ctaText}>
                {currentStep === STEPS.length - 1 ? 'Get started' : 'Next'}
              </Text>
              {currentStep < STEPS.length - 1 && (
                <Icon name="arrow-right" size={20} color={colors.white} />
              )}
            </Pressable>

            {/* Back text link (screens 2-4) */}
            {currentStep > 0 ? (
              <Pressable onPress={handleBack} hitSlop={12} style={styles.backTextBtn}>
                <Text style={styles.backText}>Back</Text>
              </Pressable>
            ) : (
              <View style={{ height: 44 }} />
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    paddingBottom: spacing.m,
    height: 52,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.textMuted,
  },

  // Illustration
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 320,
  },
  illustrationImage: {
    width: SCREEN_WIDTH * 0.65,
    height: SCREEN_WIDTH * 0.65,
  },
  illustrationIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  // Content card
  contentCard: {
    backgroundColor: colors.white,
    borderRadius: radius.l,
    padding: spacing.xl,
    marginBottom: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  heading: {
    ...typography.h2,
    marginBottom: spacing.s,
  },
  body: {
    ...typography.body,
    color: colors.textMuted,
  },

  // Bottom section
  bottom: {
    paddingBottom: spacing.m,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.l,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: radius.m,
    width: '100%',
  },
  ctaText: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    color: colors.white,
  },
  backTextBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  backText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.base.fontSize,
    color: colors.textMuted,
  },
});
