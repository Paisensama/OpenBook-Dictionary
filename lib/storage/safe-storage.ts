import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryFallback = new Map<string, string>();

function useFallback(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.toLowerCase().includes('native module is null');
}

export async function safeGetItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    if (useFallback(error)) {
      return memoryFallback.get(key) ?? null;
    }
    throw error;
  }
}

export async function safeSetItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    if (useFallback(error)) {
      memoryFallback.set(key, value);
      return;
    }
    throw error;
  }
}
