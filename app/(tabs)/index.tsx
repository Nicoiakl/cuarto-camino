import { useEffect, useMemo } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { setStatusBarStyle } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import {
  Body,
  BrandMark,
  Button,
  Hairline,
  PresencePulse,
  Screen,
  Section,
} from '@/components/ui';
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
import { quoteOfDay, quoteSource, quoteText } from '@/lib/quotes';

const { height: SCREEN_H } = Dimensions.get('window');
const easeOut = Easing.out(Easing.cubic);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HoyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { todayAim, track, todayReview, analytics } = useWork();
  const practice = practiceOfDay();
  const quote = quoteOfDay();
  const practicedToday = useMemo(() => {
    const day = todayKey();
    return analytics.some(
      (e) => e.name === 'practice_completed' && e.at.startsWith(day),
    );
  }, [analytics]);

  const ctaPress = useSharedValue(0);
  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(ctaPress.value, [0, 1], [1, 0.978]) }],
  }));

  useEffect(() => {
    track('screen_hoy');
  }, [track]);

  useEffect(() => {
    setStatusBarStyle('light');
    return () => setStatusBarStyle('dark');
  }, []);

  const heroMin = Math.max(560, SCREEN_H * 0.82);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.heroViewport,
            { minHeight: heroMin, paddingTop: insets.top + 22 },
          ]}>
          <LinearGradient
            colors={[...gradients.hero]}
            locations={[0, 0.52, 1]}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={[...gradients.heroSheen]}
            locations={[0, 0.45, 1]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.95, y: 0.85 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroMist} />
          <View style={styles.heroOrbWrap} pointerEvents="none">
            <PresencePulse active={false} />
          </View>

          <Animated.View
            entering={FadeIn.duration(motion.slow).easing(easeOut)}
            style={styles.heroInner}>
            <BrandMark large light subtitle={t('brand.subtitle')} />

            <Animated.View
              entering={FadeInUp.delay(180).duration(motion.enter).easing(easeOut)}
              style={styles.heroCopy}>
              <Text style={styles.heroKicker}>
                {practicedToday
                  ? t('home.practiceDoneKicker')
                  : t('home.practiceKicker')}
              </Text>
              <Text style={styles.heroTitle}>
                {t(`practice.kinds.${practice.kind}`)}
              </Text>
              <Text style={styles.heroBody}>
                {t(`practice.summaries.${practice.kind}`)}
              </Text>
              <View style={styles.metaRow}>
                <View style={styles.metaDot} />
                <Text style={styles.heroMeta}>
                  {t('home.practiceMeta', { minutes: practice.minutes })}
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(320).duration(motion.enter).easing(easeOut)}>
              <AnimatedPressable
                onPressIn={() => {
                  ctaPress.value = withTiming(1, { duration: motion.press });
                }}
                onPressOut={() => {
                  ctaPress.value = withSpring(0, motion.spring);
                }}
                onPress={async () => {
                  try {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  } catch {
                    /* web */
                  }
                  track('home_start_practice', { kind: practice.kind });
                  router.push('/practica');
                }}
                style={[ctaStyle, styles.heroCtaShell, shadows.gold]}>
                <View style={styles.heroCtaClip}>
                  <LinearGradient
                    colors={[...gradients.lumenBtn]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroCta}>
                    <View style={styles.ctaHighlight} />
                    <Text style={styles.heroCtaText}>
                      {practicedToday
                        ? t('home.practiceAgain')
                        : t('home.practiceStart')}
                    </Text>
                  </LinearGradient>
                </View>
              </AnimatedPressable>
            </Animated.View>
          </Animated.View>
        </View>

        <View style={styles.below}>
          <Section title={t('home.aimToday')} delay={60}>
            {todayAim?.text ? (
              <Text style={styles.aimText}>{todayAim.text}</Text>
            ) : (
              <Body muted>{t('home.noAim')}</Body>
            )}
            <Button
              label={todayAim ? t('home.reviewAim') : t('home.setAim')}
              variant="ghost"
              onPress={() => router.push('/aims')}
            />
          </Section>

          <Hairline />

          <Section title={t('home.quoteOfDay')} delay={120}>
            <Text style={styles.quote}>“{quoteText(quote.id)}”</Text>
            <Text style={styles.quoteSource}>{quoteSource()}</Text>
          </Section>

          <Hairline />

          <Section title={t('home.dayClose')} delay={180}>
            <Body muted>
              {todayReview ? t('home.reviewExists') : t('home.reviewPrompt')}
            </Body>
            <View style={styles.rowActions}>
              <Button
                label={todayReview ? t('home.seeReview') : t('home.eveningReview')}
                variant="gold"
                onPress={() => router.push('/revision')}
              />
              <Button
                label={t('home.observe')}
                variant="ghost"
                onPress={() => router.push('/observar')}
              />
            </View>
          </Section>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroViewport: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroMist: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    opacity: 1,
  },
  heroOrbWrap: {
    position: 'absolute',
    right: -48,
    top: '26%',
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
  },
  heroInner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
  },
  heroCopy: {
    gap: 12,
    marginTop: spacing.xxxl,
    marginBottom: spacing.xl,
  },
  heroKicker: {
    fontFamily: fonts.uiMedium,
    fontSize: type.label.size,
    lineHeight: type.label.line,
    letterSpacing: type.label.tracking,
    textTransform: 'uppercase',
    color: colors.accentHot,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 46,
    lineHeight: 50,
    color: colors.white,
    letterSpacing: 0.15,
  },
  heroBody: {
    fontFamily: fonts.body,
    fontSize: 17.5,
    lineHeight: 28,
    color: colors.whiteMuted,
    maxWidth: 318,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accentSoft,
    opacity: 0.8,
  },
  heroMeta: {
    fontFamily: fonts.ui,
    fontSize: type.meta.size,
    letterSpacing: type.meta.tracking,
    color: colors.whiteSoft,
  },
  heroCtaShell: {
    borderRadius: radii.md,
  },
  heroCtaClip: {
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  heroCta: {
    alignSelf: 'stretch',
    minHeight: 58,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.42)',
  },
  heroCtaText: {
    fontFamily: fonts.uiSemi,
    fontSize: 16,
    letterSpacing: 0.55,
    color: colors.ink,
  },
  below: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  aimText: {
    fontFamily: fonts.displayItalic,
    fontSize: 28,
    lineHeight: 36,
    color: colors.ink,
    letterSpacing: 0.1,
  },
  quote: {
    fontFamily: fonts.displayItalic,
    fontSize: 26,
    lineHeight: 36,
    color: colors.ink,
    letterSpacing: 0.05,
  },
  quoteSource: {
    fontFamily: fonts.ui,
    fontSize: type.meta.size,
    letterSpacing: type.meta.tracking,
    color: colors.muted,
    marginTop: 4,
  },
  rowActions: {
    gap: 12,
    marginTop: 4,
  },
});
