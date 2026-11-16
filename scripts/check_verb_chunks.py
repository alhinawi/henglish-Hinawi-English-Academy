#!/usr/bin/env python3
"""Henglish verbs-bank chunk validator (all verbs + conjugations section).

Usage: python3 scripts/check_verb_chunks.py [verbs-index.json]
Defaults to public/data/verbs/verbs-index.json. Exit 0 = all clean.

The 12-tense tables are rendered programmatically (src/utils/conjugate.ts)
from the five stored forms, so accuracy lives in these forms.

Schema per entry:
  id        string, ^vrb-\\d{6}$, unique
  v1        base form (English, no Arabic); phrasal verbs keep the particle
  v2        simple past
  v3        past participle
  ing       -ing form
  s         3rd-person singular present
  meaningAr Egyptian Arabic meaning, must contain Arabic
  exampleEn non-empty English example
  exampleAr Egyptian Arabic translation, must contain Arabic
  level     CEFR A1-C2
  irregular boolean
  phrasal   boolean
  modal     boolean (modals have no full conjugation; v2 may be '' for can/etc.)
  source    non-empty provenance tag
Optional: noteAr, synonyms. Unknown extra fields allowed.
"""
import json
import os
import re
import sys

AR = re.compile(r'[\u0600-\u06FF]')
EN = re.compile(r"^[a-z][a-z' -]*$")
CHUNK_RE = re.compile(r'^v(\d{6})-(\d{6})\.json$')
LEVELS = {"A1", "A2", "B1", "B2", "C1", "C2"}
REQUIRED = ["id", "v1", "v2", "v3", "ing", "s", "meaningAr", "exampleEn",
            "exampleAr", "level", "irregular", "phrasal", "modal", "source"]


def fail(errors, where, msg):
    errors.append(f"{where}: {msg}")


def main(index_path):
    errors = []
    if not os.path.exists(index_path):
        print(f"index not found: {index_path}")
        return 1
    index = json.load(open(index_path, encoding='utf-8'))
    chunks_dir = os.path.join(os.path.dirname(index_path), 'chunks')

    for field in ("totalEntries", "chunkSize", "chunks", "counts"):
        if field not in index:
            fail(errors, index_path, f"missing index field '{field}'")
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
    seen_v1 = {}
    total = 0
    counts = {"byLevel": {}, "irregular": 0, "phrasal": 0, "modal": 0}

    for pos, name in enumerate(files):
        m = CHUNK_RE.match(name)
        path = os.path.join(chunks_dir, name)
        if not m:
            fail(errors, name, "filename must be vSSSSSS-EEEEEE.json")
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
            if not re.match(r'^vrb-\d{6}$', qid):
                fail(errors, where, f"id must match vrb-NNNNNN, got {qid!r}")
            elif qid in seen_ids:
                fail(errors, where, f"duplicate id also at {seen_ids[qid]}")
            else:
                seen_ids[qid] = where
            v1 = str(q.get("v1", "")).strip()
            if not v1 or not EN.match(v1):
                fail(errors, where, f"v1 must be lowercase English: {v1!r}")
            elif v1 in seen_v1:
                fail(errors, where, f"duplicate v1 also at {seen_v1[v1]}")
            else:
                seen_v1[v1] = where
            modal = q.get("modal") is True
            irregular = q.get("irregular") is True
            phrasal = q.get("phrasal") is True
            if not isinstance(q.get("irregular"), bool) or \
               not isinstance(q.get("phrasal"), bool) or \
               not isinstance(q.get("modal"), bool):
                fail(errors, where, "irregular/phrasal/modal must be booleans")
            # Phrasal verbs inflect the verb part; check the head verb only.
            head = v1.split(' ')[0]
            for form, label in (("v2", "simple past"), ("v3", "past participle"),
                                ("ing", "-ing"), ("s", "3rd singular")):
                val = str(q.get(form, "")).strip()
                if modal and form in ("v2", "v3", "ing", "s"):
                    continue  # modal auxiliaries lack some forms
                if not val or AR.search(val):
                    fail(errors, where, f"{form} ({label}) must be non-empty English")
            v2h = str(q.get("v2", "")).split(' ')[0]
            if not modal:
                if irregular and v2h == head + "ed":
                    fail(errors, where, "marked irregular but v2 is the regular -ed form")
                if not irregular and not v2h.endswith("ed"):
                    fail(errors, where,
                         f"marked regular but v2 {v2h!r} does not end in -ed (typo or wrong flag)")
            if not AR.search(str(q.get("meaningAr", ""))):
                fail(errors, where, "meaningAr must contain Arabic")
            if not str(q.get("exampleEn", "")).strip():
                fail(errors, where, "empty exampleEn")
            if not AR.search(str(q.get("exampleAr", ""))):
                fail(errors, where, "exampleAr must contain Arabic")
            if q.get("level") not in LEVELS:
                fail(errors, where, f"level must be CEFR A1-C2, got {q.get('level')!r}")
            if not str(q.get("source", "")).strip():
                fail(errors, where, "empty source")
            counts["byLevel"][str(q.get("level"))] = counts["byLevel"].get(str(q.get("level")), 0) + 1
            if irregular:
                counts["irregular"] += 1
            if phrasal:
                counts["phrasal"] += 1
            if modal:
                counts["modal"] += 1

    if index.get("totalEntries") != total:
        fail(errors, index_path,
             f"totalEntries {index.get('totalEntries')} != actual {total}")
    ic = index.get("counts", {})
    for group in ("byLevel", "irregular", "phrasal", "modal"):
        if ic.get(group) != counts[group]:
            fail(errors, index_path,
                 f"counts.{group} mismatch: index {ic.get(group)} != actual {counts[group]}")

    if errors:
        print(f"FAIL: {len(errors)} error(s) across {total} verbs in {len(files)} chunks")
        for e in errors[:40]:
            print(" -", e)
        if len(errors) > 40:
            print(f" ... and {len(errors)-40} more")
        return 1
    print(f"OK: {total} verbs in {len(files)} chunks "
          f"({counts['irregular']} irregular, {counts['phrasal']} phrasal, {counts['modal']} modal)")
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1
                  else 'public/data/verbs/verbs-index.json'))
