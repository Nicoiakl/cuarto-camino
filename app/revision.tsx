import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Body, Button, Chip, Field, FormShell, Section } from '@/components/ui';
import { useWork } from '@/context/WorkContext';

export default function RevisionScreen() {
  const { t } = useTranslation();
  const { todayAim, todayReview, saveReview, track } = useWork();
  const [body, setBody] = useState(todayReview?.body ?? '');
  const [aimKept, setAimKept] = useState<boolean | null>(
    todayReview?.aimKept ?? todayAim?.kept ?? null,
  );
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    track('screen_revision');
  }, [track]);

  useEffect(() => {
    setBody(todayReview?.body ?? '');
    setAimKept(todayReview?.aimKept ?? todayAim?.kept ?? null);
  }, [todayReview, todayAim?.kept]);

  useEffect(() => {
    if (!savedFlash) return;
    const id = setTimeout(() => setSavedFlash(false), 2000);
    return () => clearTimeout(id);
  }, [savedFlash]);

  const save = () => {
    if (!body.trim()) return;
    saveReview(body, aimKept);
    setSavedFlash(true);
  };

  return (
    <FormShell
      edged
      footer={
        <Button
          label={savedFlash ? t('revision.saved') : t('revision.save')}
          onPress={save}
          disabled={!body.trim()}
        />
      }>
      <Section title={t('revision.look')}>
        <Body>{t('revision.intro')}</Body>
      </Section>

      {todayAim?.text ? (
        <Section title={t('revision.aimToday')}>
          <Body>{todayAim.text}</Body>
          <View style={styles.row}>
            <Chip
              label={t('revision.kept')}
              selected={aimKept === true}
              onPress={() => setAimKept(true)}
            />
            <Chip
              label={t('revision.lost')}
              selected={aimKept === false}
              onPress={() => setAimKept(false)}
            />
          </View>
        </Section>
      ) : (
        <Section title={t('revision.aimToday')}>
          <Body muted>{t('revision.noAim')}</Body>
        </Section>
      )}

      <Section title={t('revision.notes')}>
        <Field
          value={body}
          onChangeText={setBody}
          placeholder={t('revision.placeholder')}
          multiline
          style={{ minHeight: 160, textAlignVertical: 'top' }}
        />
      </Section>
    </FormShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
