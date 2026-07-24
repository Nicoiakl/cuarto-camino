/**
 * LUMEN Editorial — quiet brilliance, pixel-level craft.
 * Cool mist + deep atelier ink + champagne. No wellness clichés.
 */
export const colors = {
  bg: '#E7ECE8',
  bgMid: '#D8E0DA',
  bgDeep: '#C8D1CB',
  wash: '#F7F9F6',
  surface: '#EFF2EE',
  surfaceRaised: '#FBFCFA',
  ink: '#0C1311',
  inkSoft: '#1F2A26',
  muted: '#5A655F',
  line: '#AEB8B1',
  lineSoft: 'rgba(12, 19, 17, 0.075)',
  lineHair: 'rgba(12, 19, 17, 0.12)',
  focus: '#14352F',
  focusSoft: '#254F45',
  accent: '#C2A668',
  accentSoft: '#D7C496',
  accentHot: '#E9D8A8',
  accentDeep: '#9E8550',
  session: '#070F0C',
  sessionMid: '#0F1B17',
  sessionSoft: '#183530',
  danger: '#7A3535',
  white: '#F8F9F6',
  whiteMuted: 'rgba(248, 249, 246, 0.72)',
  whiteSoft: 'rgba(248, 249, 246, 0.55)',
  // legacy aliases
  pine: '#14352F',
  pineSoft: '#254F45',
  gold: '#C2A668',
  goldSoft: '#D7C496',
};

export const gradients = {
  screen: ['#F6F9F5', '#E7ECE8', '#CCD5CE'] as const,
  screenWarmEdge: ['rgba(233, 216, 168, 0.22)', 'rgba(231, 236, 232, 0)'] as const,
  hero: ['#070F0C', '#0F1B17', '#183530'] as const,
  heroSheen: ['rgba(233, 216, 168, 0.2)', 'rgba(233, 216, 168, 0.02)', 'transparent'] as const,
  session: ['#070F0C', '#0D1814', '#183530'] as const,
  sessionSheen: ['rgba(233, 216, 168, 0.14)', 'transparent'] as const,
  lumenBtn: ['#F0E2B8', '#E0C98A', '#CDB574'] as const,
  primaryBtn: ['#1A4038', '#14352F', '#0F2A25'] as const,
  goldBtn: ['#E4D3A4', '#D4C08E'] as const,
  beacon: ['#183530', '#0F1B17'] as const,
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
  md: 14,
  lg: 18,
  xl: 26,
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
  brand: { size: 52, line: 54, tracking: 0.4 },
  brandLg: { size: 60, line: 62, tracking: 0.3 },
  display: { size: 36, line: 40, tracking: 0.15 },
  displaySm: { size: 28, line: 34, tracking: 0.1 },
  body: { size: 16.5, line: 27 },
  bodyLg: { size: 18, line: 30 },
  ui: { size: 15, line: 20, tracking: 0.15 },
  label: { size: 11, line: 14, tracking: 2.1 },
  meta: { size: 12.5, line: 17, tracking: 0.35 },
};

/** Soft, editorial elevation — never stacked neon glows */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  soft: {
    shadowColor: '#0C1311',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  lift: {
    shadowColor: '#0C1311',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 6,
  },
  press: {
    shadowColor: '#0C1311',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  gold: {
    shadowColor: '#8A7340',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 5,
  },
  ink: {
    shadowColor: '#07110E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const motion = {
  enter: 700,
  slow: 900,
  pulse: 1400,
  press: 160,
  spring: { damping: 18, stiffness: 220, mass: 0.85 },
};
