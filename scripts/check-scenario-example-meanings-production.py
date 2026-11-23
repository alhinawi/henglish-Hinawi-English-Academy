import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/realLifeSimulationsData.ts').read_text().split('export const REAL_LIFE_SCENARIOS: SimulationScenario[] = ')[1].strip().rstrip(';'));meanings=json.loads((root/'src/data/scenarioExampleMeanings.ts').read_text().split(' = ',1)[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4226),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4226');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/real-life/?lang='+lang)
   for scenario in data:
    page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}',scenario['title']),exact=True)).click();cards=page.locator('article')
    for index,vocab in enumerate(scenario['keyVocabulary']):
     card=cards.nth(index);outer=card.get_by_text(t['rle.vocabExample.title'],exact=True);outer.click();details=card.locator('details').filter(has=page.get_by_text(t['rle.exampleMeaning.title'],exact=True)).last;summary=details.locator('summary');assert not details.evaluate('(el)=>el.open');hint=details.get_by_text(meanings[vocab['en']],exact=True);expect(hint).not_to_be_visible();summary.click();expect(hint).to_be_visible();expect(hint).to_have_attribute('lang','ar');expect(hint).to_have_attribute('dir','rtl');draft=card.get_by_label(t['rle.vocabDraft.label'],exact=True);draft.fill('My own sentence');summary.click();summary.click();expect(draft).to_have_value('My own sentence');expect(card.get_by_role('button',name=t['rle.vocabExample.listen'],exact=True)).to_be_visible();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');outer.click()
    page.get_by_role('button',name=t['rle.recall.start'],exact=True).click();expect(cards.get_by_text(t['rle.exampleMeaning.title'],exact=True)).to_have_count(0);cards.first.get_by_role('button',name=t['rle.recall.reveal'],exact=True).click();cards.first.get_by_text(t['rle.vocabExample.title'],exact=True).click();hintDetails=cards.first.locator('details').filter(has=page.get_by_text(t['rle.exampleMeaning.title'],exact=True)).last;assert not hintDetails.evaluate('(el)=>el.open');hintDetails.locator('summary').click();expect(cards.first.get_by_label(t['rle.vocabDraft.label'],exact=True)).to_have_value('My own sentence')
    if scenario==data[0]:hintDetails.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-140,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}scenario-example-meanings-{lang}.png')
    page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click()
   print(lang,'all9scenarios38EgyptianArabicmeanings,closednesteddefault,Arabiclanguage/direction,recallgate/reset,draft/audio-preserved,390px PASS; noactualaudio');page.close()
  b.close()
finally:server.shutdown();server.server_close()
