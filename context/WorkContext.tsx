import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createId } from '@/lib/id';
import { todayKey } from '@/lib/dates';
import { scheduleStops } from '@/lib/notifications';
import { loadJSON, saveJSON } from '@/lib/storage';
import type {
  Aim,
  AnalyticsEvent,
  Center,
  Observation,
  Review,
  StopLog,
  StopSettings,
  WorkState,
} from '@/lib/types';

const DEFAULT_STOPS: StopSettings = {
  enabled: true,
  intervalMinutes: 90,
  startHour: 8,
  endHour: 22,
};

const EMPTY: WorkState = {
  observations: [],
  aims: [],
  stopLogs: [],
  reviews: [],
  stopSettings: DEFAULT_STOPS,
  analytics: [],
};

type WorkContextValue = WorkState & {
  ready: boolean;
  track: (name: string, meta?: AnalyticsEvent['meta']) => void;
  addObservation: (input: {
    body: string;
    centers: Center[];
    identified: boolean;
  }) => void;
  removeObservation: (id: string) => void;
  setAimForToday: (text: string) => void;
  markAimKept: (kept: boolean) => void;
  todayAim: Aim | undefined;
  logStop: (remembered: boolean, note?: string) => void;
  updateStopSettings: (patch: Partial<StopSettings>) => Promise<void>;
  saveReview: (body: string, aimKept: boolean | null) => void;
  todayReview: Review | undefined;
  usageStats: { name: string; count: number }[];
};

const WorkContext = createContext<WorkContextValue | null>(null);

export function WorkProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const loaded = await loadJSON<WorkState>(EMPTY);
      if (!alive) return;
      setState({
        ...EMPTY,
        ...loaded,
        stopSettings: { ...DEFAULT_STOPS, ...loaded.stopSettings },
      });
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveJSON(state).catch(() => {});
  }, [state, ready]);

  useEffect(() => {
    if (!ready) return;
    scheduleStops(state.stopSettings).catch(() => {});
  }, [ready, state.stopSettings]);

  const track = useCallback((name: string, meta?: AnalyticsEvent['meta']) => {
    const event: AnalyticsEvent = {
      id: createId(),
      name,
      at: new Date().toISOString(),
      meta,
    };
    setState((prev) => ({
      ...prev,
      analytics: [event, ...prev.analytics].slice(0, 2000),
    }));
  }, []);

  const addObservation = useCallback(
    (input: { body: string; centers: Center[]; identified: boolean }) => {
      const observation: Observation = {
        id: createId(),
        createdAt: new Date().toISOString(),
        body: input.body.trim(),
        centers: input.centers,
        identified: input.identified,
      };
      setState((prev) => ({
        ...prev,
        observations: [observation, ...prev.observations],
      }));
      track('observation_created', {
        centers: input.centers.join(','),
        identified: input.identified,
      });
    },
    [track],
  );

  const removeObservation = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      observations: prev.observations.filter((o) => o.id !== id),
    }));
  }, []);

  const setAimForToday = useCallback(
    (text: string) => {
      const date = todayKey();
      setState((prev) => {
        const others = prev.aims.filter((a) => a.date !== date);
        const existing = prev.aims.find((a) => a.date === date);
        const aim: Aim = {
          id: existing?.id ?? createId(),
          date,
          text: text.trim(),
          kept: existing?.kept ?? null,
        };
        return { ...prev, aims: [aim, ...others] };
      });
      track('aim_set');
    },
    [track],
  );

  const markAimKept = useCallback((kept: boolean) => {
    const date = todayKey();
    setState((prev) => ({
      ...prev,
      aims: prev.aims.map((a) => (a.date === date ? { ...a, kept } : a)),
    }));
  }, []);

  const todayAim = useMemo(
    () => state.aims.find((a) => a.date === todayKey()),
    [state.aims],
  );

  const logStop = useCallback(
    (remembered: boolean, note?: string) => {
      const log: StopLog = {
        id: createId(),
        at: new Date().toISOString(),
        remembered,
        note: note?.trim() || undefined,
      };
      setState((prev) => ({
        ...prev,
        stopLogs: [log, ...prev.stopLogs].slice(0, 500),
      }));
      track(remembered ? 'stop_remembered' : 'stop_missed');
    },
    [track],
  );

  const updateStopSettings = useCallback(
    async (patch: Partial<StopSettings>) => {
      setState((prev) => ({
        ...prev,
        stopSettings: { ...prev.stopSettings, ...patch },
      }));
      track('stop_settings_updated');
    },
    [track],
  );

  const saveReview = useCallback(
    (body: string, aimKept: boolean | null) => {
      const date = todayKey();
      setState((prev) => {
        const others = prev.reviews.filter((r) => r.date !== date);
        const existing = prev.reviews.find((r) => r.date === date);
        const review: Review = {
          id: existing?.id ?? createId(),
          date,
          body: body.trim(),
          aimKept,
        };
        const aims = prev.aims.map((a) =>
          a.date === date ? { ...a, kept: aimKept } : a,
        );
        return { ...prev, reviews: [review, ...others], aims };
      });
      track('review_saved');
    },
    [track],
  );

  const todayReview = useMemo(
    () => state.reviews.find((r) => r.date === todayKey()),
    [state.reviews],
  );

  const usageStats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of state.analytics) {
      counts.set(e.name, (counts.get(e.name) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [state.analytics]);

  const value = useMemo<WorkContextValue>(
    () => ({
      ...state,
      ready,
      track,
      addObservation,
      removeObservation,
      setAimForToday,
      markAimKept,
      todayAim,
      logStop,
      updateStopSettings,
      saveReview,
      todayReview,
      usageStats,
    }),
    [
      state,
      ready,
      track,
      addObservation,
      removeObservation,
      setAimForToday,
      markAimKept,
      todayAim,
      logStop,
      updateStopSettings,
      saveReview,
      todayReview,
      usageStats,
    ],
  );

  return <WorkContext.Provider value={value}>{children}</WorkContext.Provider>;
}

export function useWork() {
  const ctx = useContext(WorkContext);
  if (!ctx) throw new Error('useWork must be used within WorkProvider');
  return ctx;
}
