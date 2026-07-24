import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Body, Screen, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';

const LINKS = [
  {
    href: '/revision',
    title: 'Revisión nocturna',
    desc: 'Cierra el día con honestidad suave.',
  },
  {
    href: '/citas',
    title: 'Citas del Trabajo',
    desc: 'Máximas para alimentar el recuerdo.',
  },
  {
    href: '/uso',
    title: 'Uso',
    desc: 'Qué usas de verdad — para ir restando después.',
  },
] as const;

export default function MasScreen() {
  const router = useRouter();
  const { track, observations, stopLogs, aims, reviews } = useWork();

  useEffect(() => {
    track('screen_mas');
  }, [track]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title="El espacio">
          <Body>
            Aquí está lo demás del Trabajo: revisión, palabras que orientan, y la
            analítica local para ver qué vive en tu práctica.
          </Body>
        </Section>

        <Section title="Ir a">
          {LINKS.map((item) => (
            <Pressable
              key={item.href}
              onPress={() => {
                track('nav_mas', { to: item.href });
                router.push(item.href);
              }}
              style={({ pressed }) => [styles.link, pressed && { opacity: 0.85 }]}>
              <Text style={styles.linkTitle}>{item.title}</Text>
              <Text style={styles.linkDesc}>{item.desc}</Text>
            </Pressable>
          ))}
        </Section>

        <Section title="Tu práctica (local)">
          <View style={styles.stats}>
            <Stat label="Observaciones" value={observations.length} />
            <Stat label="Stops" value={stopLogs.length} />
            <Stat label="Aims" value={aims.length} />
            <Stat label="Revisiones" value={reviews.length} />
          </View>
          <Body muted>
            Todo queda en este dispositivo. No hay cuenta ni nube en esta primera
            versión.
          </Body>
        </Section>
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
  },
  link: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: 4,
  },
  linkTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
  },
  linkDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stat: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.pine,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
});
