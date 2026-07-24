import React, { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  colors,
  fonts,
  gradients,
  motion,
  radii,
  shadows,
  spacing,
  type,
} from '@/constants/theme';

/** Water / breath curve — no bounce */
const tidal = Easing.inOut(Easing.sin);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function MistOrb({
  style,
  duration = 9000,
  drift = 12,
}: {
  style: ViewStyle;
  duration?: number;
  drift?: number;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration, easing: tidal }),
        withTiming(0, { duration, easing: tidal }),
      ),
      -1,
      false,
    );
  }, [drift, duration, t]);

  const anim = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(t.value, [0, 1], [0, -drift]) },
      { scale: interpolate(t.value, [0, 1], [1, 1.06]) },
    ],
    opacity: interpolate(t.value, [0, 1], [0.45, 0.7]),
  }));

  return <Animated.View style={[style, anim]} />;
}

function Atmosphere({ mode }: { mode: 'day' | 'session' }) {
  const session = mode === 'session';
  return (
    <>
      <LinearGradient
        colors={[...(session ? gradients.session : gradients.screen)]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[...(session ? gradients.sessionSheen : gradients.screenWarmEdge)]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0.2 }}
        style={StyleSheet.absoluteFill}
      />
      {/* One flame only — the whole night gathers around it */}
      <MistOrb
        style={session ? styles.flameCore : styles.flameSoft}
        duration={motion.breath}
        drift={6}
      />
    </>
  );
}

export function Screen({
  children,
  style,
  mode = 'day',
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  mode?: 'day' | 'session';
}) {
  return (
    <View
      style={[
        styles.screen,
        mode === 'session' && { backgroundColor: colors.session },
        style,
      ]}>
      <Atmosphere mode={mode} />
      {children}
    </View>
  );
}

export function BrandMark({
  subtitle,
  light,
  large,
}: {
  subtitle?: string;
  light?: boolean;
  large?: boolean;
}) {
  return (
    <View style={styles.brandWrap}>
      <Text
        style={[
          styles.brand,
          large && styles.brandLarge,
          light && { color: colors.white },
        ]}>
        The Work
      </Text>
      <View style={styles.brandRuleRow}>
        <View style={styles.brandRule} />
      </View>
      {subtitle ? (
        <Text style={[styles.brandSub, light && { color: colors.whiteMuted }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export function Headline({
  children,
  light,
  style,
}: {
  children: React.ReactNode;
  light?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text style={[styles.headline, light && { color: colors.white }, style]}>
      {children}
    </Text>
  );
}

export function Body({
  children,
  muted,
  light,
  style,
}: {
  children: React.ReactNode;
  muted?: boolean;
  light?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      style={[
        styles.body,
        muted && styles.muted,
        light && { color: colors.whiteMuted },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function Kicker({
  children,
  light,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Text style={[styles.kicker, light && { color: colors.accentHot }]}>{children}</Text>
  );
}

export function Hairline({ light }: { light?: boolean }) {
  return (
    <View
      style={[
        styles.hairline,
        light && { backgroundColor: 'rgba(243,247,246,0.12)' },
      ]}
    />
  );
}

export function Section({
  title,
  children,
  delay = 0,
}: {
  title?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(motion.enter).easing(tidal)}
      style={styles.section}>
      {title ? (
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.sectionRule} />
        </View>
      ) : null}
      {children}
    </Animated.View>
  );
}

function tap() {
  // Never await — Haptics can hang in Expo Go and block the real action.
  void Haptics.selectionAsync().catch(() => {});
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'gold' | 'session' | 'lumen';
  disabled?: boolean;
}) {
  const press = useSharedValue(0);
  const gradient =
    variant === 'lumen' || variant === 'session'
      ? gradients.lumenBtn
      : variant === 'gold'
        ? gradients.goldBtn
        : variant === 'primary'
          ? gradients.primaryBtn
          : null;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(press.value, [0, 1], [1, 0.982]) }],
    opacity: interpolate(press.value, [0, 1], [1, 0.92]),
  }));

  /** Flame buttons need dark text; ghost stays warm on night */
  const labelColor =
    variant === 'ghost' ? colors.accentHot : colors.bgDeep;

  const shadowStyle =
    variant === 'ghost'
      ? shadows.none
      : variant === 'lumen' ||
          variant === 'session' ||
          variant === 'primary' ||
          variant === 'gold'
        ? shadows.gold
        : shadows.none;

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={() => {
        if (disabled) return;
        press.value = withTiming(1, { duration: motion.press, easing: tidal });
      }}
      onPressOut={() => {
        press.value = withTiming(0, { duration: 420, easing: tidal });
      }}
      onPress={() => {
        if (disabled) return;
        tap();
        onPress();
      }}
      style={[
        animStyle,
        styles.btnShell,
        shadowStyle,
        variant === 'ghost' && styles.btnGhostShell,
        disabled && { opacity: 0.36, shadowOpacity: 0, elevation: 0 },
      ]}>
      <View style={styles.btnClip} pointerEvents="none">
        {gradient ? (
          <LinearGradient
            colors={[...gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnFill}>
            <View style={styles.btnHighlight} />
            <Text style={[styles.btnLabel, { color: labelColor }]}>{label}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.btnFill, styles.btnGhostFill]}>
            <Text style={[styles.btnLabel, { color: labelColor }]}>{label}</Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

export function Field(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      {...props}
      style={[styles.field, shadows.soft, props.style]}
    />
  );
}

export function Chip({
  label,
  selected,
  onPress,
  tone = 'day',
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: 'day' | 'session';
}) {
  const session = tone === 'session';
  const press = useSharedValue(0);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(press.value, [0, 1], [1, 0.98]) }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        press.value = withTiming(1, { duration: 200, easing: tidal });
      }}
      onPressOut={() => {
        press.value = withTiming(0, { duration: 360, easing: tidal });
      }}
      onPress={() => {
        tap();
        onPress?.();
      }}
      style={[
        animStyle,
        styles.chip,
        session && styles.chipSession,
        selected && (session ? styles.chipSessionSelected : styles.chipSelected),
        selected && (session ? shadows.gold : shadows.soft),
      ]}>
      <Text
        style={[
          styles.chipLabel,
          session && { color: colors.whiteMuted },
          selected && { color: colors.bgDeep },
        ]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

/** Single flame flicker — never urgent */
export function PresencePulse({ active }: { active: boolean }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.16);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(active ? 0.42 : 0.26, {
          duration: motion.pulse,
          easing: tidal,
        }),
        withTiming(0.08, { duration: motion.pulse * 0.85, easing: tidal }),
      ),
      -1,
      true,
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(active ? 1.12 : 1.06, {
          duration: motion.pulse,
          easing: tidal,
        }),
        withTiming(0.92, { duration: motion.pulse * 0.85, easing: tidal }),
      ),
      -1,
      true,
    );
  }, [active, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.pulse, style]} />;
}

