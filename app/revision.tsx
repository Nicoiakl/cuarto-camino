import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Body, Button, Chip, Field, Screen, Section } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';

export default function RevisionScreen() {
  const { todayAim, todayReview, saveReview, track } = useWork();
  const [body, setBody] = useState(todayReview?.body ?? '');
  const [aimKept, setAimKept] = useState<boolean | null>(
    todayReview?.aimKept ?? todayAim?.kept ?? null,
  );

  useEffect(() => {
    track('screen_revision');
  }, [track]);

  useEffect(() => {
    setBody(todayReview?.body ?? '');
    setAimKept(todayReview?.aimKept ?? todayAim?.kept ?? null);
  }, [todayReview, todayAim?.kept]);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Section title="Mirar el día">
          <Body>
            Sin juicio duro. ¿Dónde hubo un instante de recuerdo? ¿Dónde te llevó la
            corriente?
          </Body>
        </Section>

        {todayAim?.text ? (
          <Section title="Aim de hoy">
            <Body>{todayAim.text}</Body>
            <View style={styles.row}>
              <Chip
                label="Lo sostuve"
                selected={aimKept === true}
                onPress={() => setAimKept(true)}
              />
              <Chip
                label="Se me fue"
                selected={aimKept === false}
                onPress={() => setAimKept(false)}
              />
            </View>
          </Section>
        ) : (
          <Section title="Aim de hoy">
            <Body muted>No planteaste aim. Aun así puedes revisar el día.</Body>
          </Section>
        )}

        <Section title="Notas de la noche">
          <Field
            value={body}
            onChangeText={setBody}
            placeholder="Lo que viste… lo que quieres recordar mañana…"
            multiline
            style={{ minHeight: 160, textAlignVertical: 'top' }}
          />
          <Button
            label="Guardar revisión"
            onPress={() => saveReview(body, aimKept)}
            disabled={!body.trim()}
          />
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
});
