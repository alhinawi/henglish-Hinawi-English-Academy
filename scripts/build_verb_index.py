#!/usr/bin/env python3
"""Regenerate public/data/verbs/verbs-index.json from chunks on disk.

Usage: python3 scripts/build_verb_index.py
Validate afterwards with scripts/check_verb_chunks.py.
"""
import json
import os
import re

CHUNKS_DIR = 'public/data/verbs/chunks'
INDEX_PATH = 'public/data/verbs/verbs-index.json'
CHUNK_RE = re.compile(r'^v\d{6}-\d{6}\.json$')


def main():
    index = json.load(open(INDEX_PATH, encoding='utf-8'))
    files = sorted(f for f in os.listdir(CHUNKS_DIR) if CHUNK_RE.match(f)) \
        if os.path.isdir(CHUNKS_DIR) else []
    total = 0
    counts = {"byLevel": {}, "irregular": 0, "phrasal": 0, "modal": 0}
    sizes = []
    for name in files:
        rows = json.load(open(os.path.join(CHUNKS_DIR, name), encoding='utf-8'))
        sizes.append(len(rows))
        total += len(rows)
        for q in rows:
            lv = str(q.get("level"))
            counts["byLevel"][lv] = counts["byLevel"].get(lv, 0) + 1
            if q.get("irregular") is True:
                counts["irregular"] += 1
            if q.get("phrasal") is True:
                counts["phrasal"] += 1
            if q.get("modal") is True:
                counts["modal"] += 1
    index["totalEntries"] = total
    index["chunkSize"] = max(sizes) if sizes else index.get("chunkSize", 500)
    index["chunks"] = files
    index["counts"] = counts
    with open(INDEX_PATH, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f"{INDEX_PATH}: {total} verbs, {len(files)} chunks")


if __name__ == '__main__':
    main()
