import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { setStatusBarStyle } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import {
  Body,
  BrandMark,
  Button,
  Chip,
  Hairline,
  Headline,
  PresencePulse,
  Screen,
} from '@/components/ui';
import { colors, fonts, motion, radii, spacing, type } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { practiceOfDay } from '@/lib/practice';

type Phase = 'checkin' | 'guide' | 'checkout' | 'done';
const easeOut = Easing.out(Easing.cubic);

function BreathBeacon({ label }: { label: string }) {
  const scale = useSharedValue(0.88);
  const glow = useSharedValue(0.24);
  const inner = useSharedValue(0.9);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 3000, easing: easeOut }),
        withTiming(0.88, { duration: 3000, easing: easeOut }),
      ),
      -1,
      false,
    );
    glow.value = withRepeat(
      withSequence(
        withTiming(0.52, { duration: 3000, easing: easeOut }),
        withTiming(0.2, { duration: 3000, easing: easeOut }),
      ),
      -1,
      false,
    );
    inner.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 3000, easing: easeOut }),
        withTiming(0.9, { duration: 3000, easing: easeOut }),
      ),
      -1,
      false,
    );
  }, [glow, inner, scale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: glow.value,
  }));
  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inner.value }],
  }));

  return (
    <View style={styles.breathWrap}>
      <Animated.View style={[styles.breathHalo, ringStyle]} />
      <Animated.View style={[styles.breathOuter, ringStyle]} />
      <Animated.View style={[styles.breathInner, coreStyle]}>
        <Text style={styles.breathDot}>·</Text>
      </Animated.View>
      <Text style={styles.breathLabel}>{label}</Text>
    </View>
  );
}

function ProgressBar({ value }: { value: number }) {
  const [trackW, setTrackW] = useState(0);
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(value, { duration: 520, easing: easeOut });
  }, [value, progress]);
  const fillStyle = useAnimatedStyle(() => ({
    width: Math.max(0, progress.value * trackW),
  }));
  return (
    <View
      style={styles.progressTrack}
      onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}>
      <Animated.View style={[styles.progressFill, fillStyle]} />
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

  useEffect(() => {
    setStatusBarStyle('light');
    return () => setStatusBarStyle('dark');
  }, []);

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
          <Animated.View
            entering={FadeIn.duration(motion.enter).easing(easeOut)}
            style={styles.phase}>
            <BrandMark light subtitle={t(`practice.kinds.${practice.kind}`)} />
            <Headline light>{t('practice.checkin.title')}</Headline>
            <Body light>{t('practice.checkin.intro')}</Body>

            <Hairline light />

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
            entering={FadeInUp.duration(560).easing(easeOut)}
            style={styles.phase}>
            <ProgressBar value={progress} />
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
              <BreathBeacon label={t('practice.guide.breathe')} />
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
                variant="lumen"
                onPress={nextStep}
              />
            </View>
          </Animated.View>
        ) : null}

        {phase === 'checkout' ? (
          <Animated.View
            entering={FadeIn.duration(520).easing(easeOut)}
            style={styles.phase}>
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
          <Animated.View
            entering={FadeIn.duration(motion.enter).easing(easeOut)}
            style={styles.phase}>
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
    right: -56,
    top: '20%',
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
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
    fontSize: type.label.size,
    letterSpacing: type.label.tracking,
    textTransform: 'uppercase',
    color: colors.accentHot,
  },
  labelLight: {
    marginTop: spacing.xs,
    fontFamily: fonts.uiMedium,
    fontSize: type.label.size,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.whiteSoft,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  aimBox: {
    marginTop: spacing.xs,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: 'rgba(248,249,246,0.04)',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(233,216,168,0.28)',
    gap: 8,
  },
  aimLabel: {
    fontFamily: fonts.uiMedium,
    fontSize: type.label.size,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.accentSoft,
  },
  aimText: {
    fontFamily: fonts.displayItalic,
    fontSize: 24,
    color: colors.white,
    lineHeight: 30,
  },
  footer: {
    marginTop: 'auto',
    gap: 12,
  },
  progressTrack: {
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(248,249,246,0.1)',
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accentHot,
    borderRadius: 1,
  },
  guideBody: {
    fontSize: type.bodyLg.size,
    lineHeight: type.bodyLg.line,
  },
  breathWrap: {
    alignSelf: 'center',
    marginTop: spacing.xl,
    width: 190,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathHalo: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(233,216,168,0.06)',
  },
  breathOuter: {
    position: 'absolute',
    width: 158,
    height: 158,
    borderRadius: 79,
    borderWidth: 1,
    borderColor: colors.accentHot,
    backgroundColor: 'rgba(233,216,168,0.05)',
  },
  breathInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(233,216,168,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(233,216,168,0.4)',
  },
  breathDot: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.accentHot,
    marginTop: -6,
  },
  breathLabel: {
    position: 'absolute',
    bottom: 0,
    fontFamily: fonts.ui,
    fontSize: type.meta.size,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.whiteSoft,
  },
  focusDot: {
    alignSelf: 'center',
    marginTop: spacing.xxl,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentHot,
    shadowColor: colors.accentHot,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  exit: {
    alignSelf: 'center',
    paddingVertical: 12,
  },
  exitText: {
    fontFamily: fonts.ui,
    fontSize: 13,
    letterSpacing: 0.35,
    color: 'rgba(248,249,246,0.48)',
  },
});
