import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.add_init_script('''window.__denyBookmarks=true;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.__denyBookmarks&&k==='henglish_saved_videos:guest')throw Error('quota');return original.call(this,k,v)};''');page.goto('http://127.0.0.1:4188/?lang='+lang+'#movies');button=page.get_by_title(t['ms.saveClip'],exact=True).first;expect(button).to_be_visible();button.click();expect(page.get_by_role('alert').filter(has_text=t['vocab.saveError'])).to_be_visible();expect(page.get_by_title(t['ms.removeSaved'],exact=True)).to_have_count(0);page.evaluate('scrollTo(0,0)');page.screenshot(path='/downloads/movie-bookmark-error-'+lang+'.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.evaluate('window.__denyBookmarks=false');page.get_by_title(t['ms.saveClip'],exact=True).first.click();expect(page.get_by_role('alert').filter(has_text=t['vocab.saveError'])).to_have_count(0);expect(page.get_by_title(t['ms.removeSaved'],exact=True)).to_have_count(1);page.reload();expect(page.get_by_title(t['ms.removeSaved'],exact=True)).to_have_count(1);page.close();print(lang,'quota error,unchanged bookmark,retry and reload persisted PASS')
  b.close()
finally:server.shutdown();server.server_close()
