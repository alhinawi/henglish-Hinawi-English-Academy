export const isSourceRoute = (hash: string): boolean => ['sources', 'best-resources', 'top-resources'].includes(hash) || hash.startsWith('sources/') || hash.startsWith('sources-');
export function sourceCategoryTarget(hash: string, ids: readonly string[]): string | null {
  const value = hash.replace(/^#/, '');
  const category = value.startsWith('sources/') ? value.slice(8) : value.startsWith('sources-') ? value.slice(8) : '';
  return ids.includes(category) ? `sources-${category}` : null;
}
