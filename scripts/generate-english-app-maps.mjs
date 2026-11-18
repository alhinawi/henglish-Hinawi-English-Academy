import { readdirSync, existsSync, writeFileSync } from 'node:fs';
const base = 'public/data/app-i18n';
const modules = readdirSync(base).filter(name => existsSync(`${base}/${name}/en.json`)).sort();
const lines = [
  '// English app-content maps are bundled to prevent Arabic flashes or offline fallbacks.',
  '// Regenerate with node scripts/generate-english-app-maps.mjs after adding an English map.',
  ...modules.map(name => `import ${name} from '../../public/data/app-i18n/${name}/en.json';`),
  'export const ENGLISH_APP_TEXT_MAPS: Record<string, Record<string, string>> = {',
  ...modules.map(name => `  ${name},`),
  '};', '',
];
writeFileSync('src/data/englishAppTextMaps.ts', lines.join('\n'));
console.log(`Bundled ${modules.length} English content maps.`);
