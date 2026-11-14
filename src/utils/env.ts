/**
 * Cross-bundler environment variable reader.
 * Works under Vite (import.meta.env.VITE_*) and Next.js (process.env.NEXT_PUBLIC_*).
 */
export function getEnvVar(viteName: string): string {
  // Vite / browser-native ESM
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    const v = metaEnv?.[viteName];
    if (v) return v;
  } catch {
    // import.meta unavailable - ignore
  }
  // Next.js / Node (NEXT_PUBLIC_* is inlined at build time for client code)
  if (typeof process !== 'undefined' && process.env) {
    const publicName = viteName.replace(/^VITE_/, 'NEXT_PUBLIC_');
    return process.env[viteName] || process.env[publicName] || '';
  }
  return '';
}
