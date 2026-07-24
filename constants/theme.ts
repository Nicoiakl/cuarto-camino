/**
 * EMBER NIGHT — almost all dark; one quiet flame.
 * Like sitting with a fire: charcoal field, single warm point.
 * Motion stays tidal and slow.
 */
export const colors = {
  bg: '#080A0C',
  bgMid: '#0C0F12',
  bgDeep: '#050607',
  wash: '#0C0F12',
  surface: '#12161A',
  surfaceRaised: '#181D22',
  /** warm parchment on night */
  ink: '#EDE6DC',
  inkSoft: '#C9C0B4',
  muted: '#7A746C',
  line: '#2A3036',
  lineSoft: 'rgba(237, 230, 220, 0.08)',
  lineHair: 'rgba(237, 230, 220, 0.12)',
  focus: '#E2A66A',
  focusSoft: '#C48A52',
  /** the single flame */
  accent: '#D4925A',
  accentSoft: '#E2A66A',
  accentHot: '#F0B878',
  accentDeep: '#A86A38',
  session: '#060809',
  sessionMid: '#0A0D10',
  sessionSoft: '#141A1F',
  danger: '#A85A5A',
  white: '#EDE6DC',
  whiteMuted: 'rgba(237, 230, 220, 0.72)',
  whiteSoft: 'rgba(237, 230, 220, 0.48)',
  water: '#3A4248',
  mist: 'rgba(212, 146, 90, 0.12)',
  // legacy aliases
  pine: '#E2A66A',
  pineSoft: '#C48A52',
  gold: '#D4925A',
  goldSoft: '#E2A66A',
};

export const gradients = {
  /** night field — almost no color */
  screen: ['#0A0D10', '#080A0C', '#050607'] as const,
  screenWarmEdge: ['rgba(240, 184, 120, 0.08)', 'transparent'] as const,
  /** hero: void + one flame breath */
  hero: ['#050607', '#080A0C', '#0E1216'] as const,
  heroSheen: [
    'rgba(240, 184, 120, 0.16)',
    'rgba(212, 146, 90, 0.05)',
    'transparent',
  ] as const,
  session: ['#050607', '#080A0C', '#0C1014'] as const,
  sessionSheen: ['rgba(240, 184, 120, 0.12)', 'transparent'] as const,
  /** flame CTA */
  lumenBtn: ['#F2C08A', '#E2A66A', '#C47A42'] as const,
  primaryBtn: ['#F0B878', '#D4925A', '#B87438'] as const,
  goldBtn: ['#E8B480', '#D4925A'] as const,
  beacon: ['#141A1F', '#080A0C'] as const,
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radii = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const fonts = {
  display: 'CormorantGaramond_600SemiBold',
  displayItalic: 'CormorantGaramond_500Medium_Italic',
  body: 'Literata_400Regular',
  bodyMedium: 'Literata_500Medium',
  bodyItalic: 'Literata_400Regular_Italic',
  ui: 'Manrope_400Regular',
  uiMedium: 'Manrope_500Medium',
  uiSemi: 'Manrope_600SemiBold',
  uiBold: 'Manrope_700Bold',
};

export const type = {
  brand: { size: 52, line: 54, tracking: 0.6 },
  brandLg: { size: 58, line: 60, tracking: 0.5 },
  display: { size: 34, line: 40, tracking: 0.2 },
  displaySm: { size: 28, line: 34, tracking: 0.1 },
  body: { size: 16.5, line: 28 },
  bodyLg: { size: 18.5, line: 31 },
  ui: { size: 15, line: 20, tracking: 0.2 },
  label: { size: 11, line: 14, tracking: 2.4 },
  meta: { size: 12.5, line: 17, tracking: 0.4 },
};

/** Soft night depth — flame glow only where it matters */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 3,
  },
  lift: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 6,
  },
  press: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 2,
  },
  gold: {
    shadowColor: '#C47A42',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 6,
  },
  ink: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 8,
  },
};

/** Tidal — slow like breath / watching fire */
export const motion = {
  enter: 1200,
  slow: 1800,
  pulse: 3600,
  breath: 4800,
  press: 300,
  spring: { damping: 28, stiffness: 80, mass: 1.15 },
};
