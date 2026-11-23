import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();lessons=json.loads((root/'src/data/speakingAcademyData.ts').read_text().split('export const SPEAKING_LESSONS: SpeakingLesson[] = ',1)[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4199),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4199');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));ids=[lessons[0]['id'],lessons[8]['id']];page.add_init_script('localStorage.setItem("henglish-speaking-v1:guest-learner",'+json.dumps(json.dumps(ids))+');');t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang);panel=page.get_by_role('group',name=t['sa.status.title'],exact=True);cards=page.locator('button h3');expect(cards).to_have_count(32)
   panel.get_by_role('button',name=t['sa.status.done']+' (2)',exact=True).click();expect(cards).to_have_count(2);search=page.get_by_role('textbox',name=t['sa.searchAria'],exact=True);search.fill('missingzzz');expect(cards).to_have_count(0);page.get_by_role('button',name=t['sa.resetFilters'],exact=True).click();expect(cards).to_have_count(32);expect(panel.get_by_role('button',name=t['sa.status.all']+' (32)',exact=True)).to_have_attribute('aria-pressed','true');panel.get_by_role('button',name=t['sa.status.new']+' (30)',exact=True).click();expect(cards).to_have_count(30);page.get_by_role('button',name='A1',exact=True).click();expect(cards).to_have_count(7);search.fill('missingzzz');search.press('Escape');expect(cards).to_have_count(7);panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-95,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-progress-filter-{lang}.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');cards.first.click();page.get_by_role('button',name=t['sa.allUnits'],exact=True).click();expect(cards).to_have_count(7);assert json.loads(page.evaluate('localStorage.getItem("henglish-speaking-v1:guest-learner")'))==ids;print(lang,'realcompletionstate seeded2,32/30/2counts,statusxlevelxsearch,reset/focus,open/backdoesnotcomplete,390px PASS');page.close()
  b.close()
finally:server.shutdown();server.server_close()
