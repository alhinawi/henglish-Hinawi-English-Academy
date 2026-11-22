import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/realLifeSimulationsData.ts').read_text().split('export const REAL_LIFE_SCENARIOS: SimulationScenario[] = ',1)[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4199),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4199');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});");t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/real-life/?lang='+lang)
   panel=page.get_by_role('region',name=t['rle.transfer.title'],exact=True)
   for scenario in data:
    def enter():page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}',scenario['title']),exact=True)).click()
    enter();expect(panel).to_have_count(0);selected=[]
    for i,turn in enumerate(scenario['turns']):
     options=page.locator('button[lang="en"]');choice=next((o for o in turn['options'] if not o['isOptimal']),turn['options'][0]) if i%2==0 else next(o for o in turn['options'] if o['isOptimal']);selected.append(choice);options.filter(has_text=choice['textEn']).click();page.get_by_role('button',name=t['rle.continueDialogue'] if i<len(scenario['turns'])-1 else t['rle.finishScenario'],exact=True).click()
    expect(panel).to_be_visible();panel.get_by_role('button',name=t['rle.transfer.open'],exact=True).click();expect(panel.get_by_text(t['rle.transfer.task.'+scenario['id']],exact=True)).to_be_visible();plan=panel.get_by_label(t['rle.transfer.plan'],exact=True);plan.fill('My own response plan');panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible();panel.get_by_role('button',name=t['rle.transfer.close'],exact=True).click();expect(plan).to_have_count(0);panel.get_by_role('button',name=t['rle.transfer.open'],exact=True).click();expect(plan).to_have_value('');expect(panel.get_by_role('alert')).to_have_count(0);plan.fill('Explain the change, then ask politely.');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})')
    if scenario==data[0]:page.screenshot(path=f'/downloads/henglish-{prefix}scenario-transfer-{lang}.png')
    page.get_by_role('button',name=t['rle.replay'],exact=True).click();expect(panel).to_have_count(0);page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click();enter();expect(panel).to_have_count(0);page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click()
   print(lang,len(data),'originalscenariofollowups,completiononly,privateplan,close/replay/exitreset,micdenialcleanup,390px PASS; no actual capture/audio/network');page.close()
  b.close()
finally:server.shutdown();server.server_close()
