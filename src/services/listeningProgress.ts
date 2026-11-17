export type ListeningSaved = { solved: Record<string, string[]>; awarded: string[] };

export function loadListeningProgress(key: string): ListeningSaved {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { solved: {}, awarded: [] };
    const value = parsed as Partial<ListeningSaved>;
    const solved = value.solved && typeof value.solved === 'object' && !Array.isArray(value.solved)
      ? Object.fromEntries(Object.entries(value.solved).filter(([, ids]) => Array.isArray(ids))
        .map(([lesson, ids]) => [lesson, [...new Set(ids.filter((id): id is string => typeof id === 'string'))]])) : {};
    return { solved, awarded: Array.isArray(value.awarded) ? [...new Set(value.awarded.filter((id): id is string => typeof id === 'string'))] : [] };
  } catch { return { solved: {}, awarded: [] }; }
}

export function solvedListeningTasks(saved: ListeningSaved, lessonId: string, taskIds: string[]): string[] {
  const solved = new Set(saved.solved[lessonId] || []);
  return taskIds.filter(id => solved.has(id));
}
