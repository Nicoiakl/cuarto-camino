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
import { colors, fonts, radii, spacing } from '@/constants/theme';

export function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.screen, style]}>
      <LinearGradient
        colors={['#EEF1EC', colors.bg, colors.bgDeep]}
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

export function Headline({ children }: { children: React.ReactNode }) {
  return <Text style={styles.headline}>{children}</Text>;
}

export function Body({
  children,
  muted,
  style,
}: {
  children: React.ReactNode;
  muted?: boolean;
  style?: object;
}) {
  return (
    <Text style={[styles.body, muted && styles.muted, style]}>{children}</Text>
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
  variant?: 'primary' | 'ghost' | 'gold';
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
        pressed && { opacity: 0.86, transform: [{ scale: 0.985 }] },
        disabled && { opacity: 0.45 },
      ]}>
      <Text
        style={[
          styles.btnLabel,
          variant === 'ghost' && { color: colors.pine },
          variant === 'gold' && { color: colors.ink },
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
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function PresencePulse({ active }: { active: boolean }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    if (!active) return;
    scale.value = withSequence(
      withTiming(1.08, { duration: 700 }),
      withTiming(1, { duration: 900 }),
    );
    opacity.value = withSequence(
      withTiming(0.7, { duration: 700 }),
      withTiming(0.25, { duration: 900 }),
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
    marginBottom: spacing.md,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 42,
    lineHeight: 46,
    color: colors.ink,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontFamily: fonts.bodyItalic,
    fontSize: 15,
    color: colors.muted,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
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
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.pine,
    marginBottom: 2,
  },
  btn: {
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.pine,
  },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.line,
  },
  btnGold: {
    backgroundColor: colors.goldSoft,
  },
  btnLabel: {
    fontFamily: fonts.bodyMedium,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.sm,
  },
  chipSelected: {
    backgroundColor: colors.pine,
    borderColor: colors.pine,
  },
  chipLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
  },
  chipLabelSelected: {
    color: colors.white,
  },
  pulse: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.gold,
  },
  empty: {
    fontFamily: fonts.bodyItalic,
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },
});
