import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Body, BrandMark, Button, Screen, Section } from '@/components/ui';
import { colors, fonts, gradients, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { todayKey } from '@/lib/dates';
import { practiceOfDay } from '@/lib/practice';
import { quoteOfDay, quoteSource, quoteText } from '@/lib/quotes';

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

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(650)}>
          <BrandMark subtitle={t('brand.subtitle')} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(650)} style={styles.hero}>
          <LinearGradient colors={[...gradients.beacon]} style={styles.heroCard}>
            <Text style={styles.heroKicker}>
              {practicedToday ? t('home.practiceDoneKicker') : t('home.practiceKicker')}
            </Text>
            <Text style={styles.heroTitle}>{t(`practice.kinds.${practice.kind}`)}</Text>
            <Text style={styles.heroMeta}>
              {t('home.practiceMeta', { minutes: practice.minutes })}
            </Text>
            <Text style={styles.heroBody}>{t(`practice.summaries.${practice.kind}`)}</Text>
            <Pressable
              onPress={() => {
                track('home_start_practice', { kind: practice.kind });
                router.push('/practica');
              }}
              style={({ pressed }) => [
                styles.heroCta,
                pressed && { transform: [{ scale: 0.985 }], opacity: 0.92 },
              ]}>
              <Text style={styles.heroCtaText}>
                {practicedToday ? t('home.practiceAgain') : t('home.practiceStart')}
              </Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>

        <Section title={t('home.aimToday')} delay={220}>
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

        <Section title={t('home.quoteOfDay')} delay={320}>
          <Text style={styles.quote}>“{quoteText(quote.id)}”</Text>
          <Body muted>{quoteSource()}</Body>
        </Section>

        <Section title={t('home.dayClose')} delay={420}>
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
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
  },
  hero: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  heroCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: 8,
    overflow: 'hidden',
  },
  heroKicker: {
    fontFamily: fonts.uiMedium,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.accentSoft,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 38,
    color: colors.white,
  },
  heroMeta: {
    fontFamily: fonts.ui,
    fontSize: 14,
    color: 'rgba(247,245,240,0.7)',
  },
  heroBody: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(247,245,240,0.86)',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  heroCta: {
    alignSelf: 'stretch',
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  heroCtaText: {
    fontFamily: fonts.uiMedium,
    fontSize: 17,
    color: colors.session,
  },
  aimText: {
    fontFamily: fonts.displayItalic,
    fontSize: 24,
    lineHeight: 32,
    color: colors.ink,
  },
  quote: {
    fontFamily: fonts.displayItalic,
    fontSize: 22,
    lineHeight: 30,
    color: colors.ink,
  },
  rowActions: {
    gap: 8,
  },
});
