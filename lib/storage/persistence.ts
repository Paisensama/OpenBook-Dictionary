import { safeGetItem, safeSetItem } from '@/lib/storage/safe-storage';

const KEY_PREFIX = 'offline-dictionary';

export const StorageKeys = {
  favorites: `${KEY_PREFIX}:favorites`,
  history: `${KEY_PREFIX}:history`,
  wordOfDayDate: `${KEY_PREFIX}:word-of-day-date`,
  wordOfDayWord: `${KEY_PREFIX}:word-of-day-word`,
} as const;

export async function readStringArray(key: string): Promise<string[]> {
  const raw = await safeGetItem(key);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return [];
  }
}

export async function writeStringArray(key: string, values: string[]): Promise<void> {
  await safeSetItem(key, JSON.stringify(values));
}
