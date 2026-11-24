import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4266),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4266');prefix='live-' if origin.startswith('https:') else ''
data=json.loads((root/'src/data/realLifeSimulationsData.ts').read_text().split('export const REAL_LIFE_SCENARIOS: SimulationScenario[] = ',1)[1].strip().rstrip(';'))
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(w,l) for w in [320,390] for l in ['en','ar']]:
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.add_init_script("""window.YT={Player:class{constructor(el,o){this.o=o;this.time=o.playerVars.start;queueMicrotask(()=>o.events.onReady({target:this}))}getCurrentTime(){return this.time}getAvailablePlaybackRates(){return[0.5,0.75,1]}loadVideoById(v){this.time=v.startSeconds}setPlaybackRate(){}pauseVideo(){this.o.events.onStateChange({data:2,target:this})}playVideo(){}destroy(){}}};Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});""");t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'))
   for academy in ['speaking','pronunciation','real-life','movies']:
    page.goto(origin+'/'+academy+'/?lang='+lang)
    if academy=='speaking':
     page.get_by_role('button',name=t['sa.startFirst'],exact=True).click();panel=page.get_by_role('region',name=t['sp.transfer.title'],exact=True);opening='sp.transfer.open';closing='sp.transfer.close'
    elif academy=='pronunciation':
     panel=page.get_by_role('region',name=t['pa.photo.title'],exact=True);opening='pa.photo.open';closing='pa.photo.close'
    elif academy=='real-life':
     scenario=data[0];page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}',scenario['title']),exact=True)).click()
     for i,turn in enumerate(scenario['turns']):
      choice=next(o for o in turn['options'] if o['isOptimal']);page.locator('button[lang="en"]').filter(has_text=choice['textEn']).click();page.get_by_role('button',name=t['rle.continueDialogue'] if i<len(scenario['turns'])-1 else t['rle.finishScenario'],exact=True).click()
     panel=page.get_by_role('region',name=t['rle.transfer.title'],exact=True);opening='rle.transfer.open';closing='rle.transfer.close'
    else:
     page.get_by_title(t['ms.saveClip'],exact=True).first.locator('..').locator('..').click();panel=page.get_by_role('region',name=t['ms.echoTitle'],exact=True);opening='ms.echoOpen';closing='ms.echoClose'
    panel.get_by_role('button',name=t[opening],exact=True).click()
    if academy=='movies':panel.get_by_role('button',name=t['ms.own.own'],exact=True).click()
    start=panel.get_by_role('button',name=t['sp.rec.start'],exact=True);rec=start.locator('..');prompt=rec.locator(':scope > p').first;expect(start).to_be_visible();assert prompt.bounding_box()['width']>=width-70,(academy,width,lang,prompt.bounding_box());assert start.bounding_box()['height']>=48;expect(prompt).to_have_attribute('dir','ltr');rec.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})')
    if academy=='speaking':page.screenshot(path=f'/downloads/henglish-{prefix}shared-recorder-mobile-width-{width}-{lang}.png')
    start.click();expect(rec.get_by_role('alert')).to_be_visible();expect(start).to_be_enabled();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');panel.get_by_role('button',name=t[closing],exact=True).click();expect(panel.get_by_role('alert')).to_have_count(0);expect(start).to_have_count(0)
   print(width,lang,'4academies recorder promptwide/control48/denial/reset/nooverflow PASS; firstlesson/photo/scenario/clip, YouTubemocked, noactualcapture/audio/assessment',flush=True);page.close()
  b.close()
finally:server.shutdown();server.server_close()
