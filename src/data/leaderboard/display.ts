import type { LeaderboardResult, LeaderboardRow } from '../../services/henglishApi';
import { ANONYMOUS_AVATAR } from '../../services/authService';
export const STARTER_ENTRIES_ENABLED = true;
const NAMES = ['Maryam Adel', 'Ahmed Hassan', 'Omar Mahmoud', 'Nour Ahmed', 'Youssef Ibrahim', 'Sara Khaled', 'Karim Mostafa', 'Aya Mohamed', 'Hassan Ali'];
const SCORES = [96, 84, 73, 65, 57, 48, 39, 28, 19];
const PHOTOS = [null, 1, 3, 4, 5, null, 7, 2, null];
export type DisplayRow = LeaderboardRow & {own: boolean; starter: boolean};
export function displayLeaderboard(data: LeaderboardResult, enabled = STARTER_ENTRIES_ENABLED): DisplayRow[] {
  const real: DisplayRow[] = data.top.map(r => ({...r, avatar: r.avatar || ANONYMOUS_AVATAR, own: data.me?.rank === r.rank, starter: false}));
  const owner: DisplayRow[] = enabled && !real.some(r => r.pinned) ? [{rank: 0, name: 'Mohamed Alhinawi', points: 120, avatar: '/images/leaderboard/owner.webp', pinned: true, own: false, starter: true}] : [];
  const count = enabled ? Math.max(0, 10 - Math.max(data.realCount, real.length) - owner.length) : 0;
  const starters: DisplayRow[] = NAMES.slice(0, count).map((name, i) => ({rank: 0, name, points: SCORES[i], avatar: PHOTOS[i] ? `/images/leaderboard/leaderboard-profile-${PHOTOS[i]}.webp` : ANONYMOUS_AVATAR, pinned: false, own: false, starter: true}));
  return [...real, ...owner, ...starters].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.points - a.points).slice(0, 10).map((r, i) => ({...r, rank: i + 1}));
}
