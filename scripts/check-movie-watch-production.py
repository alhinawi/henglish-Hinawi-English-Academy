import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');t=json.load(open('src/i18n/locales/'+lang+'.json'))
   page.add_init_script('''window.__denyWatch=true;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.__denyWatch&&k==='henglish_recently_watched_videos:guest')throw Error('quota');return original.call(this,k,v)};''')
   page.goto('http://127.0.0.1:4188/?lang='+lang+'#movies');card=page.get_by_title(t['ms.saveClip'],exact=True).first.locator('..').locator('..');card.click();expect(page.get_by_role('button',name=t['ms.backToLibrary'],exact=True)).to_be_visible();expect(page.get_by_role('alert').filter(has_text=t['vocab.saveError'])).to_be_visible();assert page.evaluate("localStorage.getItem('henglish_recently_watched_videos:guest')") is None;page.evaluate('scrollTo(0,0)');page.screenshot(path='/downloads/movie-watch-error-'+lang+'.png');page.evaluate('window.__denyWatch=false');page.get_by_role('button',name=t['ms.backToLibrary'],exact=True).click();page.get_by_title(t['ms.saveClip'],exact=True).first.locator('..').locator('..').click();expect(page.get_by_role('alert').filter(has_text=t['vocab.saveError'])).to_have_count(0);assert len(json.loads(page.evaluate("localStorage.getItem('henglish_recently_watched_videos:guest')")))==1;page.close();print(lang,'failed history write disclosed while selected player opens,reopen retry saves once PASS')
  b.close()
finally:server.shutdown();server.server_close()
