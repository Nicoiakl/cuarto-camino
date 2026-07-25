import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Easing, FadeIn, FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { BrandMark, Button, Screen } from '@/components/ui';
import { colors, fonts, motion, spacing, type } from '@/constants/theme';
import { markOnboardingSeen } from '@/lib/onboarding';
import { useWork } from '@/context/WorkContext';

const tidal = Easing.inOut(Easing.sin);

const STEPS = ['presence', 'notProductivity', 'begin'] as const;

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { track } = useWork();
  const [step, setStep] = useState(0);

  const finish = async () => {
    await markOnboardingSeen();
    track('onboarding_done', { step });
    router.replace('/');
  };

  const next = () => {
    if (step >= STEPS.length - 1) {
      void finish();
      return;
    }
    track('onboarding_step', { step: step + 1 });
    setStep((s) => s + 1);
  };

  const key = STEPS[step];

  return (
    <Screen>
      <View
        style={[
          styles.frame,
          {
            paddingTop: insets.top + 20,
            paddingBottom: Math.max(insets.bottom, 12) + 12,
          },
        ]}>
        <Animated.View entering={FadeIn.duration(motion.enter).easing(tidal)}>
          <BrandMark light subtitle={t('brand.subtitle')} />
        </Animated.View>

        <Animated.View
          key={key}
          entering={FadeInUp.duration(motion.enter).easing(tidal)}
          style={styles.center}>
          <Text style={styles.kicker}>
            {t('onboarding.step', { current: step + 1, total: STEPS.length })}
          </Text>
          <Text style={styles.title}>{t(`onboarding.${key}.title`)}</Text>
          <Text style={styles.body}>{t(`onboarding.${key}.body`)}</Text>
        </Animated.View>

        <View style={styles.bottom}>
          <View style={styles.dots}>
            {STEPS.map((s, i) => (
              <View
                key={s}
                style={[styles.dot, i === step && styles.dotActive]}
              />
            ))}
          </View>
          <Button
            label={
              step >= STEPS.length - 1
                ? t('onboarding.enter')
                : t('onboarding.continue')
            }
            variant="lumen"
            onPress={next}
          />
          {step < STEPS.length - 1 ? (
            <Pressable onPress={() => void finish()} hitSlop={10} style={styles.skip}>
              <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 14,
    paddingVertical: spacing.xl,
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
    fontSize: 36,
    lineHeight: 42,
    color: colors.white,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 28,
    color: colors.whiteMuted,
    maxWidth: 320,
  },
  bottom: {
    gap: 14,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(237,230,220,0.2)',
  },
  dotActive: {
    backgroundColor: colors.accentHot,
    width: 18,
  },
  skip: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.whiteSoft,
    letterSpacing: 0.3,
  },
});
