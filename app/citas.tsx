import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppShell, Body, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { QUOTES, quoteSource, quoteText, quoteThemeLabel } from '@/lib/quotes';

export default function CitasScreen() {
  const { t } = useTranslation();
  const { track } = useWork();

  useEffect(() => {
    track('screen_citas');
  }, [track]);

  return (
    <AppShell>
      <Section title={t('quotes.title')}>
        <Body muted>{t('quotes.intro')}</Body>
      </Section>

      {QUOTES.map((q) => (
        <Pressable
          key={q.id}
          onPress={() => track('quote_opened', { id: q.id, theme: q.theme })}
          style={styles.card}>
          <Text style={styles.quote}>“{quoteText(q.id)}”</Text>
          <Text style={styles.source}>{quoteSource()}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{quoteThemeLabel(q.theme)}</Text>
          </View>
        </Pressable>
      ))}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
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
