import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/realLifeSimulationsData.ts').read_text().split('export const REAL_LIFE_SCENARIOS: SimulationScenario[] = ')[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4245),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4245');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/real-life/?lang='+lang)
   for scenario in data:
    def enter():page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}',scenario['title']),exact=True)).click()
    enter();cards=page.locator('article')
    for i,vocab in enumerate(scenario['keyVocabulary']):
     card=cards.nth(i);details=card.locator('details').filter(has=page.get_by_text(t['rle.vocabExample.title'],exact=True));summary=details.locator(':scope > summary');draft=card.get_by_label(t['rle.vocabDraft.label'],exact=True);clear=card.get_by_role('button',name=t['rle.vocabDraft.clear'],exact=True);assert not details.evaluate('(el)=>el.open');summary.click();expect(draft).to_have_value('');expect(clear).to_be_disabled();assert draft.get_attribute('maxlength')=='500';assert draft.get_attribute('lang')=='en';assert draft.get_attribute('dir')=='ltr';draft.fill('My sentence for '+vocab['en']);card.get_by_role('button',name=t['rle.vocabSource.hide'],exact=True).click();expect(card.get_by_role('button',name=t['rle.vocabExample.listen'],exact=True)).to_have_count(0);expect(card.get_by_text(t['rle.exampleMeaning.title'],exact=True)).to_have_count(0);expect(draft).to_have_value('My sentence for '+vocab['en']);card.get_by_role('button',name=t['rle.vocabSource.show'],exact=True).click();expect(card.get_by_role('button',name=t['rle.vocabExample.listen'],exact=True)).to_be_visible();expect(draft).to_have_value('My sentence for '+vocab['en']);summary.click();summary.click();expect(draft).to_have_value('My sentence for '+vocab['en']);clear.click();expect(draft).to_have_value('');draft.fill('Keep '+vocab['en']);summary.click()
    page.get_by_role('button',name=t['rle.recall.start'],exact=True).click();expect(cards.get_by_role('textbox')).to_have_count(0);cards.first.get_by_role('button',name=t['rle.recall.reveal'],exact=True).click();details=cards.first.locator('details').filter(has=page.get_by_text(t['rle.vocabExample.title'],exact=True));details.locator(':scope > summary').click();draft=cards.first.get_by_label(t['rle.vocabDraft.label'],exact=True);expect(draft).to_have_value('Keep '+scenario['keyVocabulary'][0]['en']);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if scenario==data[0]:cards.first.get_by_role('button',name=t['rle.vocabSource.hide'],exact=True).click();details.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-110,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}scenario-vocabulary-hide-example-{lang}.png')
    for i,turn in enumerate(scenario['turns']):
     choice=next(o for o in turn['options'] if o['isOptimal']);page.locator('button[lang="en"]').filter(has_text=choice['textEn']).click();page.get_by_role('button',name=t['rle.continueDialogue'] if i<len(scenario['turns'])-1 else t['rle.finishScenario'],exact=True).click()
    page.get_by_role('button',name=t['rle.replay'],exact=True).click();details=cards.first.locator('details').filter(has=page.get_by_text(t['rle.vocabExample.title'],exact=True));assert not details.evaluate('(el)=>el.open');details.locator(':scope > summary').click();expect(draft).to_have_value('');draft.fill('Exit reset');page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click();enter();cards.first.get_by_text(t['rle.vocabExample.title'],exact=True).click();expect(draft).to_have_value('');page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click()
   print(lang,'all9scenarios/terms,hide-show-example-meaning-audio,preservedprivatedraft,private500charEnglishdrafts,independent,clear,collapse/recallpreserves,replay/exitreset,390px PASS; noaudio/network');page.close()
  b.close()
finally:server.shutdown();server.server_close()
