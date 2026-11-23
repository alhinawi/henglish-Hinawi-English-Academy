import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4211),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4211');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#translation');page.get_by_role('button',name=t['ts.practice'],exact=True).click();level=page.get_by_label(t['tpr.filter.level'],exact=True);direction=page.get_by_label(t['tpr.filter.direction'],exact=True);draft=page.get_by_label(t['tpr.draft'],exact=True);draft.fill('Keep my first draft')
   for value in ['A1','A2','B1','B2','C1','C2']:
    level.select_option(value)
    for way in ['ar-to-en','en-to-ar']:
     direction.select_option(way);expect(draft).to_have_attribute('dir','ltr' if way=='ar-to-en' else 'rtl');page.get_by_role('button',name=t['tpr.show'],exact=True).click();expect(page.get_by_role('heading',name=t['tpr.answers'],exact=True)).to_be_visible();page.get_by_role('button',name=t['tpr.next'],exact=True).click();expect(page.get_by_role('heading',name=t['tpr.answers'],exact=True)).to_have_count(0)
   level.select_option('all');direction.select_option('all');expect(draft).to_have_value('Keep my first draft');level.select_option('C2');direction.select_option('en-to-ar');page.get_by_role('button',name=t['tpr.next'],exact=True).click();page.get_by_role('button',name=t['tpr.next'],exact=True).click();draft.fill('مسودة ترجمة للمراجعة فقط');page.get_by_role('button',name=t['tpr.show'],exact=True).click();level.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-125,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}translation-practice-expansion-{lang}.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');print(lang,'all12level/direction combinations, reveal/next reset, target direction, filter draft retention,390px PASS');page.close()
  b.close()
finally:server.shutdown();server.server_close()
