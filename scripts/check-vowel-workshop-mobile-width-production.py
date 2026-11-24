import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4196),functools.partial(Quiet,directory=str(root/'out')))
threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4196')
prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(w,l) for w in [320,390] for l in ['en','ar']]:
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce')
   pending=[]
   page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test, network effects disabled'}))
   page.route('**/api/tts/synthesize',lambda r:pending.append(r))
   page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test permission denial'))},configurable:true});delete window.speechSynthesis;")
   page.goto(origin+'/pronunciation/?lang='+lang)
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'))
   group=page.get_by_role('group',name=t['pa.vowelFilter'])
   practise=page.get_by_role('button',name=t['pa.practiseSound']+' ',exact=False)
   expect(practise).to_have_count(20)
   group.get_by_role('button',name=t['pa.group.glide'],exact=True).click();expect(practise).to_have_count(8)
   group.get_by_role('button',name=t['pa.group.pure'],exact=True).click();expect(practise).to_have_count(12)
   group.get_by_role('button',name=t['pa.group.all'],exact=True).click();expect(practise).to_have_count(20)
   page.get_by_role('button',name=t['pa.practiseSound']+' /aɪ/',exact=True).click()
   panel=page.get_by_role('region',name=t['pa.workshopTitle'])
   expect(panel.get_by_role('heading')).to_contain_text('/aɪ/')
   expect(panel.get_by_text('Five bright lights shone in the night sky.',exact=True)).to_have_count(2)
   for symbol in page.get_by_role('button',name=t['pa.practiseSound']+' ',exact=False).all_text_contents():
    page.get_by_role('button',name=symbol.strip(),exact=True).click()
    sentences=panel.locator('p[dir="ltr"]');expect(sentences).to_have_count(2)
    for sentence in sentences.all():
     assert sentence.bounding_box()['width']>=width-90,(width,lang,symbol,sentence.bounding_box())
     assert sentence.evaluate('(el)=>el.scrollWidth<=el.clientWidth')
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   assert not pending
   page.get_by_role('button',name=t['pa.practiseSound']+' /aɪ/',exact=True).click()
   panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible()
   page.get_by_role('button',name=t['pa.practiseSound']+' /eɪ/',exact=True).click();expect(panel.get_by_role('alert')).to_have_count(0)
   panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}vowel-workshop-mobile-width-{width}-{lang}.png')
   print(width,lang,'all20sounds wideLTRsentences/20/12/8filters/denialreset/noautoplay/nooverflow PASS; noactualaudio/capture')
   page.close()
  b.close()
finally:server.shutdown();server.server_close()
