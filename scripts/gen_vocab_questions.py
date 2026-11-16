#!/usr/bin/env python3
"""Generate vocabulary/sentence questions from the HAND-VERIFIED vocab chunks.
Accuracy model: question content (answer, meanings, examples) comes only from
verified chunk data; distractors are other verified entries with disjoint
Arabic token sets (no shared meaning token => unambiguous).
Types: meaning-mcq (EN->AR), reverse-mcq (AR->EN), cloze (verified example, word blanked).
Deterministic: RNG seeded per question id."""
import json, glob, re, random, sys, os
from collections import defaultdict

AR_TOK = re.compile(r'[؀-ۿ]+')
LVL_ORDER = ['A1','A2','B1','B2','C1','C2']

def ar_tokens(s):
    return set(t for t in AR_TOK.findall(s) if len(t) > 1)

def main():
    os.chdir(os.path.join(os.path.dirname(__file__), '..'))
    entries = []
    for cp in sorted(glob.glob('public/data/vocab/chunks/r*.json')):
        entries.extend(json.load(open(cp, encoding='utf-8')))
    print('verified entries:', len(entries))

    # distractor pools by (pos, level-band index)
    pools = defaultdict(list)
    for e in entries:
        li = LVL_ORDER.index(e['level']) if e['level'] in LVL_ORDER else 2
        pools[(e['partOfSpeech'], li)].append(e)

    def pick_distractors(e, n, field):
        """field 'meaningAr' for EN->AR (Arabic options), 'word' for AR->EN (English options)."""
        li = LVL_ORDER.index(e['level']) if e['level'] in LVL_ORDER else 2
        correct_toks = ar_tokens(e['meaningAr'])
        seen, out = {e['word'].lower()}, []
        seen_vals = {str(e[field]).strip().lower()}  # option-text dedupe: different words can share a gloss
        for band in (0, -1, 1, -2, 2):
            li2 = li + band
            if not (0 <= li2 < len(LVL_ORDER)): continue
            cands = pools.get((e['partOfSpeech'], li2), [])
            rng.shuffle(cands)
            for c in cands:
                if len(out) >= n: break
                if c['word'].lower() in seen: continue
                if field == 'meaningAr' and ar_tokens(c['meaningAr']) & correct_toks: continue
                if field == 'word' and ar_tokens(c['meaningAr']) & correct_toks: continue
                if c['meaningAr'] == e['meaningAr']: continue
                v = str(c[field]).strip().lower()
                if v in seen_vals: continue
                seen_vals.add(v)
                seen.add(c['word'].lower())
                out.append(c)
            if len(out) >= n: break
        return out[:n]

    questions = []
    seq = 0
    for e in entries:
        rng = random.Random('qgen-' + e['id'])
        word, mean = e['word'], e['meaningAr']
        # skip entries whose meaning is too thin for option generation
        if len(ar_tokens(mean)) == 0: continue

        # T1: EN -> AR meaning (ranks 1-1600 + 10001-15000)
        ds = pick_distractors(e, 3, 'meaningAr') if (e['rank'] <= 1600 or 10001 <= e['rank'] <= 15000) else []
        if len(ds) == 3:
            opts = [mean] + [d['meaningAr'] for d in ds]
            rng.shuffle(opts)
            seq += 1
            questions.append({
                'id': f'q-voc-{seq:06d}', 'skill': 'vocabulary', 'type': 'multiple-choice',
                'level': e['level'], 'prompt': f'What does "{word}" mean?',
                'promptAr': f'اختر المعنى الصحيح لكلمة "{word}":',
                'options': opts, 'answerIndex': opts.index(mean),
                'explanationAr': f'معنى "{word}" هو: {mean}. مثال: {e["exampleAr"]}',
                'topic': f'Vocabulary: {e["partOfSpeech"]} ({e["level"]})', 'source': 'generated-vocab',
            })

        # T3: AR -> EN word (ranks 1-1600 + 10001-12000)
        ds = pick_distractors(e, 3, 'word') if (e['rank'] <= 1600 or 10001 <= e['rank'] <= 12000) else []
        if len(ds) == 3:
            opts = [word] + [d['word'] for d in ds]
            rng.shuffle(opts)
            seq += 1
            questions.append({
                'id': f'q-voc-{seq:06d}', 'skill': 'vocabulary', 'type': 'multiple-choice',
                'level': e['level'], 'prompt': f'Which English word means: {mean}?',
                'promptAr': f'اختر الكلمة الإنجليزية التي معناها: {mean}',
                'options': opts, 'answerIndex': opts.index(word),
                'explanationAr': f'الكلمة الصحيحة هي "{word}" وتعني: {mean}.',
                'topic': f'Vocabulary: {e["partOfSpeech"]} ({e["level"]})', 'source': 'generated-vocab',
            })

        # T2: cloze from the verified example (only where highlight blanks cleanly)
        hl, ex = e.get('highlight',''), e.get('exampleEn','')
        if hl and hl in ex and len(word) > 2 and e['rank'] <= 1600:
            blanked = ex.replace(hl, '______', 1)
            if '______' in blanked:
                ds = pick_distractors(e, 3, 'word')
                if len(ds) == 3:
                    opts = [word] + [d['word'] for d in ds]
                    rng.shuffle(opts)
                    seq += 1
                    questions.append({
                        'id': f'q-voc-{seq:06d}', 'skill': 'vocabulary', 'type': 'fill-blank',
                        'level': e['level'], 'prompt': blanked,
                        'promptAr': 'أكمل الجملة بالكلمة المناسبة:',
                        'options': opts, 'answerIndex': opts.index(word),
                        'explanationAr': f'الكلمة الصحيحة هي "{word}" بمعنى {mean}. الترجمة: {e["exampleAr"]}',
                        'topic': f'Vocabulary in context ({e["level"]})', 'source': 'generated-vocab',
                    })

    # write chunks of 200
    os.makedirs('public/data/questions/chunks', exist_ok=True)
    chunk_size = 200
    chunks = []
    for i in range(0, len(questions), chunk_size):
        part = questions[i:i+chunk_size]
        name = f'q{i+1:06d}-{i+len(part):06d}.json'
        json.dump(part, open(f'public/data/questions/chunks/{name}', 'w'), ensure_ascii=False, indent=1)
        chunks.append(name)
    by_level = defaultdict(int); by_type = defaultdict(int)
    for q in questions:
        by_level[q['level']] += 1; by_type[q['type']] += 1
    manifest = {
        'totalQuestions': len(questions), 'chunkSize': chunk_size, 'chunks': chunks,
        'counts': {'byLevel': dict(by_level), 'bySkill': {'vocabulary': len(questions)},
                   'byType': dict(by_type), 'bySource': {'generated-vocab': len(questions)}},
    }
    json.dump(manifest, open('public/data/questions/questions-index.json', 'w'), ensure_ascii=False, indent=1)
    print('questions:', len(questions), 'chunks:', len(chunks))
    print('byLevel:', dict(by_level)); print('byType:', dict(by_type))

if __name__ == '__main__':
    main()
