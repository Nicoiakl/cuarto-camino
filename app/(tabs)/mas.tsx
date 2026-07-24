import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Body, BrandMark, Chip, Screen, Section } from '@/components/ui';
import { colors, fonts, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { scheduleStops } from '@/lib/notifications';
import { SUPPORTED_LANGS, setAppLanguage, type AppLanguage } from '@/i18n';

export default function MasScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { track, observations, stopLogs, aims, reviews, stopSettings } = useWork();

  useEffect(() => {
    track('screen_mas');
  }, [track]);

  const links = [
    {
      href: '/premium' as const,
      title: t('more.premiumTitle'),
      desc: t('more.premiumDesc'),
    },
    {
      href: '/estudio' as const,
      title: t('more.studyTitle'),
      desc: t('more.studyDesc'),
    },
    {
      href: '/revision' as const,
      title: t('more.revisionTitle'),
      desc: t('more.revisionDesc'),
    },
    {
      href: '/citas' as const,
      title: t('more.quotesTitle'),
      desc: t('more.quotesDesc'),
    },
    {
      href: '/uso' as const,
      title: t('more.usageTitle'),
      desc: t('more.usageDesc'),
    },
  ];

  const changeLanguage = async (lang: AppLanguage) => {
    await setAppLanguage(lang);
    track('language_changed', { lang });
    await scheduleStops(stopSettings).catch(() => {});
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BrandMark subtitle={t('more.intro')} />

        <Section title={t('more.space')}>
          <Body muted>{t('more.localNote')}</Body>
        </Section>

        <Section title={t('more.language')}>
          <Body muted>{t('more.languageHint')}</Body>
          <View style={styles.row}>
            {SUPPORTED_LANGS.map((lang) => (
              <Chip
                key={lang}
                label={t(`languages.${lang}`)}
                selected={i18n.language === lang}
                onPress={() => changeLanguage(lang)}
              />
            ))}
          </View>
        </Section>

        <Section title={t('more.goTo')}>
          {links.map((item) => (
            <Pressable
              key={item.href}
              onPress={() => {
                track('nav_mas', { to: item.href });
                router.push(item.href);
              }}
              style={({ pressed }) => [styles.link, pressed && { opacity: 0.85 }]}>
              <Text style={styles.linkTitle}>{item.title}</Text>
              <Text style={styles.linkDesc}>{item.desc}</Text>
            </Pressable>
          ))}
        </Section>

        <Section title={t('more.practice')}>
          <View style={styles.stats}>
            <Stat label={t('more.observations')} value={observations.length} />
            <Stat label={t('more.stops')} value={stopLogs.length} />
            <Stat label={t('more.aims')} value={aims.length} />
            <Stat label={t('more.reviews')} value={reviews.length} />
          </View>
        </Section>
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  link: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    gap: 4,
  },
  linkTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.ink,
  },
  linkDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stat: {
    width: '47%',
    paddingVertical: spacing.sm,
    gap: 2,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 34,
    color: colors.focus,
  },
  statLabel: {
    fontFamily: fonts.ui,
    fontSize: 12,
    letterSpacing: 0.2,
    color: colors.muted,
  },
});
