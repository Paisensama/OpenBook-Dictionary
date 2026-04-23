export type AppThemeMode = 'sunny' | 'night';

export interface AppPalette {
  mode: AppThemeMode;
  label: string;
  background: string;
  surface: string;
  elevated: string;
  text: string;
  mutedText: string;
  border: string;
  primary: string;
  primaryText: string;
  accent: string;
  accentSoft: string;
  danger: string;
  tabBar: string;
  tabInactive: string;
  statusBar: 'light' | 'dark';
}

export const palettes: Record<AppThemeMode, AppPalette> = {
  sunny: {
    mode: 'sunny',
    label: 'Sunny',
    background: '#F7F4EC',
    surface: '#FFFFFF',
    elevated: '#F1ECDF',
    text: '#1D2430',
    mutedText: '#626C7E',
    border: '#E2DAC8',
    primary: '#F59E0B',
    primaryText: '#1F1502',
    accent: '#FFB020',
    accentSoft: '#FFF4D9',
    danger: '#D13C3C',
    tabBar: '#FFFFFF',
    tabInactive: '#7C8597',
    statusBar: 'dark',
  },
  night: {
    mode: 'night',
    label: 'Night',
    background: '#0F1420',
    surface: '#151B29',
    elevated: '#1B2334',
    text: '#F3F6FF',
    mutedText: '#A0AEC7',
    border: '#2A3348',
    primary: '#FFAD1F',
    primaryText: '#1A1203',
    accent: '#FFC24F',
    accentSoft: '#332911',
    danger: '#FF6B6B',
    tabBar: '#121826',
    tabInactive: '#7F8AA0',
    statusBar: 'light',
  },
};
