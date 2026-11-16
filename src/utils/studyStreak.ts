/** Calendar-day streaks: no credit for signing in or opening a page. */
export function localStudyDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function previousDay(day: string): string {
  const [y,m,d] = day.split('-').map(Number);
  return localStudyDay(new Date(y,m-1,d-1,12));
}
export function currentStudyStreak(count: number, lastDay: string | null | undefined, now = new Date()): number {
  const today = localStudyDay(now);
  return (lastDay === today || lastDay === previousDay(today)) && Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
}
export function addStudyDay<T extends { studyStreakDays: number; lastStudyDate: string }>(progress: T, now = new Date()): T {
  const today = localStudyDay(now);
  if (progress.lastStudyDate === today && progress.studyStreakDays > 0) return progress;
  return { ...progress, lastStudyDate: today, studyStreakDays: progress.lastStudyDate === previousDay(today) ? Math.max(0, progress.studyStreakDays || 0)+1 : 1 };
}
/** Merge overlapping study and arcade streak ranges without counting a day twice. */
export function combinedStudyStreak(study: {studyStreakDays:number;lastStudyDate:string}, arcade: {streakDays:number;lastPlayDay:string|null}, now = new Date()): number {
  const days = new Set<string>();
  for (const [count,last] of [[study.studyStreakDays,study.lastStudyDate],[arcade.streakDays,arcade.lastPlayDay]] as const) {
    if (!last || !Number.isFinite(count)) continue;
    let day = last;
    for (let i=0;i<Math.min(36600,Math.max(0,Math.floor(count)));i++) {days.add(day);day=previousDay(day);}
  }
  let day=localStudyDay(now); if(!days.has(day))day=previousDay(day);
  let count=0; while(days.has(day)){count++;day=previousDay(day);} return count;
}
