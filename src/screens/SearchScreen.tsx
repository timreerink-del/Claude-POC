import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { JobCard } from '../components/features/JobCard';
import { Icon } from '../components/ui';
import { FilterSheetContent } from './FilterSheet';
import { colors, fontFamilies, typeScale, spacing, radius, sizes } from '../tokens';
import { SEARCH_RESULTS } from '../data/mockJobs';

export function SearchScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [showFilter, setShowFilter] = useState(false);

  const hasQuery = query.trim().length > 0;
  const results = hasQuery ? SEARCH_RESULTS : [];

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <View style={{ flex: 1 }}>
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Search header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, companies..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {hasQuery && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Icon name="x" size={20} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
        <Pressable
          style={styles.filterBtn}
          onPress={() => setShowFilter(true)}
          hitSlop={8}
        >
          <Icon name="sliders" size={20} color={colors.primary} />
        </Pressable>
      </View>

      {!hasQuery ? (
        /* Empty state */
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Icon name="search" size={32} color={colors.border} />
          </View>
          <Text style={styles.emptyTitle}>Find your next shift</Text>
          <Text style={styles.emptySubtitle}>
            Search by job title, company, or location
          </Text>

          {/* Quick search suggestions */}
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsLabel}>Popular searches</Text>
            {['Bartender', 'Warehouse', 'Event staff', 'Retail'].map((term) => (
              <Pressable
                key={term}
                style={styles.suggestionRow}
                onPress={() => setQuery(term)}
              >
                <Icon name="trending-up" size={16} color={colors.icon} />
                <Text style={styles.suggestionText}>{term}</Text>
                <Icon name="arrow-up-left" size={16} color={colors.border} />
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        /* Search results */
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.resultCount}>
            {results.length} results for "{query}"
          </Text>

          {results.map((job, index) => (
            <View key={job.id} style={index > 0 ? styles.cardGap : undefined}>
              <JobCard
                variant="compact"
                title={job.title}
                company={job.company}
                location={job.distance}
                time={job.time}
                hourlyRate={job.hourlyRate}
                rating={job.rating}
                reviewCount={job.reviewCount}
                isBookmarked={bookmarks[job.id] ?? false}
                onBookmark={() => toggleBookmark(job.id)}
                onPress={() => navigation?.navigate?.('ShiftDetail', { jobId: job.id })}
              />
            </View>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

    </SafeAreaView>
      {/* Filter Sheet Overlay */}
      {showFilter && (
        <View style={StyleSheet.absoluteFill}>
          <FilterSheetContent onClose={() => setShowFilter(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    gap: spacing.s,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: radius.m,
    paddingHorizontal: spacing.s,
    height: sizes.btnH,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.input,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    color: colors.foreground,
    height: '100%',
    padding: 0,
  },
  filterBtn: {
    width: sizes.btnH,
    height: sizes.btnH,
    borderRadius: radius.m,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty state
  emptyState: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.l,
  },
  emptyTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.xl.fontSize,
    lineHeight: typeScale.xl.lineHeight,
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.textMuted,
    textAlign: 'center',
  },
  suggestionsContainer: {
    width: '100%',
    marginTop: spacing.xxl,
  },
  suggestionsLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.s,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
    gap: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.input,
  },
  suggestionText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.foreground,
  },

  // Results
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  resultCount: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
    marginBottom: spacing.m,
  },
  cardGap: {
    marginTop: spacing.s,
  },
});
