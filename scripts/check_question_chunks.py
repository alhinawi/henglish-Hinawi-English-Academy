#!/usr/bin/env python3
"""Henglish question-bank chunk validator.

Usage: python3 scripts/check_question_chunks.py [index.json]
Defaults to public/data/questions/questions-index.json.
Exit 0 = all clean.

The question bank is chunked for lazy loading: an index manifest plus N chunk
JSON files (one array of question objects each). This validator is the schema
contract every generator/worker must satisfy before its PR is merged.

Schema per question:
  id            string, ^q-[a-z0-9]+-\\d{6}$, globally unique across the bank
  skill         string: vocabulary | grammar | reading | listening | usage | ...
  type          string: multiple-choice | fill-blank | true-false
  level         string: A1 | A2 | B1 | B2 | C1 | C2
  prompt        non-empty string (English instruction/cloze)
  promptAr      non-empty string, must contain Arabic
  options       list of unique non-empty strings; exactly 4 for multiple-choice
  answerIndex   int, 0 <= answerIndex < len(options)
  explanationAr non-empty string, must contain Arabic
  topic         non-empty string
  source        non-empty string (generator/worker provenance)
"""
import json
import os
import re
import sys

AR = re.compile(r'[\u0600-\u06FF]')
ID_RE = re.compile(r'^q-[a-z0-9]+-\d{6}$')
CHUNK_RE = re.compile(r'^q(\d{6})-(\d{6})\.json$')
TYPES = {"multiple-choice", "fill-blank", "true-false"}
LEVELS = {"A1", "A2", "B1", "B2", "C1", "C2"}
REQUIRED = ["id", "skill", "type", "level", "prompt", "promptAr",
            "options", "answerIndex", "explanationAr", "topic", "source"]


def fail(errors, where, msg):
    errors.append(f"{where}: {msg}")


def main(index_path):
    errors = []
    if not os.path.exists(index_path):
        print(f"index not found: {index_path}")
        return 1
    index = json.load(open(index_path, encoding='utf-8'))
    chunks_dir = os.path.join(os.path.dirname(index_path), 'chunks')

    for field in ("totalQuestions", "chunkSize", "chunks", "counts"):
        if field not in index:
            fail(errors, index_path, f"missing index field '{field}'")
    chunk_size = index.get("chunkSize", 0)
    files = index.get("chunks", [])

    # 1. index file list vs disk
    on_disk = sorted(os.listdir(chunks_dir)) if os.path.isdir(chunks_dir) else []
    if sorted(files) != on_disk:
        missing = sorted(set(files) - set(on_disk))
        extra = sorted(set(on_disk) - set(files))
        if missing:
            fail(errors, index_path, f"listed but missing on disk: {missing[:3]} ({len(missing)})")
        if extra:
            fail(errors, index_path, f"on disk but not listed: {extra[:3]} ({len(extra)})")

    # 2. per-chunk + per-question checks
    seen_ids = {}
    total = 0
    counts = {"byLevel": {}, "bySkill": {}, "byType": {}, "bySource": {}}

    def bump(group, key):
        counts[group][key] = counts[group].get(key, 0) + 1

    for pos, name in enumerate(files):
        m = CHUNK_RE.match(name)
        path = os.path.join(chunks_dir, name)
        if not m:
            fail(errors, name, "filename must be qSSSSSS-EEEEEE.json")
            continue
        if not os.path.exists(path):
            continue  # already reported above
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
            qid = q.get("id", "")
            if not ID_RE.match(str(qid)):
                fail(errors, where, f"bad id format: {qid!r}")
            elif qid in seen_ids:
                fail(errors, where, f"duplicate id also at {seen_ids[qid]}")
            else:
                seen_ids[qid] = where
            if not str(q.get("skill", "")).strip():
                fail(errors, where, "empty skill")
            if q.get("type") not in TYPES:
                fail(errors, where, f"type must be one of {sorted(TYPES)}, got {q.get('type')!r}")
            if q.get("level") not in LEVELS:
                fail(errors, where, f"level must be CEFR A1-C2, got {q.get('level')!r}")
            if not str(q.get("prompt", "")).strip():
                fail(errors, where, "empty prompt")
            if not AR.search(str(q.get("promptAr", ""))):
                fail(errors, where, "promptAr must contain Arabic")
            opts = q.get("options")
            if not isinstance(opts, list) or len(opts) < 2:
                fail(errors, where, "options must be a list of at least 2")
                opts = []
            else:
                if any(not str(o).strip() for o in opts):
                    fail(errors, where, "options must be non-empty strings")
                if len({str(o).strip().lower() for o in opts}) != len(opts):
                    fail(errors, where, "options contain duplicates")
                if q.get("type") == "multiple-choice" and len(opts) != 4:
                    fail(errors, where, f"multiple-choice must have exactly 4 options, got {len(opts)}")
            ai = q.get("answerIndex")
            if not isinstance(ai, int) or isinstance(ai, bool) or not (0 <= ai < max(len(opts), 1)):
                fail(errors, where, f"answerIndex {ai!r} out of range")
            if not AR.search(str(q.get("explanationAr", ""))):
                fail(errors, where, "explanationAr must contain Arabic")
            if not str(q.get("topic", "")).strip():
                fail(errors, where, "empty topic")
            if not str(q.get("source", "")).strip():
                fail(errors, where, "empty source")
            bump("byLevel", str(q.get("level")))
            bump("bySkill", str(q.get("skill")))
            bump("byType", str(q.get("type")))
            bump("bySource", str(q.get("source")))

    # 3. index counts vs recomputed
    if index.get("totalQuestions") != total:
        fail(errors, index_path,
             f"totalQuestions {index.get('totalQuestions')} != actual {total}")
    ic = index.get("counts", {})
    for group in ("byLevel", "bySkill", "byType", "bySource"):
        if ic.get(group) != counts[group]:
            fail(errors, index_path,
                 f"counts.{group} mismatch: index {ic.get(group)} != actual {counts[group]}")

    if errors:
        print(f"FAIL: {len(errors)} error(s) across {total} questions in {len(files)} chunks")
        for e in errors[:40]:
            print(" -", e)
        if len(errors) > 40:
            print(f" ... and {len(errors)-40} more")
        return 1
    print(f"OK: {total} questions in {len(files)} chunks, {len(seen_ids)} unique ids")
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1
                  else 'public/data/questions/questions-index.json'))
