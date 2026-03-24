import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Icon } from '../components/ui';
import { colors, fontFamilies, typeScale, typography, spacing, radius, shadows, sizes } from '../tokens';
import { MOCK_JOBS } from '../data/mockJobs';

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Icon>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconContainer}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export function JobDetailScreen({ route, navigation }: { route?: any; navigation?: any }) {
  const jobId = route?.params?.jobId ?? '1';
  const job = MOCK_JOBS.find((j) => j.id === jobId) ?? MOCK_JOBS[0];

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image placeholder */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={['#D6E4FF', '#EBE0FF', '#FFD6E7'] as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroIconCircle}>
              <Icon name="briefcase" size={32} color={colors.primary} />
            </View>
          </LinearGradient>

          {/* Back button */}
          <SafeAreaView style={styles.backBtnSafe} edges={['top']}>
            <Pressable
              style={styles.backBtn}
              onPress={() => navigation?.goBack?.()}
              hitSlop={12}
            >
              <Icon name="arrow-left" size={24} color={colors.foreground} />
            </Pressable>
            <Pressable style={styles.shareBtn} hitSlop={12}>
              <Icon name="share-2" size={20} color={colors.foreground} />
            </Pressable>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title section */}
          <View style={styles.titleSection}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.companyName}>{job.company}</Text>

            {/* Rating row */}
            <View style={styles.ratingRow}>
              <Icon name="star" size={16} color={colors.warningIcon} />
              <Text style={styles.ratingText}>
                {job.rating.toFixed(2)} ({job.reviewCount} reviews)
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Info rows */}
          <View style={styles.infoSection}>
            <InfoRow icon="dollar-sign" label="Pay" value={job.hourlyRate} />
            <InfoRow icon="clock" label="Schedule" value={job.schedule} />
            <InfoRow icon="map-pin" label="Location" value={`${job.location} · ${job.distance}`} />
            <InfoRow icon="tag" label="Category" value={job.category} />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>About this shift</Text>
            <Text style={styles.descText}>{job.description}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Requirements */}
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {job.requirements.map((req, i) => (
              <View key={i} style={styles.reqRow}>
                <Icon name="check-circle" size={16} color={colors.successIcon} />
                <Text style={styles.reqText}>{req}</Text>
              </View>
            ))}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Employer info */}
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>About {job.company}</Text>
            <View style={styles.employerCard}>
              <View style={styles.employerAvatar}>
                <Icon name="briefcase" size={24} color={colors.primary} />
              </View>
              <View style={styles.employerInfo}>
                <Text style={styles.employerName}>{job.company}</Text>
                <View style={styles.employerMeta}>
                  <Icon name="star" size={16} color={colors.warningIcon} />
                  <Text style={styles.employerMetaText}>
                    {job.rating.toFixed(1)} · {job.reviewCount} reviews
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom spacer for CTA */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Fixed bottom CTA */}
      <SafeAreaView style={styles.ctaContainer} edges={['bottom']}>
        <View style={styles.ctaInner}>
          <View style={styles.ctaLeft}>
            <Text style={styles.ctaRate}>{job.hourlyRate}</Text>
            <Text style={styles.ctaSchedule}>{job.time || job.schedule}</Text>
          </View>
          <View style={styles.ctaBtnWrapper}>
            <Button
              variant="primary"
              size="lg"
              label="Apply now"
              onPress={() => {}}
              leftIcon={<Icon name="check" size={20} color={colors.white} />}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Hero
  heroContainer: {
    height: 220,
    position: 'relative',
  },
  heroGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  backBtnSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.xs,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  content: {
    paddingHorizontal: spacing.l,
    marginTop: -spacing.m,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.l,
    borderTopRightRadius: radius.l,
    paddingTop: spacing.xl,
  },

  // Title
  titleSection: {
    marginBottom: spacing.l,
  },
  jobTitle: {
    ...typography.h3,
  },
  companyName: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  ratingText: {
    ...typography.label,
    color: colors.textMuted,
  },

  // Info rows
  infoSection: {
    gap: spacing.m,
    marginVertical: spacing.l,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.s,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.emphasis,
    color: colors.foreground,
  },

  // Dividers
  divider: {
    height: 1,
    backgroundColor: colors.input,
  },

  // Description
  descSection: {
    marginVertical: spacing.l,
  },
  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.s,
  },
  descText: {
    ...typography.body,
    lineHeight: typeScale.base.lineHeight + 6,
    color: colors.textMuted,
  },

  // Requirements
  reqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  reqText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.textMuted,
  },

  // Employer
  employerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    backgroundColor: colors.secondary,
    padding: spacing.m,
    borderRadius: radius.m,
  },
  employerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  employerInfo: {
    flex: 1,
  },
  employerName: {
    ...typography.h5,
  },
  employerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  employerMetaText: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
  },

  // CTA
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.input,
    ...shadows.dropdown,
  },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.xs,
    gap: spacing.m,
  },
  ctaLeft: {
    flex: 1,
  },
  ctaRate: {
    ...typography.emphasisLarge,
    color: colors.primary,
  },
  ctaSchedule: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  ctaBtnWrapper: {
    flex: 1,
  },
});
