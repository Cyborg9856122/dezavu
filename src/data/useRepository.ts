import { useEffect, useState } from "react";
import type { Repository } from "./localRepository";

/** Re-renders whenever the given repository changes — poor man's live query. */
export function useRepositoryAll<T extends { id: string }>(repo: Repository<T>): T[] {
  const [items, setItems] = useState<T[]>(() => repo.getAll());

  useEffect(() => {
    setItems(repo.getAll());
    return repo.subscribe(() => setItems(repo.getAll()));
  }, [repo]);

  return items;
}
