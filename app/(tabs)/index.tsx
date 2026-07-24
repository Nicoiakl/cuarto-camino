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
const tidal = Easing.inOut(Easing.sin);
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
    transform: [{ scale: interpolate(ctaPress.value, [0, 1], [1, 0.985]) }],
  }));

  useEffect(() => {
    track('screen_hoy');
  }, [track]);

  useEffect(() => {
    setStatusBarStyle('light');
  }, []);

  const heroMin = Math.max(560, SCREEN_H * 0.84);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.heroViewport,
            { minHeight: heroMin, paddingTop: insets.top + 24 },
          ]}>
          <LinearGradient
            colors={[...gradients.hero]}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={[...gradients.heroSheen]}
            locations={[0, 0.4, 1]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroOrbWrap} pointerEvents="none">
            <PresencePulse active={false} />
          </View>

          <Animated.View
            entering={FadeIn.duration(motion.slow).easing(tidal)}
            style={styles.heroInner}>
            <BrandMark large light subtitle={t('brand.subtitle')} />

            <Animated.View
              entering={FadeInUp.delay(280).duration(motion.enter).easing(tidal)}
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
              <Text style={styles.heroMeta}>
                {t('home.practiceMeta', { minutes: practice.minutes })}
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(520).duration(motion.enter).easing(tidal)}>
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
          <Section title={t('home.aimToday')} delay={80}>
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

          <Section title={t('home.quoteOfDay')} delay={160}>
            <Text style={styles.quote}>“{quoteText(quote.id)}”</Text>
            <Text style={styles.quoteSource}>{quoteSource()}</Text>
          </Section>

          <Hairline />

          <Section title={t('home.dayClose')} delay={240}>
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
  heroOrbWrap: {
    position: 'absolute',
    alignSelf: 'center',
    left: '20%',
    bottom: '18%',
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
    gap: 14,
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
    fontSize: 44,
    lineHeight: 50,
    color: colors.white,
    letterSpacing: 0.25,
  },
  heroBody: {
    fontFamily: fonts.body,
    fontSize: 17.5,
    lineHeight: 29,
    color: colors.whiteMuted,
    maxWidth: 310,
  },
  heroMeta: {
    fontFamily: fonts.ui,
    fontSize: type.meta.size,
    letterSpacing: type.meta.tracking,
    color: colors.whiteSoft,
    marginTop: 4,
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
    minHeight: 56,
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
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  heroCtaText: {
    fontFamily: fonts.uiMedium,
    fontSize: 16,
    letterSpacing: 0.6,
    color: colors.bgDeep,
  },
  below: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  aimText: {
    fontFamily: fonts.displayItalic,
    fontSize: 28,
    lineHeight: 38,
    color: colors.ink,
    letterSpacing: 0.15,
  },
  quote: {
    fontFamily: fonts.displayItalic,
    fontSize: 26,
    lineHeight: 38,
    color: colors.ink,
  },
  quoteSource: {
    fontFamily: fonts.ui,
    fontSize: type.meta.size,
    letterSpacing: type.meta.tracking,
    color: colors.muted,
    marginTop: 6,
  },
  rowActions: {
    gap: 12,
    marginTop: 6,
  },
});
