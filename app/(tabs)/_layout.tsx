import { useEffect } from 'react';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors, fonts } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';

export default function TabLayout() {
  const { track } = useWork();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    track('app_open');
  }, [track]);

  return (
    <Tabs
      key={i18n.language}
      screenOptions={{
        tabBarActiveTintColor: colors.pine,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.body,
          fontSize: 11,
        },
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.ink,
        headerTitleStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 17,
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.today'),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'sun.max', android: 'wb_sunny', web: 'wb_sunny' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stops"
        options={{
          title: t('tabs.stops'),
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="observar"
        options={{
          title: t('tabs.observe'),
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="aims"
        options={{
          title: t('tabs.aim'),
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'target', android: 'my_location', web: 'my_location' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mas"
        options={{
          title: t('tabs.more'),
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'ellipsis.circle',
                android: 'more_horiz',
                web: 'more_horiz',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
