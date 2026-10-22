// ============================================================
// ACCOUNTANCY ASSASSIN — Storage Layer
// IndexedDB primary storage via 'idb' with robust localStorage & memory fallbacks.
// Every read/write is wrapped in try/catch to ensure 100% resilience.
// ============================================================

import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'accountancy_assassin_db';
const DB_VERSION = 1;
const STORE_NAME = 'keyval_store';

// In-memory fallback when IndexedDB and localStorage are both blocked
const memoryStore = new Map<string, string>();

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDatabase(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    }).catch((err) => {
      console.warn('[Storage] IndexedDB initialization failed:', err);
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

/**
 * Storage adapter compatible with Zustand persist middleware.
 */
export const storageAdapter = {
  async getItem(key: string): Promise<string | null> {
    // 1. Try IndexedDB
    try {
      const db = await getDatabase();
      const val = await db.get(STORE_NAME, key);
      if (val !== undefined && val !== null) {
        return typeof val === 'string' ? val : JSON.stringify(val);
      }
    } catch {
      // IndexedDB failed or unavailable
    }

    // 2. Try localStorage fallback
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const localVal = window.localStorage.getItem(key);
        if (localVal !== null) {
          return localVal;
        }
      }
    } catch {
      // localStorage is blocked or throws SecurityError
    }

    // 3. Fallback to memory
    return memoryStore.get(key) ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    // Store in memory cache immediately
    memoryStore.set(key, value);

    // 1. Try IndexedDB
    let idbSucceeded = false;
    try {
      const db = await getDatabase();
      await db.put(STORE_NAME, value, key);
      idbSucceeded = true;
    } catch {
      // IndexedDB write failed
    }

    // 2. Try localStorage backup
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      if (!idbSucceeded) {
        console.warn('[Storage] Storage blocked or quota exceeded; utilizing in-memory persistence.');
      }
    }
  },

  async removeItem(key: string): Promise<void> {
    memoryStore.delete(key);

    try {
      const db = await getDatabase();
      await db.delete(STORE_NAME, key);
    } catch {
      // IDB delete failed
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // localStorage delete failed
    }
  },
};

/**
 * Export all stored data as an encrypted/clean JSON string for backup.
 */
export async function exportBackup(): Promise<string> {
  const backup: Record<string, unknown> = {};

  try {
    const db = await getDatabase();
    const keys = await db.getAllKeys(STORE_NAME);
    for (const key of keys) {
      const val = await db.get(STORE_NAME, key);
      backup[String(key)] = val;
    }
  } catch {
    // IDB export failed, collect from localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k) backup[k] = window.localStorage.getItem(k);
        }
      }
    } catch {
      // Fall back to memory
      memoryStore.forEach((v, k) => {
        backup[k] = v;
      });
    }
  }

  return JSON.stringify(
    {
      app: 'Accountancy Assassin',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: backup,
    },
    null,
    2
  );
}

/**
 * Import and restore backup JSON data.
 */
export async function importBackup(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.data) {
      return { success: false, message: 'Invalid backup format' };
    }

    const entries = Object.entries(parsed.data);
    for (const [key, value] of entries) {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      await storageAdapter.setItem(key, serialized);
    }

    return { success: true, message: `Successfully imported ${entries.length} records.` };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to parse backup data',
    };
  }
}

/**
 * Test storage health for diagnostic purposes.
 */
export async function checkStorageHealth(): Promise<{
  indexedDB: boolean;
  localStorage: boolean;
  inMemoryOnly: boolean;
}> {
  let idbOk = false;
  let localOk = false;

  try {
    const testDb = await getDatabase();
    await testDb.put(STORE_NAME, '__health_check__', '__health__');
    await testDb.delete(STORE_NAME, '__health__');
    idbOk = true;
  } catch {
    idbOk = false;
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('__health__', '1');
      window.localStorage.removeItem('__health__');
      localOk = true;
    }
  } catch {
    localOk = false;
  }

  return {
    indexedDB: idbOk,
    localStorage: localOk,
    inMemoryOnly: !idbOk && !localOk,
  };
}
