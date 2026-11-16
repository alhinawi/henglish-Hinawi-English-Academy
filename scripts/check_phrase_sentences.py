#!/usr/bin/env python3
"""Henglish phrase-sentences validator (10 example sentences per entry).

Usage: python3 scripts/check_phrase_sentences.py <bank-index.json>
  e.g. python3 scripts/check_phrase_sentences.py public/data/idioms/idioms-index.json

Contract (worker deliveries, 100 entries per file):
  public/data/<bank>/sentences/<prefix>-sent-SSSSSS-EEEEEE.json
  {"items":[{"id":"idm-000001","sentences":[{"en":"...","ar":"..."} x10]}]}

Rules: file ranges contiguous per 100 ids, ids match the phrase bank,
exactly 10 sentences per covered entry, en is English (no Arabic),
ar contains Arabic. Partial coverage is fine (UI falls back to the
entry's built-in example).
"""
import json
import os
import re
import sys

AR = re.compile(r'[\u0600-\u06FF]')
FILE_RE = re.compile(r'^[a-z]{2,4}-sent-(\d{6})-(\d{6})\.json$')


def fail(errors, where, msg):
    errors.append(f"{where}: {msg}")


def main(index_path):
    errors = []
    index = json.load(open(index_path, encoding='utf-8'))
    prefix = index.get('idPrefix', '')
    bank_dir = os.path.dirname(index_path)
    sent_dir = os.path.join(bank_dir, 'sentences')
    if not os.path.isdir(sent_dir):
        print(f"OK: no sentences directory yet for {index_path}")
        return 0

    # Bank ids for cross-reference
    bank_ids = set()
    chunks_dir = os.path.join(bank_dir, 'chunks')
    for name in index.get('chunks', []):
        for r in json.load(open(os.path.join(chunks_dir, name), encoding='utf-8')):
            bank_ids.add(r['id'])

    files = sorted(f for f in os.listdir(sent_dir) if f.endswith('.json'))
    seen_ids = set()
    total_sentences = 0
    # Coverage is partial by design: the first delivered block sets the
    # baseline, later blocks must be contiguous from there.
    expected_lo = None
    for name in files:
        m = FILE_RE.match(name)
        if not m:
            fail(errors, name, "filename must be <prefix>-sent-SSSSSS-EEEEEE.json")
            continue
        lo, hi = int(m.group(1)), int(m.group(2))
        if not name.startswith(f"{prefix}-sent-"):
            fail(errors, name, f"filename prefix must be {prefix}-sent-")
        if expected_lo is not None and lo != expected_lo:
            if lo > expected_lo:
                # Coverage gap between writer batches is expected while
                # deliveries are in flight; report it, don't fail.
                print(f"note: coverage gap {expected_lo}..{lo - 1} (pending writer batch)")
            else:
                fail(errors, name, f"overlap: block starts at {lo}, previous ended at {expected_lo - 1}")
        if hi - lo != 99:
            # A partial tail block is allowed only as the LAST file of a
            # contiguous run; it gets completed by the next batch.
            idx = files.index(name)
            is_last_of_run = idx == len(files) - 1
            if not is_last_of_run:
                nm = FILE_RE.match(files[idx + 1])
                is_last_of_run = not nm or int(nm.group(1)) != hi + 1
            if not is_last_of_run:
                fail(errors, name, "blocks must cover exactly 100 ids")
        expected_lo = hi + 1
        data = json.load(open(os.path.join(sent_dir, name), encoding='utf-8'))
        items = data.get('items') if isinstance(data, dict) else None
        if not isinstance(items, list):
            fail(errors, name, "root must be an object with an 'items' array")
            continue
        for i, item in enumerate(items):
            where = f"{name}[{i}]"
            iid = str(item.get('id', ''))
            if iid not in bank_ids:
                fail(errors, where, f"id {iid!r} not in the {prefix} bank")
            try:
                numeric = int(iid.rsplit('-', 1)[1])
                if not (lo <= numeric <= hi):
                    fail(errors, where, f"id {iid!r} outside the block range {lo}-{hi}")
            except (ValueError, IndexError):
                fail(errors, where, f"unparseable id {iid!r}")
            if iid in seen_ids:
                fail(errors, where, f"duplicate sentences for {iid!r}")
            seen_ids.add(iid)
            sents = item.get('sentences')
            if not isinstance(sents, list) or len(sents) != 10:
                fail(errors, where, f"must have exactly 10 sentences, got {len(sents) if isinstance(sents, list) else 'n/a'}")
                continue
            for j, s in enumerate(sents):
                en = str(s.get('en', '')).strip()
                ar = str(s.get('ar', '')).strip()
                if not en or AR.search(en):
                    fail(errors, f"{where}.sentences[{j}]", "en must be non-empty English")
                if not ar or not AR.search(ar):
                    fail(errors, f"{where}.sentences[{j}]", "ar must contain Arabic")
                total_sentences += 1

    if errors:
        print(f"ERRORS ({len(errors)}):")
        for e in errors[:40]:
            print(" -", e)
        return 1
    print(f"OK: {len(seen_ids)} entries with sentences, {total_sentences} sentences checked in {index_path}")
    return 0


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    sys.exit(main(sys.argv[1]))
