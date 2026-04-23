import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { AppPalette, AppThemeMode } from '@/constants/app-theme';
import { palettes } from '@/constants/app-theme';
import { safeGetItem, safeSetItem } from '@/lib/storage/safe-storage';

const STORAGE_KEY = 'offline-dictionary:ui-theme';

interface UIThemeContextValue {
  mode: AppThemeMode;
  palette: AppPalette;
  setMode: (mode: AppThemeMode) => Promise<void>;
  toggleMode: () => Promise<void>;
}

const UIThemeContext = createContext<UIThemeContextValue | null>(null);

export function UIThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppThemeMode>('sunny');

  useEffect(() => {
    const load = async () => {
      const raw = await safeGetItem(STORAGE_KEY);
      if (raw === 'sunny' || raw === 'night') {
        setModeState(raw);
      }
    };
    void load();
  }, []);

  const value = useMemo<UIThemeContextValue>(
    () => ({
      mode,
      palette: palettes[mode],
      setMode: async (nextMode: AppThemeMode) => {
        setModeState(nextMode);
        await safeSetItem(STORAGE_KEY, nextMode);
      },
      toggleMode: async () => {
        const next = mode === 'sunny' ? 'night' : 'sunny';
        setModeState(next);
        await safeSetItem(STORAGE_KEY, next);
      },
    }),
    [mode]
  );

  return <UIThemeContext.Provider value={value}>{children}</UIThemeContext.Provider>;
}

export function useUITheme(): UIThemeContextValue {
  const context = useContext(UIThemeContext);
  if (!context) {
    throw new Error('useUITheme must be used within UIThemeProvider');
  }
  return context;
}
