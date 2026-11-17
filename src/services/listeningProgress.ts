export type ListeningSaved = { storageUnreadable?: boolean; solved: Record<string, string[]>; awarded: string[] };

function readable(parsed: unknown): boolean {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;
  const value = parsed as Record<string, unknown>;
  return (value.solved === undefined || (!!value.solved && typeof value.solved === 'object' && !Array.isArray(value.solved) && Object.values(value.solved).every(ids => Array.isArray(ids) && ids.every(id => typeof id === 'string')))) &&
    (value.awarded === undefined || (Array.isArray(value.awarded) && value.awarded.every(id => typeof id === 'string')));
}

export function loadListeningProgress(key: string): ListeningSaved {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { solved: {}, awarded: [], storageUnreadable: true };
    const value = parsed as Partial<ListeningSaved>;
    const solved = value.solved && typeof value.solved === 'object' && !Array.isArray(value.solved)
      ? Object.fromEntries(Object.entries(value.solved).filter(([, ids]) => Array.isArray(ids))
        .map(([lesson, ids]) => [lesson, [...new Set(ids.filter((id): id is string => typeof id === 'string'))]])) : {};
    return { ...(!readable(parsed) ? { storageUnreadable: true } : {}), solved, awarded: Array.isArray(value.awarded) ? [...new Set(value.awarded.filter((id): id is string => typeof id === 'string'))] : [] };
  } catch { return { solved: {}, awarded: [], storageUnreadable: true }; }
}

export function saveListeningProgress(key: string, saved: ListeningSaved): boolean {
  if (saved.storageUnreadable) return false;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null && !readable(JSON.parse(raw))) return false;
    localStorage.setItem(key, JSON.stringify({ solved: saved.solved, awarded: saved.awarded }));
    return true;
  } catch { return false; }
}

export function solvedListeningTasks(saved: ListeningSaved, lessonId: string, taskIds: string[]): string[] {
  const solved = new Set(saved.solved[lessonId] || []);
  return taskIds.filter(id => solved.has(id));
}
