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
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { setStatusBarStyle } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Body, BrandMark, Button, PresencePulse, Screen, Section } from '@/components/ui';
import { colors, fonts, gradients, motion, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { todayKey } from '@/lib/dates';
import { practiceOfDay } from '@/lib/practice';
import { quoteOfDay, quoteSource, quoteText } from '@/lib/quotes';

const { height: SCREEN_H } = Dimensions.get('window');

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

  useEffect(() => {
    track('screen_hoy');
  }, [track]);

  useEffect(() => {
    setStatusBarStyle('light');
    return () => setStatusBarStyle('dark');
  }, []);

  const heroMin = Math.max(520, SCREEN_H * 0.78);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}>
        {/* First viewport: one composition */}
        <View style={[styles.heroViewport, { minHeight: heroMin, paddingTop: insets.top + 18 }]}>
          <LinearGradient
            colors={[...gradients.hero]}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={[...gradients.heroSheen]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.9, y: 0.8 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroOrbWrap} pointerEvents="none">
            <PresencePulse active={false} />
          </View>

          <Animated.View
            entering={FadeIn.duration(motion.slow)}
            style={styles.heroInner}>
            <BrandMark large light subtitle={t('brand.subtitle')} />

            <Animated.View
              entering={FadeInUp.delay(160).duration(motion.enter)}
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

            <Animated.View entering={FadeInUp.delay(280).duration(motion.enter)}>
              <Pressable
                onPress={() => {
                  track('home_start_practice', { kind: practice.kind });
                  router.push('/practica');
                }}
                style={({ pressed }) => [
                  styles.heroCta,
                  pressed && { transform: [{ scale: 0.985 }], opacity: 0.93 },
                ]}>
                <Text style={styles.heroCtaText}>
                  {practicedToday ? t('home.practiceAgain') : t('home.practiceStart')}
                </Text>
              </Pressable>
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

          <Section title={t('home.quoteOfDay')} delay={140}>
            <Text style={styles.quote}>“{quoteText(quote.id)}”</Text>
            <Body muted>{quoteSource()}</Body>
          </Section>

          <Section title={t('home.dayClose')} delay={200}>
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
    paddingBottom: spacing.xxl,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroOrbWrap: {
    position: 'absolute',
    right: -40,
    top: '28%',
    width: 210,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  heroInner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
  },
  heroCopy: {
    gap: 10,
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  heroKicker: {
    fontFamily: fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: colors.accentHot,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 44,
    lineHeight: 48,
    color: colors.white,
    letterSpacing: 0.2,
  },
  heroBody: {
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 27,
    color: 'rgba(246,247,244,0.82)',
    maxWidth: 320,
    marginTop: 4,
  },
  heroMeta: {
    fontFamily: fonts.ui,
    fontSize: 13,
    letterSpacing: 0.3,
    color: 'rgba(246,247,244,0.55)',
    marginTop: 6,
  },
  heroCta: {
    alignSelf: 'stretch',
    backgroundColor: colors.accentHot,
    borderRadius: radii.md,
    paddingVertical: 18,
    alignItems: 'center',
  },
  heroCtaText: {
    fontFamily: fonts.uiBold,
    fontSize: 16,
    letterSpacing: 0.4,
    color: colors.ink,
  },
  below: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  aimText: {
    fontFamily: fonts.displayItalic,
    fontSize: 26,
    lineHeight: 34,
    color: colors.ink,
  },
  quote: {
    fontFamily: fonts.displayItalic,
    fontSize: 24,
    lineHeight: 34,
    color: colors.ink,
  },
  rowActions: {
    gap: 10,
  },
});
