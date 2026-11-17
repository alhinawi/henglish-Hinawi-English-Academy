import functools,http.server,json,pathlib,threading,subprocess
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();meanings=json.loads(subprocess.check_output(['node','-e',"const fs=require('fs'),ts=require('typescript');require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);const a=require('./src/data/movieScenesData.ts').MOVIE_SCENES_CATALOG.flatMap(s=>s.subtitles.map(t=>[t.en.trim(),t.arEg.trim()]));const b=JSON.parse(fs.readFileSync('public/data/sentences.json')).map(s=>[s.english.trim(),s.arabicEg.trim()]);const d={},seen=new Set();for(const [en,ar]of [...a,...b]){if(en.split(/\\s+/).length<2||en.split(/\\s+/).length>10||!ar||seen.has(en.toLowerCase()))continue;seen.add(en.toLowerCase());d[en]=ar;}process.stdout.write(JSON.stringify(d));"],text=True));server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.clock.install();page.add_init_script('Math.random=()=>0.75');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#games');page.get_by_role('heading',name=t['tf.title'],exact=True).locator('..').get_by_role('button',name=t['ah.playNow'],exact=True).click();page.get_by_role('button',name=t['as.start'],exact=True).click();expect(page.get_by_role('button',name=t['tf.trueBtn'],exact=True)).to_be_visible()
   for i in range(10):
    en=page.locator('div.text-xl[dir=ltr]');english=en.inner_text().strip();arabic=en.locator('..').locator(':scope > div').nth(2).inner_text().strip();truth=meanings[english]==arabic;page.get_by_role('button',name=t['tf.trueBtn']if truth else t['tf.falseBtn'],exact=True).click();page.clock.run_for(850)
   saved=page.evaluate("JSON.parse(localStorage.getItem('henglish_arcade_v1:guest'))");assert saved['totalPlays']==1 and saved['best']['true-false']==10;page.screenshot(path='/downloads/true-false-correct-translations-'+lang+'.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next ten realcontent truthanswers score10,oneplay,translated results,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
