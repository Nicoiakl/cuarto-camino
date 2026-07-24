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
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, fonts, gradients, radii, spacing } from '@/constants/theme';

export function Screen({
  children,
  style,
  mode = 'day',
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  mode?: 'day' | 'session';
}) {
  const g = mode === 'session' ? gradients.session : gradients.screen;
  return (
    <View
      style={[
        styles.screen,
        mode === 'session' && { backgroundColor: colors.session },
        style,
      ]}>
      <LinearGradient
        colors={[...g]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

export function BrandMark({ subtitle }: { subtitle?: string }) {
  return (
    <View style={styles.brandWrap}>
      <Text style={styles.brand}>The Work</Text>
      {subtitle ? <Text style={styles.brandSub}>{subtitle}</Text> : null}
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
    <Text style={[styles.headline, light && { color: colors.white }]}>
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
  style?: object;
}) {
  return (
    <Text
      style={[
        styles.body,
        muted && styles.muted,
        light && { color: 'rgba(247,245,240,0.78)' },
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
    <Animated.View entering={FadeInDown.delay(delay).duration(520)} style={styles.section}>
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
  variant?: 'primary' | 'ghost' | 'gold' | 'session';
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
        pressed && { opacity: 0.86, transform: [{ scale: 0.985 }] },
        disabled && { opacity: 0.45 },
      ]}>
      <Text
        style={[
          styles.btnLabel,
          variant === 'ghost' && { color: colors.focus },
          variant === 'gold' && { color: colors.ink },
          variant === 'session' && { color: colors.session },
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
          session && { color: 'rgba(247,245,240,0.8)' },
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
  const opacity = useSharedValue(0.28);

  useEffect(() => {
    if (!active) return;
    scale.value = withSequence(
      withTiming(1.1, { duration: 700 }),
      withTiming(1, { duration: 900 }),
    );
    opacity.value = withSequence(
      withTiming(0.65, { duration: 700 }),
      withTiming(0.22, { duration: 900 }),
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
  brandWrap: {
    gap: 4,
    marginBottom: spacing.sm,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 44,
    lineHeight: 48,
    color: colors.ink,
    letterSpacing: 0.4,
  },
  brandSub: {
    fontFamily: fonts.bodyItalic,
    fontSize: 15,
    color: colors.muted,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 36,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkSoft,
  },
  muted: {
    color: colors.muted,
  },
  section: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.uiMedium,
    fontSize: 12,
    letterSpacing: 1.4,
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
    backgroundColor: colors.accentSoft,
  },
  btnLabel: {
    fontFamily: fonts.uiMedium,
    fontSize: 16,
    color: colors.white,
  },
  field: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
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
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
  },
  chipSession: {
    borderColor: 'rgba(247,245,240,0.22)',
    backgroundColor: 'rgba(247,245,240,0.06)',
  },
  chipSelected: {
    backgroundColor: colors.focus,
    borderColor: colors.focus,
  },
  chipSessionSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentSoft,
  },
  chipLabel: {
    fontFamily: fonts.ui,
    fontSize: 14,
    color: colors.inkSoft,
  },
  chipLabelSelected: {
    color: colors.white,
  },
  pulse: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.accent,
  },
  empty: {
    fontFamily: fonts.bodyItalic,
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },
});
