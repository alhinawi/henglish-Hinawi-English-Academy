import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/realLifeSimulationsData.ts').read_text().split('export const REAL_LIFE_SCENARIOS: SimulationScenario[] = ',1)[1].strip().rstrip(';'));job=next(x for x in data if x['id']=='sim-job-interview')
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start();origin=os.environ.get('TEST_ORIGIN',f'http://127.0.0.1:{server.server_port}');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(w,l) for w in [320,390] for l in os.environ.get('TEST_LANGS','en,ar').split(',')]:
   page=b.new_page(viewport={'width':width,'height':1150},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales/en.json'));t.update(json.load(open(root/'src/i18n/locales'/f'{lang}.json')));overlay=json.load(open(root/'public/data/app-i18n/realLifeSimulationsData'/f'{lang}.json')) if lang!='ar' else {}
   def tx(x):return overlay.get(x,x)
   page.goto(origin+'/real-life/?lang='+lang);card=page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}',job['title']),exact=True));expect(card.get_by_text(tx(job['descriptionAr']),exact=True)).to_be_visible();expect(card).to_contain_text('4 '+t['rle.stops']);card.scroll_into_view_if_needed();page.screenshot(path=f'/downloads/henglish-{prefix}job-expansion-card-{width}-{lang}.png');card.click()
   panel=page.get_by_role('region',name=t['rle.review.title'],exact=True)
   for attempt in [0,1]:
    selected=[]
    for i,turn in enumerate(job['turns']):
     expect(page.get_by_text('"'+turn['textEn']+'"',exact=True)).to_be_visible();expect(page.get_by_text(tx(turn['textAr']),exact=True)).to_be_visible();expect(panel).to_have_count(0);options=page.locator('button[lang="en"]');expect(options).to_have_count(4);nextb=page.get_by_role('button',name=t['rle.continueDialogue'] if i<3 else t['rle.finishScenario'],exact=True);expect(nextb).to_be_disabled();chosen=turn['options'][0] if attempt==0 else next(x for x in turn['options'] if x['isOptimal']);selected.append(chosen);options.filter(has_text=chosen['textEn']).click();expect(nextb).to_be_enabled();expect(page.get_by_text(tx(chosen['feedbackAr']),exact=True)).to_be_visible();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');
     if attempt==1 and i==3:page.get_by_text('"'+turn['textEn']+'"',exact=True).evaluate('(e)=>window.scrollTo({top:window.scrollY+e.getBoundingClientRect().top-240,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}job-expansion-final-{width}-{lang}.png')
     nextb.click()
    expect(panel).to_be_visible();buttons=panel.locator('button[aria-expanded]');expect(buttons).to_have_count(4)
    for i,turn in enumerate(job['turns']):
     buttons.nth(i).click();expect(panel.get_by_text(turn['textEn'],exact=True)).to_be_visible();expect(panel.get_by_text(selected[i]['textEn'],exact=True)).to_be_visible();expect(panel.get_by_role('heading',name=t['rle.review.model'],exact=True)).to_have_count(0 if selected[i]['isOptimal'] else 1);draft=panel.get_by_role('textbox',name=t['rle.review.rewrite'],exact=True);expect(draft).to_have_value('');draft.fill('My own truthful example '+str(i));buttons.nth(i).click();buttons.nth(i).click();expect(draft).to_have_value('My own truthful example '+str(i));assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.get_by_role('button',name=t['rle.replay'],exact=True).click();expect(panel).to_have_count(0)
   page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click();card.click();expect(panel).to_have_count(0);expect(page.get_by_text('"'+job['turns'][0]['textEn']+'"',exact=True)).to_be_visible();page.close();print(width,lang,'4turns/16choices/cardaligned,twocompleteattempts,selectiongate,exactlocalizedmeaningfeedback,all4reviewchoices/conditionalmodels/independentrewrites,collapse/replay/exitreset/nooverflow PASS; noactualaudio/capture/AIassessment',flush=True)
  b.close()
finally:server.shutdown();server.server_close()
