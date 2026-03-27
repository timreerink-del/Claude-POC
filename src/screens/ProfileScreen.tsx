import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MeshGradient } from '../components/ui/MeshGradient';
import { Chip, Icon } from '../components/ui';
import {
  colors,
  spacing,
  radius,
  fontFamilies,
  typeScale,
  shadows,
} from '../tokens';

// ── Mock data ────────────────────────────────────────────

type TabKey = 'personal' | 'work';
type CertStatus = 'valid' | 'expiring' | 'expired';

const USER = {
  name: 'Marco van Bergen',
  age: 24,
  rating: 4.91,
  connections: 84,
  communities: 2,
  shifts: 27,
  quote: '"Be the change that you wish to see in the world."',
};

const PERSONAL_INFO_ROWS: { icon: string; label: string; tag?: string }[] = [
  { icon: 'user', label: 'Personal details', tag: 'complete' },
  { icon: 'mail', label: 'Emails', tag: 'complete' },
  { icon: 'smartphone', label: 'Phone numbers', tag: 'complete' },
  { icon: 'map-pin', label: 'Addresses', tag: 'pending' },
  { icon: 'book-open', label: "Driver's licences", tag: 'optional' },
];

const TAG_STYLE: Record<string, { bg: string; text: string }> = {
  complete: { bg: colors.successSurface, text: colors.successText },
  pending: { bg: colors.warningSurface, text: colors.warningText },
  optional: { bg: colors.secondary, text: colors.textMuted },
};

const REVIEWS = [
  {
    company: 'KLM Catering',
    rating: 5,
    quote: '"Excellent worker, always on time and professional."',
    date: '2 weeks ago',
  },
  {
    company: 'DB Schenker',
    rating: 4.5,
    quote: '"Great forklift skills and team player."',
    date: '1 month ago',
  },
];

const SETTINGS_ROWS: { icon: string; label: string; value?: string }[] = [
  { icon: 'credit-card', label: 'Payment details' },
  { icon: 'volume-2', label: 'Notifications & alerts' },
  { icon: 'lock', label: 'Privacy & visibility' },
  { icon: 'globe', label: 'Language', value: 'English' },
];

const SKILLS = ['Forklift driver · Expert', 'Picker · Advanced', 'Bar staff · Intermediate'];

const CERTS: { name: string; expires: string; status: CertStatus }[] = [
  { name: 'Forklift Certificate', expires: 'Dec 2025', status: 'valid' },
  { name: 'Food Safety Level 1', expires: 'Jan 2025', status: 'expiring' },
  { name: 'First Aid', expires: 'Nov 2024', status: 'expired' },
];

const CERT_BADGE: Record<CertStatus, { bg: string; text: string; label: string }> = {
  valid: { bg: colors.successSurface, text: colors.successText, label: 'Valid' },
  expiring: { bg: colors.warningSurface, text: colors.warningText, label: 'Expiring soon' },
  expired: { bg: colors.errorSurface, text: colors.errorText, label: 'Expired' },
};

const SHIFT_OPTIONS = ['Morning', 'Night', 'Evening'];

// ── Shared primitives ────────────────────────────────────

function Divider() {
  return <View style={styles.divider} />;
}

// Individual white row card used in personal info / settings / preferences
function RowCard({ children }: { children: React.ReactNode }) {
  return <View style={[styles.rowCard, shadows.card]}>{children}</View>;
}

// ── Hero Header ──────────────────────────────────────────

