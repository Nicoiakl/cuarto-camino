import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Body, Button, Field, Screen, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { formatDayLabel } from '@/lib/dates';

export default function AimsScreen() {
  const { t } = useTranslation();
  const { todayAim, setAimForToday, aims, track } = useWork();
  const [text, setText] = useState(todayAim?.text ?? '');

  useEffect(() => {
    track('screen_aims');
  }, [track]);

  useEffect(() => {
    setText(todayAim?.text ?? '');
  }, [todayAim?.text]);

  const history = aims.filter((a) => a.id !== todayAim?.id).slice(0, 14);
  const examples = [t('aims.ex1'), t('aims.ex2'), t('aims.ex3')];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Section title={t('aims.title')}>
          <Body>{t('aims.intro')}</Body>
        </Section>

        <Section title={t('aims.today')}>
          <Field
            value={text}
            onChangeText={setText}
            placeholder={t('aims.placeholder')}
            multiline
            style={{ minHeight: 96, textAlignVertical: 'top' }}
          />
          <Button
            label={t('aims.save')}
            onPress={() => setAimForToday(text)}
            disabled={!text.trim()}
          />
          {todayAim?.kept != null ? (
            <Body muted>
              {t('aims.nightMarked')}{' '}
              {todayAim.kept ? t('aims.keptPartly') : t('aims.slippedAway')}
            </Body>
          ) : null}
        </Section>

        <Section title={t('aims.examples')}>
          <View style={styles.examples}>
            {examples.map((ex) => (
              <Button key={ex} label={ex} variant="ghost" onPress={() => setText(ex)} />
            ))}
          </View>
        </Section>

        <Section title={t('aims.history')}>
          {history.length === 0 ? (
            <Body muted>{t('aims.historyEmpty')}</Body>
          ) : (
            history.map((a) => (
              <View key={a.id} style={styles.card}>
                <Text style={styles.meta}>{formatDayLabel(a.date)}</Text>
                <Text style={styles.aim}>{a.text}</Text>
                <Text style={styles.kept}>
                  {a.kept == null
                    ? t('aims.noReview')
                    : a.kept
                      ? t('aims.aimKept')
                      : t('aims.aimLost')}
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
