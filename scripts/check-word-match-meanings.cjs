const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const words=Array.from({length:8},(_,i)=>({word:'word-'+i,meaningAr:'meaning-'+i})).concat([{word:'synonym',meaningAr:'meaning-0'}]);
const context={exports:{},Set,require:path=>path.includes('vocabularyAcademyData')?{VOCABULARY_ACADEMY_WORDS:words}:path.includes('movieScenesData')?{MOVIE_SCENES_CATALOG:[]}:path.includes('sentencesService')?{loadSentences:async()=>[]}:null};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/components/arcade/arcadeContent.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
const{allWordPairs,uniqueMeaningPairs,sample}=context.exports;const pool=allWordPairs();assert.equal(pool.length,9);const unique=uniqueMeaningPairs(pool);assert.equal(unique.length,8);assert.equal(uniqueMeaningPairs([{en:'one',ar:' meaning '},{en:'two',ar:'meaning'},{en:'blank',ar:' '}]).length,1);
for(let i=0;i<100;i++){const board=sample(unique,8);assert.equal(board.length,8);assert.equal(new Set(board.map(x=>x.ar)).size,8);for(const pair of board)assert.equal(board.filter(x=>x.ar===pair.ar).length,1)}
assert(fs.readFileSync('src/components/arcade/games/WordMatchGame.tsx','utf8').includes('sample(uniqueMeaningPairs(allWordPairs()), PAIRS)'));
console.log('WordMatch duplicate meanings removed before sampling, unique owner for each Arabic choice, trimming and blank guards, 100 finishable eight-pair boards: PASS');
