#!/usr/bin/env python3
"""Regenerate an exam-vocab manifest (IELTS/TOEFL) from chunks on disk.

Usage: python3 scripts/build_exam_vocab_index.py <vocab-index.json>
  e.g. python3 scripts/build_exam_vocab_index.py public/data/ielts/vocab/vocab-index.json
Keeps exam/idPrefix from the existing manifest; recomputes chunks, totals and
counts. Validate afterwards with scripts/check_exam_vocab_chunks.py.
"""
import json
import os
import re
import sys

CHUNK_RE = re.compile(r'^[a-z]{1,3}\d{6}-\d{6}\.json$')


def main(index_path):
    index = json.load(open(index_path, encoding='utf-8'))
    chunks_dir = os.path.join(os.path.dirname(index_path), 'chunks')
    files = sorted(f for f in os.listdir(chunks_dir) if CHUNK_RE.match(f)) \
        if os.path.isdir(chunks_dir) else []
    total = 0
    counts = {"byLevel": {}, "byPos": {}, "byTopic": {}}
    sizes = []
    for name in files:
        rows = json.load(open(os.path.join(chunks_dir, name), encoding='utf-8'))
        sizes.append(len(rows))
        total += len(rows)
        for q in rows:
            for group, field in (("byLevel", "level"), ("byPos", "partOfSpeech"),
                                 ("byTopic", "topic")):
                key = str(q.get(field))
                counts[group][key] = counts[group].get(key, 0) + 1
    index["totalEntries"] = total
    index["chunkSize"] = max(sizes) if sizes else index.get("chunkSize", 500)
    index["chunks"] = files
    index["counts"] = counts
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f"{index_path}: {total} entries, {len(files)} chunks")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1])
