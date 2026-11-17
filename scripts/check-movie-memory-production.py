import functools,http.server,json,pathlib,threading,subprocess
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
scene=json.loads(subprocess.check_output(['node','-e',"const fs=require('fs'),ts=require('typescript');require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);process.stdout.write(JSON.stringify(require('./src/data/movieScenesData.ts').MOVIE_SCENES_CATALOG.flatMap(s=>s.subtitles.map(t=>[t.en.trim(),t.arEg.trim()]))));"],text=True));pairs=scene+[[s['english'].strip(),s['arabicEg'].strip()]for s in json.load(open('public/data/sentences.json'))];meanings={}
for en,ar in pairs:meanings.setdefault(en,ar)
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.clock.install();page.add_init_script('Math.random=()=>0.5;');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#games');page.get_by_role('heading',name=t['ah.gameMovieMemory'],exact=True).locator('..').get_by_role('button',name=t['ah.playNow'],exact=True).click();page.get_by_role('button',name=t['as.start'],exact=True).click();grid=page.locator('div.grid.grid-cols-3.gap-2');cards=grid.get_by_role('button');expect(cards).to_have_count(12);seen={}
   for i in range(0,12,2):
    for j in [i,i+1]:cards.nth(j).click();seen[j]=(cards.nth(j).get_attribute('dir'),cards.nth(j).inner_text())
    page.clock.run_for(950)
   ar=[text for d,text in seen.values()if d=='rtl'];assert len(ar)==6 and len(set(ar))==6
   for i,(d,text)in seen.items():
    if d!='ltr':continue
    j=next(j for j,(dd,tt)in seen.items()if dd=='rtl' and tt==meanings[text]);cards.nth(i).click();cards.nth(j).click()
   page.screenshot(path='/downloads/movie-memory-distinct-'+lang+'.png',animations='disabled');page.clock.run_for(700);saved=page.evaluate("JSON.parse(localStorage.getItem('henglish_arcade_v1:guest'))");assert saved['totalPlays']==1 and saved['plays']['movie-memory']==1;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next movie-memory six uniqueArabiccards,real matching deck finishable,onecompletion,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
