# Vocabulary Academy scale-up: rank manifest + chunk schema

Single source of truth: `data/vocab-ranks/english-30k.tsv` v2 (rank, lemma, pos, cefr, cefr_src, zipf). Proper nouns/brands/acronyms filtered (NLTK names + WordNet exact-case lemma match); POS re-tagged from WordNet first sense where available (still advisory - chunk author verifies). `cefr_src` is `cefrj` (official CEFR-J level) or `band` (frequency-band estimate).
Frequency order from wordfreq + hermitdave/FrequencyWords (both CC BY-SA 4.0 - keep this attribution in app credits). Lemmatized/POS via spaCy en_core_web_sm; lexical validation via WordNet (or zipf>=3.6); CEFR via CEFR-J Vocabulary Profile 1.5 overlay, fallback rank bands (1-500 A1, 501-1500 A2, 1501-3500 B1, 3501-6000 B2, 6001-8000 C1, 8001-30000 C2). POS column is advisory - verify per entry; level column is authoritative.

Content lives in `public/data/vocab/chunks/r00001-00100.json` style files: 100 entries each, rank order, JSON array. Fields: id (`voc-w` + 5-digit rank), word (= manifest lemma), rank, ipa (/slashed/), partOfSpeech, meaningAr (Egyptian colloquial), level (= manifest cefr), category (everyday|business|tech|academic|travel|workplace|medical|food|hotel|phrasal_verbs|idioms|collocations), exampleEn, exampleAr (Egyptian colloquial), highlight (substring of exampleEn), collocation (optional), cefrSrc (optional, copy of manifest cefr_src - the UI marks band-estimated levels as estimated). No audio fields - word audio goes through the app's ElevenLabs TTS path.

Rank ownership: agent main = 1-10000, helper B = 10001-20000, helper C = 20001-30000.

Validate before every PR:
```
python3 scripts/check_vocab_chunks.py data/vocab-ranks/english-30k.tsv public/data/vocab/chunks/r*.json
```
Must exit 0. Enforces rank/word/level match, required fields, no Arabic in IPA, highlight inside exampleEn, zero duplicate words across chunks.
