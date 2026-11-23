import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/realLifeSimulationsData.ts').read_text().split('export const REAL_LIFE_SCENARIOS: SimulationScenario[] = ',1)[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4198),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4198');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/real-life/?lang='+lang)
   panel=page.get_by_role('region',name=t['rle.review.title'],exact=True)
   for scenario in data:
    def enter():page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}',scenario['title']),exact=True)).click()
    enter();expect(panel).to_have_count(0);selected=[]
    for i,turn in enumerate(scenario['turns']):
     options=page.locator('button[lang="en"]');choice=next((o for o in turn['options'] if not o['isOptimal']),turn['options'][0]) if i%2==0 else next(o for o in turn['options'] if o['isOptimal']);selected.append(choice);options.filter(has_text=choice['textEn']).click();page.get_by_role('button',name=t['rle.continueDialogue'] if i<len(scenario['turns'])-1 else t['rle.finishScenario'],exact=True).click()
    expect(panel).to_be_visible();expect(panel.locator('button[aria-expanded]')).to_have_count(len(scenario['turns']))
    for i,turn in enumerate(scenario['turns']):
     button=panel.locator('button[aria-expanded]').nth(i);button.click();expect(button).to_have_attribute('aria-expanded','true');expect(panel.get_by_text(turn['textEn'],exact=True)).to_be_visible();expect(panel.get_by_text(selected[i]['textEn'],exact=True)).to_be_visible();expect(panel.get_by_role('button',name=t['rle.review.listen.prompt'],exact=True)).to_be_visible();expect(panel.get_by_role('button',name=t['rle.review.listen.chosen'],exact=True)).to_be_visible();expect(panel.get_by_role('button',name=t['rle.review.listen.model'],exact=True)).to_have_count(0 if selected[i]['isOptimal'] else 1);expect(panel.get_by_role('heading',name=t['rle.review.model'],exact=True)).to_have_count(0 if selected[i]['isOptimal'] else 1);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    first=panel.locator('button[aria-expanded]').first
    if first.get_attribute('aria-expanded')!='true':first.click()
    panel.get_by_role('button',name=t['rle.review.listen.chosen'],exact=True).click();panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})')
    if scenario==data[0]:page.screenshot(path=f'/downloads/henglish-{prefix}scenario-review-audio-{lang}.png')
    page.get_by_role('button',name=t['rle.replay'],exact=True).click();expect(panel).to_have_count(0);page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click();enter();expect(panel).to_have_count(0);page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click()
   print(lang,len(data),'scenarios allturnsourceaudio,chosenreplyaudio,conditionalmodelaudio,allturnchoice/feedback,strongeroptionconditional,oneaccordion,replay/exitreset,390px PASS; localattemptchoices,noaudio/network');page.close()
  b.close()
finally:server.shutdown();server.server_close()
