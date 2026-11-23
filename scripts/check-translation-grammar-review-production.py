import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4197),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4197');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#translation');page.get_by_role('button',name=t['ts.practice'],exact=True).click();draft=page.get_by_label(t['tpr.draft'],exact=True);summary=page.locator('summary').filter(has_text=t['tpr.grammar.title']);details=page.locator('details').filter(has=summary)
   for i in range(20):
    expect(summary).to_have_count(0);draft.fill('My independent translation');page.get_by_role('button',name=t['tpr.show'],exact=True).click();expect(summary).to_be_visible();assert not details.evaluate('(el)=>el.open');summary.click();assert details.locator('p[lang="ar"]').inner_text().strip();expect(draft).to_have_value('My independent translation');expect(details.get_by_text(t['tpr.grammar.note'],exact=True)).to_be_visible();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');details.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-95,behavior:"instant"})')
    if i==0:page.screenshot(path=f'/downloads/henglish-{prefix}translation-grammar-review-{lang}.png')
    page.get_by_role('button',name=t['tpr.hide'],exact=True).click();expect(summary).to_have_count(0);page.get_by_role('button',name=t['tpr.show'],exact=True).click();assert not details.evaluate('(el)=>el.open');page.get_by_role('button',name=t['tpr.next'],exact=True).click()
   print(lang,'20tasksourcegrammarnotes,modelgated/nativecloseddefault,hide/reopenreset,draftretention,Arabiclabels,390px PASS; no score/network');page.close()
  b.close()
finally:server.shutdown();server.server_close()
