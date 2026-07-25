import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
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
        tabBarActiveTintColor: colors.accentHot,
        tabBarInactiveTintColor: colors.muted,
        sceneContainerStyle: {
          flex: 1,
          backgroundColor: colors.bg,
        },
        tabBarStyle: {
          backgroundColor: colors.bgDeep,
          borderTopColor: colors.lineSoft,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.uiMedium,
          fontSize: 10,
          letterSpacing: 0.4,
        },
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.ink,
        headerTitleStyle: {
          fontFamily: fonts.uiMedium,
          fontSize: 16,
          letterSpacing: 0.25,
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.today'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stops"
        options={{
          title: t('tabs.stops'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="observar"
        options={{
          title: t('tabs.observe'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="eye-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="aims"
        options={{
          title: t('tabs.aim'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="locate-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mas"
        options={{
          title: t('tabs.more'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
