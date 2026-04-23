import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChromaticBackdrop } from '@/components/chromatic-backdrop';
import { ThemeToggleChip } from '@/components/theme-toggle-chip';
import type { AppPalette } from '@/constants/app-theme';
import { useUITheme } from '@/context/ui-theme-context';
import { safeGetItem, safeSetItem } from '@/lib/storage/safe-storage';

type DifficultyKey = 'easy' | 'medium' | 'hard';

interface CellCoord {
  row: number;
  col: number;
}

interface PlacedWord {
  word: string;
  cells: CellCoord[];
}

interface Puzzle {
  grid: string[][];
  words: PlacedWord[];
  signature: string;
}

interface RunStats {
  score: number;
  streak: number;
  level: number;
  completedLevels: number;
  bestScore: number;
  bestStreak: number;
  bestLevel: number;
  difficulty: DifficultyKey;
}

interface DifficultyConfig {
  gridSize: number;
  wordCount: number;
  minLength: number;
  maxLength: number;
  directions: CellCoord[];
}

const STORAGE_KEY = 'offline-dictionary:word-play-stats';

const WORD_POOL = [
  'algorithm',
  'array',
  'binary',
  'cache',
  'compile',
  'context',
  'debug',
  'deploy',
  'dictionary',
  'enqueue',
  'framework',
  'graph',
  'index',
  'iterate',
  'latency',
  'memoize',
  'optimize',
  'queue',
  'reduce',
  'trie',
  'anchor',
  'beacon',
  'canvas',
  'dragon',
  'ember',
  'forest',
  'galaxy',
  'harbor',
  'island',
  'jungle',
  'kernel',
  'legend',
  'matrix',
  'nebula',
  'oasis',
  'planet',
  'quartz',
  'rocket',
  'signal',
  'turbo',
  'update',
  'vector',
  'wizard',
  'xenon',
  'yellow',
  'zenith',
  'action',
  'adventure',
  'puzzle',
  'search',
  'crossword',
  'letter',
  'random',
  'streak',
  'level',
  'scoreboard',
  'challenge',
  'victory',
  'pattern',
  'wildcard',
  'history',
  'favorite',
  'syllable',
  'pronounce',
  'meaning',
  'example',
  'network',
  'offline',
  'storage',
  'package',
  'feature',
  'gaming',
  'player',
  'master',
  'solver',
  'searching',
  'builder',
  'reactive',
  'native',
];

const DIFFICULTY_CONFIG: Record<DifficultyKey, DifficultyConfig> = {
  easy: {
    gridSize: 8,
    wordCount: 5,
    minLength: 4,
    maxLength: 7,
    directions: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
  },
  medium: {
    gridSize: 10,
    wordCount: 7,
    minLength: 5,
    maxLength: 8,
    directions: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: -1, col: 1 },
    ],
  },
  hard: {
    gridSize: 12,
    wordCount: 9,
    minLength: 6,
    maxLength: 10,
    directions: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: -1, col: 1 },
      { row: 0, col: -1 },
      { row: -1, col: 0 },
      { row: -1, col: -1 },
      { row: 1, col: -1 },
    ],
  },
};

const DEFAULT_STATS: RunStats = {
  score: 0,
  streak: 0,
  level: 1,
  completedLevels: 0,
  bestScore: 0,
  bestStreak: 0,
  bestLevel: 1,
  difficulty: 'easy',
};

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function shuffle<T>(source: T[]): T[] {
  const output = [...source];
  for (let i = output.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    const temp = output[i];
    output[i] = output[j];
    output[j] = temp;
  }
  return output;
}

function inBounds(size: number, row: number, col: number): boolean {
  return row >= 0 && row < size && col >= 0 && col < size;
}

function tryPlaceWord(
  grid: string[][],
  word: string,
  direction: CellCoord,
  startRow: number,
  startCol: number
): CellCoord[] | null {
  const cells: CellCoord[] = [];
  for (let i = 0; i < word.length; i += 1) {
    const row = startRow + i * direction.row;
    const col = startCol + i * direction.col;
    if (!inBounds(grid.length, row, col)) {
      return null;
    }
    const existing = grid[row][col];
    if (existing && existing !== word[i]) {
      return null;
    }
    cells.push({ row, col });
  }

  for (let i = 0; i < cells.length; i += 1) {
    const cell = cells[i];
    grid[cell.row][cell.col] = word[i];
  }
  return cells;
}

