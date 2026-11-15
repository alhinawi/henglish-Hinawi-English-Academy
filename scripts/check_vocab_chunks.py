#!/usr/bin/env python3
"""Henglish vocab chunk validator. Usage: python3 check_vocab_chunks.py english-30k.tsv chunk1.json [chunk2.json ...]
Exit 0 = all clean. The TSV manifest is the source of truth for rank<->word and level."""
import json, re, sys

AR = re.compile(r'[\u0600-\u06FF]')
REQUIRED = ["id","word","rank","ipa","partOfSpeech","meaningAr","level","category","exampleEn","exampleAr","highlight"]
POS_SET = {"noun","verb","modal verb","adjective","adverb","pronoun","preposition","determiner","conjunction","number","interjection","particle","phrasal verb"}
CATS = {"everyday","business","tech","academic","travel","workplace","medical","food","hotel","phrasal_verbs","idioms","collocations"}

def main(tsv, chunks):
    ranks = {}
    for line in open(tsv, encoding='utf-8'):
        if line.startswith('#') or not line.strip(): continue
        n, lemma, pos, cefr, z = line.rstrip('\n').split('\t')
        ranks[int(n)] = (lemma, pos, cefr)
    errors = checked = 0
    seen_words = {}
    for cp in chunks:
        m = re.search(r'r(\d{5})-(\d{5})\.json$', str(cp))
        if not m:
            print(f"ERR {cp}: filename must be r00001-00100.json style"); errors += 1; continue
        start, end = int(m.group(1)), int(m.group(2))
        try:
            data = json.load(open(cp, encoding='utf-8'))
        except Exception as ex:
            print(f"ERR {cp}: invalid JSON: {ex}"); errors += 1; continue
        if len(data) != end - start + 1:
            print(f"ERR {cp}: {len(data)} entries, expected {end-start+1}"); errors += 1
        for i, e in enumerate(data):
            rank = start + i; checked += 1
            lemma, _pos, cefr = ranks.get(rank, (None, None, None))
            for fld in REQUIRED:
                if not str(e.get(fld, '')).strip():
                    print(f"ERR {cp}[{i}] rank {rank}: missing/empty {fld}"); errors += 1
            if e.get("id") != f"voc-w{rank:05d}": print(f"ERR {cp}[{i}]: id must be voc-w{rank:05d}"); errors += 1
            if e.get("rank") != rank: print(f"ERR {cp}[{i}]: rank field != {rank}"); errors += 1
            if lemma and e.get("word") != lemma: print(f"ERR {cp}[{i}]: word '{e.get('word')}' != manifest '{lemma}'"); errors += 1
            if cefr and e.get("level") != cefr: print(f"ERR {cp}[{i}]: level '{e.get('level')}' != manifest '{cefr}'"); errors += 1
            if e.get("partOfSpeech") not in POS_SET: print(f"ERR {cp}[{i}]: bad partOfSpeech"); errors += 1
            if e.get("category") not in CATS: print(f"ERR {cp}[{i}]: bad category"); errors += 1
            if AR.search(str(e.get("ipa",""))): print(f"ERR {cp}[{i}]: Arabic in ipa"); errors += 1
            if not str(e.get("ipa","")).startswith("/"): print(f"ERR {cp}[{i}]: ipa must be /slashed/"); errors += 1
            if str(e.get("highlight","")) not in str(e.get("exampleEn","")): print(f"ERR {cp}[{i}]: highlight not a substring of exampleEn"); errors += 1
            if not AR.search(str(e.get("meaningAr",""))): print(f"ERR {cp}[{i}]: meaningAr not Arabic"); errors += 1
            if not AR.search(str(e.get("exampleAr",""))): print(f"ERR {cp}[{i}]: exampleAr not Arabic"); errors += 1
            w = str(e.get("word","")).lower()
            if w in seen_words: print(f"ERR {cp}[{i}]: word also in {seen_words[w]}"); errors += 1
            seen_words[w] = cp
    print(f"checked {checked} entries, {errors} errors")
    sys.exit(1 if errors else 0)

if __name__ == "__main__":
    if len(sys.argv) < 3: print("usage: check_vocab_chunks.py english-30k.tsv chunk.json [...]"); sys.exit(2)
    main(sys.argv[1], sys.argv[2:])
