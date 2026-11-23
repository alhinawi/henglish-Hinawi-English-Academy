import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();keys=['study','travel','meeting','presentation','cafe','market','library','walk','airport','map','writing','bookshop','garden','food','hotel','museum','nightStreet','track','freight','photography']
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4224),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4224');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});");t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/pronunciation/?lang='+lang);panel=page.get_by_role('region',name=t['pa.photo.title'],exact=True);selector=panel.get_by_label(t['pa.photo.choose'],exact=True);nav=panel.get_by_role('navigation',name=t['pa.photoNav.label'],exact=True);prev=nav.get_by_role('button',name=t['pa.photoNav.previous'],exact=True);nxt=nav.get_by_role('button',name=t['pa.photoNav.next'],exact=True)
   def verify(i):
    expect(selector).to_have_value(str(i));expect(nav.get_by_role('status')).to_have_text(t['pa.photoNav.position'].replace('{current}',str(i+1)).replace('{total}','20'));image=panel.get_by_role('img',name=t['pa.photo.'+keys[i]],exact=True);image.scroll_into_view_if_needed();page.wait_for_function('(el)=>el.complete&&el.naturalWidth>0',arg=image.element_handle());expect(panel.get_by_text(t['pa.photo.model'],exact=True)).to_have_count(0);expect(panel.get_by_role('button',name=t['sp.rec.start'],exact=True)).to_have_count(0);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   verify(0);expect(prev).to_be_disabled()
   for i in range(1,20):nxt.click();verify(i)
   expect(nxt).to_be_disabled()
   for i in range(18,-1,-1):prev.click();verify(i)
   selector.select_option('4');verify(4);details=panel.locator('details').filter(has=page.locator('summary').filter(has_text=t['pa.photoPlan.title']));details.locator('summary').click();draft=panel.get_by_label(t['pa.photoPlan.label'],exact=True);draft.fill('Do not retain on another photo');panel.get_by_role('button',name=t['pa.photo.show'],exact=True).click();panel.get_by_role('button',name=t['pa.photo.open'],exact=True).click();panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible();nxt.click();verify(5);expect(panel.get_by_role('alert')).to_have_count(0)
   expect(details).to_have_count(1)
   if not details.evaluate('(el)=>el.open'):details.locator('summary').click()
   expect(draft).to_have_value('');prev.click();verify(4)
   expect(details).to_have_count(1)
   if not details.evaluate('(el)=>el.open'):details.locator('summary').click()
   expect(draft).to_have_value('');nav.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-140,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}pronunciation-photo-navigation-{lang}.png');print(lang,'all20forward/back,selectorin-sync,politeposition,endpointdisable,noautowrap,loadedphotos,model/recorder/privateplanreset,micdenialcleanup,390px PASS; nocapture/playback');page.close()
  b.close()
finally:server.shutdown();server.server_close()
