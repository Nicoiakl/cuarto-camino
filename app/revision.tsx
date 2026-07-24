import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Body, Button, Chip, Field, Screen, Section } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';

export default function RevisionScreen() {
  const { t } = useTranslation();
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
          <Button
            label={t('revision.save')}
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
