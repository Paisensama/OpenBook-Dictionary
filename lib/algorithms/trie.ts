import type { DictionaryEntry } from '@/types/dictionary';

class TrieNode {
  public readonly children = new Map<string, TrieNode>();

  public isWord = false;

  public entry: DictionaryEntry | null = null;
}

function sortedKeys(node: TrieNode): string[] {
  return [...node.children.keys()].sort((a, b) => a.localeCompare(b));
}

export class Trie {
  private readonly root = new TrieNode();

  insert(word: string, entry: DictionaryEntry): void {
    const normalized = word.toLowerCase().trim();
    if (!normalized) {
      return;
    }

    let cursor = this.root;
    for (const char of normalized) {
      if (!cursor.children.has(char)) {
        cursor.children.set(char, new TrieNode());
      }
      cursor = cursor.children.get(char)!;
    }

    cursor.isWord = true;
    cursor.entry = entry;
  }

  search(word: string): DictionaryEntry | null {
    const node = this.findNode(word.toLowerCase().trim());
    if (!node || !node.isWord) {
      return null;
    }
    return node.entry;
  }

  autocomplete(prefix: string, limit = 20): DictionaryEntry[] {
    const normalized = prefix.toLowerCase().trim();
    const startNode = this.findNode(normalized);
    if (!startNode) {
      return [];
    }

    const results: DictionaryEntry[] = [];
    this.collectWords(startNode, results, limit);
    return results;
  }

  wildcardSearch(pattern: string, wildcard = '_', limit = 20): DictionaryEntry[] {
    const normalized = pattern.toLowerCase().replace(/\s+/g, '').trim();
    if (!normalized) {
      return [];
    }

    const results: DictionaryEntry[] = [];
    const seen = new Set<string>();
    const singleWildcards = new Set<string>([wildcard, '?']);

    const pushResult = (entry: DictionaryEntry) => {
      if (seen.has(entry.word)) {
        return;
      }
      seen.add(entry.word);
      results.push(entry);
    };

    const visit = (node: TrieNode, index: number) => {
      if (results.length >= limit) {
        return;
      }

      if (index === normalized.length) {
        if (node.isWord && node.entry) {
          pushResult(node.entry);
        }
        return;
      }

      const current = normalized[index];
      if (current === '*') {
        // '*' can match zero characters.
        visit(node, index + 1);
        // '*' can also consume one or more characters.
        for (const key of sortedKeys(node)) {
          const next = node.children.get(key);
          if (next) {
            visit(next, index);
          }
        }
        return;
      }

      if (singleWildcards.has(current)) {
        for (const key of sortedKeys(node)) {
          const next = node.children.get(key);
          if (next) {
            visit(next, index + 1);
          }
        }
        return;
      }

      const next = node.children.get(current);
      if (!next) {
        return;
      }
      visit(next, index + 1);
    };

    visit(this.root, 0);
    return results;
  }

  private findNode(fragment: string): TrieNode | null {
    let cursor = this.root;
    for (const char of fragment) {
      const next = cursor.children.get(char);
      if (!next) {
        return null;
      }
      cursor = next;
    }
    return cursor;
  }

  private collectWords(node: TrieNode, out: DictionaryEntry[], limit: number): void {
    if (out.length >= limit) {
      return;
    }

    if (node.isWord && node.entry) {
      out.push(node.entry);
    }

    for (const key of sortedKeys(node)) {
      if (out.length >= limit) {
        break;
      }
      const next = node.children.get(key);
      if (next) {
        this.collectWords(next, out, limit);
      }
    }
  }
}
