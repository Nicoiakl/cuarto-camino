import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEY = 'thework.premium.v1';
/** Temporary owner unlock until App Store IAP is wired. */
export const DEV_UNLOCK_CODE = 'THEWORK-PREMIUM';

export type Plan = 'free' | 'premium';

export type Entitlements = {
  plan: Plan;
  source: 'none' | 'dev' | 'store' | 'promo';
  updatedAt: string | null;
};

const FREE: Entitlements = {
  plan: 'free',
  source: 'none',
  updatedAt: null,
};

async function readRaw(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return AsyncStorage.getItem(KEY);
    return SecureStore.getItemAsync(KEY);
  } catch {
    return null;
  }
}

async function writeRaw(value: string) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(KEY, value);
    return;
  }
  await SecureStore.setItemAsync(KEY, value);
}

export async function getEntitlements(): Promise<Entitlements> {
  const raw = await readRaw();
  if (!raw) return FREE;
  try {
    return { ...FREE, ...JSON.parse(raw) };
  } catch {
    return FREE;
  }
}

export async function isPremium(): Promise<boolean> {
  const e = await getEntitlements();
  return e.plan === 'premium';
}

export async function setPremium(
  plan: Plan,
  source: Entitlements['source'],
): Promise<Entitlements> {
  const next: Entitlements = {
    plan,
    source: plan === 'free' ? 'none' : source,
    updatedAt: new Date().toISOString(),
  };
  await writeRaw(JSON.stringify(next));
  return next;
}

export async function unlockWithCode(code: string): Promise<boolean> {
  if (code.trim().toUpperCase() !== DEV_UNLOCK_CODE) return false;
  await setPremium('premium', 'dev');
  return true;
}

/** Feature matrix — single source of truth for freemium. */
export const FEATURES = {
  dailyPractice: 'free',
  stops: 'free',
  observe: 'free',
  aims: 'free',
  review: 'free',
  quotes: 'free',
  studyLocal: 'free',
  studyAi: 'premium',
  unlimitedHistory: 'premium',
} as const;

export type Feature = keyof typeof FEATURES;

export function featureRequiresPremium(feature: Feature): boolean {
  return FEATURES[feature] === 'premium';
}
