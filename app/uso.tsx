import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, Screen, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';

const LABELS: Record<string, string> = {
  app_open: 'Aperturas de la app',
  screen_hoy: 'Pantalla Hoy',
  screen_stops: 'Pantalla Stops',
  screen_observar: 'Pantalla Observar',
  screen_aims: 'Pantalla Aim',
  screen_mas: 'Pantalla Más',
  screen_revision: 'Revisión nocturna',
  screen_citas: 'Citas',
  observation_created: 'Observaciones creadas',
  aim_set: 'Aims guardados',
  stop_remembered: 'Stops con presencia',
  stop_missed: 'Stops perdidos / notados tarde',
  stop_settings_updated: 'Ajustes de stops',
  review_saved: 'Revisiones guardadas',
  quote_opened: 'Citas abiertas',
  nav_mas: 'Navegación desde Más',
};

export default function UsoScreen() {
  const { usageStats, track, analytics } = useWork();

  useEffect(() => {
    track('screen_uso');
  }, [track]);

  const ranked = useMemo(
    () =>
      usageStats
        .filter((s) => s.name !== 'screen_uso')
        .map((s) => ({
          ...s,
          label: LABELS[s.name] ?? s.name,
        })),
    [usageStats],
  );

  const max = ranked[0]?.count ?? 1;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title="Analítica local">
          <Body>
            Empezamos con más herramientas de las necesarias. Esta pantalla te muestra
            qué usas de verdad para que, con el tiempo, podamos restar sin adivinar.
          </Body>
          <Body muted>
            {analytics.length} eventos registrados en este dispositivo. No se envían a
            ningún servidor.
          </Body>
        </Section>

        <Section title="Qué más usas">
          {ranked.length === 0 ? (
            <Body muted>Usa la app unos días y vuelve aquí.</Body>
          ) : (
            ranked.map((item) => (
              <View key={item.name} style={styles.row}>
                <View style={styles.rowTop}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.count}>{item.count}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${Math.max(8, (item.count / max) * 100)}%` },
                    ]}
                  />
                </View>
              </View>
            ))
          )}
        </Section>

        <Section title="Cómo leerlo">
          <Body muted>
            Si una pantalla casi no aparece, quizás no pertenece a tu Trabajo. Si
            “Recuérdate” y Observar dominan, el resto puede volverse secundario.
          </Body>
        </Section>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
  },
  row: {
    gap: 6,
    marginBottom: 4,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.inkSoft,
  },
  count: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.pine,
  },
  barTrack: {
    height: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.bgDeep,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.pineSoft,
    borderRadius: radii.sm,
  },
});
