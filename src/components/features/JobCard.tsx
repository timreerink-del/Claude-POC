import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image, ImageSourcePropType, Platform, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Icon } from '../ui';
import { colors, fontFamilies, typeScale, typography, spacing, radius, sizes, shadows } from '../../tokens';

type JobCardVariant = 'compact' | 'horizontal' | 'photo';

interface JobCardProps {
  variant?: JobCardVariant;
  title: string;
  company: string;
  location: string;
  time?: string;
  hourlyRate: string;
  rating?: number;
  reviewCount?: number;
  isBookmarked?: boolean;
  thumbnailUrl?: string;
  imageUrl?: string;
  image?: ImageSourcePropType;
  video?: any;
  isActive?: boolean;
  badge?: string;
  dateLabel?: string;
  onPress?: () => void;
  onBookmark?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function BookmarkButton({
  isBookmarked,
  onBookmark,
  color,
}: {
  isBookmarked: boolean;
  onBookmark?: () => void;
  color?: string;
}) {
  const scale = useSharedValue(1);
  const iconColor = color ?? (isBookmarked ? colors.primary : colors.icon);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.3, { damping: 4, stiffness: 300 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    onBookmark?.();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.bookmarkBtn, animatedStyle]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Icon
        name="heart"
        size={22}
        color={iconColor}
      />
    </AnimatedPressable>
  );
}

function MetaRow({
  rating,
  reviewCount,
  location,
  time,
}: {
  rating?: number;
  reviewCount?: number;
  location: string;
  time?: string;
}) {
  return (
    <View style={styles.metaRow}>
      {rating != null && (
        <>
          <Icon name="star" size={16} color={colors.warningIcon} />
          <Text style={styles.metaText}>
            {rating.toFixed(2)} ({reviewCount})
          </Text>
          <Text style={styles.metaDot}>·</Text>
        </>
      )}
      <Icon name="map-pin" size={16} color={colors.icon} />
      <Text style={styles.metaText}>{location}</Text>
      {time && (
        <>
          <Text style={styles.metaDot}>·</Text>
          <Icon name="clock" size={16} color={colors.icon} />
          <Text style={styles.metaText}>{time}</Text>
        </>
      )}
    </View>
  );
}

// ── Photo Card Variant (for carousel) ───────────────────

