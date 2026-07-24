/**
 * LUMEN — quiet brilliance for study.
 * Cool mist field + deep atelier ink + champagne accent.
 * Avoids wellness orange, violet glow, and flat “app gray”.
 */
export const colors = {
  bg: '#E9EEEA',
  bgMid: '#DCE3DD',
  bgDeep: '#CDD6CF',
  wash: '#F6F8F5',
  surface: '#F0F3EF',
  surfaceRaised: '#FAFBF8',
  ink: '#0E1513',
  inkSoft: '#24302C',
  muted: '#5E6964',
  line: '#B4BDB6',
  lineSoft: 'rgba(14, 21, 19, 0.07)',
  focus: '#163A33',
  focusSoft: '#275247',
  accent: '#C4A86A',
  accentSoft: '#D9C79A',
  accentHot: '#E8D7A6',
  session: '#08110E',
  sessionMid: '#101C18',
  sessionSoft: '#1A3A33',
  danger: '#7A3535',
  white: '#F7F8F5',
  // legacy aliases
  pine: '#163A33',
  pineSoft: '#275247',
  gold: '#C4A86A',
  goldSoft: '#D9C79A',
};

export const gradients = {
  screen: ['#F5F8F4', '#E9EEEA', '#D0D9D1'] as const,
  screenWarmEdge: ['rgba(232, 215, 166, 0.28)', 'rgba(233, 238, 234, 0)'] as const,
  hero: ['#08110E', '#101C18', '#1A3A33'] as const,
  heroSheen: ['rgba(232, 215, 166, 0.18)', 'rgba(232, 215, 166, 0)'] as const,
  session: ['#08110E', '#0E1915', '#1A3A33'] as const,
  beacon: ['#1A3A33', '#101C18'] as const,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
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
  uiBold: 'Manrope_700Bold',
};

export const motion = {
  enter: 640,
  slow: 820,
  pulse: 1100,
};
