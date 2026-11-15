#!/usr/bin/env python3
"""Generate public/data/vocab/chunks-index.json and ranks-index.json from the manifest."""
import json, glob, os

ROOT = os.path.join(os.path.dirname(__file__), '..')
chunks_dir = os.path.join(ROOT, 'public/data/vocab/chunks')
files = sorted(os.path.basename(f) for f in glob.glob(os.path.join(chunks_dir, 'r*.json')))
index = {"files": files, "fileCount": len(files)}
with open(os.path.join(ROOT, 'public/data/vocab/chunks-index.json'), 'w') as f:
    json.dump(index, f)

ranks = {}
with open(os.path.join(ROOT, 'data/vocab-ranks/english-30k.tsv')) as f:
    for line in f:
        if line.startswith('#') or not line.strip():
            continue
        p = line.rstrip('\n').split('\t')
        ranks[p[1]] = [int(p[0]), float(p[5])]
with open(os.path.join(ROOT, 'public/data/vocab/ranks-index.json'), 'w') as f:
    json.dump(ranks, f, separators=(',', ':'))
print(f"chunks-index: {len(files)} files; ranks-index: {len(ranks)} words")
