import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Body, BrandMark, Button, Chip, Headline, PresencePulse, Screen } from '@/components/ui';
import { colors, fonts, motion, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { practiceOfDay } from '@/lib/practice';

type Phase = 'checkin' | 'guide' | 'checkout' | 'done';

function BreathBeacon() {
  const scale = useSharedValue(0.86);
  const glow = useSharedValue(0.28);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2800 }),
        withTiming(0.86, { duration: 2800 }),
      ),
      -1,
      false,
    );
    glow.value = withRepeat(
      withSequence(
        withTiming(0.55, { duration: 2800 }),
        withTiming(0.22, { duration: 2800 }),
      ),
      -1,
      false,
    );
  }, [glow, scale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: glow.value,
  }));

  return (
    <View style={styles.breathWrap}>
      <Animated.View style={[styles.breathOuter, ringStyle]} />
      <View style={styles.breathInner}>
        <Text style={styles.breathText}>·</Text>
      </View>
    </View>
  );
}

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
    <Screen mode="session">
      <StatusBar style="light" />
      <View style={styles.orbWrap} pointerEvents="none">
        <PresencePulse active={phase === 'guide'} />
      </View>
      <View
        style={[
          styles.wrap,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}>
        {phase === 'checkin' ? (
          <Animated.View entering={FadeIn.duration(motion.enter)} style={styles.phase}>
            <BrandMark light subtitle={t(`practice.kinds.${practice.kind}`)} />
            <Headline light>{t('practice.checkin.title')}</Headline>
            <Body light>{t('practice.checkin.intro')}</Body>

            <Text style={styles.labelLight}>{t('practice.checkin.stateLabel')}</Text>
            <View style={styles.row}>
              {states.map((label, i) => (
                <Chip
                  key={label}
                  tone="session"
                  label={label}
                  selected={stateIdx === i}
                  onPress={() => setStateIdx(i)}
                />
              ))}
            </View>

            <Text style={styles.labelLight}>{t('practice.checkin.centerLabel')}</Text>
            <View style={styles.row}>
              {centers.map((label, i) => (
                <Chip
                  key={label}
                  tone="session"
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
                variant="lumen"
                onPress={startGuide}
                disabled={stateIdx == null || centerIdx == null}
              />
              <Pressable onPress={() => router.back()} style={styles.exit}>
                <Text style={styles.exitText}>{t('practice.close')}</Text>
              </Pressable>
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
            {current.breath ? <BreathBeacon /> : <View style={styles.focusDot} />}
            <View style={styles.footer}>
              <Button
                label={
                  step < practice.steps.length - 1
                    ? t('practice.guide.next')
                    : t('practice.guide.finish')
                }
                variant="lumen"
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
                variant="lumen"
                onPress={finish}
                disabled={presence == null}
              />
            </View>
          </Animated.View>
        ) : null}

        {phase === 'done' ? (
          <Animated.View entering={FadeIn.duration(motion.enter)} style={styles.phase}>
            <BrandMark light subtitle={t('practice.done.kicker')} />
            <Headline light>{t('practice.done.title')}</Headline>
            <Body light>{t('practice.done.body')}</Body>
            <View style={styles.footer}>
              <Button
                label={t('practice.done.home')}
                variant="lumen"
                onPress={() => router.replace('/')}
              />
              <Pressable
                onPress={() => router.replace('/observar')}
                style={styles.exit}>
                <Text style={styles.exitText}>{t('practice.done.observe')}</Text>
              </Pressable>
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
  orbWrap: {
    position: 'absolute',
    right: -50,
    top: '22%',
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.55,
  },
  wrap: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  phase: {
    flex: 1,
    gap: spacing.md,
  },
  sessionKicker: {
    fontFamily: fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.accentHot,
  },
  labelLight: {
    marginTop: spacing.sm,
    fontFamily: fonts.uiMedium,
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: 'rgba(246,247,244,0.62)',
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
    backgroundColor: 'rgba(246,247,244,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(232,215,166,0.22)',
    gap: 6,
  },
  aimLabel: {
    fontFamily: fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.accentSoft,
  },
  aimText: {
    fontFamily: fonts.displayItalic,
    fontSize: 22,
    color: colors.white,
    lineHeight: 28,
  },
  footer: {
    marginTop: 'auto',
    gap: 10,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(247,245,240,0.1)',
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accentHot,
  },
  guideBody: {
    fontSize: 19,
    lineHeight: 30,
  },
  breathWrap: {
    alignSelf: 'center',
    marginTop: spacing.xl,
    width: 168,
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathOuter: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1.5,
    borderColor: colors.accentHot,
    backgroundColor: 'rgba(232,215,166,0.06)',
  },
  breathInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(232,215,166,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathText: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.accentHot,
    marginTop: -4,
  },
  focusDot: {
    alignSelf: 'center',
    marginTop: spacing.xxl,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accentHot,
  },
  exit: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  exitText: {
    fontFamily: fonts.ui,
    fontSize: 13,
    letterSpacing: 0.2,
    color: 'rgba(247,245,240,0.5)',
  },
});
