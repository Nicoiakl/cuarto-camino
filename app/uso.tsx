import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Body, Screen, Section } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';

export default function UsoScreen() {
  const { t } = useTranslation();
  const { usageStats, track, analytics } = useWork();

  useEffect(() => {
    track('screen_uso');
  }, [track]);

  const ranked = useMemo(
    () =>
      usageStats
        .filter((s) => s.name !== 'screen_uso')
        .map((s) => {
          const key = `usage.eventsMap.${s.name}`;
          const label = t(key);
          return {
            ...s,
            label: label === key ? s.name : label,
          };
        }),
    [usageStats, t],
  );

  const max = ranked[0]?.count ?? 1;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title={t('usage.title')}>
          <Body>{t('usage.intro')}</Body>
          <Body muted>{t('usage.events', { count: analytics.length })}</Body>
        </Section>

        <Section title={t('usage.mostUsed')}>
          {ranked.length === 0 ? (
            <Body muted>{t('usage.empty')}</Body>
          ) : (
            ranked.map((item) => (
              <View key={item.name} style={styles.row}>
                <View style={styles.rowTop}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.count}>{item.count}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${Math.max(8, (item.count / max) * 100)}%` },
                    ]}
                  />
                </View>
              </View>
            ))
          )}
        </Section>

        <Section title={t('usage.howToRead')}>
          <Body muted>{t('usage.howToReadBody')}</Body>
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
    gap: 6,
    marginBottom: 4,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.inkSoft,
  },
  count: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.pine,
  },
  barTrack: {
    height: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.bgDeep,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.pineSoft,
    borderRadius: radii.sm,
  },
});
