import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

/** Ultra-slow sand — ~3 minutes for one breath of the glass */
const CYCLE_MS = 180_000;
const tidal = Easing.inOut(Easing.sin);

/**
 * Quiet hourglass for the sauna room.
 * No labels, no urgency — only time becoming visible.
 */
export function Hourglass({ size = 112 }: { size?: number }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: CYCLE_MS, easing: tidal }),
      -1,
      false,
    );
  }, [t]);

  const topSand = useAnimatedStyle(() => ({
    height: interpolate(t.value, [0, 1], [size * 0.28, 2]),
    opacity: interpolate(t.value, [0, 0.85, 1], [0.85, 0.55, 0.35]),
  }));

  const bottomSand = useAnimatedStyle(() => ({
    height: interpolate(t.value, [0, 1], [2, size * 0.28]),
    opacity: interpolate(t.value, [0, 1], [0.35, 0.9]),
  }));

  const stream = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 0.08, 0.92, 1], [0, 0.7, 0.7, 0]),
  }));

  const w = size;
  const chamber = size * 0.42;

  return (
    <View style={[styles.wrap, { width: w, height: size * 1.35 }]} accessibilityRole="image">
      {/* top bulb */}
      <View style={[styles.bulb, { width: chamber, height: chamber }]}>
        <Animated.View style={[styles.sandTop, topSand]} />
      </View>

      {/* neck + stream */}
      <View style={styles.neck}>
        <Animated.View style={[styles.stream, stream]} />
      </View>

      {/* bottom bulb */}
      <View style={[styles.bulb, styles.bulbBottom, { width: chamber, height: chamber }]}>
        <Animated.View style={[styles.sandBottom, bottomSand]} />
      </View>

      {/* faint frame lines */}
      <View style={[styles.frameLine, styles.frameTop, { width: chamber + 8 }]} />
      <View style={[styles.frameLine, styles.frameBottom, { width: chamber + 8 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulb: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(237, 230, 220, 0.22)',
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(237, 230, 220, 0.02)',
  },
  bulbBottom: {
    justifyContent: 'flex-end',
  },
  sandTop: {
    width: '62%',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: colors.accentSoft,
  },
  sandBottom: {
    width: '68%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: colors.accentHot,
  },
  neck: {
    width: 2,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(237, 230, 220, 0.12)',
  },
  stream: {
    width: 1,
    height: 18,
    backgroundColor: colors.accentHot,
  },
  frameLine: {
    position: 'absolute',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(237, 230, 220, 0.14)',
  },
  frameTop: {
    top: 0,
  },
  frameBottom: {
    bottom: 0,
  },
});
