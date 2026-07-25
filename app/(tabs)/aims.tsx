import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Body, Button, Field, FormShell, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { formatDayLabel } from '@/lib/dates';

export default function AimsScreen() {
  const { t } = useTranslation();
  const { todayAim, setAimForToday, aims, track } = useWork();
  const [text, setText] = useState(todayAim?.text ?? '');
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    track('screen_aims');
  }, [track]);

  useEffect(() => {
    setText(todayAim?.text ?? '');
  }, [todayAim?.text]);

  useEffect(() => {
    if (!savedFlash) return;
    const id = setTimeout(() => setSavedFlash(false), 2200);
    return () => clearTimeout(id);
  }, [savedFlash]);

  const history = aims.filter((a) => a.id !== todayAim?.id).slice(0, 14);
  const examples = [t('aims.ex1'), t('aims.ex2'), t('aims.ex3')];
  const canSave = Boolean(text.trim());
  const isUnchanged =
    Boolean(todayAim?.text) && text.trim() === todayAim?.text.trim();

  const save = () => {
    const next = text.trim();
    if (!next) return;
    Keyboard.dismiss();
    setAimForToday(next);
    setSavedFlash(true);
  };

  return (
    <FormShell
      footer={
        <Button
          label={
            savedFlash
              ? t('aims.saved')
              : isUnchanged
                ? t('aims.update')
                : t('aims.save')
          }
          onPress={save}
          disabled={!canSave}
        />
      }>
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
        {todayAim?.text ? (
          <View style={styles.savedBox}>
            <Text style={styles.savedLabel}>{t('aims.savedToday')}</Text>
            <Text style={styles.savedText}>{todayAim.text}</Text>
          </View>
        ) : null}
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
    </FormShell>
  );
}

const styles = StyleSheet.create({
  examples: {
    gap: 8,
  },
  savedBox: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lineHair,
    gap: 6,
  },
  savedLabel: {
    fontFamily: fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.focusSoft,
  },
  savedText: {
    fontFamily: fonts.displayItalic,
    fontSize: 22,
    lineHeight: 30,
    color: colors.ink,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.lineSoft,
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
