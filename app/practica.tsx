import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Body, Button, Chip, Headline, Screen } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { practiceOfDay } from '@/lib/practice';

type Phase = 'checkin' | 'guide' | 'checkout' | 'done';

export default function PracticaScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { track, todayAim, logStop, addObservation } = useWork();
  const practice = useMemo(() => practiceOfDay(), []);

  const [phase, setPhase] = useState<Phase>('checkin');
  const [stateIdx, setStateIdx] = useState<number | null>(null);
  const [centerIdx, setCenterIdx] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [presence, setPresence] = useState<boolean | null>(null);

  const states = [
    t('practice.checkin.scattered'),
    t('practice.checkin.tense'),
    t('practice.checkin.sleepy'),
    t('practice.checkin.clear'),
  ];
  const centers = [
    t('centers.intelectual'),
    t('centers.emocional'),
    t('centers.motor'),
    t('centers.instinctivo'),
  ];

  useEffect(() => {
    track('screen_practica', { kind: practice.kind });
  }, [track, practice.kind]);

  const current = practice.steps[step];
  const progress = (step + 1) / practice.steps.length;

  const startGuide = () => {
    if (stateIdx == null || centerIdx == null) return;
    track('practice_checkin', {
      state: states[stateIdx],
      center: centers[centerIdx],
      kind: practice.kind,
    });
    setPhase('guide');
  };

  const nextStep = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      /* web */
    }
    if (step < practice.steps.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setPhase('checkout');
  };

  const finish = () => {
    if (presence) logStop(true);
    if (presence === false) logStop(false, t('practice.checkout.missedNote'));
    addObservation({
      body: t('practice.checkout.autoNote', {
        kind: t(`practice.kinds.${practice.kind}`),
        state: stateIdx != null ? states[stateIdx] : '',
        center: centerIdx != null ? centers[centerIdx] : '',
        presence:
          presence == null
            ? t('practice.checkout.presenceUnset')
            : presence
              ? t('practice.checkout.presenceYes')
              : t('practice.checkout.presenceNo'),
      }),
      centers: [],
      identified: presence === false,
    });
    track('practice_completed', { kind: practice.kind, presence: !!presence });
    setPhase('done');
  };

  return (
    <Screen mode={phase === 'checkin' || phase === 'done' ? 'day' : 'session'}>
      <View
        style={[
          styles.wrap,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}>
        {phase === 'checkin' ? (
          <Animated.View entering={FadeIn.duration(500)} style={styles.phase}>
            <Text style={styles.kicker}>{t(`practice.kinds.${practice.kind}`)}</Text>
            <Headline>{t('practice.checkin.title')}</Headline>
            <Body muted>{t('practice.checkin.intro')}</Body>

            <Text style={styles.label}>{t('practice.checkin.stateLabel')}</Text>
            <View style={styles.row}>
              {states.map((label, i) => (
                <Chip
                  key={label}
                  label={label}
                  selected={stateIdx === i}
                  onPress={() => setStateIdx(i)}
                />
              ))}
            </View>

            <Text style={styles.label}>{t('practice.checkin.centerLabel')}</Text>
            <View style={styles.row}>
              {centers.map((label, i) => (
                <Chip
                  key={label}
                  label={label}
                  selected={centerIdx === i}
                  onPress={() => setCenterIdx(i)}
                />
              ))}
            </View>

            {todayAim?.text ? (
              <View style={styles.aimBox}>
                <Text style={styles.aimLabel}>{t('home.aimToday')}</Text>
                <Text style={styles.aimText}>{todayAim.text}</Text>
              </View>
            ) : null}

            <View style={styles.footer}>
              <Button
                label={t('practice.checkin.begin')}
                onPress={startGuide}
                disabled={stateIdx == null || centerIdx == null}
              />
              <Button
                label={t('practice.close')}
                variant="ghost"
                onPress={() => router.back()}
              />
            </View>
          </Animated.View>
        ) : null}

        {phase === 'guide' && current ? (
          <Animated.View
            key={step}
            entering={FadeInUp.duration(520)}
            style={styles.phase}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.sessionKicker}>
              {t('practice.guide.step', {
                current: step + 1,
                total: practice.steps.length,
              })}
            </Text>
            <Headline light>{t(current.titleKey)}</Headline>
            <Body light style={styles.guideBody}>
              {t(current.bodyKey)}
            </Body>
            {current.breath ? (
              <View style={styles.breathRing}>
                <Text style={styles.breathText}>{t('practice.guide.breathe')}</Text>
              </View>
            ) : (
              <View style={styles.focusDot} />
            )}
            <View style={styles.footer}>
              <Button
                label={
                  step < practice.steps.length - 1
                    ? t('practice.guide.next')
                    : t('practice.guide.finish')
                }
                variant="session"
                onPress={nextStep}
              />
            </View>
          </Animated.View>
        ) : null}

        {phase === 'checkout' ? (
          <Animated.View entering={FadeIn.duration(480)} style={styles.phase}>
            <Text style={styles.sessionKicker}>{t('practice.checkout.kicker')}</Text>
            <Headline light>{t('practice.checkout.title')}</Headline>
            <Body light>{t('practice.checkout.intro')}</Body>
            <View style={styles.row}>
              <Chip
                tone="session"
                label={t('practice.checkout.yes')}
                selected={presence === true}
                onPress={() => setPresence(true)}
              />
              <Chip
                tone="session"
                label={t('practice.checkout.no')}
                selected={presence === false}
                onPress={() => setPresence(false)}
              />
            </View>
            <View style={styles.footer}>
              <Button
                label={t('practice.checkout.save')}
                variant="session"
                onPress={finish}
                disabled={presence == null}
              />
            </View>
          </Animated.View>
        ) : null}

        {phase === 'done' ? (
          <Animated.View entering={FadeIn.duration(500)} style={styles.phase}>
            <Text style={styles.kicker}>{t('practice.done.kicker')}</Text>
            <Headline>{t('practice.done.title')}</Headline>
            <Body muted>{t('practice.done.body')}</Body>
            <View style={styles.footer}>
              <Button label={t('practice.done.home')} onPress={() => router.replace('/')} />
              <Button
                label={t('practice.done.observe')}
                variant="ghost"
                onPress={() => router.replace('/observar')}
              />
            </View>
          </Animated.View>
        ) : null}

        {phase === 'guide' || phase === 'checkout' ? (
          <Pressable onPress={() => router.back()} style={styles.exit}>
            <Text style={styles.exitText}>{t('practice.exit')}</Text>
          </Pressable>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  phase: {
    flex: 1,
    gap: spacing.md,
  },
  kicker: {
    fontFamily: fonts.uiMedium,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.focusSoft,
  },
  sessionKicker: {
    fontFamily: fonts.uiMedium,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.accentSoft,
  },
  label: {
    marginTop: spacing.sm,
    fontFamily: fonts.uiMedium,
    fontSize: 13,
    color: colors.inkSoft,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  aimBox: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 4,
  },
  aimLabel: {
    fontFamily: fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.focusSoft,
  },
  aimText: {
    fontFamily: fonts.displayItalic,
    fontSize: 22,
    color: colors.ink,
    lineHeight: 28,
  },
  footer: {
    marginTop: 'auto',
    gap: 10,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(247,245,240,0.12)',
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accentSoft,
  },
  guideBody: {
    fontSize: 18,
    lineHeight: 28,
  },
  breathRing: {
    alignSelf: 'center',
    marginTop: spacing.xl,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(220,200,148,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathText: {
    fontFamily: fonts.ui,
    fontSize: 14,
    color: colors.accentSoft,
  },
  focusDot: {
    alignSelf: 'center',
    marginTop: spacing.xxl,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  exit: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  exitText: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: 'rgba(247,245,240,0.55)',
  },
});