function generatePuzzle(config: DifficultyConfig, avoidSignature?: string, attempt = 0): Puzzle {
  const size = config.gridSize;
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
  const candidates = shuffle(
    WORD_POOL.filter((word) => word.length >= config.minLength && word.length <= config.maxLength)
  );

  const words: PlacedWord[] = [];
  for (const candidateRaw of candidates) {
    if (words.length >= config.wordCount) {
      break;
    }
    const candidate = candidateRaw.toUpperCase();
    let placed: PlacedWord | null = null;
    const shuffledDirections = shuffle(config.directions);

    for (const direction of shuffledDirections) {
      for (let i = 0; i < 60; i += 1) {
        const row = randomInt(size);
        const col = randomInt(size);
        const cells = tryPlaceWord(grid, candidate, direction, row, col);
        if (cells) {
          placed = { word: candidate, cells };
          break;
        }
      }
      if (placed) {
        break;
      }
    }

    if (placed) {
      words.push(placed);
    }
  }

  if (words.length < Math.max(3, Math.floor(config.wordCount * 0.7))) {
    if (attempt < 20) {
      return generatePuzzle(config, avoidSignature, attempt + 1);
    }
  }

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!grid[row][col]) {
        grid[row][col] = String.fromCharCode(65 + randomInt(26));
      }
    }
  }

  const signature = `${size}:${words
    .map((item) => `${item.word}@${item.cells[0]?.row ?? 0},${item.cells[0]?.col ?? 0}`)
    .sort()
    .join('|')}`;

  if (avoidSignature && signature === avoidSignature && attempt < 20) {
    return generatePuzzle(config, avoidSignature, attempt + 1);
  }

  return { grid, words, signature };
}

function isAdjacent(a: CellCoord, b: CellCoord): boolean {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return dr <= 1 && dc <= 1 && (dr + dc > 0);
}

function keyOfCell(cell: CellCoord): string {
  return `${cell.row}:${cell.col}`;
}

