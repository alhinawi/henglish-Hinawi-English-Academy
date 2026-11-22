import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4195),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4195');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});")
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/pronunciation/?lang='+lang);panel=page.get_by_role('region',name=t['pa.pairRecord.title'],exact=True)
   expect(panel.get_by_text('sheep · ship · sheep · ship',exact=True)).to_have_count(1);panel.get_by_role('button',name=t['pa.pairRecord.open'],exact=True).click();panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible()
   page.get_by_role('button',name=t['pa.challenge']+' 02',exact=True).click();expect(panel.get_by_role('alert')).to_have_count(0);expect(panel.get_by_text('leave · live · leave · live',exact=True)).to_have_count(1);expect(panel.get_by_role('button',name=t['pa.pairRecord.open'],exact=True)).to_be_visible();panel.get_by_role('button',name=t['pa.pairRecord.open'],exact=True).click()
   panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-96,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}minimal-pair-rehearsal-{lang}.png')
   panel.get_by_role('button',name=t['pa.pairRecord.close'],exact=True).click();expect(panel.get_by_role('button',name=t['sp.rec.start'],exact=True)).to_have_count(0);panel.get_by_role('button',name=t['pa.pairRecord.open'],exact=True).click();expect(panel.get_by_role('alert')).to_have_count(0);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');print(lang,'pair prompt, simulated mic denial, pair/close/reopen reset,390px PASS; no real recording');page.close()
  b.close()
finally:server.shutdown();server.server_close()
