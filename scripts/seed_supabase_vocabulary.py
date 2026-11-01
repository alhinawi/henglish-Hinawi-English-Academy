# -*- coding: utf-8 -*-
"""
Henglish Academy - Supabase Vocabulary Database Seeder
Reads public/data/vocabulary.json and streams records into Supabase PostgREST in batches.
"""

import os
import sys
import json
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('VITE_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("[!] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in environment.")
    print("    This script can be executed when Supabase credentials are configured.")
    sys.exit(0)

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'vocabulary.json')
if not os.path.exists(DATA_PATH):
    print("[!] vocabulary.json not found. Run scripts/compile_vocabulary_database.py first.")
    sys.exit(1)

with open(DATA_PATH, 'r', encoding='utf-8') as f:
    entries = json.load(f)

print(f"[>] Seeding {len(entries):,} words into Supabase ({SUPABASE_URL})...")

BATCH_SIZE = 500
headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': f"Bearer {SUPABASE_SERVICE_KEY}",
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
}

for i in range(0, len(entries), BATCH_SIZE):
    batch = entries[i:i + BATCH_SIZE]
    db_records = []
    for item in batch:
        db_records.append({
            'headword': item['headword'],
            'normalized_headword': item['normalized'],
            'primary_part_of_speech': item['pos'],
            'cefr_level': item['cefr'],
            'ipa_us': item['ipaUs'],
            'ipa_uk': item['ipaUk'],
            'audio_us_url': item['audioUsUrl'],
            'audio_uk_url': item['audioUkUrl'],
            'frequency_tier': item['frequencyTier'],
            'domain_category': item['domain'],
            'formality': item['formality'],
            'inflections_json': item['inflections'],
            'data_source': 'Henglish Lexical Core'
        })

    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/dictionary_lexical_entries",
        data=json.dumps(db_records).encode('utf-8'),
        headers=headers,
        method='POST'
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            print(f"[+] Seeded batch {i//BATCH_SIZE + 1} ({len(batch)} words)")
    except Exception as e:
        print(f"[!] Error seeding batch {i}: {e}")
        break

print("[✓] Supabase Seeder Finished.")

