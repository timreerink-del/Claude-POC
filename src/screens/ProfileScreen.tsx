import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/ui';
import { colors, fontFamilies, typeScale, spacing } from '../tokens';

export function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Your account</Text>
      </View>
      <View style={styles.empty}>
        <View style={styles.iconCircle}>
          <Icon name="user" size={32} color={colors.border} />
        </View>
        <Text style={styles.emptyTitle}>Coming soon</Text>
        <Text style={styles.emptySubtitle}>
          Manage your profile, ratings, and preferences
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.s,
    paddingBottom: spacing.m,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.xl.fontSize,
    lineHeight: typeScale.xl.lineHeight,
    color: colors.foreground,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
    marginTop: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.l,
  },
  emptyTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.lg.fontSize,
    lineHeight: typeScale.lg.lineHeight,
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.textMuted,
  },
});
