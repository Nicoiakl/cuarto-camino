import React, { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, fonts, gradients, motion, radii, spacing } from '@/constants/theme';

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
          colors={['rgba(181,154,91,0.12)', 'transparent']}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.9, y: 0.7 }}
          style={StyleSheet.absoluteFill}
        />
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
        end={{ x: 0.2, y: 0.55 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.grainA} />
      <View style={styles.grainB} />
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
      <Text style={[styles.brand, large && styles.brandLarge, light && { color: colors.white }]}>
        The Work
      </Text>
      <View style={[styles.brandRule, light && { backgroundColor: colors.accentHot }]} />
      {subtitle ? (
        <Text style={[styles.brandSub, light && { color: 'rgba(246,247,244,0.72)' }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export function Headline({
  children,
  light,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Text style={[styles.headline, light && { color: colors.white }]}>{children}</Text>
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
  style?: object;
}) {
  return (
    <Text
      style={[
        styles.body,
        muted && styles.muted,
        light && { color: 'rgba(246,247,244,0.78)' },
        style,
      ]}>
      {children}
    </Text>
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
      entering={FadeInDown.delay(delay).duration(motion.enter)}
      style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      {children}
    </Animated.View>
  );
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
  return (
    <Pressable
      disabled={disabled}
      onPress={async () => {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {
          /* web */
        }
        onPress();
      }}
      style={({ pressed }) => [
        styles.btn,
        variant === 'primary' && styles.btnPrimary,
        variant === 'ghost' && styles.btnGhost,
        variant === 'gold' && styles.btnGold,
        variant === 'session' && styles.btnSession,
        variant === 'lumen' && styles.btnLumen,
        pressed && { opacity: 0.88, transform: [{ scale: 0.987 }] },
        disabled && { opacity: 0.4 },
      ]}>
      <Text
        style={[
          styles.btnLabel,
          variant === 'ghost' && { color: colors.focus },
          variant === 'gold' && { color: colors.ink },
          variant === 'session' && { color: colors.session },
          variant === 'lumen' && { color: colors.ink },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Field(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      {...props}
      style={[styles.field, props.style]}
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
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        session && styles.chipSession,
        selected && (session ? styles.chipSessionSelected : styles.chipSelected),
      ]}>
      <Text
        style={[
          styles.chipLabel,
          session && { color: 'rgba(246,247,244,0.82)' },
          selected && styles.chipLabelSelected,
          selected && session && { color: colors.session },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function PresencePulse({ active }: { active: boolean }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.22);

  useEffect(() => {
    if (!active) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.28, { duration: 1600 }),
          withTiming(0.14, { duration: 1600 }),
        ),
        -1,
        true,
      );
      return;
    }
    scale.value = withSequence(
      withTiming(1.12, { duration: 700 }),
      withTiming(1, { duration: 900 }),
    );
    opacity.value = withSequence(
      withTiming(0.55, { duration: 700 }),
      withTiming(0.18, { duration: 900 }),
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
    top: -40,
    right: -30,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(181, 154, 91, 0.07)',
  },
  grainB: {
    position: 'absolute',
    bottom: 120,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(28, 61, 54, 0.05)',
  },
  brandWrap: {
    gap: 10,
    marginBottom: spacing.sm,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 48,
    lineHeight: 50,
    color: colors.ink,
    letterSpacing: 0.2,
  },
  brandLarge: {
    fontSize: 56,
    lineHeight: 58,
  },
  brandRule: {
    width: 36,
    height: 2,
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
  brandSub: {
    fontFamily: fonts.bodyItalic,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    maxWidth: 280,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 38,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 26,
    color: colors.inkSoft,
  },
  muted: {
    color: colors.muted,
  },
  section: {
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.focusSoft,
    marginBottom: 2,
  },
  btn: {
    borderRadius: radii.md,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.focus,
  },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.line,
  },
  btnGold: {
    backgroundColor: colors.accentSoft,
  },
  btnSession: {
    backgroundColor: colors.accentHot,
  },
  btnLumen: {
    backgroundColor: colors.accentHot,
  },
  btnLabel: {
    fontFamily: fonts.uiMedium,
    fontSize: 16,
    letterSpacing: 0.2,
    color: colors.white,
  },
  field: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    minHeight: 48,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.md,
  },
  chipSession: {
    borderColor: 'rgba(246,247,244,0.16)',
    backgroundColor: 'rgba(246,247,244,0.05)',
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
    fontSize: 14,
    color: colors.inkSoft,
  },
  chipLabelSelected: {
    color: colors.white,
  },
  pulse: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.accentHot,
  },
  empty: {
    fontFamily: fonts.bodyItalic,
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },
});
