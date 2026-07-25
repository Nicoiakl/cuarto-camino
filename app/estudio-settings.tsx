import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppShell, Body, Button, Field, Section } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import {
  clearAnthropicKey,
  getAnthropicKey,
  saveAnthropicKey,
} from '@/lib/study/settings';
import { corpusSummary } from '@/lib/study/corpus';

export default function EstudioSettingsScreen() {
  const { t } = useTranslation();
  const { track } = useWork();
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    track('screen_estudio_settings');
    getAnthropicKey().then((k) => {
      setHasKey(!!k);
      if (k) setKey('sk-ant-••••••••');
    });
  }, [track]);

  const save = async () => {
    if (key.includes('••••')) return;
    await saveAnthropicKey(key);
    setHasKey(!!key.trim());
    setSaved(true);
    track('study_key_saved', { hasKey: !!key.trim() });
    setTimeout(() => setSaved(false), 1600);
  };

  const clear = async () => {
    await clearAnthropicKey();
    setKey('');
    setHasKey(false);
    track('study_key_cleared');
  };

  return (
    <AppShell>
      <Section title={t('study.settingsTitle')}>
        <Body>{t('study.settingsIntro')}</Body>
        <Text style={styles.corpus}>{corpusSummary()}</Text>
      </Section>

      <Section title="Anthropic">
        <Body muted>{t('study.keyHint')}</Body>
        <Field
          value={key}
          onChangeText={(v) => {
            setKey(v);
            setSaved(false);
          }}
          onFocus={() => {
            if (key.includes('••••')) setKey('');
          }}
          placeholder="sk-ant-..."
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        <Button label={t('study.saveKey')} onPress={save} />
        {hasKey ? (
          <Button label={t('study.clearKey')} variant="ghost" onPress={clear} />
        ) : null}
        {saved ? <Body muted>{t('study.keySaved')}</Body> : null}
      </Section>

      <Section title={t('study.privacyTitle')}>
        <Body muted>{t('study.privacyBody')}</Body>
      </Section>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  corpus: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.pineSoft,
    lineHeight: 20,
  },
});
