import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import pt from './locales/pt';
import de from './locales/de';
import it from './locales/it';

export const SUPPORTED_LANGS = ['en', 'es', 'fr', 'pt', 'de', 'it'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGS)[number];

const LOCALE_KEY = 'thework.locale';

export function isAppLanguage(value: string): value is AppLanguage {
  return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

export function deviceLanguage(): AppLanguage {
  const tag = Localization.getLocales()[0]?.languageCode ?? 'en';
  return isAppLanguage(tag) ? tag : 'en';
}

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    pt: { translation: pt },
    de: { translation: de },
    it: { translation: it },
  },
  lng: deviceLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export async function loadSavedLanguage(): Promise<AppLanguage> {
  try {
    const saved = await AsyncStorage.getItem(LOCALE_KEY);
    if (saved && isAppLanguage(saved)) {
      await i18n.changeLanguage(saved);
      return saved;
    }
  } catch {
    /* ignore */
  }
  const device = deviceLanguage();
  await i18n.changeLanguage(device);
  return device;
}

export async function setAppLanguage(lang: AppLanguage): Promise<void> {
  await AsyncStorage.setItem(LOCALE_KEY, lang);
  await i18n.changeLanguage(lang);
}

export default i18n;
