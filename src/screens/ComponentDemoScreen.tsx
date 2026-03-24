import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon, Chip, DatePill, Card } from '../components/ui';
import { JobCard, DateSelectorFilter } from '../components/features';
import { colors, fontFamilies, typeScale, typography, spacing } from '../tokens';

function SectionTitle({ title }: { title: string }) {
  return (
    <Text style={styles.sectionTitle}>{title}</Text>
  );
}

function Spacer({ h = 16 }: { h?: number }) {
  return <View style={{ height: h }} />;
}

export function ComponentDemoScreen() {
  const [activeChip, setActiveChip] = useState('Hospitality');
  const [activeDate, setActiveDate] = useState(19);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Component Library</Text>
        <Text style={styles.pageSubtitle}>Peppercorn Design System</Text>

        <Spacer h={24} />

        {/* ── Buttons ── */}
        <SectionTitle title="Button" />

        <Text style={styles.label}>Primary (gradient)</Text>
        <View style={styles.row}>
          <Button variant="primary" size="sm" label="Small" />
          <Button variant="primary" size="md" label="Medium" />
          <Button variant="primary" size="lg" label="Large" />
        </View>

        <Spacer h={12} />
        <Text style={styles.label}>Primary with icons</Text>
        <View style={styles.row}>
          <Button
            variant="primary"
            size="md"
            label="Apply now"
            leftIcon={<Icon name="check" size={20} color={colors.white} />}
          />
          <Button
            variant="primary"
            size="md"
            label="Next"
            rightIcon={<Icon name="arrow-right" size={20} color={colors.white} />}
          />
        </View>

        <Spacer h={12} />
        <Text style={styles.label}>Secondary (outlined)</Text>
        <View style={styles.row}>
          <Button variant="secondary" size="sm" label="Cancel" />
          <Button variant="secondary" size="md" label="Save" />
          <Button variant="secondary" size="lg" label="Details" />
        </View>

        <Spacer h={12} />
        <Text style={styles.label}>Ghost</Text>
        <View style={styles.row}>
          <Button variant="ghost" size="sm" label="Skip" />
          <Button variant="ghost" size="md" label="Read more" />
        </View>

        <Spacer h={12} />
        <Text style={styles.label}>States</Text>
        <View style={styles.row}>
          <Button variant="primary" size="md" label="Disabled" disabled />
          <Button variant="primary" size="md" label="Loading" loading />
          <Button variant="secondary" size="md" label="Disabled" disabled />
        </View>

        <Spacer h={24} />

        {/* ── Icons ── */}
        <SectionTitle title="Icon" />
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Icon name="search" size={16} />
            <Text style={styles.iconLabel}>16</Text>
          </View>
          <View style={styles.iconBox}>
            <Icon name="heart" size={20} color={colors.destructive} />
            <Text style={styles.iconLabel}>20</Text>
          </View>
          <View style={styles.iconBox}>
            <Icon name="bookmark" size={24} color={colors.primary} />
            <Text style={styles.iconLabel}>24</Text>
          </View>
          <View style={styles.iconBox}>
            <Icon name="map-pin" size={32} color={colors.foreground} />
            <Text style={styles.iconLabel}>32</Text>
          </View>
          <View style={styles.iconBox}>
            <Icon name="star" size={24} color={colors.warningIcon} />
            <Text style={styles.iconLabel}>star</Text>
          </View>
          <View style={styles.iconBox}>
            <Icon name="briefcase" size={24} />
            <Text style={styles.iconLabel}>brief</Text>
          </View>
        </View>

        <Spacer h={24} />

        {/* ── Chips ── */}
        <SectionTitle title="Chip" />
        <View style={styles.chipRow}>
          {['Hospitality', 'Retail', 'Logistics', 'Events'].map((label) => (
            <Chip
              key={label}
              label={label}
              active={activeChip === label}
              onPress={() => setActiveChip(label)}
            />
          ))}
        </View>

        <Spacer h={24} />

        {/* ── DatePill ── */}
        <SectionTitle title="DatePill" />
        <View style={styles.dateRow}>
          <DatePill day="Mon" date={17} isPast onPress={() => {}} />
          <DatePill day="Tue" date={18} isToday onPress={() => setActiveDate(18)} active={activeDate === 18} />
          <DatePill day="Wed" date={19} onPress={() => setActiveDate(19)} active={activeDate === 19} />
          <DatePill day="Thu" date={20} onPress={() => setActiveDate(20)} active={activeDate === 20} />
          <DatePill day="Fri" date={21} onPress={() => setActiveDate(21)} active={activeDate === 21} />
          <DatePill day="Sat" date={22} onPress={() => setActiveDate(22)} active={activeDate === 22} />
          <DatePill day="Sun" date={23} onPress={() => setActiveDate(23)} active={activeDate === 23} />
        </View>

        <Spacer h={24} />

        {/* ── Card ── */}
        <SectionTitle title="Card" />
        <Card>
          <Text style={styles.cardTitle}>Bartender · Ziggo Dome</Text>
          <Text style={styles.cardSubtitle}>Amsterdam · Hospitality</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <Icon name="star" size={16} color={colors.warningIcon} />
            <Text style={styles.cardMeta}>4.91 (484)</Text>
            <Text style={styles.cardMeta}>·</Text>
            <Icon name="navigation" size={16} color={colors.icon} />
            <Text style={styles.cardMeta}>12.2 km</Text>
          </View>
          <Text style={styles.cardRate}>€30,00 / hour</Text>
        </Card>

        <Spacer h={12} />

        <Card onPress={() => {}}>
          <Text style={styles.cardTitle}>Warehouse Associate</Text>
          <Text style={styles.cardSubtitle}>Rotterdam · Logistics</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <Icon name="star" size={16} color={colors.warningIcon} />
            <Text style={styles.cardMeta}>4.72 (312)</Text>
            <Text style={styles.cardMeta}>·</Text>
            <Icon name="navigation" size={16} color={colors.icon} />
            <Text style={styles.cardMeta}>8.4 km</Text>
          </View>
          <Text style={styles.cardRate}>€25,50 / hour</Text>
        </Card>

        <Spacer h={24} />

        {/* ── DateSelectorFilter ── */}
        <SectionTitle title="DateSelectorFilter" />
        <View style={styles.fullBleed}>
          <DateSelectorFilter
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </View>

        <Spacer h={24} />

        {/* ── JobCard (compact) ── */}
        <SectionTitle title="JobCard — Compact" />
        <JobCard
          title="Bartender · Ziggo Dome"
          company="Horeca Staff B.V."
          location="12.2 km"
          time="18:00 – 02:00"
          hourlyRate="€30,00 / hour"
          rating={4.91}
          reviewCount={484}
          isBookmarked={bookmarked['bartender']}
          onBookmark={() => setBookmarked((b) => ({ ...b, bartender: !b.bartender }))}
        />

        <Spacer h={12} />

        <JobCard
          title="Warehouse Associate"
          company="LogiPick Rotterdam"
          location="8.4 km"
          hourlyRate="€25,50 / hour"
          rating={4.72}
          reviewCount={312}
          isBookmarked={bookmarked['warehouse']}
          onBookmark={() => setBookmarked((b) => ({ ...b, warehouse: !b.warehouse }))}
        />

        <Spacer h={24} />

        {/* ── JobCard (horizontal) ── */}
        <SectionTitle title="JobCard — Horizontal" />
        <JobCard
          variant="horizontal"
          title="Event Staff · AFAS Live"
          company="EventForce"
          location="5.1 km"
          time="20:00 – 01:00"
          hourlyRate="€28,00 / hour"
          rating={4.85}
          reviewCount={203}
          isBookmarked={bookmarked['event']}
          onBookmark={() => setBookmarked((b) => ({ ...b, event: !b.event }))}
        />

        <Spacer h={12} />

        <JobCard
          variant="horizontal"
          title="Kitchen Assistant"
          company="Fresh Bites Catering"
          location="3.7 km"
          hourlyRate="€22,00 / hour"
          rating={4.63}
          reviewCount={158}
          thumbnailUrl="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop"
          isBookmarked={bookmarked['kitchen']}
          onBookmark={() => setBookmarked((b) => ({ ...b, kitchen: !b.kitchen }))}
        />

        <Spacer h={40} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.l,
  },
  pageTitle: {
    ...typography.h2,
  },
  pageSubtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 4,
  },
  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.s,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.input,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  iconBox: {
    alignItems: 'center',
    gap: 4,
    width: 48,
  },
  iconLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  cardTitle: {
    ...typography.h5,
  },
  cardSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardMeta: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  cardRate: {
    ...typography.emphasisLarge,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  fullBleed: {
    marginHorizontal: -spacing.l,
  },
});
