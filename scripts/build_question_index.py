#!/usr/bin/env python3
"""Regenerate public/data/questions/questions-index.json from the chunks on disk.

Usage: python3 scripts/build_question_index.py
Run this after adding/removing question chunks, then validate with
python3 scripts/check_question_chunks.py before committing.
"""
import json
import os
import re

CHUNKS_DIR = 'public/data/questions/chunks'
INDEX_PATH = 'public/data/questions/questions-index.json'
CHUNK_RE = re.compile(r'^q\d{6}-\d{6}\.json$')


def main():
    files = sorted(f for f in os.listdir(CHUNKS_DIR) if CHUNK_RE.match(f))
    total = 0
    counts = {"byLevel": {}, "bySkill": {}, "byType": {}, "bySource": {}}
    sizes = []
    for name in files:
        rows = json.load(open(os.path.join(CHUNKS_DIR, name), encoding='utf-8'))
        sizes.append(len(rows))
        total += len(rows)
        for q in rows:
            for group, field in (("byLevel", "level"), ("bySkill", "skill"),
                                 ("byType", "type"), ("bySource", "source")):
                key = str(q.get(field))
                counts[group][key] = counts[group].get(key, 0) + 1
    chunk_size = max(sizes) if sizes else 200
    index = {
        "totalQuestions": total,
        "chunkSize": chunk_size,
        "chunks": files,
        "counts": counts,
    }
    with open(INDEX_PATH, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f"index: {total} questions, {len(files)} chunks, chunkSize {chunk_size}")


if __name__ == '__main__':
    main()
