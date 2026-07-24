import {
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import {
  Literata_400Regular,
  Literata_400Regular_Italic,
  Literata_500Medium,
} from '@expo-google-fonts/literata';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import 'react-native-reanimated';

import i18n, { loadSavedLanguage } from '@/i18n';
import { PremiumProvider } from '@/context/PremiumContext';
import { WorkProvider } from '@/context/WorkContext';
import { colors, fonts } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    CormorantGaramond_600SemiBold,
    CormorantGaramond_500Medium_Italic,
    Literata_400Regular,
    Literata_400Regular_Italic,
    Literata_500Medium,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    loadSavedLanguage().finally(() => setI18nReady(true));
  }, []);

  useEffect(() => {
    if (loaded && i18nReady) SplashScreen.hideAsync();
  }, [loaded, i18nReady]);

  if (!loaded || !i18nReady) return null;

  return (
    <I18nextProvider i18n={i18n}>
      <WorkProvider>
        <PremiumProvider>
          <StatusBar style="light" />
          <RootStack />
        </PremiumProvider>
      </WorkProvider>
    </I18nextProvider>
  );
}

function RootStack() {
  const { t, i18n: i18nInstance } = useTranslation();

  return (
    <Stack
      key={i18nInstance.language}
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.accentHot,
        headerTitleStyle: {
          fontFamily: fonts.uiMedium,
          fontSize: 16,
          color: colors.ink,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'fade',
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="revision" options={{ title: t('screens.revision') }} />
      <Stack.Screen name="citas" options={{ title: t('screens.quotes') }} />
      <Stack.Screen name="uso" options={{ title: t('screens.usage') }} />
      <Stack.Screen name="estudio" options={{ title: t('screens.study') }} />
      <Stack.Screen name="estudio-chat" options={{ title: t('screens.studyChat') }} />
      <Stack.Screen
        name="estudio-settings"
        options={{ title: t('screens.studySettings') }}
      />
      <Stack.Screen
        name="practica"
        options={{ headerShown: false, presentation: 'fullScreenModal' }}
      />
      <Stack.Screen name="premium" options={{ title: t('screens.premium') }} />
    </Stack>
  );
}
