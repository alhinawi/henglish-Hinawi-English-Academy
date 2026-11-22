import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4198),functools.partial(Quiet,directory=str(root/'out')))
threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4198');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce')
   page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.add_init_script("""window.__pauses=0;window.YT={Player:class{constructor(el,o){this.o=o;this.time=o.playerVars.start;queueMicrotask(()=>o.events.onReady({target:this}))}getCurrentTime(){return this.time}getAvailablePlaybackRates(){return[0.5,0.75,1]}loadVideoById(v){this.time=v.startSeconds}setPlaybackRate(){}pauseVideo(){window.__pauses++;this.o.events.onStateChange({data:2,target:this})}playVideo(){}destroy(){}}};Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});""")
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'))
   page.goto(origin+'/movies/?lang='+lang)
   page.get_by_title(t['ms.saveClip'],exact=True).first.locator('..').locator('..').click()
   panel=page.get_by_role('region',name=t['ms.echoTitle'],exact=True)
   panel.get_by_role('button',name=t['ms.echoOpen'],exact=True).click()
   expect(panel.get_by_role('combobox',name=t['ms.echoChoose'],exact=True)).to_be_visible()
   assert page.evaluate('window.__pauses')>0
   sentence=panel.get_by_role('combobox').locator('option').first.inner_text().split('. ',1)[1]
   expect(panel.get_by_text(sentence,exact=True)).to_be_visible()
   panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible()
   panel.get_by_role('button',name=t['ms.echoClose'],exact=True).click();expect(panel.get_by_role('combobox')).to_have_count(0)
   panel.get_by_role('button',name=t['ms.echoOpen'],exact=True).click();expect(panel.get_by_role('alert')).to_have_count(0)
   panel.scroll_into_view_if_needed();page.screenshot(path=f'/downloads/henglish-{prefix}movie-cue-speaking-{lang}.png')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.get_by_role('button',name=t['ms.backToLibrary'],exact=True).click();expect(panel).to_have_count(0)
   print(lang,'reviewed cue exact text, open/close, pause calls, simulated mic denial/reset, exit cleanup, 390px PASS; YouTube player mocked')
   page.close()
  b.close()
finally:server.shutdown();server.server_close()
