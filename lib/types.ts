export type Center = 'intelectual' | 'emocional' | 'motor' | 'instinctivo';

export const CENTERS: Center[] = [
  'intelectual',
  'emocional',
  'motor',
  'instinctivo',
];

export type Observation = {
  id: string;
  createdAt: string;
  body: string;
  centers: Center[];
  identified: boolean;
};

export type Aim = {
  id: string;
  date: string;
  text: string;
  kept: boolean | null;
};

export type StopLog = {
  id: string;
  at: string;
  remembered: boolean;
  note?: string;
};

export type Review = {
  id: string;
  date: string;
  body: string;
  aimKept: boolean | null;
};

export type StopSettings = {
  enabled: boolean;
  intervalMinutes: number;
  startHour: number;
  endHour: number;
};

export type AnalyticsEvent = {
  id: string;
  name: string;
  at: string;
  meta?: Record<string, string | number | boolean>;
};

export type WorkState = {
  observations: Observation[];
  aims: Aim[];
  stopLogs: StopLog[];
  reviews: Review[];
  stopSettings: StopSettings;
  analytics: AnalyticsEvent[];
};
