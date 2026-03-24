import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Button, Icon, CollapsibleSection } from '../components/ui';
import { colors, fontFamilies, typeScale, spacing, radius, shadows, sizes } from '../tokens';
import { MOCK_JOBS, WORK_NOW_JOBS } from '../data/mockJobs';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ── Image map for jobs ──────────────────────────────────

const JOB_IMAGES: Record<string, string> = {
  'wn-1': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'wn-2': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
  'wn-3': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
  'wn-4': 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800',
  'wn-5': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
  'wn-6': 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800',
  'pfy-1': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'pfy-2': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
  'pfy-3': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  'pfy-4': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
  'pfy-5': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
  '1': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
  '2': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
  '3': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  '4': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
  '5': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  '6': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  '7': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  '8': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
};

// ── Mock shift data ─────────────────────────────────────

interface ShiftSlot {
  id: string;
  day: string;
  date: string;
  time: string;
  rate: string;
  spots: number;
  cancellationPolicy: string;
  socialProof?: string;
}

const MOCK_SHIFTS: ShiftSlot[] = [
  { id: 's1', day: 'Monday', date: 'October 6th', time: '8:00-17:00', rate: '€30,10h', spots: 41, cancellationPolicy: 'Cancellation policy minimum 8h', socialProof: 'Company you know work here' },
  { id: 's2', day: 'Monday', date: 'October 6th', time: '8:00-17:00', rate: '€30,10h', spots: 41, cancellationPolicy: 'Cancellation policy minimum 8h' },
  { id: 's3', day: 'Monday', date: 'October 6th', time: '8:00-17:00', rate: '€30,10h', spots: 41, cancellationPolicy: 'Cancellation policy minimum 8h' },
  { id: 's4', day: 'Monday', date: 'October 6th', time: '8:00-17:00', rate: '€30,10h', spots: 41, cancellationPolicy: 'Cancellation policy minimum 8h' },
];

// ── Tab Component ───────────────────────────────────────

type DetailTab = 'about' | 'client';

function TabRow({
  activeTab,
  onTabChange,
}: {
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
}) {
  return (
    <View style={tabStyles.container}>
      <Pressable
        style={tabStyles.tab}
        onPress={() => onTabChange('about')}
      >
        <View style={tabStyles.labelRow}>
          <Icon name="briefcase" size={16} color={activeTab === 'about' ? colors.primaryContrast : colors.textMuted} />
          <Text style={[tabStyles.label, activeTab === 'about' && tabStyles.labelActive]}>
            About the job
          </Text>
        </View>
        <View style={activeTab === 'about' ? tabStyles.activeIndicator : tabStyles.inactiveIndicator} />
      </Pressable>
      <Pressable
        style={tabStyles.tab}
        onPress={() => onTabChange('client')}
      >
        <View style={tabStyles.labelRow}>
          <Icon name="users" size={16} color={activeTab === 'client' ? colors.primaryContrast : colors.textMuted} />
          <Text style={[tabStyles.label, activeTab === 'client' && tabStyles.labelActive]}>
            About the client
          </Text>
        </View>
        <View style={activeTab === 'client' ? tabStyles.activeIndicator : tabStyles.inactiveIndicator} />
      </Pressable>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 48,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.primaryContrast,
    fontFamily: fontFamilies.semibold,
  },
  activeIndicator: {
    width: '100%',
    height: 3,
    backgroundColor: colors.primaryContrast,
    borderRadius: radius.pill,
  },
  inactiveIndicator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
  },
});

// ── Shift Card (Figma style) ────────────────────────────

