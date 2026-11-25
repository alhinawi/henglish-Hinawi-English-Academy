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
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');pending=[];page.route('**/api/**',lambda r:pending.append(r));page.add_init_script("delete window.speechSynthesis;");page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/real-life/?lang='+lang)
   for scenario in data:
    def enter():page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}',scenario['title']),exact=True)).click()
    enter()
    for i,turn in enumerate(scenario['turns']):
     listen=page.get_by_role('button',name=t['rle.playAudio'],exact=True);expect(listen).to_be_visible();assert listen.bounding_box()['height']>=44 and listen.bounding_box()['width']>=44;dialogue=page.locator('p[lang=en]').filter(has_text=turn['textEn']);expect(dialogue).to_be_visible();listen.click();stop=page.get_by_role('button',name=t['listen.stopAudio'],exact=True);expect(stop).to_be_visible();assert stop.bounding_box()['height']>=44 and stop.bounding_box()['width']>=44;stop.click();expect(listen).to_be_visible();listen.click();expect(stop).to_be_visible()
     if scenario==data[0] and i==0:dialogue.locator('../..').evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}real-life-listen-touch-target-{width}-{lang}.png')
     options=page.get_by_role('region',name=t['rle.draft.title'],exact=True).locator('button[lang=en]');options.first.click();page.get_by_role('button',name=t['rle.continueDialogue'] if i<len(scenario['turns'])-1 else t['rle.finishScenario'],exact=True).click();expect(stop).to_have_count(0);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click()
   print(width,lang,len(data),'scenarios/everyturn listen-stop44/pendingstop-retry/turncleanup/exactdialogue/nooverflow PASS; noactualaudio/capture/assessment');
   for route in pending:
    try:route.abort()
    except:pass
   page.close()
  b.close()
finally:server.shutdown();server.server_close()
