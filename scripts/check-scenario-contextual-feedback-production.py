import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/realLifeSimulationsData.ts').read_text().split('export const REAL_LIFE_SCENARIOS: SimulationScenario[] = ')[1].strip().rstrip(';'));rows=json.loads((root/'scripts/fixtures/scenario-contextual-feedback.json').read_text())
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start();origin=os.environ.get('TEST_ORIGIN',f'http://127.0.0.1:{server.server_address[1]}');prefix='live-'if origin.startswith('https:')else''
try:
 with sync_playwright()as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(int(w),l)for w in os.environ.get('TEST_WIDTHS','320,390').split(',')for l in os.environ.get('TEST_LANGS','en,ar').split(',')]:
   page=b.new_page(viewport={'width':width,'height':1100},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.loads((root/'src/i18n/locales/en.json').read_text());t.update(json.loads((root/'src/i18n/locales'/f'{lang}.json').read_text()));page.goto(origin+'/real-life/?lang='+lang)
   for row in rows:
    scenario=next(s for s in data if s['id']==row['scenario']);page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}',scenario['title']),exact=True)).click()
    for i in range(row['turn']):
     page.locator('button[lang="en"]').first.click();page.get_by_role('button',name=t['rle.continueDialogue'],exact=True).click()
    options=page.get_by_role('region',name=t['rle.draft.title'],exact=True).locator('button[lang="en"]');expect(options).to_have_count(len(scenario['turns'][row['turn']]['options']));options.nth(row['option']).click();status=page.get_by_role('status').filter(has=page.locator('[data-scenario-tip-text]'));expect(status).to_have_count(1);expect(status).to_have_text(row['ar']if lang=='ar'else row['translations'][lang]);expect(options.nth(row['option'])).to_be_disabled()
    for run in status.locator('bdi').all():expect(run).to_have_attribute('dir','ltr');expect(run).to_have_attribute('lang','en')
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');status.evaluate('(e)=>window.scrollTo({top:window.scrollY+e.getBoundingClientRect().top-480,behavior:"instant"})')
    if row['key']in['sim-hotel-checkin:0:0','sim-coffee-shop:2:2']:page.screenshot(path=f'/downloads/henglish-{prefix}scenario-contextual-feedback-{width}-{lang}-{row["key"].replace(":","-")}.png')
    page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click()
   print(width,lang,'7exactfeedbacks/choicesdisabled/LTRisolation/nooverflow PASS; APIsblocked/noactualaudio');page.close()
  b.close()
finally:server.shutdown();server.server_close()