function ShiftCard({
  shift,
  selected,
  onToggle,
}: {
  shift: ShiftSlot;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable onPress={onToggle} style={shiftStyles.card}>
      {/* Top row: day + date, rate */}
      <View style={shiftStyles.topRow}>
        <Text style={shiftStyles.dayDate}>{shift.day} {shift.date}</Text>
        <Text style={shiftStyles.rate}>{shift.rate}</Text>
      </View>
      {/* Time */}
      <Text style={shiftStyles.time}>{shift.time}</Text>
      {/* Spots + Cancellation */}
      <Text style={shiftStyles.meta}>{shift.spots} spots available</Text>
      <Text style={shiftStyles.meta}>{shift.cancellationPolicy}</Text>
      {/* Social proof */}
      {shift.socialProof && (
        <View style={shiftStyles.socialRow}>
          <View style={shiftStyles.avatarStack}>
            <View style={[shiftStyles.miniAvatar, { backgroundColor: colors.primary }]} />
            <View style={[shiftStyles.miniAvatar, { backgroundColor: colors.gradientPink, marginLeft: -6 }]} />
          </View>
          <Text style={shiftStyles.socialText}>{shift.socialProof}</Text>
        </View>
      )}
      {/* Checkbox */}
      <View style={shiftStyles.checkboxWrap}>
        <View style={[shiftStyles.checkbox, selected && shiftStyles.checkboxSelected]}>
          {selected && <Icon name="check" size={14} color={colors.white} />}
        </View>
      </View>
    </Pressable>
  );
}

const shiftStyles = StyleSheet.create({
  card: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: radius.m,
    position: 'relative',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayDate: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.foreground,
  },
  rate: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.foreground,
  },
  time: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
    marginTop: 4,
  },
  meta: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
    color: colors.textMuted,
    marginTop: 2,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  avatarStack: {
    flexDirection: 'row',
  },
  miniAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
  },
  socialText: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
    color: colors.textMuted,
  },
  checkboxWrap: {
    position: 'absolute',
    bottom: spacing.m,
    right: spacing.m,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});

// ── Main Screen ─────────────────────────────────────────

