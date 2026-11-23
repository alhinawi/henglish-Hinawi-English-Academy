import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4202),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4202');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});")
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang);page.get_by_role('button',name=t['sa.startFirst'],exact=True).click();panel=page.get_by_role('region',name=t['sp.transfer.title'],exact=True);panel.get_by_role('button',name=t['sp.transfer.open'],exact=True).click();plan=panel.get_by_role('textbox',name=t['sp.transfer.plan'],exact=True);summary=panel.locator('summary').filter(has_text=t['sp.transferReview.title']);details=panel.locator('details').filter(has=page.get_by_text(t['sp.transferReview.title'],exact=True));target=panel.get_by_role('textbox',name=t['sp.transferReview.target'],exact=True);checks=details.get_by_role('checkbox')
   def review():
    assert not details.evaluate('(el)=>el.open');summary.click();expect(target).to_have_value('');expect(checks).to_have_count(3)
    for i in range(3):expect(checks.nth(i)).not_to_be_checked()
    plan.fill('My independent plan');target.fill('Add a clear detail');checks.nth(0).check();checks.nth(2).check();expect(checks.nth(1)).not_to_be_checked();expect(plan).to_have_value('My independent plan');summary.click();summary.click();expect(target).to_have_value('Add a clear detail');expect(checks.nth(0)).to_be_checked();expect(checks.nth(2)).to_be_checked();assert target.get_attribute('maxlength')=='300';assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   review();details.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-95,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-transfer-review-{lang}.png');panel.get_by_role('button',name=t['sp.transfer.choice.1'],exact=True).click();review();panel.get_by_role('button',name=t['sp.transfer.close'],exact=True).click();expect(summary).to_have_count(0);panel.get_by_role('button',name=t['sp.transfer.open'],exact=True).click();review();panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible();page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   for level in ['A2','B1','B2']:
    page.get_by_role('button',name=level,exact=True).click();page.locator('button').filter(has=page.locator('h3')).first.click();panel.get_by_role('button',name=t['sp.transfer.open'],exact=True).click();review();panel.get_by_role('button',name=t['sp.transfer.choice.1'],exact=True).click();review();page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');print(lang,'all4levels x2followups,selfreviewcloseddefault,3independentchecks,300chartarget,planunchanged,collapsepreserves,task/close/lesson reset,micdenialcleanup,390px PASS; noactualrecording');page.close()
  b.close()
finally:server.shutdown();server.server_close()
