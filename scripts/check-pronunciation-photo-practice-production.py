import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4199),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4199');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});");t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/pronunciation/?lang='+lang);panel=page.get_by_role('region',name=t['pa.photo.title'],exact=True);expect(panel).to_be_visible();selector=panel.get_by_label(t['pa.photo.choose'],exact=True)
   for i,key in enumerate(['study','travel','meeting','presentation','cafe','market','library','walk','airport','map','writing','bookshop','garden','food','hotel','museum']):
    selector.select_option(str(i));image=panel.get_by_role('img',name=t['pa.photo.'+key],exact=True);expect(image).to_be_visible();image.scroll_into_view_if_needed();page.wait_for_function('(el)=>el.complete&&el.naturalWidth>0',arg=image.element_handle());expect(panel.get_by_text(t['pa.photo.model'],exact=True)).to_have_count(0);panel.get_by_role('button',name=t['pa.photo.show'],exact=True).click();expect(panel.get_by_text(t['pa.photo.model'],exact=True)).to_be_visible();panel.get_by_role('button',name=t['pa.photo.open'],exact=True).click();panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible();panel.get_by_role('button',name=t['pa.photo.close'],exact=True).click();expect(panel.get_by_role('alert')).to_have_count(0);panel.get_by_role('button',name=t['pa.photo.open'],exact=True).click();expect(panel.get_by_role('alert')).to_have_count(0);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-90,behavior:"instant"})')
    if i==0:page.screenshot(path=f'/downloads/henglish-{prefix}pronunciation-photo-{lang}.png')
   print(lang,'12loadedphotos,scene/modelreset,optionalexample,localrecorder,denialcleanup,390px PASS; no actual capture/playback');page.close()
  b.close()
finally:server.shutdown();server.server_close()
