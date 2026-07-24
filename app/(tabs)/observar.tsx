import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Body, Button, Chip, Field, Screen, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { CENTERS, type Center } from '@/lib/types';
import { formatFriendlyDateTime } from '@/lib/dates';

export default function ObservarScreen() {
  const { t } = useTranslation();
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

  const centerLabel = (c: Center) => t(`centers.${c}`);

  const save = () => {
    if (!body.trim()) return;
    addObservation({ body, centers, identified });
    setBody('');
    setCenters([]);
    setIdentified(false);
  };

  const confirmRemove = (id: string) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(t('observe.deleteWeb'))) {
        removeObservation(id);
      }
      return;
    }
    Alert.alert(t('observe.deleteTitle'), t('observe.deleteConfirm'), [
      { text: t('observe.cancel'), style: 'cancel' },
      {
        text: t('observe.delete'),
        style: 'destructive',
        onPress: () => removeObservation(id),
      },
    ]);
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Section title={t('observe.title')}>
          <Body>{t('observe.intro')}</Body>
        </Section>

        <Section title={t('observe.what')}>
          <Field
            value={body}
            onChangeText={setBody}
            placeholder={t('observe.placeholder')}
            multiline
            style={{ minHeight: 110, textAlignVertical: 'top' }}
          />
        </Section>

        <Section title={t('observe.centers')}>
          <View style={styles.row}>
            {CENTERS.map((c) => (
              <Chip
                key={c}
                label={centerLabel(c)}
                selected={centers.includes(c)}
                onPress={() => toggleCenter(c)}
              />
            ))}
          </View>
        </Section>

        <Section title={t('observe.identification')}>
          <View style={styles.row}>
            <Chip
              label={t('observe.wasIdentified')}
              selected={identified}
              onPress={() => setIdentified(true)}
            />
            <Chip
              label={t('observe.someSeparation')}
              selected={!identified}
              onPress={() => setIdentified(false)}
            />
          </View>
          <Button
            label={t('observe.save')}
            onPress={save}
            disabled={!body.trim()}
          />
        </Section>

        <Section title={t('observe.journal')}>
          {observations.length === 0 ? (
            <Body muted>{t('observe.empty')}</Body>
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
                    ? o.centers.map((c) => centerLabel(c)).join(' · ')
                    : t('observe.noCenter')}
                  {' · '}
                  {o.identified ? t('observe.identified') : t('observe.moreSeparate')}
                </Text>
              </Pressable>
            ))
          )}
          {observations.length > 0 ? (
            <Body muted>{t('observe.longPress')}</Body>
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
