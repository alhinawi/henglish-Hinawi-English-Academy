// Keep stored IDs stable; turn only known quiz families into localized labels.
export function quizHistoryTitle(id: string, t: (key: string) => string): string {
  if (id === 'cefr-placement') return t('exa.title');
  if (!id.startsWith('question-bank:')) return id;
  const parts = id.split(':');
  if (parts.length !== 4) return id;
  const [, skill, level, type] = parts;
  const skills: Record<string, string> = { all: 'qb.skillAll', vocabulary: 'qb.skillVocabulary', grammar: 'qb.skillGrammar', usage: 'qb.skillUsage', reading: 'qb.skillReading', listening: 'qb.skillListening' };
  const types: Record<string, string> = { all: 'qb.typeAll', 'multiple-choice': 'qb.typeMc', 'fill-blank': 'qb.typeFill', 'true-false': 'qb.typeTf' };
  if (!(Object.hasOwn(skills, skill) || skill === 'ielts' || skill === 'toefl')
    || !(level === 'all' || ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)) || !Object.hasOwn(types, type)) return id;
  return [t('qb.quizTitle'), skills[skill] ? t(skills[skill]) : skill.toUpperCase(), level === 'all' ? t('so.allLevels') : level, t(types[type])].join(' · ');
}
