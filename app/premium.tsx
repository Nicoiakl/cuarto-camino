import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Body, Button, Field, Screen, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { usePremium } from '@/context/PremiumContext';
import { useWork } from '@/context/WorkContext';

export default function PremiumScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { track } = useWork();
  const { isPremium, unlockDev, setPlan } = usePremium();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const tryUnlock = async () => {
    const ok = await unlockDev(code);
    track(ok ? 'premium_dev_unlock' : 'premium_dev_fail');
    setMsg(ok ? t('premium.unlockOk') : t('premium.unlockFail'));
    if (ok) setCode('');
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Section title={t('premium.title')}>
          <Text style={styles.plan}>
            {isPremium ? t('premium.youArePremium') : t('premium.youAreFree')}
          </Text>
          <Body>{t('premium.intro')}</Body>
        </Section>

        <Section title={t('premium.freeTitle')}>
          {[
            t('premium.free1'),
            t('premium.free2'),
            t('premium.free3'),
            t('premium.free4'),
          ].map((line) => (
            <Text key={line} style={styles.bullet}>
              · {line}
            </Text>
          ))}
        </Section>

        <Section title={t('premium.premiumTitle')}>
          {[
            t('premium.prem1'),
            t('premium.prem2'),
            t('premium.prem3'),
          ].map((line) => (
            <View key={line} style={styles.premRow}>
              <Text style={styles.premBullet}>★</Text>
              <Text style={styles.premText}>{line}</Text>
            </View>
          ))}
          <Body muted>{t('premium.storeNote')}</Body>
          <Button
            label={t('premium.ctaSoon')}
            onPress={() => {
              track('premium_cta_tap');
              setMsg(t('premium.ctaSoonMsg'));
            }}
          />
        </Section>

        <Section title={t('premium.devTitle')}>
          <Body muted>{t('premium.devHint')}</Body>
          <Field
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            autoCorrect={false}
            placeholder="THEWORK-PREMIUM"
          />
          <Button label={t('premium.unlock')} onPress={tryUnlock} disabled={!code.trim()} />
          {isPremium ? (
            <Button
              label={t('premium.backToFree')}
              variant="ghost"
              onPress={async () => {
                await setPlan('free');
                track('premium_cleared');
                setMsg(t('premium.cleared'));
              }}
            />
          ) : null}
          {msg ? <Body muted>{msg}</Body> : null}
        </Section>

        <Button label={t('premium.close')} variant="ghost" onPress={() => router.back()} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
    gap: 4,
  },
  plan: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
  },
  bullet: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
  },
  premRow: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  premBullet: {
    color: colors.accent,
    fontFamily: fonts.uiMedium,
  },
  premText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
});
