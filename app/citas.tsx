import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, Screen, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { QUOTES } from '@/lib/quotes';

export default function CitasScreen() {
  const { track } = useWork();

  useEffect(() => {
    track('screen_citas');
  }, [track]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title="Palabras para el Trabajo">
          <Body muted>
            Léelas despacio. Una sola frase, bien recibida, puede bastar para el día.
          </Body>
        </Section>

        {QUOTES.map((q) => (
          <Pressable
            key={q.id}
            onPress={() => track('quote_opened', { id: q.id, theme: q.theme })}
            style={styles.card}>
            <Text style={styles.quote}>“{q.text}”</Text>
            <Text style={styles.source}>{q.source}</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{q.theme}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: 8,
  },
  quote: {
    fontFamily: fonts.displayItalic,
    fontSize: 24,
    lineHeight: 32,
    color: colors.ink,
  },
  source: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
  tag: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  tagText: {
    fontFamily: fonts.body,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.pine,
  },
});
