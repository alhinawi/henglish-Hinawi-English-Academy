import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4219),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4219');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});");t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/pronunciation/?lang='+lang);panel=page.get_by_role('region',name=t['pa.photo.title'],exact=True);expect(panel).to_be_visible();selector=panel.get_by_label(t['pa.photo.choose'],exact=True)
   wordbanks=['pen · book · page','trip · visit · ticket','team · table · today','see · screen · speaker','coffee · cafe · friend','green · grapes · vegetables','library · long · shelf','walk · woods · way','plane · bags · gate','map · camera · bag','write · right · report','choose · book · shelf']
   for i,key in enumerate(['study','travel','meeting','presentation','cafe','market','library','walk','airport','map','writing','bookshop','garden','food','hotel','museum']):
    selector.select_option(str(i));image=panel.get_by_role('img',name=t['pa.photo.'+key],exact=True);image.scroll_into_view_if_needed();page.wait_for_function('(el)=>el.complete&&el.naturalWidth>0',arg=image.element_handle());group=panel.get_by_role('group',name=t['pa.photoWords.title'],exact=True);expect(group.get_by_role('button')).to_have_count(3);expect(panel.get_by_text(t['pa.photo.model'],exact=True)).to_have_count(0)
    for word in wordbanks[i].split(' · '):
     button=group.get_by_role('button',name=t['pa.photoWords.listen'].replace('{word}',word),exact=True);expect(button).to_be_visible();expect(button).to_have_attribute('aria-pressed','false');button.click()
     expect(button).to_have_attribute('aria-pressed','false')
    selector.select_option(str((i+1)%16));selector.select_option(str(i));group=panel.get_by_role('group',name=t['pa.photoWords.title'],exact=True);group.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-440,behavior:"instant"})')
    if i==4:page.screenshot(path=f'/downloads/henglish-{prefix}pronunciation-photo-words-{lang}.png')
    panel.get_by_role('button',name=t['pa.photo.open'],exact=True).click();expect(group).to_have_count(0);panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible();panel.get_by_role('button',name=t['pa.photo.close'],exact=True).click();expect(group.get_by_role('button')).to_have_count(3);expect(panel.get_by_role('alert')).to_have_count(0);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   print(lang,'36namedwordcontrols/all12loadedphotos,noautoplay,explicitclick,hiddenmodelpreserved,recordingpracticeguard/denialcleanup,390px PASS; noactualcapture/playback');page.close()
  b.close()
finally:server.shutdown();server.server_close()
