import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { setStatusBarStyle } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { BrandMark, Screen } from '@/components/ui';
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
import { useWork } from '@/context/WorkContext';
import { todayKey } from '@/lib/dates';
import { practiceOfDay } from '@/lib/practice';

const tidal = Easing.inOut(Easing.sin);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * One native phone-height screen. No scroll. No sun/orb.
 * Brand · practice · CTA (thumb zone) · two secondary hits.
 */
export default function HoyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { todayAim, track, todayReview, analytics } = useWork();
  const practice = practiceOfDay();
  const practicedToday = useMemo(() => {
    const day = todayKey();
    return analytics.some(
      (e) => e.name === 'practice_completed' && e.at.startsWith(day),
    );
  }, [analytics]);

  const ctaPress = useSharedValue(0);
  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(ctaPress.value, [0, 1], [1, 0.985]) }],
  }));

  useEffect(() => {
    track('screen_hoy');
  }, [track]);

  useEffect(() => {
    setStatusBarStyle('light');
  }, []);

  const secondaryLabel = todayAim?.text ? todayAim.text : t('home.setAim');
  const closeLabel = todayReview ? t('home.seeReview') : t('home.eveningReview');

  return (
    <Screen>
      <View
        style={[
          styles.frame,
          {
            paddingTop: insets.top + 12,
            paddingBottom: Math.max(insets.bottom, 6) + 6,
          },
        ]}>
        <LinearGradient
          colors={[...gradients.hero]}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={[...gradients.heroSheen]}
          locations={[0, 0.5, 1]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View
          entering={FadeIn.duration(motion.slow).easing(tidal)}
          style={styles.top}>
          <BrandMark light subtitle={t('brand.subtitle')} />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(motion.enter).easing(tidal)}
          style={styles.center}>
          <Text style={styles.kicker}>
            {practicedToday
              ? t('home.practiceDoneKicker')
              : t('home.practiceKicker')}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {t(`practice.kinds.${practice.kind}`)}
          </Text>
          <Text style={styles.body} numberOfLines={3}>
            {t(`practice.summaries.${practice.kind}`)}
          </Text>
          <Text style={styles.meta}>
            {t('home.practiceMeta', { minutes: practice.minutes })}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(380).duration(motion.enter).easing(tidal)}
          style={styles.bottom}>
          <AnimatedPressable
            onPressIn={() => {
              ctaPress.value = withTiming(1, {
                duration: motion.press,
                easing: tidal,
              });
            }}
            onPressOut={() => {
              ctaPress.value = withTiming(0, {
                duration: 450,
                easing: tidal,
              });
            }}
            onPress={() => {
              void Haptics.selectionAsync().catch(() => {});
              track('home_start_practice', { kind: practice.kind });
              router.push('/practica');
            }}
            style={[ctaStyle, styles.ctaShell, shadows.gold]}>
            <View style={styles.ctaClip}>
              <LinearGradient
                colors={[...gradients.lumenBtn]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cta}>
                <View style={styles.ctaHighlight} />
                <Text style={styles.ctaText}>
                  {practicedToday
                    ? t('home.practiceAgain')
                    : t('home.practiceStart')}
                </Text>
              </LinearGradient>
            </View>
          </AnimatedPressable>

          <View style={styles.secondaryRow}>
            <Pressable
              onPress={() => router.push('/aims')}
              hitSlop={8}
              style={({ pressed }) => [
                styles.secondaryHit,
                pressed && { opacity: 0.7 },
              ]}>
              <Text style={styles.secondaryLabel}>{t('home.aimToday')}</Text>
              <Text style={styles.secondaryValue} numberOfLines={1}>
                {secondaryLabel}
              </Text>
            </Pressable>

            <View style={styles.secondaryDivider} />

            <Pressable
              onPress={() => router.push('/revision')}
              hitSlop={8}
              style={({ pressed }) => [
                styles.secondaryHit,
                pressed && { opacity: 0.7 },
              ]}>
              <Text style={styles.secondaryLabel}>{t('home.dayClose')}</Text>
              <Text style={styles.secondaryValue} numberOfLines={1}>
                {closeLabel}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  top: {
    flexShrink: 0,
  },
  center: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    gap: 10,
    paddingVertical: spacing.md,
  },
  kicker: {
    fontFamily: fonts.uiMedium,
    fontSize: type.label.size,
    letterSpacing: type.label.tracking,
    textTransform: 'uppercase',
    color: colors.accentHot,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 42,
    color: colors.white,
    letterSpacing: 0.2,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 25,
    color: colors.whiteMuted,
    maxWidth: 300,
  },
  meta: {
    fontFamily: fonts.ui,
    fontSize: type.meta.size,
    letterSpacing: type.meta.tracking,
    color: colors.whiteSoft,
    marginTop: 2,
  },
  bottom: {
    flexShrink: 0,
    gap: 14,
  },
  ctaShell: {
    borderRadius: radii.md,
  },
  ctaClip: {
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  cta: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  ctaHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  ctaText: {
    fontFamily: fonts.uiMedium,
    fontSize: 16,
    letterSpacing: 0.55,
    color: colors.bgDeep,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 48,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lineSoft,
    paddingTop: 12,
  },
  secondaryHit: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  secondaryDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.lineSoft,
    marginHorizontal: 14,
  },
  secondaryLabel: {
    fontFamily: fonts.uiMedium,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  secondaryValue: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.whiteMuted,
  },
});
