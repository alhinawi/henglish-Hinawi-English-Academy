#!/usr/bin/env python3
"""Henglish exam-vocab chunk validator (IELTS / TOEFL word lists).

Usage: python3 scripts/check_exam_vocab_chunks.py <vocab-index.json>
  e.g. python3 scripts/check_exam_vocab_chunks.py public/data/ielts/vocab/vocab-index.json
Exit 0 = all clean. This is the schema contract for every exam-vocab PR.

Manifest (vocab-index.json):
  exam        'ielts' | 'toefl'
  idPrefix    'ielts-v' | 'toefl-v'
  totalEntries, chunkSize (500), chunks[] (filenames)
  counts      {byLevel, byPos, byTopic}

Chunk files live in <dir>/chunks/ as arrays of entries.

Schema per entry:
  id           string, ^<idPrefix>-\\d{6}$, unique within the exam list
  word         English headword, non-empty, no Arabic
  partOfSpeech one of the vocab POS whitelist
  meaningAr    Egyptian Arabic meaning, must contain Arabic
  exampleEn    non-empty English example (exam-register sentence)
  exampleAr    Egyptian Arabic translation, must contain Arabic
  level        CEFR A1-C2
  topic        exam theme, e.g. 'education', 'health', 'environment'
  source       non-empty provenance tag
Optional: ipa (no Arabic), noteAr, synonyms. Unknown extra fields allowed.
"""
import json
import os
import re
import sys

AR = re.compile(r'[\u0600-\u06FF]')
CHUNK_RE = re.compile(r'^[a-z]{1,3}(\d{6})-(\d{6})\.json$')
LEVELS = {"A1", "A2", "B1", "B2", "C1", "C2"}
POS_SET = {"noun", "verb", "modal verb", "adjective", "adverb", "pronoun",
           "preposition", "determiner", "conjunction", "number",
           "interjection", "particle", "phrasal verb"}
REQUIRED = ["id", "word", "partOfSpeech", "meaningAr", "exampleEn",
            "exampleAr", "level", "topic", "source"]


def fail(errors, where, msg):
    errors.append(f"{where}: {msg}")


def main(index_path):
    errors = []
    if not os.path.exists(index_path):
        print(f"index not found: {index_path}")
        return 1
    index = json.load(open(index_path, encoding='utf-8'))
    chunks_dir = os.path.join(os.path.dirname(index_path), 'chunks')

    for field in ("exam", "idPrefix", "totalEntries", "chunkSize", "chunks", "counts"):
        if field not in index:
            fail(errors, index_path, f"missing index field '{field}'")
    prefix = index.get("idPrefix", "")
    if prefix not in ("ielts-v", "toefl-v"):
        fail(errors, index_path, f"idPrefix must be ielts-v|toefl-v, got {prefix!r}")
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
    seen_words = {}
    total = 0
    counts = {"byLevel": {}, "byPos": {}, "byTopic": {}}

    def bump(group, key):
        counts[group][key] = counts[group].get(key, 0) + 1

    for pos, name in enumerate(files):
        m = CHUNK_RE.match(name)
        path = os.path.join(chunks_dir, name)
        if not m:
            fail(errors, name, "filename must be <letters>SSSSSS-EEEEEE.json")
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
            word = str(q.get("word", "")).strip()
            if not word:
                fail(errors, where, "empty word")
            elif AR.search(word):
                fail(errors, where, "word must be English (contains Arabic)")
            else:
                key = word.lower()
                if key in seen_words:
                    fail(errors, where, f"duplicate word also at {seen_words[key]}")
                else:
                    seen_words[key] = where
            if q.get("partOfSpeech") not in POS_SET:
                fail(errors, where, f"partOfSpeech not in whitelist: {q.get('partOfSpeech')!r}")
            if not AR.search(str(q.get("meaningAr", ""))):
                fail(errors, where, "meaningAr must contain Arabic")
            if not str(q.get("exampleEn", "")).strip():
                fail(errors, where, "empty exampleEn")
            if not AR.search(str(q.get("exampleAr", ""))):
                fail(errors, where, "exampleAr must contain Arabic")
            if q.get("level") not in LEVELS:
                fail(errors, where, f"level must be CEFR A1-C2, got {q.get('level')!r}")
            if not str(q.get("topic", "")).strip():
                fail(errors, where, "empty topic")
            if not str(q.get("source", "")).strip():
                fail(errors, where, "empty source")
            if "ipa" in q and AR.search(str(q["ipa"])):
                fail(errors, where, "ipa must not contain Arabic")
            bump("byLevel", str(q.get("level")))
            bump("byPos", str(q.get("partOfSpeech")))
            bump("byTopic", str(q.get("topic")))

    if index.get("totalEntries") != total:
        fail(errors, index_path,
             f"totalEntries {index.get('totalEntries')} != actual {total}")
    ic = index.get("counts", {})
    for group in ("byLevel", "byPos", "byTopic"):
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
    print(f"OK: {total} {index.get('exam')} entries in {len(files)} chunks, {len(seen_ids)} unique ids")
    return 0


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    sys.exit(main(sys.argv[1]))
