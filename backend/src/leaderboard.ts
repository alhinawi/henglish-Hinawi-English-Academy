// Display-only owner pin. Never changes stored account scores or learning progress.
export const OWNER_DISPLAY_BASE = 120
export function isOwner(email: string) { return email.trim().toLowerCase() === '3asfuur@gmail.com' }
export function isOwnerGoogleSession(user: {email: string; google_sub: string | null}, token: string) {
  // g. is part of the random session token whose complete hash is stored server-side.
  // It is only minted after Google's verified-email callback, never by password login.
  return isOwner(user.email) && !!user.google_sub && token.startsWith('g.')
}
export type LeaderboardAccount = {id: number; name: string; email: string; google_sub: string | null; avatar: string | null; data: string | null}
export function pointsOf(raw: string | null): number {
  try {
    const p = JSON.parse(raw || '{}');
    const completed = Array.isArray(p.completedLessons) ? new Set(p.completedLessons.filter((x: unknown) => typeof x === 'string')).size : 0;
    const quizzes = p.quizScores && typeof p.quizScores === 'object' && !Array.isArray(p.quizScores) ? Object.values(p.quizScores) : [];
    const score = quizzes.reduce<number>((n, q) => {
      if (!q || typeof q !== 'object') return n;
      const {score, total} = q as {score: unknown; total: unknown};
      return n + (typeof score === 'number' && Number.isFinite(score) && typeof total === 'number' && Number.isFinite(total) && total > 0 ? Math.round(Math.max(0, Math.min(1, score / total)) * 50) : 0);
    }, 0);
    return completed * 100 + score;
  } catch { return 0; }
}
function displayName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length > 1 ? `${parts[0]} ${[...parts[parts.length - 1]][0]}.` : parts[0] || 'Learner';
}
export function buildLeaderboard(rows: LeaderboardAccount[], viewerId: number | null) {
  const board = rows.filter(r => !isOwner(r.email) || !!r.google_sub).map(r => {
    const pinned = isOwner(r.email) && !!r.google_sub;
    return { id: r.id, name: pinned ? r.name : displayName(r.name), points: pinned ? Math.max(OWNER_DISPLAY_BASE, pointsOf(r.data)) : pointsOf(r.data), avatar: pinned ? r.avatar : null, pinned };
  }).sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.points - a.points || a.id - b.id);
  const mine = board.findIndex(r => r.id === viewerId);
  return { top: board.slice(0, 10).map(({id: _id, ...r}, i) => ({...r, rank: i + 1})), realCount: board.length,
    me: mine >= 0 ? {rank: mine + 1, points: board[mine].points} : null };
}
