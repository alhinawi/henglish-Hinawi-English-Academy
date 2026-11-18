import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for name,locale,saved,query,expected in [('arabic','ar-EG',None,'','ar'),('english','en-US',None,'','en'),('german','de-DE',None,'','en'),('saved-ar','en-US','ar','','ar'),('saved-en','ar-EG','en','','en'),('invalid','ar-EG','invalid','','ar'),('url','ar-EG','ar','?lang=en','en'),('no-signal','en-US',None,'','ar')]:
   context=b.new_context(viewport={'width':390,'height':1000},locale=locale)
   if saved:context.add_init_script('if (!localStorage.getItem("henglish_ui_lang_v1")) localStorage.setItem("henglish_ui_lang_v1",'+json.dumps(saved)+');')
   if name=='no-signal':context.add_init_script('Object.defineProperty(navigator,"languages",{get:()=>[]});Object.defineProperty(navigator,"language",{get:()=>""});')
   page=context.new_page();page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}));page.goto('http://127.0.0.1:4188/'+query);expect(page.locator('html')).to_have_attribute('lang',expected);expect(page.locator('html')).to_have_attribute('dir','rtl' if expected=='ar' else 'ltr');t=json.load(open('src/i18n/locales/'+expected+'.json'));expect(page.get_by_role('button',name=t['header.menuOpen'],exact=True)).to_be_visible();page.get_by_role('button',name=t['header.menuOpen'],exact=True).click();expect(page.get_by_text(t['sb.dashboard'],exact=True).first).to_be_visible() if 'sb.dashboard' in t else None
   page.wait_for_timeout(500)
   if name in ['arabic','english']:page.screenshot(path='/downloads/default-language-'+name+'.png');assert page.evaluate('localStorage.getItem("henglish_ui_lang_v1")') is None
   if name=='url':page.goto('http://127.0.0.1:4188/');expect(page.locator('html')).to_have_attribute('lang','en')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');context.close();print(name,expected,'browser/default/choice/direction PASS')
  b.close()
finally:server.shutdown();server.server_close()
