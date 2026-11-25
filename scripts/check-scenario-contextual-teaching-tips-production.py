import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/realLifeSimulationsData.ts').read_text().split('export const REAL_LIFE_SCENARIOS: SimulationScenario[] = ',1)[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN',f'http://127.0.0.1:{server.server_address[1]}');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(int(w),l) for w in os.environ.get('TEST_WIDTHS','320,390').split(',') for l in os.environ.get('TEST_LANGS','en,ar').split(',')]:
   page=b.new_page(viewport={'width':width,'height':1300},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/'en.json'));t.update(json.load(open(root/'src/i18n/locales'/f'{lang}.json')));overlay={} if lang=='ar' else json.load(open(root/'public/data/app-i18n/realLifeSimulationsData'/f'{lang}.json'));page.goto(origin+'/real-life/?lang='+lang)
   for scenario in data:
    page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}',scenario['title']),exact=True)).click()
    for i,turn in enumerate(scenario['turns']):
     tip=page.locator('[data-scenario-tip-text]')
     if turn.get('grammarTipAr'):
      expect(tip).to_be_visible();expect(tip).to_have_text(overlay.get(turn['grammarTipAr'],turn['grammarTipAr']))
      if lang=='ar':expect(tip).to_have_text(turn['grammarTipAr'])
      for run in tip.locator('bdi').all():assert run.evaluate('(el)=>getComputedStyle(el).direction')=='ltr'
      if i==0 and scenario['id'] in ['sim-airport-checkin','sim-doctor-appointment','sim-coffee-shop','sim-hotel-checkin']:
       tip.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-300,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}scenario-contextual-teaching-tips-{width}-{lang}-{scenario["id"]}.png')
     else:expect(tip).to_have_count(0)
     assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.locator('button[lang="en"]').first.click();page.get_by_role('button',name=t['rle.continueDialogue'] if i<len(scenario['turns'])-1 else t['rle.finishScenario'],exact=True).click()
    page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click()
   print(width,lang,'all9scenarios/23exacttips/LTRisolation/choice-progression/nooverflow PASS; noactualaudio/capture/assessment');page.close()
  b.close()
finally:server.shutdown();server.server_close()
