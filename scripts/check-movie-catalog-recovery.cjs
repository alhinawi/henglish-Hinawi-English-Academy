const fs=require('fs'),assert=require('assert/strict');const s=fs.readFileSync('src/views/MovieStudioPage.tsx','utf8');
const clear=s.match(/const clearCatalogSearch = \(\) => \{([^}]+)\}/)[1];assert(clear.includes("setSearchQuery('')"));assert(clear.includes('focus()'));assert(!clear.includes('setSelected'));
const reset=s.match(/const resetCatalogFilters = \(\) => \{([^}]+)\}/)[1];for(const part of ["setSearchQuery('')","setSelectedCategory('all')","setSelectedCefr('all')","setSelectedAccent('all')",'setCatalogPage(1)','focus()'])assert(reset.includes(part));
assert(s.includes("event.key === 'Escape'"));assert(s.includes("aria-label={t('ms.clearSearch')}"));assert(s.includes('onClick={resetCatalogFilters}'));assert(!reset.includes('clearSearchHistory'));assert(!clear.includes('addSearchHistory'));
console.log('Movie catalog clear/Escape preserves filters, explicit reset clears all filters, search focus and history preserved: PASS');