export function ShiftDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const jobId = route?.params?.jobId ?? '1';

  // Find job from all data sources
  const mockJob = MOCK_JOBS.find((j) => j.id === jobId);
  const wnJob = WORK_NOW_JOBS.find((j) => j.id === jobId);
  const job = mockJob ?? {
    id: jobId,
    title: wnJob?.title ?? 'Bartender',
    company: wnJob?.company ?? 'Zome Amsterdam',
    location: wnJob?.location ?? 'Amsterdam',
    distance: wnJob?.distance ?? '5 km',
    hourlyRate: wnJob?.hourlyRate ?? '€32,00 / hour',
    rating: wnJob?.rating ?? 4.5,
    reviewCount: wnJob?.reviewCount ?? 100,
    isBookmarked: wnJob?.isBookmarked ?? false,
    category: wnJob?.category ?? 'Hospitality',
    description: 'Join us for an exciting bartending opportunity at the upcoming Rock the Night concert! As a bartender, read more...',
    schedule: wnJob?.time ?? '9:00 – 17:00',
    requirements: [
      'Previous experience in a warehouse or logistics role (preferred but not mandatory).',
      'Ability to lift and carry heavy items (up to 50kg).',
      'Strong attention to detail and ability to follow instructions.',
      'Forklift certification (a plus).',
    ],
    time: wnJob?.time,
  };

  const imageUrl = JOB_IMAGES[jobId] ?? 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800';

  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked);
  const [activeTab, setActiveTab] = useState<DetailTab>('about');
  const [selectedShifts, setSelectedShifts] = useState<Record<string, boolean>>({});
  const [showAllShifts, setShowAllShifts] = useState(false);

  const bookmarkScale = useSharedValue(1);

  const handleBookmark = () => {
    bookmarkScale.value = withSequence(
      withSpring(1.3, { damping: 4, stiffness: 300 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    setIsBookmarked(!isBookmarked);
  };

  const bookmarkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  const toggleShift = (id: string) => {
    setSelectedShifts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = Object.values(selectedShifts).filter(Boolean).length;
  const description = typeof job.description === 'string' ? job.description : '';
  const visibleShifts = showAllShifts ? MOCK_SHIFTS : MOCK_SHIFTS.slice(0, 3);

  return (
    <View style={styles.screen}>
      {/* ── Top Bar ── */}
      <SafeAreaView edges={['top']} style={styles.topBar}>
        <Pressable
          style={styles.navBtn}
          onPress={() => navigation.goBack()}
          hitSlop={12}
        >
          <Icon name="arrow-left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={styles.topBarTitle}>shift details</Text>
        <View style={styles.topBarRight}>
          <Pressable style={styles.navBtn} hitSlop={8}>
            <Icon name="share" size={20} color={colors.foreground} />
          </Pressable>
          <AnimatedPressable
            style={[styles.navBtn, bookmarkAnimStyle]}
            onPress={handleBookmark}
            hitSlop={8}
          >
            <Icon
              name="heart"
              size={20}
              color={isBookmarked ? colors.primary : colors.icon}
            />
          </AnimatedPressable>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. Description text ── */}
        <View style={styles.descBlock}>
          <Text style={styles.postedDate}>posted on 09 September 2024</Text>
          <Text style={styles.descText}>
            Come hang out with us at Zome! We're on the lookout for fun bartenders. Whip up some awesome cocktails and spread good vibes at Amsterdam's top spot. Apply now for an exciting time in hospitality!
          </Text>
        </View>

        {/* ── 2. Tabs ── */}
        <TabRow activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'about' ? (
          <>
            {/* ── 3. Photo Card ── */}
            <View style={styles.cardSection}>
              <View style={styles.photoCard}>
                <Image source={{ uri: imageUrl }} style={styles.photoImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)'] as any}
                  style={styles.photoGradient}
                />
                <View style={styles.photoOverlay}>
                  <Text style={styles.photoTitle}>{job.title}</Text>
                  <Text style={styles.photoCompany}>{job.company}</Text>
                  <View style={styles.photoBottom}>
                    <Text style={styles.photoRate}>{job.hourlyRate}</Text>
                    <View style={styles.photoRating}>
                      <Icon name="star" size={12} color="#FFECB3" />
                      <Text style={styles.photoRatingText}>
                        {job.rating.toFixed(1)} ({job.reviewCount})
                      </Text>
                    </View>
                  </View>
                </View>
                {/* Heart on photo */}
                <View style={styles.photoHeart}>
                  <Icon name="heart" size={20} color={isBookmarked ? colors.primary : colors.white} />
                </View>
              </View>

              {/* Tag pills */}
              <View style={styles.tagRow}>
                <View style={[styles.tag, { backgroundColor: colors.tertiary }]}>
                  <Text style={[styles.tagText, { color: colors.primary }]}>Single shift</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: '#FFF3E0' }]}>
                  <Text style={[styles.tagText, { color: '#E65100' }]}>1 day</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: colors.gradientMint }]}>
                  <Text style={[styles.tagText, { color: colors.successText }]}>
                    {typeof job.category === 'string' ? job.category : 'Hospitality'}
                  </Text>
                </View>
              </View>
            </View>

            {/* ── 4. Job Description ── */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Job Description</Text>
              <Text style={styles.bodyText}>{description}</Text>
              <Pressable>
                <Text style={styles.readMore}>read more...</Text>
              </Pressable>
            </View>

            {/* ── 5. Shifts ── */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Shifts</Text>
              <Text style={styles.sectionSubtitle}>select which shifts you'd like to take</Text>
              <View style={styles.shiftsList}>
                {visibleShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    selected={selectedShifts[shift.id] ?? false}
                    onToggle={() => toggleShift(shift.id)}
                  />
                ))}
              </View>
              {!showAllShifts && MOCK_SHIFTS.length > 3 && (
                <Pressable onPress={() => setShowAllShifts(true)} style={styles.showAllBtn}>
                  <Text style={styles.showAllText}>Show all shifts</Text>
                </Pressable>
              )}
            </View>

            {/* ── 6. Qualifications (expanded) ── */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Qualifications</Text>
              {(Array.isArray(job.requirements) ? job.requirements : [
                'Previous experience in a warehouse or logistics role (preferred but not mandatory).',
                'Ability to lift and carry heavy items (up to 50kg).',
                'Strong attention to detail and ability to follow instructions.',
                'Forklift certification (a plus).',
              ]).map((req: string, i: number) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{req}</Text>
                </View>
              ))}
            </View>

            {/* ── 7. Shift unlock requirements (expanded) ── */}
            <View style={styles.unlockSection}>
              <Text style={styles.sectionTitle}>shift unlock requirements</Text>
              <View style={styles.unlockItem}>
                <Icon name="check-circle" size={20} color={colors.successIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.unlockLabel}>ID verification</Text>
                  <Text style={styles.unlockMeta}>It takes 5 minutes to confirm if the ID is successfully added.</Text>
                </View>
              </View>
              <View style={styles.unlockDivider} />
              <View style={styles.unlockItem}>
                <Text style={styles.unlockLabel}>Work permit</Text>
              </View>
              <View style={styles.unlockDivider} />
              <View style={styles.unlockItem}>
                <Text style={styles.unlockLabel}>Certificates check</Text>
              </View>
              <View style={styles.unlockDivider} />
              <View style={styles.unlockItem}>
                <Text style={styles.unlockLabel}>Food safety certificate</Text>
              </View>
              <View style={styles.unlockDivider} />
              <View style={styles.unlockItem}>
                <Text style={styles.unlockLabel}>Alcohol service license</Text>
              </View>
              <View style={styles.unlockDivider} />
              <View style={styles.unlockItem}>
                <Text style={styles.unlockLabel}>Reference check</Text>
              </View>
              <View style={styles.unlockDivider} />
              <View style={styles.unlockItem}>
                <Text style={styles.unlockLabel}>Related work reference</Text>
              </View>
            </View>

            {/* ── 8-10. Collapsed sections ── */}
            <View style={styles.infoSection}>
              <CollapsibleSection title="Payment details">
                <View style={styles.paymentRow}>
                  <Icon name="zap" size={18} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.paymentTitle}>Fast payment</Text>
                    <Text style={styles.paymentDesc}>
                      Get paid within 48 hours after shift completion via bank transfer.
                    </Text>
                  </View>
                </View>
              </CollapsibleSection>
            </View>

            <View style={styles.infoSection}>
              <CollapsibleSection title="Mandatory skills">
                <View style={styles.skillsWrap}>
                  {['Communication', 'Teamwork', 'Physical fitness', 'Punctuality', 'Dutch (basic)', 'English'].map((skill) => (
                    <View key={skill} style={styles.skillChip}>
                      <Text style={styles.skillChipText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </CollapsibleSection>
            </View>

            <View style={styles.infoSection}>
              <CollapsibleSection title="Rules & regulations">
                {[
                  'Arrive at least 15 minutes before your shift starts.',
                  'Wear appropriate clothing and safety equipment as provided.',
                  'Report any injuries or incidents immediately to your supervisor.',
                  'Mobile phone use is not allowed during active work hours.',
                  'Follow all on-site health and safety regulations.',
                ].map((rule, i) => (
                  <View key={i} style={styles.ruleRow}>
                    <Text style={styles.ruleNumber}>{i + 1}.</Text>
                    <Text style={styles.ruleText}>{rule}</Text>
                  </View>
                ))}
              </CollapsibleSection>
            </View>
          </>
        ) : (
          /* ── About the client tab ── */
          <View style={styles.infoSection}>
            <View style={styles.clientCard}>
              <View style={styles.clientAvatar}>
                <Icon name="briefcase" size={28} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.clientName}>{job.company}</Text>
                <View style={styles.clientMeta}>
                  <Icon name="star" size={14} color={colors.warningIcon} />
                  <Text style={styles.clientMetaText}>
                    {job.rating.toFixed(1)} · {job.reviewCount} reviews
                  </Text>
                </View>
                <Text style={styles.clientMetaText}>
                  {typeof job.location === 'string' ? job.location : 'Netherlands'}
                </Text>
              </View>
            </View>
            <Text style={[styles.bodyText, { marginTop: spacing.m }]}>
              A trusted employer on our platform with a track record of reliable
              shifts and positive worker reviews. Known for good communication
              and fair working conditions.
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Fixed Bottom CTA ── */}
      <SafeAreaView style={styles.ctaContainer} edges={['bottom']}>
        <View style={styles.ctaInner}>
          <Button
            variant="primary"
            size="lg"
            label={selectedCount > 0 ? `Apply for ${selectedCount} shift${selectedCount > 1 ? 's' : ''}` : 'Verify to apply'}
            onPress={() => {}}
          />
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

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
    backgroundColor: colors.background,
    zIndex: 10,
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.foreground,
    textAlign: 'center',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // Description block
  descBlock: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
    paddingBottom: spacing.l,
    gap: 10,
  },
  postedDate: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
  },
  descText: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize + 1,
    lineHeight: 24,
    color: colors.primaryContrast,
  },

  // Photo Card
  cardSection: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    gap: spacing.m,
  },
  photoCard: {
    width: '100%',
    height: 201,
    borderRadius: radius.l,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  photoGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.m,
  },
  photoTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.lg.fontSize,
    lineHeight: typeScale.lg.lineHeight,
    color: colors.white,
  },
  photoCompany: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  photoBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  photoRate: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: '#93C5FD',
  },
  photoRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoRatingText: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.xs.fontSize,
    color: 'rgba(255,255,255,0.8)',
  },
  photoHeart: {
    position: 'absolute',
    top: spacing.s,
    right: spacing.s,
  },

  // Tag pills
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  tagText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
  },

  // Info sections
  infoSection: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  sectionTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.lg.fontSize,
    lineHeight: typeScale.lg.lineHeight + 2,
    color: colors.primaryContrast,
    marginBottom: spacing.s,
  },
  sectionSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
    marginBottom: spacing.s,
  },
  bodyText: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight + 4,
    color: colors.textMuted,
  },
  readMore: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    color: colors.primary,
    marginTop: spacing.xs,
  },

  // Shifts list
  shiftsList: {
    gap: spacing.s,
  },
  showAllBtn: {
    alignItems: 'center',
    paddingVertical: spacing.m,
  },
  showAllText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    color: colors.primary,
  },

  // Bullet list
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.foreground,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight + 2,
    color: colors.textMuted,
  },

  // Unlock requirements
  unlockSection: {
    marginHorizontal: spacing.l,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    backgroundColor: colors.secondary,
    borderRadius: radius.l,
    gap: spacing.s,
  },
  unlockItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.s,
  },
  unlockLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.foreground,
  },
  unlockMeta: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
    color: colors.textMuted,
    marginTop: 2,
  },
  unlockDivider: {
    height: 1,
    backgroundColor: colors.input,
  },

  // Payment
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.s,
  },
  paymentTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.foreground,
  },
  paymentDesc: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight + 4,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Skills
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  skillChip: {
    backgroundColor: colors.tertiary,
    paddingHorizontal: spacing.s,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  skillChipText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.primary,
  },

  // Rules
  ruleRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  ruleNumber: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.foreground,
    width: 20,
  },
  ruleText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight + 4,
    color: colors.textMuted,
  },

  // Client tab
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    backgroundColor: colors.secondary,
    padding: spacing.m,
    borderRadius: radius.m,
  },
  clientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientName: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.foreground,
  },
  clientMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  clientMetaText: {
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
    paddingHorizontal: spacing.l,
    paddingTop: spacing.s,
    paddingBottom: spacing.xs,
  },
});
