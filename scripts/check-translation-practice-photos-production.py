import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4192),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4192');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#translation');page.get_by_role('button',name=t['ts.practice'],exact=True).click();level=page.get_by_label(t['tpr.filter.level'],exact=True);direction=page.get_by_label(t['tpr.filter.direction'],exact=True);draft=page.get_by_label(t['tpr.draft'],exact=True);draft.fill('Keep this photo task draft')
   for lev,way,theme in [('A1','ar-to-en','study'),('A1','en-to-ar','travel'),('B1','ar-to-en','work'),('C2','en-to-ar','discussion')]:
    level.select_option(lev);direction.select_option(way);img=page.get_by_role('img',name=t['tpr.photo.'+theme],exact=True);expect(img).to_be_visible();img.evaluate('(el)=>el.decode()');assert img.evaluate('el=>el.naturalWidth>0');expect(page.get_by_text(t['tpr.photo.note'],exact=True)).to_be_visible()
   level.select_option('all');direction.select_option('all');expect(draft).to_have_value('Keep this photo task draft');level.select_option('C2');direction.select_option('en-to-ar');photo=page.locator('figure').filter(has=page.get_by_role('img',name=t['tpr.photo.discussion'],exact=True));photo.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-96,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}translation-practice-photos-{lang}.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');print(lang,'all4licensedlocalphotosdecode,themechangeswithtask,caption/disclaimer,draftretention,390px PASS');page.close()
  b.close()
finally:server.shutdown();server.server_close()