function PhotoCard({
  title,
  company,
  hourlyRate,
  rating,
  reviewCount,
  isBookmarked = false,
  imageUrl,
  image,
  video,
  isActive = false,
  dateLabel,
  onPress,
  onBookmark,
}: JobCardProps) {
  const scale = useSharedValue(1);
  const videoRef = useRef<Video>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !video) return;

    if (isActive) {
      videoRef.current.playAsync().catch(() => {});
    } else {
      videoRef.current.pauseAsync();
      videoRef.current.setPositionAsync(0);
    }
  }, [isActive, videoLoaded]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      }}
      style={[photoStyles.card, animatedStyle]}
    >
      {/* Video or plain color fallback */}
      {video ? (
        <Video
          ref={videoRef}
          source={video}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted
          shouldPlay={isActive}
          onLoad={() => setVideoLoaded(true)}
          videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' } as any}
        />
      ) : (
        <View style={[photoStyles.bgImage, { backgroundColor: colors.primaryContrast }]}>
          <View style={photoStyles.fallbackCenter}>
            <Icon name="briefcase" size={40} color="rgba(255,255,255,0.3)" />
          </View>
        </View>
      )}

      {/* Gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)'] as any}
        style={photoStyles.gradient}
      />

      {/* Date tag top-left */}
      {dateLabel && (
        <View style={photoStyles.dateTag}>
          <Text style={photoStyles.dateTagText}>{dateLabel}</Text>
        </View>
      )}

      {/* Bookmark top-right */}
      <View style={photoStyles.bookmarkWrap}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            onBookmark?.();
          }}
          hitSlop={8}
        >
          <Icon
            name="bookmark"
            size={22}
            color={isBookmarked ? colors.primary : colors.white}
          />
        </Pressable>
      </View>

      {/* Text over gradient at bottom */}
      <View style={photoStyles.textOverlay}>
        <Text style={photoStyles.title} numberOfLines={1}>{title}</Text>
        <Text style={photoStyles.company} numberOfLines={1}>{company}</Text>
        <View style={photoStyles.bottomRow}>
          <Text style={photoStyles.rate}>{hourlyRate}</Text>
          {rating != null && (
            <View style={photoStyles.ratingRow}>
              <Icon name="star" size={12} color="#FFECB3" />
              <Text style={photoStyles.ratingText}>
                {rating.toFixed(1)} ({reviewCount})
              </Text>
            </View>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
}

const photoStyles = StyleSheet.create({
  card: {
    width: 280,
    height: 400,
    borderRadius: radius.l,
    overflow: 'hidden',
    position: 'relative',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  fallbackCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  dateTag: {
    position: 'absolute',
    top: spacing.s,
    left: spacing.s,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.s,
  },
  dateTagText: {
    ...typography.emphasisSmall,
    fontSize: typeScale.xs.fontSize,
    color: colors.white,
  },
  bookmarkWrap: {
    position: 'absolute',
    top: spacing.s,
    right: spacing.s,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.s,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.white,
  },
  company: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  rate: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: '#93C5FD',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.xs.fontSize,
    color: 'rgba(255,255,255,0.8)',
  },
});

// ── Main Export ──────────────────────────────────────────

export function JobCard(props: JobCardProps) {
  const {
    variant = 'compact',
    title,
    company,
    location,
    time,
    hourlyRate,
    rating,
    reviewCount,
    isBookmarked = false,
    thumbnailUrl,
    imageUrl,
    image,
    badge,
    dateLabel,
    onPress,
    onBookmark,
  } = props;

  if (variant === 'photo') {
    return <PhotoCard {...props} />;
  }

  if (variant === 'horizontal') {
    return (
      <Card onPress={onPress}>
        <View style={styles.horizontalLayout}>
          <View style={styles.thumbnail}>
            {(image || thumbnailUrl) ? (
              <Image source={image || { uri: thumbnailUrl! }} style={styles.thumbnailImage} resizeMode="cover" />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Icon name="briefcase" size={24} color={colors.border} />
              </View>
            )}
          </View>
          <View style={styles.horizontalContent}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>{title}</Text>
              <BookmarkButton isBookmarked={isBookmarked} onBookmark={onBookmark} />
            </View>
            <Text style={styles.company} numberOfLines={1}>{company}</Text>
            <MetaRow rating={rating} reviewCount={reviewCount} location={location} time={time} />
            <Text style={styles.rate}>{hourlyRate}</Text>
          </View>
        </View>
      </Card>
    );
  }

  // Compact variant
  const hasImage = !!(image || thumbnailUrl || imageUrl);
  return (
    <Card onPress={onPress} style={hasImage ? { padding: 0, overflow: 'hidden' } : undefined}>
      {hasImage && (
        <View style={styles.compactImageWrap}>
          <Image
            source={image || { uri: (thumbnailUrl || imageUrl)! }}
            style={styles.compactImage}
            resizeMode="cover"
          />
          <View style={styles.heartWrap}>
            <BookmarkButton isBookmarked={isBookmarked} onBookmark={onBookmark} color={colors.white} />
          </View>
        </View>
      )}
      <View style={hasImage ? styles.compactBody : undefined}>
        {/* Row 1: Company + Rating */}
        <View style={styles.headerRow}>
          <Text style={styles.company} numberOfLines={1}>{company}</Text>
          {rating != null && (
            <View style={styles.ratingChip}>
              <Icon name="star" size={14} color={colors.foreground} />
              <Text style={styles.ratingChipText}>{rating.toFixed(2)} ({reviewCount})</Text>
            </View>
          )}
        </View>

        {/* Row 2: Job title */}
        <Text style={styles.title} numberOfLines={2}>{title}</Text>

        {/* Row 3: Location + Time */}
        <View style={styles.metaBlock}>
          <View style={styles.metaLine}>
            <Icon name="map-pin" size={16} color={colors.icon} />
            <Text style={styles.metaText}>{location}</Text>
          </View>
          {time && (
            <View style={styles.metaLine}>
              <Icon name="clock" size={16} color={colors.icon} />
              <Text style={styles.metaText}>{time}</Text>
            </View>
          )}
        </View>

        {/* Row 4: Rate badge */}
        <View style={styles.rateBadge}>
          <Text style={styles.rateBadgeText}>{hourlyRate}</Text>
        </View>

        {!hasImage && (
          <View style={styles.floatingBookmark}>
            <BookmarkButton isBookmarked={isBookmarked} onBookmark={onBookmark} />
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  // Horizontal variant
  horizontalLayout: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  thumbnail: {
    width: sizes.cardThumb,
    height: sizes.cardThumb,
    borderRadius: radius.s,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalContent: {
    flex: 1,
    gap: 2,
  },

  // Compact variant with top image
  compactImageWrap: {
    width: '100%',
    height: 206,
    position: 'relative',
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  heartWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  compactBody: {
    padding: spacing.m,
    gap: spacing.s,
  },

  // Shared
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  title: {
    flex: 1,
    ...typography.h4,
  },
  company: {
    ...typography.bodySmall,
    color: colors.textMuted,
    flex: 1,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
  },
  ratingChipText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.foreground,
  },
  metaBlock: {
    gap: 6,
  },
  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  metaDot: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginHorizontal: 2,
  },
  rateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF6FF',
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
  },
  rateBadgeText: {
    ...typography.emphasisSmall,
    color: colors.primary,
  },
  rate: {
    ...typography.emphasisLarge,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  badge: {
    backgroundColor: colors.tertiary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.s,
  },
  badgeText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.xs.fontSize,
    lineHeight: typeScale.xs.lineHeight,
    color: colors.primary,
  },
  floatingBookmark: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bookmarkBtn: {
    width: sizes.touchMin,
    height: sizes.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
