/** Contemplative focus — Headspace calm + Reveri ritual, without wellness clichés. */
export const colors = {
  bg: '#E8E4DC',
  bgMid: '#E0DBD2',
  bgDeep: '#D9D3C8',
  surface: '#F3EFE7',
  surfaceGlass: 'rgba(243, 239, 231, 0.82)',
  ink: '#1A1F1C',
  inkSoft: '#3A423C',
  muted: '#6E736C',
  line: '#C9C2B6',
  focus: '#2F4A3F',
  focusSoft: '#3E6354',
  accent: '#C4A35A',
  accentSoft: '#DCC894',
  session: '#1E2A26',
  sessionMid: '#243530',
  sessionSoft: '#2F4A3F',
  danger: '#8B3F3F',
  white: '#F7F5F0',
  // aliases kept for gradual migration
  pine: '#2F4A3F',
  pineSoft: '#3E6354',
  gold: '#C4A35A',
  goldSoft: '#DCC894',
};

export const gradients = {
  screen: ['#EFEBE3', '#E8E4DC', '#D9D3C8'] as const,
  session: ['#1E2A26', '#243530', '#2F4A3F'] as const,
  beacon: ['#3E6354', '#2F4A3F'] as const,
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
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const fonts = {
  display: 'CormorantGaramond_600SemiBold',
  displayItalic: 'CormorantGaramond_500Medium_Italic',
  body: 'Literata_400Regular',
  bodyMedium: 'Literata_500Medium',
  bodyItalic: 'Literata_400Regular_Italic',
  ui: 'DMSans_400Regular',
  uiMedium: 'DMSans_500Medium',
  uiBold: 'DMSans_700Bold',
};

export const motion = {
  enter: 560,
  slow: 700,
  pulse: 900,
};
