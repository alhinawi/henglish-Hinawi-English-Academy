#!/usr/bin/env python3
"""Henglish phrase-bank chunk validator (idioms / slang / genz).

Usage: python3 scripts/check_phrase_chunks.py <bank-index.json>
  e.g. python3 scripts/check_phrase_chunks.py public/data/idioms/idioms-index.json
Exit 0 = all clean. This is the schema contract for every phrase-bank PR.

Manifest (<bank>-index.json):
  bank        'idioms' | 'slang' | 'genz'
  idPrefix    'idm' | 'slg' | 'gnz'
  totalEntries, chunkSize (500), chunks[] (filenames)
  counts      {byRegister, byOrigin}

Chunk files live in <bank-dir>/chunks/ as arrays of entries.

Schema per entry:
  id         string, ^<idPrefix>-\\d{6}$, globally unique within the bank
  phrase     the idiom / slang term, English, non-empty, no Arabic
  meaningAr  Egyptian Arabic meaning, must contain Arabic
  exampleEn  non-empty English example sentence
  exampleAr  Egyptian Arabic translation, must contain Arabic
  register   'formal' | 'neutral' | 'informal' | 'vulgar' | 'offensive'
  origin     'US' | 'UK' | 'both' | 'global'
  source     non-empty provenance tag (worker/generator)
Optional: category, literalAr, noteAr (usage/register note). Unknown extra
fields are allowed.
"""
import json
import os
import re
import sys

AR = re.compile(r'[\u0600-\u06FF]')
CHUNK_RE = re.compile(r'^[a-z]{1,3}(\d{6})-(\d{6})\.json$')
REGISTERS = {"formal", "neutral", "informal", "vulgar", "offensive"}
ORIGINS = {"US", "UK", "both", "global"}
REQUIRED = ["id", "phrase", "meaningAr", "exampleEn", "exampleAr",
            "register", "origin", "source"]


def fail(errors, where, msg):
    errors.append(f"{where}: {msg}")


def main(index_path):
    errors = []
    if not os.path.exists(index_path):
        print(f"index not found: {index_path}")
        return 1
    index = json.load(open(index_path, encoding='utf-8'))
    chunks_dir = os.path.join(os.path.dirname(index_path), 'chunks')

    for field in ("bank", "idPrefix", "totalEntries", "chunkSize", "chunks", "counts"):
        if field not in index:
            fail(errors, index_path, f"missing index field '{field}'")
    prefix = index.get("idPrefix", "")
    if prefix not in ("idm", "slg", "gnz"):
        fail(errors, index_path, f"idPrefix must be idm|slg|gnz, got {prefix!r}")
    id_re = re.compile(r'^' + re.escape(prefix) + r'-\d{6}$')
    chunk_size = index.get("chunkSize", 0)
    files = index.get("chunks", [])

    on_disk = sorted(os.listdir(chunks_dir)) if os.path.isdir(chunks_dir) else []
    if sorted(files) != on_disk:
        missing = sorted(set(files) - set(on_disk))
        extra = sorted(set(on_disk) - set(files))
        if missing:
            fail(errors, index_path, f"listed but missing on disk: {missing[:3]} ({len(missing)})")
        if extra:
            fail(errors, index_path, f"on disk but not listed: {extra[:3]} ({len(extra)})")

    seen_ids = {}
    seen_phrases = {}
    total = 0
    counts = {"byRegister": {}, "byOrigin": {}}

    def bump(group, key):
        counts[group][key] = counts[group].get(key, 0) + 1

    for pos, name in enumerate(files):
        m = CHUNK_RE.match(name)
        path = os.path.join(chunks_dir, name)
        if not m:
            fail(errors, name, "filename must be <letter>SSSSSS-EEEEEE.json")
            continue
        if not os.path.exists(path):
            continue
        try:
            rows = json.load(open(path, encoding='utf-8'))
        except Exception as e:
            fail(errors, name, f"invalid JSON: {e}")
            continue
        if not isinstance(rows, list):
            fail(errors, name, "chunk must be a JSON array")
            continue
        total += len(rows)
        lo, hi = int(m.group(1)), int(m.group(2))
        if hi - lo + 1 != len(rows):
            fail(errors, name, f"range {lo}-{hi} implies {hi-lo+1} entries, file has {len(rows)}")
        if chunk_size and pos < len(files) - 1 and len(rows) != chunk_size:
            fail(errors, name, f"non-final chunk has {len(rows)} entries, expected {chunk_size}")
        if lo != pos * chunk_size + 1:
            fail(errors, name, f"chunk #{pos+1} should start at {pos*chunk_size+1}, starts at {lo}")

        for i, q in enumerate(rows):
            where = f"{name}[{i}]"
            if not isinstance(q, dict):
                fail(errors, where, "entry must be an object")
                continue
            for field in REQUIRED:
                if field not in q:
                    fail(errors, where, f"missing field '{field}'")
            qid = str(q.get("id", ""))
            if not id_re.match(qid):
                fail(errors, where, f"id must match {prefix}-NNNNNN, got {qid!r}")
            elif qid in seen_ids:
                fail(errors, where, f"duplicate id also at {seen_ids[qid]}")
            else:
                seen_ids[qid] = where
            phrase = str(q.get("phrase", "")).strip()
            if not phrase:
                fail(errors, where, "empty phrase")
            elif AR.search(phrase):
                fail(errors, where, "phrase must be English (contains Arabic)")
            else:
                key = phrase.lower()
                if key in seen_phrases:
                    fail(errors, where, f"duplicate phrase also at {seen_phrases[key]}")
                else:
                    seen_phrases[key] = where
            if not AR.search(str(q.get("meaningAr", ""))):
                fail(errors, where, "meaningAr must contain Arabic")
            if not str(q.get("exampleEn", "")).strip():
                fail(errors, where, "empty exampleEn")
            if not AR.search(str(q.get("exampleAr", ""))):
                fail(errors, where, "exampleAr must contain Arabic")
            if q.get("register") not in REGISTERS:
                fail(errors, where, f"register must be one of {sorted(REGISTERS)}, got {q.get('register')!r}")
            if q.get("origin") not in ORIGINS:
                fail(errors, where, f"origin must be one of {sorted(ORIGINS)}, got {q.get('origin')!r}")
            if not str(q.get("source", "")).strip():
                fail(errors, where, "empty source")
            bump("byRegister", str(q.get("register")))
            bump("byOrigin", str(q.get("origin")))

    if index.get("totalEntries") != total:
        fail(errors, index_path,
             f"totalEntries {index.get('totalEntries')} != actual {total}")
    ic = index.get("counts", {})
    for group in ("byRegister", "byOrigin"):
        if ic.get(group) != counts[group]:
            fail(errors, index_path,
                 f"counts.{group} mismatch: index {ic.get(group)} != actual {counts[group]}")

    if errors:
        print(f"FAIL: {len(errors)} error(s) across {total} entries in {len(files)} chunks")
        for e in errors[:40]:
            print(" -", e)
        if len(errors) > 40:
            print(f" ... and {len(errors)-40} more")
        return 1
    print(f"OK: {total} {index.get('bank')} entries in {len(files)} chunks, {len(seen_ids)} unique ids")
    return 0


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    sys.exit(main(sys.argv[1]))