export function EmptyLine({ text }: { text: string }) {
  return <Text style={styles.empty}>{text}</Text>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flameSoft: {
    position: 'absolute',
    bottom: '12%',
    alignSelf: 'center',
    left: '28%',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(240, 184, 120, 0.14)',
  },
  flameCore: {
    position: 'absolute',
    bottom: '16%',
    alignSelf: 'center',
    left: '24%',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(240, 184, 120, 0.2)',
  },
  brandWrap: {
    gap: 14,
    marginBottom: spacing.xs,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 42,
    lineHeight: 44,
    letterSpacing: type.brand.tracking,
    color: colors.ink,
  },
  brandLarge: {
    fontSize: type.brandLg.size,
    lineHeight: type.brandLg.line,
    letterSpacing: type.brandLg.tracking,
  },
  brandRuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandRule: {
    width: 20,
    height: 1.5,
    backgroundColor: colors.accentHot,
    borderRadius: 1,
  },
  brandSub: {
    fontFamily: fonts.bodyItalic,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.muted,
    maxWidth: 280,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: type.display.size,
    lineHeight: type.display.line,
    letterSpacing: type.display.tracking,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: type.body.size,
    lineHeight: type.body.line,
    color: colors.inkSoft,
  },
  muted: {
    color: colors.muted,
  },
  kicker: {
    fontFamily: fonts.uiMedium,
    fontSize: type.label.size,
    lineHeight: type.label.line,
    letterSpacing: type.label.tracking,
    textTransform: 'uppercase',
    color: colors.focusSoft,
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lineHair,
    marginVertical: spacing.md,
  },
  section: {
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  sectionHead: {
    marginBottom: spacing.xxs,
    gap: 10,
  },
  sectionTitle: {
    fontFamily: fonts.uiMedium,
    fontSize: type.label.size,
    lineHeight: type.label.line,
    letterSpacing: type.label.tracking,
    textTransform: 'uppercase',
    color: colors.focusSoft,
  },
  sectionRule: {
    width: 16,
    height: 1,
    backgroundColor: colors.accent,
    opacity: 0.55,
  },
  btnShell: {
    borderRadius: radii.md,
  },
  btnClip: {
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  btnGhostShell: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.line,
    backgroundColor: 'rgba(237, 230, 220, 0.03)',
  },
  btnFill: {
    minHeight: 54,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostFill: {
    backgroundColor: 'transparent',
  },
  btnHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  btnLabel: {
    fontFamily: fonts.uiMedium,
    fontSize: 15.5,
    letterSpacing: 0.55,
  },
  field: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.lineSoft,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.body,
    fontSize: 16.5,
    color: colors.ink,
    minHeight: 52,
  },
  chip: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.line,
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: radii.sm,
  },
  chipSession: {
    borderColor: 'rgba(243,247,246,0.14)',
    backgroundColor: 'rgba(243,247,246,0.04)',
  },
  chipSelected: {
    backgroundColor: colors.accentHot,
    borderColor: colors.accentHot,
  },
  chipSessionSelected: {
    backgroundColor: colors.accentHot,
    borderColor: colors.accentHot,
  },
  chipLabel: {
    fontFamily: fonts.uiMedium,
    fontSize: 13.5,
    letterSpacing: 0.25,
    color: colors.inkSoft,
  },
  pulse: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.accentHot,
  },
  empty: {
    fontFamily: fonts.bodyItalic,
    fontSize: 15.5,
    color: colors.muted,
    lineHeight: 25,
  },
});
