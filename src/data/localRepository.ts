// A generic localStorage-backed repository. This is the ENTIRE swap point
// for moving to a real multi-tenant backend (e.g. Supabase) later — every
// screen talks to a Repository<T>, never to localStorage directly, so
// replacing this file's implementation with real network calls should not
// require touching any component.

export interface Repository<T extends { id: string }> {
  getAll(): T[];
  getById(id: string): T | undefined;
  create(item: T): T;
  update(id: string, patch: Partial<T>): T | undefined;
  remove(id: string): void;
  replaceAll(items: T[]): void;
  subscribe(listener: () => void): () => void;
}

const NAMESPACE = "dezavu:v1:";

function readAll<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(NAMESPACE + key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeAll<T>(key: string, items: T[]) {
  window.localStorage.setItem(NAMESPACE + key, JSON.stringify(items));
}

export function createLocalRepository<T extends { id: string }>(key: string): Repository<T> {
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((l) => l());

  return {
    getAll: () => readAll<T>(key),
    getById: (id) => readAll<T>(key).find((item) => item.id === id),
    create: (item) => {
      const items = readAll<T>(key);
      items.push(item);
      writeAll(key, items);
      notify();
      return item;
    },
    update: (id, patch) => {
      const items = readAll<T>(key);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return undefined;
      items[index] = { ...items[index], ...patch };
      writeAll(key, items);
      notify();
      return items[index];
    },
    remove: (id) => {
      const items = readAll<T>(key).filter((item) => item.id !== id);
      writeAll(key, items);
      notify();
    },
    replaceAll: (items) => {
      writeAll(key, items);
      notify();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
