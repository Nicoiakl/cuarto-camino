import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, Button, Field, Screen, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { formatDayLabel } from '@/lib/dates';

export default function AimsScreen() {
  const { todayAim, setAimForToday, aims, track } = useWork();
  const [text, setText] = useState(todayAim?.text ?? '');

  useEffect(() => {
    track('screen_aims');
  }, [track]);

  useEffect(() => {
    setText(todayAim?.text ?? '');
  }, [todayAim?.text]);

  const history = aims.filter((a) => a.id !== todayAim?.id).slice(0, 14);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Section title="Aim consciente">
          <Body>
            Un aim es una dirección posible para hoy — concreta, sentida, no un deseo
            vago. Mejor pequeño y vivo que grande y abstracto.
          </Body>
        </Section>

        <Section title="Aim de hoy">
          <Field
            value={text}
            onChangeText={setText}
            placeholder="Ej.: Recordarme al cruzar umbrales"
            multiline
            style={{ minHeight: 96, textAlignVertical: 'top' }}
          />
          <Button
            label="Guardar aim"
            onPress={() => setAimForToday(text)}
            disabled={!text.trim()}
          />
          {todayAim?.kept != null ? (
            <Body muted>
              Por la noche marcaste:{' '}
              {todayAim.kept ? 'lo mantuve en parte' : 'se me fue'}
            </Body>
          ) : null}
        </Section>

        <Section title="Ejemplos vivos">
          <View style={styles.examples}>
            {[
              'Cuando hable, notar la voz y el cuerpo',
              'Una vez cada hora: ¿estoy aquí?',
              'No justificar automáticamente la irritación',
            ].map((ex) => (
              <Button
                key={ex}
                label={ex}
                variant="ghost"
                onPress={() => setText(ex)}
              />
            ))}
          </View>
        </Section>

        <Section title="Días anteriores">
          {history.length === 0 ? (
            <Body muted>El historial de aims aparecerá aquí.</Body>
          ) : (
            history.map((a) => (
              <View key={a.id} style={styles.card}>
                <Text style={styles.meta}>{formatDayLabel(a.date)}</Text>
                <Text style={styles.aim}>{a.text}</Text>
                <Text style={styles.kept}>
                  {a.kept == null
                    ? 'Sin revisión'
                    : a.kept
                      ? 'Aim sostenido'
                      : 'Aim perdido de vista'}
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
  },
  examples: {
    gap: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: 4,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    textTransform: 'capitalize',
  },
  aim: {
    fontFamily: fonts.displayItalic,
    fontSize: 20,
    lineHeight: 28,
    color: colors.ink,
  },
  kept: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.pineSoft,
  },
});
