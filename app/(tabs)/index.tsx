import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import {
  Body,
  BrandMark,
  Button,
  PresencePulse,
  Screen,
  Section,
} from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { quoteOfDay, quoteSource, quoteText } from '@/lib/quotes';
import { formatFriendlyDateTime } from '@/lib/dates';

export default function HoyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { todayAim, logStop, track, observations, todayReview } = useWork();
  const [pulse, setPulse] = useState(false);
  const quote = quoteOfDay();

  useEffect(() => {
    track('screen_hoy');
  }, [track]);

  const remember = async () => {
    setPulse(true);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      /* web */
    }
    logStop(true);
    setTimeout(() => setPulse(false), 1600);
  };

  const recent = observations.slice(0, 3);
  const rememberLabel = t('home.remember');

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(700)}>
          <BrandMark subtitle={t('brand.subtitle')} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(650)} style={styles.presenceBlock}>
          <View style={styles.pulseWrap}>
            <PresencePulse active={pulse} />
            <Pressable onPress={remember} style={styles.presenceBtn}>
              <Text
                style={[
                  styles.presenceLabel,
                  rememberLabel.length > 12 && styles.presenceLabelSmall,
                ]}>
                {rememberLabel}
              </Text>
              <Text style={styles.presenceHint}>{t('home.rememberHint')}</Text>
            </Pressable>
          </View>
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

        <Section title={t('home.recentObs')} delay={420}>
          {recent.length === 0 ? (
            <Body muted>{t('home.recentObsEmpty')}</Body>
          ) : (
            recent.map((o) => (
              <View key={o.id} style={styles.obsRow}>
                <Text style={styles.obsMeta}>{formatFriendlyDateTime(o.createdAt)}</Text>
                <Text style={styles.obsBody} numberOfLines={2}>
                  {o.body}
                </Text>
              </View>
            ))
          )}
          <Button
            label={t('home.observe')}
            variant="ghost"
            onPress={() => router.push('/observar')}
          />
        </Section>

        <Section title={t('home.dayClose')} delay={520}>
          <Body muted>
            {todayReview ? t('home.reviewExists') : t('home.reviewPrompt')}
          </Body>
          <Button
            label={todayReview ? t('home.seeReview') : t('home.eveningReview')}
            variant="gold"
            onPress={() => router.push('/revision')}
          />
        </Section>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
  },
  presenceBlock: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  pulseWrap: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presenceBtn: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: colors.pine,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    shadowColor: colors.pine,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  presenceLabel: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.white,
    textAlign: 'center',
  },
  presenceLabelSmall: {
    fontSize: 20,
    lineHeight: 24,
  },
  presenceHint: {
    fontFamily: fonts.bodyItalic,
    fontSize: 11,
    color: colors.goldSoft,
    textAlign: 'center',
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
  obsRow: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: 4,
  },
  obsMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  obsBody: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
  },
});
