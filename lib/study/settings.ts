import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'thework.anthropic.apiKey';

async function setItem(value: string) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(KEY, value);
    return;
  }
  await SecureStore.setItemAsync(KEY, value);
}

async function getItem() {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(KEY);
  }
  return SecureStore.getItemAsync(KEY);
}

async function deleteItem() {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(KEY);
    return;
  }
  await SecureStore.deleteItemAsync(KEY);
}

export async function getAnthropicKey(): Promise<string | null> {
  try {
    return (await getItem())?.trim() || null;
  } catch {
    return null;
  }
}

export async function saveAnthropicKey(key: string): Promise<void> {
  const trimmed = key.trim();
  if (!trimmed) {
    await deleteItem();
    return;
  }
  await setItem(trimmed);
}

export async function clearAnthropicKey(): Promise<void> {
  await deleteItem();
}
