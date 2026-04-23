import type { DictionaryEntry, PartOfSpeech } from '@/types/dictionary';

interface DictionaryApiDefinition {
  definition?: string;
  example?: string;
}

interface DictionaryApiMeaning {
  partOfSpeech?: string;
  definitions?: DictionaryApiDefinition[];
}

interface DictionaryApiPhonetic {
  text?: string;
}

interface DictionaryApiEntry {
  word?: string;
  phonetic?: string;
  phonetics?: DictionaryApiPhonetic[];
  meanings?: DictionaryApiMeaning[];
}

const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

function mapPartOfSpeech(raw: string | undefined): PartOfSpeech {
  const normalized = (raw ?? '').toLowerCase().trim();
  if (normalized === 'noun') return 'noun';
  if (normalized === 'verb') return 'verb';
  if (normalized === 'adjective') return 'adjective';
  if (normalized === 'adverb') return 'adverb';
  if (normalized === 'pronoun') return 'pronoun';
  if (normalized === 'preposition') return 'preposition';
  if (normalized === 'conjunction') return 'conjunction';
  if (normalized === 'interjection' || normalized === 'exclamation') return 'interjection';
  return 'other';
}

function splitSyllables(word: string): string[] {
  const normalized = word.toLowerCase().trim();
  if (!normalized) {
    return [word];
  }

  const parts: string[] = [];
  let start = 0;
  let index = 0;

  while (index < normalized.length) {
    if (/[aeiouy]/.test(normalized[index])) {
      let j = index + 1;
      while (j < normalized.length && /[aeiouy]/.test(normalized[j])) {
        j += 1;
      }
      const nextConsonantStart = j;
      while (j < normalized.length && !/[aeiouy]/.test(normalized[j])) {
        j += 1;
      }
      const splitAt = nextConsonantStart + Math.min(1, Math.max(0, j - nextConsonantStart));
      if (splitAt > start && splitAt < normalized.length) {
        parts.push(normalized.slice(start, splitAt));
        start = splitAt;
      }
      index = j;
      continue;
    }
    index += 1;
  }

  if (start < normalized.length) {
    parts.push(normalized.slice(start));
  }

  return parts.length > 0 ? parts : [normalized];
}

function toEntry(raw: DictionaryApiEntry, requestedWord: string): DictionaryEntry | null {
  const word = (raw.word ?? requestedWord).toLowerCase().trim();
  if (!word) {
    return null;
  }

  const firstMeaning = raw.meanings?.[0];
  const allDefinitions = (raw.meanings ?? [])
    .flatMap((meaning) => meaning.definitions ?? [])
    .map((definition) => definition.definition?.trim())
    .filter((text): text is string => Boolean(text));

  const definition = allDefinitions[0] ?? `Definition for "${word}" was not provided by the API.`;
  const details =
    allDefinitions.length > 1
      ? allDefinitions
          .slice(1, 4)
          .map((item, index) => `${index + 2}. ${item}`)
          .join('\n')
      : undefined;

  const apiExample = firstMeaning?.definitions?.find((item) => item.example)?.example?.trim();
  const example = apiExample ? `Example: "${apiExample}"` : undefined;

  const pronunciation =
    raw.phonetic?.trim() ||
    raw.phonetics?.find((item) => item.text?.trim())?.text?.trim() ||
    undefined;
  const syllables = splitSyllables(word);

  return {
    word,
    definition,
    partOfSpeech: mapPartOfSpeech(firstMeaning?.partOfSpeech),
    details,
    example,
    usageTip: 'Tip: Online entry from DictionaryAPI; phrasing may differ from offline corpus.',
    pronunciation,
    syllables,
  };
}

export async function fetchDictionaryApiEntry(word: string): Promise<DictionaryEntry | null> {
  const normalized = word.toLowerCase().trim();
  if (!normalized) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(normalized)}`);
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as unknown;
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }
    return toEntry(data[0] as DictionaryApiEntry, normalized);
  } catch {
    return null;
  }
}
