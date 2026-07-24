/**
 * STILL — lagoon at dusk, quiet fire on the shore.
 * Cool water mist by day; deep pool + soft ember in session.
 * Motion is tidal and slow, like breath or flame.
 */
export const colors = {
  bg: '#E3EAE9',
  bgMid: '#D0DBDA',
  bgDeep: '#BCC9C8',
  wash: '#F2F6F5',
  surface: '#E8EFEE',
  surfaceRaised: '#F7FAF9',
  ink: '#0B1518',
  inkSoft: '#1C2C31',
  muted: '#5A6B6E',
  line: '#A8B6B7',
  lineSoft: 'rgba(11, 21, 24, 0.07)',
  lineHair: 'rgba(11, 21, 24, 0.11)',
  focus: '#1A3A42',
  focusSoft: '#2A515A',
  /** quiet fire — warm, never loud */
  accent: '#C4926E',
  accentSoft: '#D4A892',
  accentHot: '#E2B89A',
  accentDeep: '#A67452',
  session: '#071216',
  sessionMid: '#0B1A20',
  sessionSoft: '#143038',
  danger: '#7A3535',
  white: '#F3F7F6',
  whiteMuted: 'rgba(243, 247, 246, 0.74)',
  whiteSoft: 'rgba(243, 247, 246, 0.52)',
  water: '#7A9AA0',
  mist: 'rgba(180, 205, 208, 0.35)',
  // legacy aliases
  pine: '#1A3A42',
  pineSoft: '#2A515A',
  gold: '#C4926E',
  goldSoft: '#D4A892',
};

export const gradients = {
  screen: ['#F1F6F5', '#E3EAE9', '#C5D2D1'] as const,
  screenWarmEdge: ['rgba(226, 184, 154, 0.18)', 'rgba(227, 234, 233, 0)'] as const,
  /** deep lagoon — looking into still water */
  hero: ['#071216', '#0B1A20', '#143038'] as const,
  heroSheen: [
    'rgba(122, 154, 160, 0.22)',
    'rgba(226, 184, 154, 0.12)',
    'transparent',
  ] as const,
  session: ['#071216', '#0A171C', '#143038'] as const,
  sessionSheen: ['rgba(226, 184, 154, 0.1)', 'transparent'] as const,
  /** ember — soft fire */
  lumenBtn: ['#E8C4A8', '#D4A07C', '#C08A62'] as const,
  primaryBtn: ['#244850', '#1A3A42', '#132E34'] as const,
  goldBtn: ['#E0BCA0', '#D0A486'] as const,
  beacon: ['#143038', '#0B1A20'] as const,
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

/** Soft depth — mist and ember, never neon */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  soft: {
    shadowColor: '#0B1518',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  lift: {
    shadowColor: '#0B1518',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 5,
  },
  press: {
    shadowColor: '#0B1518',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  gold: {
    shadowColor: '#8A5A3A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 5,
  },
  ink: {
    shadowColor: '#061014',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.32,
    shadowRadius: 28,
    elevation: 7,
  },
};

/** Tidal — slow like breath, fire, water */
export const motion = {
  enter: 1100,
  slow: 1600,
  pulse: 3200,
  breath: 4200,
  press: 280,
  spring: { damping: 26, stiffness: 90, mass: 1.1 },
};
