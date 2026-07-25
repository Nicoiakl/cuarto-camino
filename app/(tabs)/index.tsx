import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Easing, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { setStatusBarStyle } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Hourglass } from '@/components/Hourglass';
import { Screen } from '@/components/ui';
import { colors, fonts, gradients, motion, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { todayKey } from '@/lib/dates';
import { practiceOfDay } from '@/lib/practice';

const tidal = Easing.inOut(Easing.sin);

/**
 * The sauna room.
 * Open the app → you are already inside.
 * One slow hourglass. One quiet threshold.
 */
export default function HoyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { track, analytics } = useWork();
  const practice = practiceOfDay();
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
  }, []);

  const enter = () => {
    void Haptics.selectionAsync().catch(() => {});
    track('home_start_practice', { kind: practice.kind });
    router.push('/practica');
  };

  return (
    <Screen>
      <LinearGradient
        colors={[...gradients.session]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Pressable
        onPress={enter}
        style={[
          styles.room,
          {
            paddingTop: insets.top + 24,
            paddingBottom: Math.max(insets.bottom, 10) + 10,
          },
        ]}>
        <Animated.View
          entering={FadeIn.duration(motion.slow).easing(tidal)}
          style={styles.brandLine}>
          <Text style={styles.brand}>The Work</Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(400).duration(motion.slow).easing(tidal)}
          style={styles.center}>
          <Hourglass size={120} />
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(900).duration(motion.slow).easing(tidal)}
          style={styles.threshold}>
          <Text style={styles.whisper}>{t('home.roomWhisper')}</Text>
          <Text style={styles.enter}>
            {practicedToday ? t('home.practiceAgain') : t('home.practiceStart')}
          </Text>
        </Animated.View>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  room: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandLine: {
    alignSelf: 'stretch',
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: 1.2,
    color: 'rgba(237, 230, 220, 0.38)',
  },
  center: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threshold: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 4,
    minHeight: 56,
    justifyContent: 'center',
  },
  whisper: {
    fontFamily: fonts.bodyItalic,
    fontSize: 15,
    color: colors.whiteSoft,
    letterSpacing: 0.2,
  },
  enter: {
    fontFamily: fonts.uiMedium,
    fontSize: 13,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: colors.accentHot,
  },
});
