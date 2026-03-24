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

const MOCK_LOCATIONS = [
  'Amsterdam, Noord Holland',
  'Rotterdam, Zuid Holland',
  'Den Haag, Zuid Holland',
  'Utrecht, Utrecht',
  'Eindhoven, Noord Brabant',
  'Groningen, Groningen',
  'Tilburg, Noord Brabant',
  'Almere, Flevoland',
  'Breda, Noord Brabant',
  'Nijmegen, Gelderland',
  'Haarlem, Noord Holland',
  'Arnhem, Gelderland',
];

export function LocationSearchScreen({
  navigation,
  route,
}: {
  navigation: any;
  route?: any;
}) {
  const initialLocation = route?.params?.initialLocation ?? 'Amsterdam, Noord Holland';
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(initialLocation);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const filtered =
    query.length > 0
      ? MOCK_LOCATIONS.filter((l) =>
          l.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  const handleSelect = (location: string) => {
    setSelected((prev) => (prev === location ? null : location));
  };

  const handleBack = () => {
    filterState.setLocation(selected);
    navigation.goBack();
  };

  const handleReset = () => {
    setSelected(null);
    setQuery('');
  };

  const handleUseLocation = async () => {
    try {
      const Location = await import('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Brief visual feedback — no toast library needed
        setQuery('Location not available');
        setTimeout(() => setQuery(''), 2000);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo?.city) {
        const region = geo.region ?? geo.subregion ?? '';
        const label = region ? `${geo.city}, ${region}` : geo.city;
        setSelected(label);
        setQuery('');
      }
    } catch {
      setQuery('Location not available');
      setTimeout(() => setQuery(''), 2000);
    }
  };

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = selected === item;
    return (
      <Pressable style={styles.row} onPress={() => handleSelect(item)}>
        <Icon name="map-pin" size={20} color={colors.textMuted} />
        <Text style={styles.rowText}>{item}</Text>
        {isSelected && <Icon name="check" size={20} color={colors.primary} />}
      </Pressable>
    );
  };

  // Build list data: selected item (if any and not searching) + search results
  const listData: string[] = [];
  if (query.length === 0 && selected) {
    listData.push(selected);
  }
  if (query.length > 0) {
    filtered.forEach((loc) => {
      if (!listData.includes(loc)) listData.push(loc);
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.headerSide}>
          <Icon name="arrow-left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={styles.headerTitle}>location</Text>
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
            placeholder="Search a city"
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
        {/* Use your location */}
        <Pressable style={styles.useLocationRow} onPress={handleUseLocation}>
          <Icon name="navigation" size={20} color={colors.primary} />
          <Text style={styles.useLocationText}>Use your location</Text>
        </Pressable>

        {/* Location list */}
        <FlatList
          data={listData}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          style={styles.list}
        />
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
  useLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingHorizontal: spacing.m,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  useLocationText: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    color: colors.primary,
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingHorizontal: spacing.m,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    color: colors.foreground,
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
