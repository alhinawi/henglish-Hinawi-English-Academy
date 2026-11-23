import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4249),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4249');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});");t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/pronunciation/?lang='+lang);panel=page.get_by_role('region',name=t['pa.photo.title'],exact=True);expect(panel).to_be_visible();selector=panel.get_by_label(t['pa.photo.choose'],exact=True)
   for i in range(24):
    selector.select_option(str(i));question=panel.locator('details').filter(has=page.locator('summary').filter(has_text=t['pa.photoChallenge.title']));question.locator(':scope > summary').click();response=question.locator('details').filter(has=page.locator('summary').filter(has_text=t['pa.photoResponse.title']));response.locator(':scope > summary').click();draft=panel.get_by_label(t['pa.photoResponse.label'],exact=True);draft.fill('My independent answer.');review=response.locator('details');assert not review.evaluate('(el)=>el.open');review.locator('summary').click();checks=review.get_by_role('checkbox');expect(checks).to_have_count(2);clear=review.get_by_role('button',name=t['pa.responseChecks.clear'],exact=True);expect(clear).to_be_disabled()
    for c in checks.all():expect(c).not_to_be_checked();c.check()
    expect(draft).to_have_value('My independent answer.');review.locator('summary').click();review.locator('summary').click();expect(checks.first).to_be_checked();response.locator(':scope > summary').click();response.locator(':scope > summary').click();expect(checks.first).to_be_checked();clear.click();expect(clear).to_be_disabled()
    for c in checks.all():expect(c).not_to_be_checked()
    checks.first.check();panel.get_by_role('button',name=t['pa.photoResponse.clear'],exact=True).click();expect(draft).to_have_value('');expect(checks.first).to_be_checked();draft.fill('Another answer.');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');review.evaluate('(el)=>{document.activeElement.blur();window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-110,behavior:"instant"})}')
    if i==4:page.screenshot(path=f'/downloads/henglish-{prefix}pronunciation-response-checks-{lang}.png')
   selector.select_option('0');question=panel.locator('details').filter(has=page.locator('summary').filter(has_text=t['pa.photoChallenge.title']));question.locator(':scope > summary').click();response=question.locator('details').filter(has=page.locator('summary').filter(has_text=t['pa.photoResponse.title']));response.locator(':scope > summary').click();review=response.locator('details');assert not review.evaluate('(el)=>el.open');review.locator('summary').click()
   for c in review.get_by_role('checkbox').all():expect(c).not_to_be_checked()
   print(lang,'20photos40manualcontentchecks,closeduncheckeddefault,collapsepreserved,clearindependent,draftunchanged,scenereset,390px PASS; no actual capture/playback');page.close()
  b.close()
finally:server.shutdown();server.server_close()
