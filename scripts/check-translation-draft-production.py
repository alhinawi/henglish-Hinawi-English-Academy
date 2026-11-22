import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4198),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4198');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce')
   page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#translation');page.get_by_role('button',name=t['ts.practice'],exact=True).click()
   draft=page.get_by_label(t['tpr.draft'],exact=True);expect(draft).to_have_attribute('dir','ltr');draft.fill('I learn English each day.')
   show=page.get_by_role('button',name=t['tpr.show'],exact=True);show.click();checks=page.get_by_role('checkbox');expect(checks).to_have_count(3);checks.nth(0).check();draft.fill('I study English every day.');expect(checks.nth(0)).not_to_be_checked();checks.nth(0).check()
   page.get_by_role('button',name=t['tpr.hide'],exact=True).click();expect(draft).to_have_value('I study English every day.');show.click();expect(checks.nth(0)).to_be_checked()
   page.get_by_role('button',name=t['tpr.next'],exact=True).click();expect(draft).to_have_value('');expect(draft).to_have_attribute('dir','rtl');expect(checks).to_have_count(0);draft.fill('ترجمتي الخاصة')
   page.get_by_role('button',name=t['tpr.previous'],exact=True).click();expect(draft).to_have_value('I study English every day.');show.click();expect(checks.nth(0)).to_be_checked();draft.scroll_into_view_if_needed();page.screenshot(path=f'/downloads/henglish-{prefix}translation-draft-{lang}.png')
   checks.nth(0).scroll_into_view_if_needed();page.screenshot(path=f'/downloads/henglish-{prefix}translation-draft-review-{lang}.png')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.get_by_role('button',name=t['ts.studio']+' '+t['ts.main'],exact=True).click();page.get_by_role('button',name=t['ts.practice'],exact=True).click();expect(draft).to_have_value('');expect(checks).to_have_count(0)
   print(lang,'draft, direction, self-check/edit-reset, challenge retention, hide/reveal, tab-exit reset, 390px PASS; API unavailable simulation')
   page.close()
  b.close()
finally:server.shutdown();server.server_close()
