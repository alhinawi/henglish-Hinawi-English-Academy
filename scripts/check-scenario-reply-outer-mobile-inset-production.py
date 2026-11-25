import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/realLifeSimulationsData.ts').read_text().split('export const REAL_LIFE_SCENARIOS: SimulationScenario[] = ')[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN',f'http://127.0.0.1:{server.server_port}');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(int(w),l)for w in os.environ.get('TEST_WIDTHS','320,390').split(',')for l in ['en','ar']]:
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/real-life/?lang='+lang)
   for scenario in data[int(os.environ.get('TEST_START','0')):int(os.environ.get('TEST_END',str(len(data))))]:
    def enter():page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}',scenario['title']),exact=True)).click()
    enter();panel=page.get_by_role('region',name=t['rle.draft.title'],exact=True);draft=page.get_by_role('textbox',name=t['rle.draft.label'],exact=True);choose=panel.get_by_role('button').filter(has=page.locator('div[lang="en"]'))
    options=panel.locator('button[lang="en"]');expect(options).to_have_count(len(scenario['turns'][0]['options']));panel.get_by_role('button',name=t['rle.draft.open'],exact=True).click();expect(options).to_have_count(0);assert panel.locator(':scope > div').first.evaluate('(e)=>getComputedStyle(e).paddingLeft')=='0px';assert panel.locator(':scope > div').first.evaluate('(e)=>getComputedStyle(e).borderLeftWidth')=='0px';assert draft.bounding_box()['width']>=width-52;assert draft.evaluate('(e)=>parseFloat(getComputedStyle(e).paddingLeft)')==8;assert draft.evaluate('(e)=>parseFloat(getComputedStyle(e).paddingTop)')==16;expect(draft).to_have_attribute('maxlength','2000');draft.fill('x'*2000);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');draft.fill('My own practice reply.');expect(draft).to_have_attribute('dir','ltr');panel.get_by_role('button',name=t['rle.draft.compare'],exact=True).click();expect(options).to_have_count(len(scenario['turns'][0]['options']));review=panel.get_by_role('checkbox');review.check();draft.fill('My revised practice reply.');expect(review).not_to_be_checked();review.check();panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-105,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}scenario-reply-outer-mobile-inset-{width}-{lang}-{scenario["id"]}.png')
    panel.get_by_role('button',name=t['rle.draft.hide'],exact=True).click();expect(options).to_have_count(0);expect(draft).to_have_value('My revised practice reply.');panel.get_by_role('button',name=t['rle.draft.close'],exact=True).click();expect(draft).to_have_count(0);expect(options).to_have_count(len(scenario['turns'][0]['options']));panel.get_by_role('button',name=t['rle.draft.open'],exact=True).click();expect(draft).to_have_value('');draft.fill('Reset on restart');page.get_by_role('button',name=t['rle.restartDialogue'],exact=True).click();expect(draft).to_have_count(0);panel.get_by_role('button',name=t['rle.draft.open'],exact=True).click();expect(draft).to_have_value('');draft.fill('Reset on next scene');panel.get_by_role('button',name=t['rle.draft.compare'],exact=True).click();options.first.click()
    if len(scenario['turns'])>1:
     page.get_by_role('button',name=t['rle.continueDialogue'],exact=True).click();expect(draft).to_have_count(0);panel.get_by_role('button',name=t['rle.draft.open'],exact=True).click();expect(draft).to_have_value('')
    page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click();enter();expect(draft).to_have_count(0);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');print(width,lang,scenario["id"],'draft hides/reveals originalchoices,self-review edit reset,close/restart/turn/exit reset,8pxhorizontal/16pxvertical/2000limit PASS; no grading/network')
    page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click()
   page.close()
  b.close()
finally:server.shutdown();server.server_close()
