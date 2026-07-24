import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Body, Screen, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { corpusSummary } from '@/lib/study/corpus';
import { getAnthropicKey } from '@/lib/study/settings';

export default function EstudioHubScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { track } = useWork();
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    track('screen_estudio');
    getAnthropicKey().then((k) => setHasKey(!!k));
  }, [track]);

  const links = [
    {
      href: '/estudio-chat?mode=chat' as const,
      title: t('study.chatTitle'),
      desc: t('study.chatDesc'),
    },
    {
      href: '/estudio-chat?mode=daily' as const,
      title: t('study.dailyTitle'),
      desc: t('study.dailyDesc'),
    },
    {
      href: '/estudio-chat?mode=fromObservation' as const,
      title: t('study.fromObsTitle'),
      desc: t('study.fromObsDesc'),
    },
    {
      href: '/estudio-settings' as const,
      title: t('study.settingsTitle'),
      desc: t('study.settingsDesc'),
    },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title={t('study.hubTitle')}>
          <Body>{t('study.hubIntro')}</Body>
          <Text style={styles.corpus}>{corpusSummary()}</Text>
          <Body muted>
            {hasKey ? t('study.aiReady') : t('study.aiLocal')}
          </Body>
        </Section>

        <Section title={t('study.enter')}>
          {links.map((item) => (
            <Pressable
              key={item.href}
              onPress={() => {
                track('nav_estudio', { to: item.href });
                router.push(item.href);
              }}
              style={({ pressed }) => [styles.link, pressed && { opacity: 0.85 }]}>
              <Text style={styles.linkTitle}>{item.title}</Text>
              <Text style={styles.linkDesc}>{item.desc}</Text>
            </Pressable>
          ))}
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
  corpus: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.pineSoft,
    lineHeight: 20,
  },
  link: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: 4,
  },
  linkTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
  },
  linkDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
});
