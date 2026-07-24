import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { colors, fonts } from '@/constants/theme';
import { useWork } from '@/context/WorkContext';
import { useEffect } from 'react';

export default function TabLayout() {
  const { track } = useWork();

  useEffect(() => {
    track('app_open');
  }, [track]);

  return (
    <Tabs
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
          title: 'Hoy',
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
          title: 'Stops',
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
          title: 'Observar',
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
          title: 'Aim',
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
          title: 'Más',
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
