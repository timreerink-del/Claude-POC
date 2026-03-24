import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { Icon } from '../components/ui';
import { colors, fontFamilies, typeScale, spacing, radius, shadows } from '../tokens';
import { WORK_NOW_JOBS, type WorkNowJob } from '../data/mockJobs';

// ── Mock coordinates around Amsterdam ──────────────────
const JOB_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'wn-1':  { lat: 52.3780, lng: 4.9000 },
  'wn-2':  { lat: 52.3702, lng: 4.8952 },
  'wn-3':  { lat: 52.3600, lng: 4.8800 },
  'wn-4':  { lat: 52.3550, lng: 4.9100 },
  'wn-5':  { lat: 52.3650, lng: 4.9300 },
  'wn-6':  { lat: 52.3750, lng: 4.8700 },
  'wn-7':  { lat: 52.3680, lng: 4.8850 },
  'wn-8':  { lat: 52.3620, lng: 4.9200 },
  'wn-9':  { lat: 52.3720, lng: 4.8780 },
  'wn-10': { lat: 52.3660, lng: 4.8920 },
  'wn-11': { lat: 52.3580, lng: 4.9050 },
  'wn-12': { lat: 52.3740, lng: 4.9150 },
  'wn-13': { lat: 52.3690, lng: 4.8680 },
  'wn-14': { lat: 52.3560, lng: 4.8960 },
  'wn-15': { lat: 52.3710, lng: 4.9080 },
  'wn-16': { lat: 52.3630, lng: 4.8750 },
  'wn-17': { lat: 52.3770, lng: 4.8900 },
  'wn-18': { lat: 52.3540, lng: 4.9180 },
  'wn-19': { lat: 52.3760, lng: 4.9250 },
  'wn-20': { lat: 52.3590, lng: 4.8830 },
};

const AMSTERDAM_CENTER = { lat: 52.3676, lng: 4.9041 };
const { width: SCREEN_W } = Dimensions.get('window');

// ── Job Preview Card ───────────────────────────────────
function JobPreviewCard({
  job,
  onPress,
  onClose,
}: {
  job: WorkNowJob;
  onPress: () => void;
  onClose: () => void;
}) {
  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18).stiffness(200)}
      exiting={SlideOutDown.springify().damping(18).stiffness(200)}
      style={previewStyles.container}
    >
      <Pressable onPress={onPress} style={previewStyles.card}>
        {/* Row 1: Company + Rating */}
        <View style={previewStyles.topRow}>
          <Text style={previewStyles.company} numberOfLines={1}>{job.company}</Text>
          <View style={previewStyles.ratingRow}>
            <Icon name="star" size={14} color={colors.warningIcon} />
            <Text style={previewStyles.ratingText}>
              {job.rating.toFixed(1)} ({job.reviewCount})
            </Text>
          </View>
        </View>

        {/* Row 2: Title */}
        <Text style={previewStyles.title} numberOfLines={1}>{job.title}</Text>

        {/* Row 3: Location */}
        <View style={previewStyles.metaRow}>
          <Icon name="map-pin" size={14} color={colors.icon} />
          <Text style={previewStyles.metaText}>{job.location} · {job.distance}</Text>
        </View>

        {/* Row 4: Time */}
        {job.time && (
          <View style={previewStyles.metaRow}>
            <Icon name="clock" size={14} color={colors.icon} />
            <Text style={previewStyles.metaText}>{job.time}</Text>
          </View>
        )}

        {/* Row 5: Rate chip */}
        <View style={previewStyles.rateChip}>
          <Text style={previewStyles.rateText}>{job.hourlyRate}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const previewStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.m,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.l,
    padding: spacing.m,
    gap: 6,
    ...shadows.dropdown,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  company: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    color: colors.foreground,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.lg.fontSize,
    lineHeight: typeScale.lg.lineHeight,
    color: colors.foreground,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
  },
  rateChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
    marginTop: 2,
  },
  rateText: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.white,
  },
});

// ── Map Pin Component ──────────────────────────────────
function MapPin({
  isActive,
  onPress,
}: {
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <View
        style={[
          pinStyles.pin,
          isActive ? pinStyles.pinActive : pinStyles.pinDefault,
        ]}
      >
        <Icon
          name="map-pin"
          size={16}
          color={isActive ? colors.white : colors.primaryContrast}
        />
      </View>
    </Pressable>
  );
}

const PIN_SIZE = 36;
const pinStyles = StyleSheet.create({
  pin: {
    width: PIN_SIZE,
    height: PIN_SIZE,
    borderRadius: PIN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDefault: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primaryContrast,
  },
  pinActive: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
});

