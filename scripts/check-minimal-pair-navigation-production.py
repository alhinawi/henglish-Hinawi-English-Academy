import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4198),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4198');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});")
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/pronunciation/?lang='+lang);picker=page.get_by_label(t['pa.navigator.choose'],exact=True);expect(picker).to_be_visible();expect(picker.locator('option')).to_have_count(18)
   prev=page.get_by_role('button',name=t['pa.navigator.previous'],exact=True);nxt=page.get_by_role('button',name=t['pa.navigator.next'],exact=True);expect(prev).to_be_disabled();expect(nxt).to_be_enabled()
   panel=page.get_by_role('region',name=t['pa.pairRecord.title'],exact=True)
   for i in range(18):
    picker.select_option(str(i));expect(picker).to_have_value(str(i));expect(page.get_by_text(t['pa.navigator.position'].replace('{current}',str(i+1)).replace('{total}','18'),exact=True)).to_be_visible();expect(panel.get_by_role('button',name=t['pa.pairRecord.open'],exact=True)).to_be_visible();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   expect(nxt).to_be_disabled();prev.click();expect(picker).to_have_value('16');nxt.click();expect(picker).to_have_value('17');picker.select_option('0')
   panel.get_by_role('button',name='sheep',exact=True).first.click();panel.get_by_role('button',name=t['pa.pairRecord.open'],exact=True).click();panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible();nxt.click();expect(picker).to_have_value('1');expect(panel.get_by_role('alert')).to_have_count(0);expect(panel.get_by_text(t['pa.context.correct'],exact=True)).to_have_count(0);expect(panel.get_by_role('button',name=t['pa.pairRecord.open'],exact=True)).to_be_visible();prev.click();expect(picker).to_have_value('0');expect(panel.get_by_text(t['pa.context.correct'],exact=True)).to_have_count(0)
   picker.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-150,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}minimal-pair-navigation-{lang}.png');print(lang,'all18word/IPAoptions,selectedposition,prevnextboundaries,keyedquiz/recorderdenialreset,390px PASS; noactualcapture');page.close()
  b.close()
finally:server.shutdown();server.server_close()
