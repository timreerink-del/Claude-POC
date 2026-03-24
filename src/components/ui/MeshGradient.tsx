import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// ── Time-of-day color palettes ──────────────────────────
// High internal alpha — container opacity controls final intensity

function getAuroraBlobs() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12)
    return [
      { x: 0.3, y: 0.25, r: 0.45, color: '255,220,80', alpha: 0.85 },
      { x: 0.7, y: 0.4, r: 0.40, color: '255,160,80', alpha: 0.75 },
      { x: 0.5, y: 0.15, r: 0.38, color: '120,200,255', alpha: 0.70 },
      { x: 0.2, y: 0.55, r: 0.35, color: '255,200,120', alpha: 0.65 },
    ];
  if (hour >= 12 && hour < 17)
    return [
      { x: 0.3, y: 0.25, r: 0.45, color: '80,180,255', alpha: 0.85 },
      { x: 0.7, y: 0.4, r: 0.40, color: '120,240,180', alpha: 0.75 },
      { x: 0.5, y: 0.15, r: 0.38, color: '200,150,255', alpha: 0.70 },
      { x: 0.2, y: 0.55, r: 0.35, color: '80,220,220', alpha: 0.65 },
    ];
  if (hour >= 17 && hour < 21)
    return [
      { x: 0.3, y: 0.25, r: 0.45, color: '255,100,130', alpha: 0.85 },
      { x: 0.7, y: 0.4, r: 0.40, color: '255,150,60', alpha: 0.75 },
      { x: 0.5, y: 0.15, r: 0.38, color: '200,80,255', alpha: 0.70 },
      { x: 0.2, y: 0.55, r: 0.35, color: '255,80,100', alpha: 0.65 },
    ];
  return [
    { x: 0.3, y: 0.25, r: 0.45, color: '60,100,255', alpha: 0.85 },
    { x: 0.7, y: 0.4, r: 0.40, color: '120,60,255', alpha: 0.75 },
    { x: 0.5, y: 0.15, r: 0.38, color: '40,180,220', alpha: 0.70 },
    { x: 0.2, y: 0.55, r: 0.35, color: '100,40,200', alpha: 0.65 },
  ];
}

// Container opacity — the master dial for intensity
const OVERLAY_OPACITY = 0.16;

// ── Web implementation — HTML5 Canvas ───────────────────

function MeshGradientCanvas({ height: h }: { height: number }) {
  const { width } = useWindowDimensions();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);
  const blobsRef = useRef(getAuroraBlobs());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const blobs = blobsRef.current;

    function draw() {
      if (!ctx) return;
      const t = tRef.current;

      // Transparent canvas — no background fill
      // The background color comes from the screen behind this overlay
      ctx.clearRect(0, 0, width, h);

      blobs.forEach((blob, i) => {
        const bx =
          width *
          (blob.x +
            0.3 * Math.sin(t * 0.7 + i * 1.5) +
            0.12 * Math.cos(t * 0.3 + i));
        const by =
          h *
          (blob.y +
            0.25 * Math.cos(t * 0.5 + i * 1.3) +
            0.08 * Math.sin(t * 0.4 + i * 0.7));
        const r = width * blob.r;

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, r);
        grad.addColorStop(0, `rgba(${blob.color}, ${blob.alpha})`);
        grad.addColorStop(0.6, `rgba(${blob.color}, ${blob.alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${blob.color}, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, h);
      });

      tRef.current += 0.004;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [width, h]);

  return (
    <canvas
      ref={canvasRef as any}
      style={{
        width,
        height: h,
        display: 'block',
      }}
    />
  );
}

// ── Native implementation — Reanimated blobs ────────────

function MeshGradientNativeBlobs({ height: h }: { height: number }) {
  const { width } = useWindowDimensions();
  const Animated = require('react-native-reanimated');
  const {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    cancelAnimation,
    Easing,
  } = Animated;

  const blobs = getAuroraBlobs();

  const t1 = useSharedValue(0);
  const t2 = useSharedValue(0);
  const t3 = useSharedValue(0);

  const TWO_PI = Math.PI * 2;

  useFocusEffect(
    useCallback(() => {
      t1.value = withRepeat(
        withTiming(TWO_PI, { duration: 8000, easing: Easing.linear }),
        -1,
        false,
      );
      t2.value = withRepeat(
        withTiming(TWO_PI, { duration: 11000, easing: Easing.linear }),
        -1,
        false,
      );
      t3.value = withRepeat(
        withTiming(TWO_PI, { duration: 14000, easing: Easing.linear }),
        -1,
        false,
      );

      return () => {
        cancelAnimation(t1);
        cancelAnimation(t2);
        cancelAnimation(t3);
      };
    }, []),
  );

  const times = [t1, t2, t3];
  const blobStyles = blobs.map((blob, i) => {
    const tA = times[i % 3];
    const tB = times[(i + 1) % 3];

    return useAnimatedStyle(() => ({
      transform: [
        {
          translateX:
            width *
            (0.3 * Math.sin(tA.value * 0.7 + i * 1.5) +
              0.12 * Math.cos(tB.value * 0.3 + i)),
        },
        {
          translateY:
            h *
            (0.25 * Math.cos(tB.value * 0.5 + i * 1.3) +
              0.08 * Math.sin(tA.value * 0.4 + i * 0.7)),
        },
      ],
    }));
  });

  return (
    <>
      {blobs.map((blob, i) => {
        const size = width * blob.r * 2;
        return (
          <Animated.default.View
            key={i}
            style={[
              {
                position: 'absolute',
                left: width * blob.x - size / 2,
                top: h * blob.y - size / 2,
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: `rgba(${blob.color}, ${blob.alpha * 0.5})`,
              },
              blobStyles[i],
            ]}
          />
        );
      })}
    </>
  );
}

// ── Exported component — absolute overlay ───────────────

export function MeshGradient({ height }: { height: number }) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.overlay,
        { height, opacity: OVERLAY_OPACITY },
      ]}
      pointerEvents="none"
    >
      {Platform.OS === 'web' ? (
        <MeshGradientCanvas height={height} />
      ) : (
        <MeshGradientNativeBlobs height={height} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    overflow: 'hidden',
    zIndex: 0,
  },
});
