import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, Button, Chip, Field, Screen, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { CENTER_LABELS, type Center } from '@/lib/types';
import { formatFriendlyDateTime } from '@/lib/dates';

const CENTERS = Object.keys(CENTER_LABELS) as Center[];

export default function ObservarScreen() {
  const { addObservation, observations, removeObservation, track } = useWork();
  const [body, setBody] = useState('');
  const [centers, setCenters] = useState<Center[]>([]);
  const [identified, setIdentified] = useState(false);

  useEffect(() => {
    track('screen_observar');
  }, [track]);

  const toggleCenter = (c: Center) => {
    setCenters((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  const save = () => {
    if (!body.trim()) return;
    addObservation({ body, centers, identified });
    setBody('');
    setCenters([]);
    setIdentified(false);
  };

  const confirmRemove = (id: string) => {
    Alert.alert('Borrar observación', '¿Quieres eliminarla?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: () => removeObservation(id) },
    ]);
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Section title="Auto-observación">
          <Body>
            Describe lo que ves en ti: un “yo”, una emoción, una tensión, una
            identificación. Sin moralizar.
          </Body>
        </Section>

        <Section title="¿Qué observas?">
          <Field
            value={body}
            onChangeText={setBody}
            placeholder="Ej.: Me identifiqué con la prisa en el trabajo…"
            multiline
            style={{ minHeight: 110, textAlignVertical: 'top' }}
          />
        </Section>

        <Section title="Centros implicados">
          <View style={styles.row}>
            {CENTERS.map((c) => (
              <Chip
                key={c}
                label={CENTER_LABELS[c]}
                selected={centers.includes(c)}
                onPress={() => toggleCenter(c)}
              />
            ))}
          </View>
        </Section>

        <Section title="Identificación">
          <View style={styles.row}>
            <Chip
              label="Estaba identificado"
              selected={identified}
              onPress={() => setIdentified(true)}
            />
            <Chip
              label="Había algo de separación"
              selected={!identified}
              onPress={() => setIdentified(false)}
            />
          </View>
          <Button label="Guardar observación" onPress={save} disabled={!body.trim()} />
        </Section>

        <Section title="Diario">
          {observations.length === 0 ? (
            <Body muted>Tu bitácora de conciencia aparecerá aquí.</Body>
          ) : (
            observations.map((o) => (
              <Pressable
                key={o.id}
                onLongPress={() => confirmRemove(o.id)}
                style={styles.card}>
                <Text style={styles.meta}>{formatFriendlyDateTime(o.createdAt)}</Text>
                <Text style={styles.body}>{o.body}</Text>
                <Text style={styles.tags}>
                  {o.centers.length
                    ? o.centers.map((c) => CENTER_LABELS[c]).join(' · ')
                    : 'Sin centro marcado'}
                  {' · '}
                  {o.identified ? 'Identificado' : 'Más separado'}
                </Text>
              </Pressable>
            ))
          )}
          {observations.length > 0 ? (
            <Body muted>Mantén pulsada una nota para borrarla.</Body>
          ) : null}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: 6,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  tags: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.pineSoft,
  },
});