function HeroHeader() {
  return (
    <View style={styles.hero}>
      {/* Blob background */}
      <MeshGradient height={337} />

      <View style={styles.heroBody}>
        {/* Top row: avatar left + info right */}
        <View style={styles.heroTop}>
          {/* Avatar with camera badge */}
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Icon name="user" size={36} color={colors.textMuted} />
            </View>
            <View style={styles.cameraBadge}>
              <Icon name="camera" size={12} color={colors.white} />
            </View>
          </View>

          {/* Info column */}
          <View style={styles.heroInfo}>
            <View style={styles.statusTag}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Available</Text>
            </View>
            <View style={styles.nameRow}>
              <Text style={styles.heroName}>{USER.name}</Text>
              <Icon name="shield" size={18} color={colors.successIcon} />
            </View>
            <Text style={styles.heroAge}>{USER.age} years old</Text>
            <Text style={styles.heroQuote}>{USER.quote}</Text>
          </View>
        </View>

        {/* Stats — row 1: Connections, Communities, Shifts */}
        <View style={styles.statsRow}>
          {[
            { value: USER.connections, label: 'Connections' },
            { value: USER.communities, label: 'Communities' },
            { value: USER.shifts, label: 'Shifts' },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { width: 100 }]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Stats — row 2: Rating, Local Hero */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { width: 155 }]}>
            <View style={styles.statRatingRow}>
              <Icon name="star" size={14} color={colors.primaryContrast} />
              <Text style={styles.statValue}> {USER.rating}</Text>
            </View>
            <Text style={styles.statLabel}>rating</Text>
          </View>
          <View style={[styles.statCard, { width: 155 }]}>
            <Text style={styles.statValue}>🏆</Text>
            <Text style={styles.statLabel}>Local hero</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Reward Card ──────────────────────────────────────────

function RewardCard() {
  return (
    <View style={styles.rewardCard}>
      {/* Illustration placeholder */}
      <View style={styles.rewardIllustration}>
        <Icon name="award" size={48} color="rgba(255,255,255,0.6)" />
      </View>
      <Text style={styles.rewardTitle}>Favourite employee badge earned!</Text>
      <Text style={styles.rewardSub}>You have unlocked a badge & 50 Randopoints</Text>
    </View>
  );
}

// ── Tab Switcher ─────────────────────────────────────────

const TABS: { key: TabKey; label: string }[] = [
  { key: 'personal', label: 'Personal info' },
  { key: 'work', label: 'Work preferences' },
];

function TabSwitcher({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <View style={styles.tabRow}>
      {TABS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={[styles.tabPill, isActive && styles.tabPillActive]}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ── Personal Info Tab ────────────────────────────────────

function PersonalInfoTab() {
  const [darkMode, setDarkMode] = useState(false);
  const [contrast, setContrast] = useState(false);

  return (
    <>
      {/* Personal information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal information</Text>
        <View style={styles.rowCardGroup}>
          {PERSONAL_INFO_ROWS.map((row) => (
            <RowCard key={row.label}>
              <Pressable style={styles.listRow}>
                <View style={styles.listLeft}>
                  <Icon name={row.icon as any} size={20} color={colors.primaryContrast} />
                  <Text style={styles.listLabel}>{row.label}</Text>
                  {row.tag && (
                    <View
                      style={[
                        styles.tag,
                        { backgroundColor: TAG_STYLE[row.tag]?.bg ?? colors.secondary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          { color: TAG_STYLE[row.tag]?.text ?? colors.textMuted },
                        ]}
                      >
                        {row.tag}
                      </Text>
                    </View>
                  )}
                </View>
                <Icon name="chevron-right" size={20} color={colors.icon} />
              </Pressable>
            </RowCard>
          ))}
        </View>
      </View>

      {/* Your Reviews */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your reviews</Text>
        </View>
        <View style={[styles.card, shadows.card]}>
          {REVIEWS.map((r, i) => (
            <React.Fragment key={r.company}>
              {i > 0 && <Divider />}
              <View style={styles.reviewRow}>
                <View style={styles.reviewTop}>
                  <Text style={styles.reviewCompany}>{r.company}</Text>
                  <View style={styles.ratingRow}>
                    <Icon name="star" size={13} color={colors.warningIcon} />
                    <Text style={styles.ratingText}> {r.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewQuote}>{r.quote}</Text>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
            </React.Fragment>
          ))}
          <Divider />
          <Pressable style={styles.cardLink}>
            <Text style={styles.linkText}>See all reviews  ›</Text>
          </Pressable>
        </View>
      </View>

      {/* Connections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connections</Text>
        <View style={[styles.card, shadows.card]}>
          <View style={styles.connectionsRow}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={[styles.avatarSmall, i > 0 && { marginLeft: -10 }]}
              />
            ))}
            <Text style={styles.connectionsLabel}>{USER.connections} connections</Text>
          </View>
          <Divider />
          <Pressable style={styles.cardLink}>
            <Text style={styles.linkText}>View all connections  ›</Text>
          </Pressable>
        </View>
      </View>

      {/* App preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App preferences</Text>
        <View style={styles.rowCardGroup}>
          <RowCard>
            <View style={styles.listRow}>
              <View style={styles.listLeft}>
                <Icon name="moon" size={20} color={colors.primaryContrast} />
                <Text style={styles.listLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.input, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </RowCard>
          <RowCard>
            <View style={styles.listRow}>
              <View style={styles.listLeft}>
                <Icon name="eye" size={20} color={colors.primaryContrast} />
                <Text style={styles.listLabel}>Enhance contrast</Text>
              </View>
              <Switch
                value={contrast}
                onValueChange={setContrast}
                trackColor={{ false: colors.input, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </RowCard>
          <RowCard>
            <Pressable style={styles.listRow}>
              <View style={styles.listLeft}>
                <Icon name="settings" size={20} color={colors.primaryContrast} />
                <Text style={styles.listLabel}>Accessibility settings</Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.icon} />
            </Pressable>
          </RowCard>
        </View>
      </View>

      {/* Settings & account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings & account</Text>
        <View style={styles.rowCardGroup}>
          {SETTINGS_ROWS.map((row) => (
            <RowCard key={row.label}>
              <Pressable style={styles.listRow}>
                <View style={styles.listLeft}>
                  <Icon name={row.icon as any} size={20} color={colors.primaryContrast} />
                  <Text style={styles.listLabel}>{row.label}</Text>
                </View>
                <View style={styles.listRight}>
                  {row.value !== undefined && (
                    <Text style={styles.listValue}>{row.value}</Text>
                  )}
                  <Icon name="chevron-right" size={20} color={colors.icon} />
                </View>
              </Pressable>
            </RowCard>
          ))}
        </View>
      </View>
    </>
  );
}

// ── Work Preferences Tab ─────────────────────────────────

function WorkPreferencesTab() {
  const [selectedShifts, setSelectedShifts] = useState<string[]>(['Morning', 'Night']);

  function toggleShift(s: string) {
    setSelectedShifts((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  return (
    <>
      {/* Skills & Professions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills & professions</Text>
        <View style={[styles.card, shadows.card]}>
          <View style={styles.chipGrid}>
            {SKILLS.map((skill) => (
              <Chip key={skill} label={skill} active />
            ))}
            <Pressable style={styles.addChip}>
              <Icon name="plus" size={14} color={colors.primary} />
              <Text style={styles.addChipText}>Add skill</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Certificates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certificates</Text>
        <View style={[styles.card, shadows.card]}>
          {CERTS.map((cert, i) => {
            const badge = CERT_BADGE[cert.status];
            return (
              <React.Fragment key={cert.name}>
                {i > 0 && <Divider />}
                <View style={styles.certRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    <Text style={styles.certExpiry}>Expires {cert.expires}</Text>
                  </View>
                  <View style={[styles.certBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.certBadgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            );
          })}
          <Divider />
          <Pressable style={styles.cardLink}>
            <Icon name="plus" size={16} color={colors.primary} />
            <Text style={styles.linkText}>Add certificate</Text>
          </Pressable>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={[styles.card, shadows.card]}>
          <View style={styles.prefBlock}>
            <Text style={styles.prefLabel}>Preferred shift times</Text>
            <View style={styles.chipRow}>
              {SHIFT_OPTIONS.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  active={selectedShifts.includes(s)}
                  onPress={() => toggleShift(s)}
                />
              ))}
            </View>
          </View>
          <Divider />
          <View style={styles.prefBlock}>
            <Text style={styles.prefLabel}>Max travel distance: 15 km</Text>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: '45%' }]} />
            </View>
          </View>
          <Divider />
          <Pressable style={styles.cardLink}>
            <Text style={styles.linkText}>Edit all preferences  ›</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

// ── Main Screen ──────────────────────────────────────────

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('personal');
  const navigation = useNavigation();
  const route = useRoute();
  // Show close button only when pushed as a stack screen (from avatar), not via bottom tab
  const showClose = route.name === 'ProfileView';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Close button — sticky, shown only when pushed from avatar (ProfileView stack route) */}
      {showClose && (
        <View style={styles.closeRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Icon name="x" size={16} color={colors.white} />
          </Pressable>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroHeader />
        <RewardCard />
        <TabSwitcher active={activeTab} onChange={setActiveTab} />
        {activeTab === 'personal' && <PersonalInfoTab />}
        {activeTab === 'work' && <WorkPreferencesTab />}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },

  // ─ Close button ─
  closeRow: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    top: spacing.xl,
    right: spacing.m,
    zIndex: 20,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryContrast,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─ Hero ─
  hero: {
    backgroundColor: colors.background,
    overflow: 'hidden',
    paddingBottom: spacing.xl,
  },
  heroBody: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.m,
    zIndex: 1,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.s,
    marginBottom: spacing.m,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryContrast,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  heroInfo: {
    flex: 1,
    gap: 4,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1BAC4B',
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  statusText: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
    color: colors.white,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  heroName: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.lg.fontSize,
    lineHeight: typeScale.lg.lineHeight,
    color: colors.primaryContrast,
  },
  heroAge: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.foreground,
  },
  heroQuote: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  statCard: {
    height: 68,
    backgroundColor: colors.white,
    borderRadius: radius.s,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  statRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.xl.fontSize,
    lineHeight: typeScale.xl.lineHeight,
    color: colors.primaryContrast,
  },
  statLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
    color: colors.primaryContrast,
  },

  // ─ Reward card ─
  rewardCard: {
    marginHorizontal: spacing.m,
    marginTop: spacing.m,
    marginBottom: spacing.xs,
    backgroundColor: colors.errorSurface,
    borderRadius: radius.l,
    padding: spacing.m,
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  rewardIllustration: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    opacity: 0.4,
  },
  rewardTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.lg.fontSize,
    lineHeight: typeScale.lg.lineHeight,
    color: colors.white,
    marginBottom: spacing.xs,
    maxWidth: '75%',
  },
  rewardSub: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.white,
    opacity: 0.9,
    maxWidth: '75%',
  },

  // ─ Tabs ─
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.m,
    marginVertical: spacing.m,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    padding: 4,
  },
  tabPill: {
    flex: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  tabPillActive: {
    backgroundColor: colors.primaryContrast,
  },
  tabLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.white,
  },

  // ─ Sections ─
  section: {
    marginHorizontal: spacing.m,
    marginBottom: spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.lg.fontSize,
    lineHeight: typeScale.lg.lineHeight,
    color: colors.primaryContrast,
    marginBottom: spacing.xs,
  },

  // ─ Row cards (individual cards per item) ─
  rowCardGroup: {
    gap: spacing.xs,
  },
  rowCard: {
    backgroundColor: colors.card,
    borderRadius: radius.s,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.l,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: colors.input,
    marginHorizontal: spacing.m,
  },

  // ─ List rows ─
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    minHeight: 48,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    flex: 1,
  },
  listRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  listLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.primaryContrast,
  },
  listValue: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
  },
  tag: {
    borderRadius: radius.s,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    marginLeft: spacing.xs,
  },
  tagText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
  },

  // ─ Reviews ─
  reviewRow: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  reviewCompany: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.foreground,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.foreground,
  },
  reviewQuote: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: '#222222',
    marginBottom: spacing.xxs,
  },
  reviewDate: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
    color: '#717171',
  },
  cardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
  },
  linkText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.primary,
  },

  // ─ Connections ─
  connectionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.card,
  },
  connectionsLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
    marginLeft: spacing.s,
  },

  // ─ Chip layouts ─
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    padding: spacing.m,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 32,
    paddingHorizontal: spacing.s,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addChipText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.primary,
  },

  // ─ Certificates ─
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    minHeight: 48,
    gap: spacing.s,
  },
  certName: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.foreground,
  },
  certExpiry: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
    color: colors.textMuted,
  },
  certBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
  },
  certBadgeText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
  },

  // ─ Preferences ─
  prefBlock: {
    padding: spacing.m,
    gap: spacing.xs,
  },
  prefLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.input,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

});
