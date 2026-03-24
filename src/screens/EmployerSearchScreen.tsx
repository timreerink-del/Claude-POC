import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { filterState } from './filterState';
import { Icon } from '../components/ui';
import { colors, fontFamilies, typeScale, spacing, radius } from '../tokens';

const MOCK_EMPLOYERS = [
  'KLM',
  'Kloesters Dranken',
  'Klantreizen',
  'Randstad',
  'ABN AMRO',
  'ING',
  'Booking.com',
  'Philips',
  'ASML',
  'Shell',
  'Unilever',
  'Heineken',
  'AkzoNobel',
  'NN Group',
  'Coolblue',
  'Bol.com',
  'DHL',
  'PostNL',
  'NS',
  'Schiphol Group',
  'Albert Heijn',
  'Jumbo',
  'Lidl',
  'Action',
  'HEMA',
];

export function EmployerSearchScreen({
  navigation,
  route,
}: {
  navigation: any;
  route?: any;
}) {
  const initialEmployer = route?.params?.initialEmployer ?? null;
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(initialEmployer);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const filtered =
    query.length > 0
      ? MOCK_EMPLOYERS.filter((e) =>
          e.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  const handleSelect = (employer: string) => {
    setSelected(employer);
  };

  const handleBack = () => {
    filterState.setEmployer(selected);
    navigation.goBack();
  };

  const handleReset = () => {
    setSelected(null);
    setQuery('');
  };

  const renderItem = ({ item }: { item: string }) => (
    <Pressable style={styles.row} onPress={() => handleSelect(item)}>
      <Text style={[styles.rowText, selected === item && styles.rowTextSelected]}>
        {item}
      </Text>
      {selected === item && <Icon name="check" size={18} color={colors.primary} />}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.headerSide}>
          <Icon name="arrow-left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={styles.headerTitle}>employer</Text>
        <Pressable onPress={handleReset} hitSlop={8} style={styles.headerSide}>
          <Text style={styles.resetText}>reset</Text>
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={18} color={colors.textMuted} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search an employer"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Icon name="x" size={16} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {filtered.length > 0 ? (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
          />
        ) : query.length === 0 && selected ? (
          <View style={styles.selectedContainer}>
            <Pressable style={styles.row} onPress={() => setSelected(null)}>
              <Text style={styles.rowTextSelected}>{selected}</Text>
              <Icon name="check" size={18} color={colors.primary} />
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* Sticky CTA */}
      <View style={styles.ctaContainer}>
        <Pressable style={styles.ctaButton} onPress={handleBack}>
          <Text style={styles.ctaText}>See 76 jobs</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    backgroundColor: colors.card,
  },
  headerSide: {
    width: 60,
  },
  headerTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.lg.fontSize,
    lineHeight: typeScale.lg.lineHeight,
    color: colors.foreground,
    textAlign: 'center',
    flex: 1,
  },
  resetText: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    color: colors.primary,
    textAlign: 'right',
  },
  searchContainer: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    backgroundColor: colors.card,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: radius.m,
    paddingHorizontal: spacing.s,
    height: 44,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    color: colors.foreground,
    height: '100%',
    padding: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  } as any,
  content: {
    flex: 1,
    backgroundColor: colors.card,
    marginTop: 1,
  },
  selectedContainer: {
    // just a wrapper for the selected item when no query
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    color: colors.foreground,
  },
  rowTextSelected: {
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.base.fontSize,
    color: colors.primary,
  },
  ctaContainer: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.s,
    paddingBottom: spacing.xs,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.m,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    color: colors.white,
  },
});
