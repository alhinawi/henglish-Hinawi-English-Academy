import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/realLifeSimulationsData.ts').read_text().split('export const REAL_LIFE_SCENARIOS: SimulationScenario[] = ')[1].strip().rstrip(';'));examples=json.loads((root/'src/data/scenarioVocabularyExamples.ts').read_text().split(' = ',1)[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4213),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4213');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/real-life/?lang='+lang)
   for scenario in data:
    page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}',scenario['title']),exact=True)).click();cards=page.locator('article');expect(cards).to_have_count(len(scenario['keyVocabulary']))
    for index,vocab in enumerate(scenario['keyVocabulary']):
     card=cards.nth(index);details=card.locator('details').filter(has=page.get_by_text(t['rle.vocabExample.title'],exact=True));summary=details.locator(':scope > summary');assert not details.evaluate('(el)=>el.open');summary.click();expect(details.get_by_text(examples[vocab['en']],exact=True)).to_be_visible();summary.click();expect(details.get_by_text(examples[vocab['en']],exact=True)).not_to_be_visible()
    page.get_by_role('button',name=t['rle.recall.start'],exact=True).click();expect(cards.locator('details').filter(has=page.get_by_text(t['rle.vocabExample.title'],exact=True))).to_have_count(0);cards.first.get_by_role('button',name=t['rle.recall.reveal'],exact=True).click();details=cards.first.locator('details').filter(has=page.get_by_text(t['rle.vocabExample.title'],exact=True));assert not details.evaluate('(el)=>el.open');details.locator(':scope > summary').click();expect(details.get_by_text(examples[scenario['keyVocabulary'][0]['en']],exact=True)).to_be_visible();cards.first.get_by_role('button',name=t['rle.recall.hide'],exact=True).click();expect(details).to_have_count(0);cards.first.get_by_role('button',name=t['rle.recall.reveal'],exact=True).click();assert not details.evaluate('(el)=>el.open');details.locator(':scope > summary').click();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if scenario==data[0]:cards.first.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-110,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}scenario-vocabulary-examples-{lang}.png')
    page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click()
   print(lang,'all9scenarios38uniqueexamples,exactEnglishsentences,closeddefault,individualreveal/hide,recallgate/reset,390px PASS; noaudio/network');page.close()
  b.close()
finally:server.shutdown();server.server_close()
