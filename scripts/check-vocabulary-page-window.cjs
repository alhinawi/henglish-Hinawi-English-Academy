const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');const src=fs.readFileSync('src/components/vocabulary/VocabularyExplorer.tsx','utf8');
const expr=src.slice(src.indexOf('                    const firstPage ='),src.indexOf('                    return (',src.indexOf('                    const firstPage =')));
for(let totalPages=1;totalPages<=150;totalPages++)for(let page=1;page<=totalPages;page++){
 const values=Array.from({length:Math.min(5,totalPages)},(_,i)=>vm.runInNewContext(expr+'\npageNum;',{Math,searchResults:{page,totalPages},i}));
 assert.equal(new Set(values).size,values.length);assert.ok(values.every(p=>p>=1&&p<=totalPages));assert.ok(values.includes(page));assert.ok(values.every((p,i)=>!i||p===values[i-1]+1));
}
assert.ok(src.includes("aria-current={searchResults.page === pageNum ? 'page' : undefined}"));
console.log('Vocabulary page window stays unique, contiguous, in bounds and includes current page for every page of1-150pages: PASS');
