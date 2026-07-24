import { useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Body, Button, Chip, Screen, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { formatFriendlyDateTime } from '@/lib/dates';
import { ensureNotificationPermission } from '@/lib/notifications';

const INTERVALS = [60, 90, 120, 180];

export default function StopsScreen() {
  const { t } = useTranslation();
  const { stopSettings, updateStopSettings, logStop, stopLogs, track } = useWork();

  useEffect(() => {
    track('screen_stops');
  }, [track]);

  const enable = async () => {
    if (Platform.OS !== 'web') {
      await ensureNotificationPermission();
    }
    await updateStopSettings({ enabled: true });
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Section title={t('stops.title')}>
          <Body>{t('stops.intro')}</Body>
        </Section>

        <Section title={t('stops.status')}>
          <View style={styles.row}>
            <Chip
              label={stopSettings.enabled ? t('stops.active') : t('stops.paused')}
              selected={stopSettings.enabled}
              onPress={() =>
                stopSettings.enabled
                  ? updateStopSettings({ enabled: false })
                  : enable()
              }
            />
            <Chip
              label={!stopSettings.enabled ? t('stops.enable') : t('stops.pause')}
              selected={!stopSettings.enabled}
              onPress={() =>
                stopSettings.enabled
                  ? updateStopSettings({ enabled: false })
                  : enable()
              }
            />
          </View>
          {Platform.OS === 'web' ? (
            <Body muted>{t('stops.webNote')}</Body>
          ) : (
            <Body muted>
              {t('stops.scheduleNote', {
                start: stopSettings.startHour,
                end: stopSettings.endHour,
                minutes: stopSettings.intervalMinutes,
              })}
            </Body>
          )}
        </Section>

        <Section title={t('stops.interval')}>
          <View style={styles.row}>
            {INTERVALS.map((m) => (
              <Chip
                key={m}
                label={t('stops.minutes', { count: m })}
                selected={stopSettings.intervalMinutes === m}
                onPress={() => updateStopSettings({ intervalMinutes: m })}
              />
            ))}
          </View>
        </Section>

        <Section title={t('stops.now')}>
          <Button label={t('stops.wasPresent')} onPress={() => logStop(true)} />
          <Button
            label={t('stops.noticedLate')}
            variant="ghost"
            onPress={() => logStop(false)}
          />
        </Section>

        <Section title={t('stops.recent')}>
          {stopLogs.length === 0 ? (
            <Body muted>{t('stops.empty')}</Body>
          ) : (
            stopLogs.slice(0, 12).map((s) => (
              <View key={s.id} style={styles.log}>
                <Text style={styles.logTime}>{formatFriendlyDateTime(s.at)}</Text>
                <Text style={styles.logState}>
                  {s.remembered ? t('stops.presence') : t('stops.missed')}
                </Text>
              </View>
            ))
          )}
        </Section>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  log: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  logTime: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
  logState: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.pine,
  },
});
