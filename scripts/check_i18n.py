#!/usr/bin/env python3
"""i18n gates for CI:
1. Key parity - every locale file in src/i18n/locales must carry exactly the
   same key set as en.json (the fallback).
2. Arabic ratchet - no new hardcoded Arabic UI strings in components. Counts
   per file may only shrink against scripts/i18n-arabic-baseline.json.
"""
import glob, json, re, sys

fail = False

# --- gate 1: locale key parity ---
locales = sorted(glob.glob('src/i18n/locales/*.json'))
sets = {}
for path in locales:
    sets[path] = set(json.load(open(path, encoding='utf-8')).keys())
base = sets.get('src/i18n/locales/en.json')
if base is None:
    print('FAIL: src/i18n/locales/en.json missing'); sys.exit(1)
for path, keys in sets.items():
    missing = base - keys
    extra = keys - base
    if missing or extra:
        fail = True
        print(f'FAIL parity {path}: missing {len(missing)} {sorted(missing)[:5]} extra {len(extra)} {sorted(extra)[:5]}')

# --- gate 2: arabic ratchet ---
baseline = json.load(open('scripts/i18n-arabic-baseline.json', encoding='utf-8'))
files = [f for f in glob.glob('src/**/*.ts', recursive=True) + glob.glob('src/**/*.tsx', recursive=True)
         if not f.startswith('src/i18n/') and not f.startswith('src/data/') and not f.startswith('src/services/')]
STR = re.compile(r'(["\'`])((?:(?!\1).)*[\u0600-\u06FF](?:(?!\1).)*)\1')
JSX = re.compile(r'>([^<>{}\n]*[\u0600-\u06FF][^<>{}\n]*)<')
new_total = 0
for f in files:
    src = open(f, encoding='utf-8').read()
    n = sum(1 for m in STR.finditer(src) if len(m.group(2).strip()) >= 2)
    n += sum(1 for m in JSX.finditer(src) if len(m.group(1).strip()) >= 2)
    new_total += n
    allowed = baseline.get(f, 0)
    if n > allowed:
        fail = True
        print(f'FAIL arabic {f}: {n} strings (baseline {allowed}). Move UI strings to src/i18n/locales.')

print(f'i18n check: {len(locales)} locales, {len(base)} keys each; arabic UI strings {new_total} (baseline {sum(baseline.values())})')
sys.exit(1 if fail else 0)
