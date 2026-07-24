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
  if (mode === 'session') {
    return (
      <>
        <LinearGradient
          colors={[...gradients.session]}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={[...gradients.sessionSheen]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 0.75 }}
          style={StyleSheet.absoluteFill}
        />
        {/* soft ember — like fire across water */}
        <MistOrb style={styles.emberGlow} duration={motion.breath * 2} drift={8} />
        <View style={styles.waterFloor} />
      </>
    );
  }

  return (
    <>
      <LinearGradient
        colors={[...gradients.screen]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[...gradients.screenWarmEdge]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.2, y: 0.7 }}
        style={StyleSheet.absoluteFill}
      />
      <MistOrb style={styles.mistA} duration={10000} drift={14} />
      <MistOrb style={styles.mistB} duration={14000} drift={10} />
      <View style={styles.mistC} />
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
        <View style={[styles.brandRule, light && { backgroundColor: colors.accentHot }]} />
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

  const labelColor =
    variant === 'ghost'
      ? colors.focus
      : variant === 'primary'
        ? colors.white
        : colors.ink;

  const shadowStyle =
    variant === 'lumen' || variant === 'session'
      ? shadows.gold
      : variant === 'primary'
        ? shadows.ink
        : variant === 'gold'
          ? shadows.soft
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
          selected && styles.chipLabelSelected,
          selected && session && { color: colors.ink },
        ]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

/** Soft fire / water ripple — never urgent */
export function PresencePulse({ active }: { active: boolean }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.14);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(active ? 0.36 : 0.22, {
          duration: motion.pulse,
          easing: tidal,
        }),
        withTiming(0.1, { duration: motion.pulse, easing: tidal }),
      ),
      -1,
      true,
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(active ? 1.1 : 1.05, {
          duration: motion.pulse,
          easing: tidal,
        }),
        withTiming(0.94, { duration: motion.pulse, easing: tidal }),
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
  mistA: {
    position: 'absolute',
    top: -30,
    right: -50,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(122, 154, 160, 0.16)',
  },
  mistB: {
    position: 'absolute',
    bottom: 80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(226, 184, 154, 0.1)',
  },
  mistC: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(242, 246, 245, 0.4)',
  },
  emberGlow: {
    position: 'absolute',
    bottom: '18%',
    alignSelf: 'center',
    left: '22%',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(226, 184, 154, 0.14)',
  },
  waterFloor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
    backgroundColor: 'rgba(7, 18, 22, 0.25)',
  },
  brandWrap: {
    gap: 14,
    marginBottom: spacing.xs,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: type.brand.size,
    lineHeight: type.brand.line,
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
    width: 24,
    height: 1,
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
  brandSub: {
    fontFamily: fonts.bodyItalic,
    fontSize: 16,
    lineHeight: 26,
    color: colors.muted,
    maxWidth: 300,
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
    width: 18,
    height: 1,
    backgroundColor: colors.water,
    opacity: 0.7,
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
    backgroundColor: 'rgba(247,250,249,0.5)',
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
    backgroundColor: colors.focus,
    borderColor: colors.focus,
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
  chipLabelSelected: {
    color: colors.white,
  },
  pulse: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.accentHot,
  },
  empty: {
    fontFamily: fonts.bodyItalic,
    fontSize: 15.5,
    color: colors.muted,
    lineHeight: 25,
  },
});
