import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { StopSettings } from './types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/** Agenda stops locales según el intervalo (máx. ~16 por día). */
export async function scheduleStops(settings: StopSettings): Promise<number> {
  if (Platform.OS === 'web' || !settings.enabled) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return 0;
  }

  const granted = await ensureNotificationPermission();
  if (!granted) return 0;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = new Date();
  const start = new Date(now);
  start.setHours(settings.startHour, 0, 0, 0);
  const end = new Date(now);
  end.setHours(settings.endHour, 0, 0, 0);

  let cursor = new Date(Math.max(now.getTime() + 60_000, start.getTime()));
  let count = 0;

  while (cursor < end && count < 16) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'The Work',
        body: '¿Estás aquí? Un momento de presencia.',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: cursor,
      },
    });
    cursor = new Date(cursor.getTime() + settings.intervalMinutes * 60_000);
    count += 1;
  }

  return count;
}
