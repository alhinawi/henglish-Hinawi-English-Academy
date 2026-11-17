import functools,http.server,json,pathlib,threading,re
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});spoken=[];page.route('**/api/tts/synthesize',lambda r:(spoken.append(r.request.post_data_json),r.fulfill(status=503,json={'error':'fixture'})));page.add_init_script('Math.random=()=>0.5;delete window.speechSynthesis;');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#games')
   def launch():
    spoken.clear();page.get_by_role('heading',name=t['ah.gameListeningChallenge'],exact=True).locator('..').get_by_role('button',name=t['ah.playNow'],exact=True).click();page.get_by_role('button',name=t['as.start'],exact=True).click();expect(page.get_by_role('textbox',name=t['lc.hint'],exact=True)).to_be_visible();page.wait_for_timeout(100)
    assert spoken;return spoken[-1]['text']
   target=launch();words=re.sub("[^a-z0-9'\\s]",' ',target.lower()).split();assert len(words)>=3;page.get_by_role('textbox',name=t['lc.hint'],exact=True).fill(' '.join(reversed(words))+' extra extra extra extra extra');page.get_by_role('button',name=t['lc.check'],exact=True).click();expect(page.get_by_text(t['lc.excellent'],exact=True)).to_have_count(0);expect(page.get_by_text(target,exact=True)).to_be_visible();page.screenshot(path='/downloads/listening-order-'+lang+'.png');page.get_by_role('button',name=t['as.quit'],exact=True).click();target=launch();page.get_by_role('textbox',name=t['lc.hint'],exact=True).fill(target);page.get_by_role('button',name=t['lc.check'],exact=True).click();expect(page.get_by_text(t['lc.excellent'],exact=True)).to_be_visible();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next reversed+padded dictation rejected,exact dictated sentence accepted,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
