import { useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, Button, Chip, Screen, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { formatFriendlyDateTime } from '@/lib/dates';
import { ensureNotificationPermission } from '@/lib/notifications';

const INTERVALS = [60, 90, 120, 180];

export default function StopsScreen() {
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
        <Section title="Recordarme a mí mismo">
          <Body>
            Un stop no es una alarma de productividad. Es un llamado a volver: ¿dónde
            estoy? ¿quién mira?
          </Body>
        </Section>

        <Section title="Estado">
          <View style={styles.row}>
            <Chip
              label={stopSettings.enabled ? 'Activos' : 'Pausados'}
              selected={stopSettings.enabled}
              onPress={() =>
                stopSettings.enabled
                  ? updateStopSettings({ enabled: false })
                  : enable()
              }
            />
            <Chip
              label={!stopSettings.enabled ? 'Activar' : 'Pausar'}
              selected={!stopSettings.enabled}
              onPress={() =>
                stopSettings.enabled
                  ? updateStopSettings({ enabled: false })
                  : enable()
              }
            />
          </View>
          {Platform.OS === 'web' ? (
            <Body muted>
              En la web los stops programados no suenan; usa el botón de presencia en
              Hoy. En iOS/Android se programan notificaciones locales.
            </Body>
          ) : (
            <Body muted>
              Entre las {stopSettings.startHour}:00 y las {stopSettings.endHour}:00,
              cada {stopSettings.intervalMinutes} minutos.
            </Body>
          )}
        </Section>

        <Section title="Intervalo">
          <View style={styles.row}>
            {INTERVALS.map((m) => (
              <Chip
                key={m}
                label={`${m} min`}
                selected={stopSettings.intervalMinutes === m}
                onPress={() => updateStopSettings({ intervalMinutes: m })}
              />
            ))}
          </View>
        </Section>

        <Section title="Ahora mismo">
          <Button label="Estuve presente" onPress={() => logStop(true)} />
          <Button
            label="Lo noté tarde / me perdí"
            variant="ghost"
            onPress={() => logStop(false)}
          />
        </Section>

        <Section title="Registro reciente">
          {stopLogs.length === 0 ? (
            <Body muted>Aún no hay stops registrados.</Body>
          ) : (
            stopLogs.slice(0, 12).map((s) => (
              <View key={s.id} style={styles.log}>
                <Text style={styles.logTime}>{formatFriendlyDateTime(s.at)}</Text>
                <Text style={styles.logState}>
                  {s.remembered ? 'Presencia' : 'Olvido notado'}
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
