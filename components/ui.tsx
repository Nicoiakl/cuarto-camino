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
  withSpring,
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

const easeOut = Easing.out(Easing.cubic);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Atmosphere({ mode }: { mode: 'day' | 'session' }) {
  if (mode === 'session') {
    return (
      <>
        <LinearGradient
          colors={[...gradients.session]}
          locations={[0, 0.52, 1]}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={[...gradients.sessionSheen]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.85, y: 0.65 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.sessionVignette} />
      </>
    );
  }

  return (
    <>
      <LinearGradient
        colors={[...gradients.screen]}
        locations={[0, 0.48, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[...gradients.screenWarmEdge]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.15, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.grainA} />
      <View style={styles.grainB} />
      <View style={styles.grainC} />
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
        <View style={[styles.brandRuleTail, light && { backgroundColor: 'rgba(233,216,168,0.35)' }]} />
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
        light && { backgroundColor: 'rgba(248,249,246,0.14)' },
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
      entering={FadeInDown.delay(delay)
        .duration(motion.enter)
        .easing(easeOut)}
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

async function tap() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    /* web / simulator */
  }
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
    transform: [{ scale: interpolate(press.value, [0, 1], [1, 0.975]) }],
    opacity: interpolate(press.value, [0, 1], [1, 0.94]),
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
        press.value = withTiming(1, { duration: motion.press });
      }}
      onPressOut={() => {
        press.value = withSpring(0, motion.spring);
      }}
      onPress={async () => {
        await tap();
        onPress();
      }}
      style={[
        animStyle,
        styles.btnShell,
        shadowStyle,
        variant === 'ghost' && styles.btnGhostShell,
        disabled && { opacity: 0.38, shadowOpacity: 0, elevation: 0 },
      ]}>
      <View style={styles.btnClip}>
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
    transform: [{ scale: interpolate(press.value, [0, 1], [1, 0.97]) }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        press.value = withTiming(1, { duration: 120 });
      }}
      onPressOut={() => {
        press.value = withSpring(0, motion.spring);
      }}
      onPress={async () => {
        await tap();
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

export function PresencePulse({ active }: { active: boolean }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.18);

  useEffect(() => {
    if (!active) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.26, { duration: 1800, easing: easeOut }),
          withTiming(0.12, { duration: 1800, easing: easeOut }),
        ),
        -1,
        true,
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 1800, easing: easeOut }),
          withTiming(0.96, { duration: 1800, easing: easeOut }),
        ),
        -1,
        true,
      );
      return;
    }
    scale.value = withSequence(
      withTiming(1.14, { duration: 780, easing: easeOut }),
      withTiming(1, { duration: 980, easing: easeOut }),
    );
    opacity.value = withSequence(
      withTiming(0.48, { duration: 780, easing: easeOut }),
      withTiming(0.16, { duration: 980, easing: easeOut }),
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
  grainA: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(194, 166, 104, 0.08)',
  },
  grainB: {
    position: 'absolute',
    bottom: 100,
    left: -70,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(20, 53, 47, 0.045)',
  },
  grainC: {
    position: 'absolute',
    top: '42%',
    right: '18%',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(248, 249, 246, 0.35)',
  },
  sessionVignette: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 0,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 40,
  },
  brandWrap: {
    gap: 12,
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
    gap: 6,
  },
  brandRule: {
    width: 28,
    height: 1.5,
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
  brandRuleTail: {
    width: 10,
    height: 1.5,
    backgroundColor: 'rgba(194,166,104,0.35)',
    borderRadius: 1,
  },
  brandSub: {
    fontFamily: fonts.bodyItalic,
    fontSize: 15.5,
    lineHeight: 24,
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
    gap: 8,
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
    width: 22,
    height: 1,
    backgroundColor: colors.accent,
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
    backgroundColor: 'rgba(251,252,250,0.55)',
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
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  btnLabel: {
    fontFamily: fonts.uiSemi,
    fontSize: 15.5,
    letterSpacing: 0.45,
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
    borderColor: 'rgba(248,249,246,0.16)',
    backgroundColor: 'rgba(248,249,246,0.045)',
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
    letterSpacing: 0.2,
    color: colors.inkSoft,
  },
  chipLabelSelected: {
    color: colors.white,
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
    lineHeight: 24,
  },
});