// ── Travel Time Pills ──────────────────────────────────
function TravelTimePills({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (v: string | null) => void;
}) {
  const pills = ['5 min', '15 min'];
  return (
    <View style={pillStyles.row}>
      {pills.map((label) => (
        <Pressable
          key={label}
          style={[
            pillStyles.pill,
            selected === label && pillStyles.pillActive,
          ]}
          onPress={() => onSelect(selected === label ? null : label)}
        >
          <Text
            style={[
              pillStyles.text,
              selected === label && pillStyles.textActive,
            ]}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const pillStyles = StyleSheet.create({
  row: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  pill: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  text: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.white,
  },
  textActive: {
    color: colors.white,
  },
});

// ── Web Map (Leaflet) ──────────────────────────────────
function WebMapView({
  jobs,
  selectedJobId,
  onPinPress,
  onMapPress,
}: {
  jobs: WorkNowJob[];
  selectedJobId: string | null;
  onPinPress: (id: string) => void;
  onMapPress: () => void;
}) {
  const mapRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  // Dynamic imports for leaflet (web only)
  const { MapContainer, TileLayer, Marker, useMapEvents } = require('react-leaflet');
  const L = require('leaflet');

  // Inject Leaflet CSS
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const existing = document.getElementById('leaflet-css');
      if (!existing) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
    }
  }, []);

  function createPinIcon(isActive: boolean) {
    return L.divIcon({
      className: '',
      html: `<div style="
        width: ${PIN_SIZE}px;
        height: ${PIN_SIZE}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${isActive ? colors.primary : colors.white};
        border: ${isActive ? 'none' : `2px solid ${colors.primaryContrast}`};
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        cursor: pointer;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isActive ? colors.white : colors.primaryContrast}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>`,
      iconSize: [PIN_SIZE, PIN_SIZE],
      iconAnchor: [PIN_SIZE / 2, PIN_SIZE / 2],
    });
  }

  function MapClickHandler() {
    useMapEvents({
      click: () => onMapPress(),
    });
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapContainer
        ref={mapRef}
        center={[AMSTERDAM_CENTER.lat, AMSTERDAM_CENTER.lng]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapClickHandler />
        {jobs.map((job) => {
          const coords = JOB_COORDINATES[job.id];
          if (!coords) return null;
          return (
            <Marker
              key={job.id}
              position={[coords.lat, coords.lng]}
              icon={createPinIcon(job.id === selectedJobId)}
              eventHandlers={{
                click: () => onPinPress(job.id),
              }}
            />
          );
        })}
      </MapContainer>
    </View>
  );
}

// ── Main MapViewScreen ─────────────────────────────────
export function MapViewScreen() {
  const navigation = useNavigation<any>();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);

  const selectedJob = WORK_NOW_JOBS.find((j) => j.id === selectedJobId) ?? null;

  const handlePinPress = useCallback((id: string) => {
    setSelectedJobId((prev) => (prev === id ? null : id));
  }, []);

  const handleMapPress = useCallback(() => {
    setSelectedJobId(null);
  }, []);

  const handleJobCardPress = useCallback(() => {
    if (selectedJobId) {
      navigation.navigate('ShiftDetail', { jobId: selectedJobId });
    }
  }, [selectedJobId, navigation]);

  return (
    <View style={mapStyles.screen}>
      <SafeAreaView edges={['top']} style={mapStyles.safeTop}>
        {/* Header */}
        <View style={mapStyles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={mapStyles.backBtn}
            hitSlop={8}
          >
            <Icon name="chevron-left" size={24} color={colors.foreground} />
          </Pressable>

          <View style={mapStyles.searchBar}>
            <Icon name="search" size={18} color={colors.icon} />
            <Text style={mapStyles.searchPlaceholder}>Search jobs</Text>
          </View>

          <Pressable
            style={mapStyles.filterBtn}
            hitSlop={8}
            onPress={() => navigation.navigate('FilterSheet')}
          >
            <Icon name="sliders" size={20} color={colors.foreground} />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Map */}
      <View style={mapStyles.mapContainer}>
        {Platform.OS === 'web' ? (
          <WebMapView
            jobs={WORK_NOW_JOBS}
            selectedJobId={selectedJobId}
            onPinPress={handlePinPress}
            onMapPress={handleMapPress}
          />
        ) : (
          <View style={mapStyles.nativeMapPlaceholder}>
            <Text style={mapStyles.placeholderText}>
              Map view (native only)
            </Text>
          </View>
        )}
      </View>

      {/* Travel time pills */}
      <TravelTimePills selected={travelTime} onSelect={setTravelTime} />

      {/* Job count or preview card */}
      {selectedJob ? (
        <JobPreviewCard
          job={selectedJob}
          onPress={handleJobCardPress}
          onClose={handleMapPress}
        />
      ) : (
        <View style={mapStyles.jobCountRow}>
          <Text style={mapStyles.jobCountText}>
            See all {WORK_NOW_JOBS.length} jobs
          </Text>
        </View>
      )}
    </View>
  );
}

const mapStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeTop: {
    backgroundColor: colors.white,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    gap: spacing.s,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.m,
    paddingVertical: 10,
  },
  searchPlaceholder: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    color: colors.textMuted,
  },
  filterBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  nativeMapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E5DC',
  },
  placeholderText: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    color: colors.textMuted,
  },
  jobCountRow: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  jobCountText: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    color: colors.primary,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    overflow: 'hidden',
    ...shadows.card,
  },
});
