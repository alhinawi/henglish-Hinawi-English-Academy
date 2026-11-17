export function vocabularyEntryTarget(hash: string): string | null {
  const [route, query] = hash.replace(/^#/, '').split('?');
  if (route !== 'vocabulary') return null;
  const target = new URLSearchParams(query).get('entry');
  return target && (target.startsWith('word:') || target.startsWith('verb:')) ? target : null;
}
