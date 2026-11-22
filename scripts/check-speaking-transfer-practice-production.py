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
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});")
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang);page.get_by_role('button',name=t['sa.startFirst'],exact=True).click();panel=page.get_by_role('region',name=t['sp.transfer.title'],exact=True);panel.get_by_role('button',name=t['sp.transfer.open'],exact=True).click();expect(panel.get_by_text(t['sp.transfer.task.A1.0'],exact=True)).to_be_visible();plan=panel.get_by_role('textbox',name=t['sp.transfer.plan'],exact=True);plan.fill('My private plan');panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible();panel.get_by_role('button',name=t['sp.transfer.choice.1'],exact=True).click();expect(plan).to_have_value('');expect(panel.get_by_role('alert')).to_have_count(0);expect(panel.get_by_text(t['sp.transfer.task.A1.1'],exact=True)).to_be_visible();plan.fill('Ask one follow-up question.');panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-96,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-transfer-{lang}.png');panel.get_by_role('button',name=t['sp.transfer.close'],exact=True).click();expect(plan).to_have_count(0);panel.get_by_role('button',name=t['sp.transfer.open'],exact=True).click();expect(plan).to_have_value('');expect(panel.get_by_text(t['sp.transfer.task.A1.0'],exact=True)).to_be_visible();page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   for level in ['A2','B1','B2']:
    page.get_by_role('button',name=level,exact=True).click();page.locator('button').filter(has=page.locator('h3')).first.click();panel.get_by_role('button',name=t['sp.transfer.open'],exact=True).click();expect(panel.get_by_text(t[f'sp.transfer.task.{level}.0'],exact=True)).to_be_visible();expect(plan).to_have_value('');panel.get_by_role('button',name=t['sp.transfer.choice.1'],exact=True).click();expect(panel.get_by_text(t[f'sp.transfer.task.{level}.1'],exact=True)).to_be_visible();page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');print(lang,'all4levels x2followups,privateplan,task/close/lesson reset,micdenialcleanup,390px PASS; noactualrecording');page.close()
  b.close()
finally:server.shutdown();server.server_close()
