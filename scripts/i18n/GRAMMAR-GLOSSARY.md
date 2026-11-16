# Protected English-grammar labels

`grammar-glossary.json` records 33 grammar concepts for all 28 content languages.
The concepts include all twelve tense/aspect teaching labels, Be Going To,
conditionals, eight parts of speech (plus articles), passive voice, modal verbs,
relative clauses and reported speech.

Each language/concept entry records its source and one of two statuses:
- `sourced-label`: a label in a multilingual grammar reference. Not a native-speaker review claim.
- `canonical-english`: no native equivalent was established in this pass. Keep the English teaching term instead of inventing a translation.

There are 470 reference-backed labels among 924 language/concept entries. Some
reference labels themselves use English. The remaining 454 deliberately retain
canonical English. This is not a claim of full native-language terminology review.

Wikidata labels describe grammatical concepts, with English tense items linked
from the English-language entity. Hebrew Present Simple and related tense names
were cross-checked against an independent English-teaching tense table. Individual
source URLs are recorded beside every term, so labels can be reviewed separately.

Dictionary labels are citation forms, not inflected phrases. Standalone headings
use the sourced label when available. Compound headings protect the original
English term and translate the surrounding text using stored templates. This
avoids inventing plural/case agreement, such as putting a singular dictionary
label after a numeral. The full English title still appears as the lesson subtitle.

## Sources
- https://www.wikidata.org/wiki/Q1860 (links the English tense/aspect concepts)
- https://www.wikidata.org/wiki/Q3910936 (Simple Present)
- https://www.wikidata.org/wiki/Wikidata:Lexicographical_data/Documentation/Lexical_categories
- https://free-english.co.il/grammar/tenses (Hebrew English-tense table)
- https://my-poly.app/grammar/he-en/present-simple/ (Hebrew Present Simple cross-check)
- https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/verb-phrases
- https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/present-tense
- https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/present-continuous

Other concept-specific Wikidata URLs are in the glossary JSON.

## Regeneration and checks

After emitting machine locale or app-content translations, run:

```
node scripts/grammar-glossary.mjs
python3 scripts/check_i18n.py
```

The generator updates only protected title/UI values. It never changes keys,
layout or review flags. `grammar-overrides.json` is the generated manifest.
`grammar-heading-templates.json` contains machine-translated surrounding text;
QQnQQ tokens must stay intact. New templates can be exported with
`node scripts/grammar-glossary.mjs --export-templates` and translated separately.

`node scripts/grammar-glossary.mjs --check` checks already-protected output fields.
The regular parity/Arabic-ratchet gate runs it too. New extraction keys do not
fail merely because glossary generation has not caught up yet. Existing protected
labels cannot silently revert to generic machine translations.
