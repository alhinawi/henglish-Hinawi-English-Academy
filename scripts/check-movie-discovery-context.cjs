const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const source=fs.readFileSync('src/services/youtubeSearchService.ts','utf8');
const ast=ts.createSourceFile('search.ts',source,ts.ScriptTarget.Latest,true);
const code=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='searchYouTubeVideos').getText(ast);
const scene={id:'catalog-scene',youtubeId:'abcdefghijk',sceneTitle:'Learning scene',sceneDescription:'Description',director:'Source',releaseYear:2020,isEmbeddable:true,startTime:10,endTime:35,subtitles:[{id:'cue',start:10,end:15,en:'Hello'}]};
(async()=>{for(const mode of ['no-key','suggestions','quota','network']){
const ctx={exports:{},Date,Map,URL,setTimeout,console:{warn:()=>{}},searchCache:new Map(),lastRequestTime:0,getEnvVar:()=>['no-key','suggestions'].includes(mode)?'':'test',queryVideoCatalog:opts=>({videos:mode==='suggestions'&&opts.query?[]:[scene],totalMatches:mode==='suggestions'&&opts.query?0:1}),fetch:async()=>{if(mode==='network')throw Error('offline');return {ok:false,status:403};}};
vm.runInNewContext(ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,ctx);const result=await ctx.exports.searchYouTubeVideos('query');assert.equal(result.source,'verified_catalog_fallback');assert.equal(result.items[0].catalogScene,scene);
}
const page=fs.readFileSync('src/views/MovieStudioPage.tsx','utf8');assert(page.includes("ytResults?.source === 'verified_catalog_fallback' && item.catalogScene"));assert(page.includes('handleSelectScene(item.catalogScene);\n      return;'));console.log('No-key,empty-match suggestions,quota,network discovery retain full catalog scene; playback reuses exact scene: PASS');})();
