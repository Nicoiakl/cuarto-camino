import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getEntitlements,
  setPremium,
  unlockWithCode,
  type Entitlements,
  type Feature,
  featureRequiresPremium,
} from '@/lib/premium';

type PremiumContextValue = {
  ready: boolean;
  entitlements: Entitlements;
  isPremium: boolean;
  refresh: () => Promise<void>;
  unlockDev: (code: string) => Promise<boolean>;
  setPlan: (plan: 'free' | 'premium', source?: Entitlements['source']) => Promise<void>;
  canUse: (feature: Feature) => boolean;
};

const PremiumContext = createContext<PremiumContextValue | null>(null);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [entitlements, setEntitlements] = useState<Entitlements>({
    plan: 'free',
    source: 'none',
    updatedAt: null,
  });

  const refresh = useCallback(async () => {
    const e = await getEntitlements();
    setEntitlements(e);
  }, []);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, [refresh]);

  const unlockDev = useCallback(async (code: string) => {
    const ok = await unlockWithCode(code);
    if (ok) await refresh();
    return ok;
  }, [refresh]);

  const setPlan = useCallback(
    async (plan: 'free' | 'premium', source: Entitlements['source'] = 'promo') => {
      const next = await setPremium(plan, source);
      setEntitlements(next);
    },
    [],
  );

  const isPremium = entitlements.plan === 'premium';

  const value = useMemo<PremiumContextValue>(
    () => ({
      ready,
      entitlements,
      isPremium,
      refresh,
      unlockDev,
      setPlan,
      canUse: (feature) =>
        !featureRequiresPremium(feature) || entitlements.plan === 'premium',
    }),
    [ready, entitlements, isPremium, refresh, unlockDev, setPlan],
  );

  return (
    <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error('usePremium must be used within PremiumProvider');
  return ctx;
}