export default function WordPlayScreen() {
  const { palette } = useUITheme();
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [stats, setStats] = useState<RunStats>(DEFAULT_STATS);
  const [loaded, setLoaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [selectedCells, setSelectedCells] = useState<CellCoord[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [lastSignature, setLastSignature] = useState<string | undefined>(undefined);

  const config = DIFFICULTY_CONFIG[stats.difficulty];
  const boardSizePx = useMemo(() => {
    const raw = Math.min(width - 32, 460);
    return Math.max(280, raw);
  }, [width]);
  const cellSize = useMemo(() => {
    const gaps = (config.gridSize - 1) * 3;
    return Math.floor((boardSizePx - gaps) / config.gridSize);
  }, [boardSizePx, config.gridSize]);

  useEffect(() => {
    const load = async () => {
      const raw = await safeGetItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<RunStats>;
          setStats((prev) => ({
            ...prev,
            ...parsed,
            difficulty:
              parsed.difficulty === 'easy' || parsed.difficulty === 'medium' || parsed.difficulty === 'hard'
                ? parsed.difficulty
                : prev.difficulty,
          }));
        } catch {
          // Ignore corrupt storage and continue with defaults.
        }
      }
      setLoaded(true);
    };
    void load();
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    void safeSetItem(STORAGE_KEY, JSON.stringify(stats));
  }, [loaded, stats]);

  const buildLevel = useCallback(
    (avoidSignature?: string) => {
      const next = generatePuzzle(config, avoidSignature);
      setPuzzle(next);
      setFoundWords(new Set());
      setSelectedCells([]);
      setLastSignature(next.signature);
    },
    [config]
  );

  useEffect(() => {
    if (!loaded) {
      return;
    }
    buildLevel(lastSignature);
  }, [loaded, buildLevel]);

  const foundCellKeys = useMemo(() => {
    if (!puzzle) {
      return new Set<string>();
    }
    const keys = new Set<string>();
    for (const word of puzzle.words) {
      if (!foundWords.has(word.word)) {
        continue;
      }
      for (const cell of word.cells) {
        keys.add(keyOfCell(cell));
      }
    }
    return keys;
  }, [puzzle, foundWords]);

  const selectedWord = useMemo(() => {
    if (!puzzle || selectedCells.length === 0) {
      return '';
    }
    return selectedCells.map((cell) => puzzle.grid[cell.row][cell.col]).join('');
  }, [puzzle, selectedCells]);

  const isLevelComplete = Boolean(puzzle && foundWords.size >= puzzle.words.length && puzzle.words.length > 0);

  const handleDifficulty = (difficulty: DifficultyKey) => {
    setStats((prev) => ({
      ...prev,
      difficulty,
      score: 0,
      streak: 0,
      level: 1,
      completedLevels: 0,
    }));
    setLastSignature(undefined);
  };

  const handleCellPress = (row: number, col: number) => {
    if (!puzzle || isLevelComplete) {
      return;
    }
    const nextCell: CellCoord = { row, col };
    const nextKey = keyOfCell(nextCell);
    const selectedKeys = new Set(selectedCells.map(keyOfCell));

    if (selectedCells.length === 0) {
      setSelectedCells([nextCell]);
      return;
    }

    const lastCell = selectedCells[selectedCells.length - 1];
    if (selectedCells.length > 1) {
      const secondLast = selectedCells[selectedCells.length - 2];
      if (nextKey === keyOfCell(secondLast)) {
        setSelectedCells((prev) => prev.slice(0, -1));
        return;
      }
    }

    if (selectedKeys.has(nextKey)) {
      return;
    }
    if (!isAdjacent(lastCell, nextCell)) {
      setSelectedCells([nextCell]);
      return;
    }

    const nextSelection = [...selectedCells, nextCell];
    setSelectedCells(nextSelection);

    const builtWord = nextSelection.map((cell) => puzzle.grid[cell.row][cell.col]).join('');
    const reversed = builtWord.split('').reverse().join('');
    const match = puzzle.words.find((item) => !foundWords.has(item.word) && (item.word === builtWord || item.word === reversed));
    if (!match) {
      return;
    }

    setFoundWords((prev) => {
      const updated = new Set(prev);
      updated.add(match.word);
      return updated;
    });
    setSelectedCells([]);
    setStats((prev) => ({
      ...prev,
      score: prev.score + match.word.length * 8,
      bestScore: Math.max(prev.bestScore, prev.score + match.word.length * 8),
    }));
  };

  const handleNextLevel = () => {
    if (!puzzle) {
      return;
    }
    const completed = foundWords.size >= puzzle.words.length && puzzle.words.length > 0;
    setStats((prev) => {
      const nextLevel = prev.level + 1;
      const nextCompleted = completed ? prev.completedLevels + 1 : prev.completedLevels;
      const nextStreak = completed ? prev.streak + 1 : 0;
      const bonus = completed ? 60 + prev.level * 10 : 0;
      const nextScore = prev.score + bonus;
      return {
        ...prev,
        level: nextLevel,
        completedLevels: nextCompleted,
        streak: nextStreak,
        score: nextScore,
        bestScore: Math.max(prev.bestScore, nextScore),
        bestStreak: Math.max(prev.bestStreak, nextStreak),
        bestLevel: Math.max(prev.bestLevel, nextLevel),
      };
    });
    buildLevel(lastSignature);
  };

  const handleResetAll = () => {
    const previousSignature = puzzle?.signature;
    setStats({
      ...DEFAULT_STATS,
      difficulty: stats.difficulty,
    });
    setLastSignature(undefined);
    if (previousSignature) {
      buildLevel(previousSignature);
    } else {
      buildLevel(undefined);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ChromaticBackdrop palette={palette} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.topBar}>
            <View style={styles.topBarTextBlock}>
              <Text style={styles.kicker}>GAME HUB</Text>
              <Text style={styles.title}>Word Play</Text>
              <Text style={styles.caption}>Crossword-style Word Search</Text>
            </View>
            <View style={styles.themeChipWrap}>
              <ThemeToggleChip />
            </View>
          </View>

          <View style={styles.scoreCard}>
            <View style={styles.scoreRow}>
              <StatPill label="Score" value={String(stats.score)} palette={palette} />
              <StatPill label="Streak" value={`${stats.streak}`} palette={palette} />
              <StatPill label="Level" value={`${stats.level}`} palette={palette} />
              <StatPill label="Solved" value={`${stats.completedLevels}`} palette={palette} />
            </View>
            <View style={styles.scoreRow}>
              <StatPill label="Best Score" value={`${stats.bestScore}`} palette={palette} compact />
              <StatPill label="Best Streak" value={`${stats.bestStreak}`} palette={palette} compact />
              <StatPill label="Best Level" value={`${stats.bestLevel}`} palette={palette} compact />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Difficulty</Text>
            <View style={styles.difficultyRow}>
              {(['easy', 'medium', 'hard'] as DifficultyKey[]).map((difficulty) => (
                <Pressable
                  key={difficulty}
                  onPress={() => handleDifficulty(difficulty)}
                  style={[
                    styles.difficultyChip,
                    stats.difficulty === difficulty ? styles.difficultyChipActive : null,
                  ]}>
                  <Text
                    style={[
                      styles.difficultyText,
                      stats.difficulty === difficulty ? styles.difficultyTextActive : null,
                    ]}>
                    {difficulty.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.cardText}>
              Grid {config.gridSize}x{config.gridSize} • Hidden words: {puzzle?.words.length ?? 0}
            </Text>
          </View>

        <View style={styles.card}>
          <Pressable style={styles.instructionsHeader} onPress={() => setShowInstructions((prev) => !prev)}>
            <Text style={styles.cardTitle}>How To Play</Text>
            <Text style={styles.toggleText}>{showInstructions ? 'Hide' : 'Show'}</Text>
          </Pressable>
          {showInstructions ? (
            <>
              <Text style={styles.cardText}>1. Look at the target word list below the board.</Text>
              <Text style={styles.cardText}>2. Tap adjacent letters in sequence to build a word.</Text>
              <Text style={styles.cardText}>3. You can build forward or reverse direction.</Text>
              <Text style={styles.cardText}>4. Find all hidden words to clear the level and keep your streak.</Text>
              <Text style={styles.cardText}>5. Reset clears score/streak/levels and reshuffles words.</Text>
            </>
          ) : null}
        </View>

        <View style={styles.boardCard}>
          {puzzle ? (
            <>
              <View style={[styles.board, { width: boardSizePx }]}>
                {puzzle.grid.map((rowLetters, rowIndex) => (
                  <View key={`row-${rowIndex}`} style={styles.gridRow}>
                    {rowLetters.map((letter, colIndex) => {
                      const cellKey = `${rowIndex}:${colIndex}`;
                      const selected = selectedCells.some((cell) => cell.row === rowIndex && cell.col === colIndex);
                      const found = foundCellKeys.has(cellKey);
                      return (
                        <Pressable
                          key={cellKey}
                          onPress={() => handleCellPress(rowIndex, colIndex)}
                          style={[
                            styles.cell,
                            { width: cellSize, height: cellSize },
                            found ? styles.foundCell : null,
                            selected ? styles.selectedCell : null,
                          ]}>
                          <Text style={[styles.cellText, found ? styles.foundCellText : null]}>{letter}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ))}
              </View>

              <Text style={styles.currentWord}>Current Selection: {selectedWord || '---'}</Text>
              <View style={styles.wordListWrap}>
                {puzzle.words.map((item) => (
                  <View key={item.word} style={[styles.wordChip, foundWords.has(item.word) ? styles.wordChipDone : null]}>
                    <Text style={[styles.wordChipText, foundWords.has(item.word) ? styles.wordChipTextDone : null]}>
                      {item.word}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.cardText}>Generating puzzle...</Text>
          )}
        </View>

        <View style={styles.actionRow}>
          <Pressable style={[styles.actionButton, styles.shuffleButton]} onPress={() => buildLevel(lastSignature)}>
            <Text style={styles.shuffleButtonText}>Shuffle Level</Text>
          </Pressable>
          {isLevelComplete ? (
            <Pressable style={[styles.actionButton, styles.nextButton]} onPress={handleNextLevel}>
              <Text style={styles.nextButtonText}>Next Level</Text>
            </Pressable>
          ) : (
            <Pressable style={[styles.actionButton, styles.nextButton]} onPress={handleNextLevel}>
              <Text style={styles.nextButtonText}>Skip To Next</Text>
            </Pressable>
          )}
          <Pressable style={[styles.actionButton, styles.resetButton]} onPress={handleResetAll}>
            <Text style={styles.resetButtonText}>Reset All</Text>
          </Pressable>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(palette: AppPalette) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: palette.background },
    scrollContent: { paddingBottom: 120 },
    container: { paddingHorizontal: 16, paddingTop: 14, gap: 12 },
    topBar: {
      backgroundColor: palette.mode === 'night' ? '#1A2233F2' : '#FFFFFFF0',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 18,
      paddingVertical: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      transform: [{ translateY: -1 }],
      ...cardShadow(palette),
    },
    topBarTextBlock: { flex: 1, minWidth: 0, paddingRight: 8 },
    themeChipWrap: { alignSelf: 'flex-start' },
    kicker: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2, color: palette.primary },
    title: { fontSize: 30, fontWeight: '900', color: palette.text, lineHeight: 34 },
    caption: { color: palette.mutedText, marginTop: 4, fontWeight: '700', fontSize: 15 },
    scoreCard: {
      backgroundColor: palette.mode === 'night' ? '#1A2233F4' : '#FFFFFFF5',
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 12,
      gap: 8,
      ...cardShadow(palette),
    },
    scoreRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    card: {
      backgroundColor: palette.mode === 'night' ? '#1A2233F4' : '#FFFFFFF5',
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: palette.border,
      gap: 8,
      ...cardShadow(palette),
    },
    cardTitle: { color: palette.text, fontSize: 18, fontWeight: '900' },
    cardText: { color: palette.mutedText, fontSize: 14, lineHeight: 21 },
    difficultyRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    difficultyChip: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.elevated,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    difficultyChipActive: {
      backgroundColor: palette.primary,
      borderColor: palette.primary,
    },
    difficultyText: {
      color: palette.text,
      fontWeight: '800',
      fontSize: 12,
    },
    difficultyTextActive: {
      color: palette.primaryText,
    },
    instructionsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    toggleText: {
      color: palette.primary,
      fontWeight: '800',
      fontSize: 12,
    },
    boardCard: {
      backgroundColor: palette.mode === 'night' ? '#1A2233F4' : '#FFFFFFF5',
      borderRadius: 20,
      padding: 12,
      borderWidth: 1,
      borderColor: palette.border,
      gap: 10,
      ...cardShadow(palette),
    },
    board: {
      alignSelf: 'center',
      gap: 3,
    },
    gridRow: {
      flexDirection: 'row',
      gap: 3,
    },
    cell: {
      borderRadius: 6,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.elevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedCell: {
      backgroundColor: palette.primary,
      borderColor: palette.primary,
    },
    foundCell: {
      backgroundColor: palette.accentSoft,
      borderColor: palette.accent,
    },
    cellText: {
      color: palette.text,
      fontWeight: '900',
      fontSize: 12.5,
    },
    foundCellText: {
      color: palette.accent,
    },
    currentWord: {
      color: palette.text,
      fontWeight: '800',
      fontSize: 13,
      textAlign: 'center',
    },
    wordListWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
    },
    wordChip: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.elevated,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    wordChipDone: {
      borderColor: palette.primary,
      backgroundColor: palette.accentSoft,
    },
    wordChipText: {
      color: palette.text,
      fontWeight: '800',
      fontSize: 11.5,
    },
    wordChipTextDone: {
      color: palette.primary,
      textDecorationLine: 'line-through',
    },
    actionRow: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },
    shuffleButton: {
      backgroundColor: palette.surface,
      borderColor: palette.border,
    },
    shuffleButtonText: {
      color: palette.text,
      fontWeight: '800',
      fontSize: 12,
    },
    nextButton: {
      backgroundColor: palette.primary,
      borderColor: palette.primary,
    },
    nextButtonText: {
      color: palette.primaryText,
      fontWeight: '900',
      fontSize: 12,
    },
    resetButton: {
      backgroundColor: palette.surface,
      borderColor: palette.danger,
    },
    resetButtonText: {
      color: palette.danger,
      fontWeight: '900',
      fontSize: 12,
    },
  });
}

function StatPill({
  label,
  value,
  palette,
  compact = false,
}: {
  label: string;
  value: string;
  palette: AppPalette;
  compact?: boolean;
}) {
  return (
    <View
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: palette.border,
        backgroundColor: palette.elevated,
        paddingHorizontal: compact ? 8 : 10,
        paddingVertical: compact ? 7 : 8,
        minWidth: compact ? 86 : 74,
        flex: compact ? 1 : undefined,
      }}>
      <Text style={{ color: palette.mutedText, fontSize: 10.5, fontWeight: '700' }}>{label}</Text>
      <Text style={{ color: palette.text, fontSize: compact ? 14 : 16, fontWeight: '900', marginTop: 1 }}>
        {value}
      </Text>
    </View>
  );
}

function cardShadow(palette: AppPalette) {
  return Platform.select({
    ios: {
      shadowColor: palette.mode === 'night' ? '#000000' : '#0A1A36',
      shadowOpacity: palette.mode === 'night' ? 0.38 : 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
    },
    android: {
      elevation: palette.mode === 'night' ? 6 : 8,
    },
    default: {
      shadowColor: palette.mode === 'night' ? '#000000' : '#0A1A36',
      shadowOpacity: palette.mode === 'night' ? 0.34 : 0.1,
      shadowRadius: 15,
      shadowOffset: { width: 0, height: 8 },
    },
  });
}
