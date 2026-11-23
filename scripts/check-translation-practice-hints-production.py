import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4199),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4199');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#translation');page.get_by_role('button',name=t['ts.practice'],exact=True).click();panel=page.get_by_role('region',name=t['tpr.help.title'],exact=True);draft=page.get_by_label(t['tpr.draft'],exact=True)
   for i in range(20):
    expect(panel.get_by_role('definition')).to_have_count(0);draft.fill('My own attempt');page.get_by_role('button',name=t['tpr.show'],exact=True).click();model=page.get_by_role('heading',name=t['tpr.answers'],exact=True);expect(model).to_be_visible();page.get_by_role('button',name=t['tpr.hide'],exact=True).click();expect(model).to_have_count(0);panel.get_by_role('button',name=t['tpr.help.open'],exact=True).click();expect(panel.get_by_role('definition').first).to_be_visible();assert panel.locator('p[lang="ar"]').inner_text();assert panel.locator('dt').count()>0;expect(draft).to_have_value('My own attempt');expect(model).to_have_count(0);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-90,behavior:"instant"})')
    if i==0:page.screenshot(path=f'/downloads/henglish-{prefix}translation-help-{lang}.png')
    panel.get_by_role('button',name=t['tpr.help.close'],exact=True).click();expect(panel.get_by_role('definition')).to_have_count(0);panel.get_by_role('button',name=t['tpr.help.open'],exact=True).click();page.get_by_role('button',name=t['tpr.next'],exact=True).click()
   for key,value in [('tpr.filter.level','B1'),('tpr.filter.direction','en-to-ar')]:
    panel.get_by_role('button',name=t['tpr.help.open'],exact=True).click();page.get_by_label(t[key],exact=True).select_option(value);expect(panel.get_by_role('definition')).to_have_count(0)
   print(lang,'20taskcontext/vocabulary panels,hiddenmodels,draftretained,explicitArabic/direction,filter/navigationreset,390px PASS; no network/grade');page.close()
  b.close()
finally:server.shutdown();server.server_close()
