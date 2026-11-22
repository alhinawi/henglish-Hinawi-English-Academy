import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4199),functools.partial(Quiet,directory=str(root/'out')))
threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4199');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce')
   page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});")
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'))
   page.goto(origin+'/speaking/?lang='+lang)
   page.get_by_role('button',name=t['sa.startFirst'],exact=True).click()
   panel=page.get_by_role('region',name=t['sp.roleplay.title'],exact=True)
   panel.get_by_role('button',name=t['sp.roleplay.open'],exact=True).click()
   expect(panel.get_by_role('button',name=t['sp.roleplay.listenPartner'],exact=True)).to_be_visible()
   panel.get_by_role('button',name=t['sp.roleplay.next'],exact=True).click()
   model='My name is Salma. Nice to meet you.'
   hint=panel.locator('#speaking-role-meaning');expect(hint).to_have_count(0);panel.get_by_role('button',name=t['sp.roleMeaning.show'],exact=True).click();expect(hint).to_have_text('اسمي سلمى. مبسوطة بمعرفتك.');expect(panel.get_by_text(model,exact=True)).to_have_count(0);panel.get_by_role('button',name=t['sp.roleMeaning.hide'],exact=True).click();expect(hint).to_have_count(0);panel.get_by_role('button',name=t['sp.roleMeaning.show'],exact=True).click()
   expect(panel.get_by_text(model,exact=True)).to_have_count(0)
   panel.get_by_role('button',name=t['sp.roleplay.reveal'],exact=True).click();expect(panel.get_by_text(model,exact=True)).to_be_visible()
   panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible()
   panel.get_by_role('button',name=t['sp.roleplay.role']+' A',exact=True).click()
   expect(panel.get_by_role('alert')).to_have_count(0)
   expect(hint).to_have_count(0);expect(panel.get_by_role('button',name=t['sp.roleMeaning.show'],exact=True)).to_have_count(0);expect(panel.get_by_text('What is your name?',exact=True)).to_have_count(0)
   panel.get_by_role('button',name=t['sp.roleplay.reveal'],exact=True).click();expect(panel.get_by_text('What is your name?',exact=True)).to_be_visible()
   panel.get_by_role('button',name=t['sp.roleplay.hide'],exact=True).click();panel.get_by_role('button',name=t['sp.roleplay.restart'],exact=True).click();expect(hint).to_have_count(0);panel.get_by_role('button',name=t['sp.roleplay.role']+' B',exact=True).click();panel.get_by_role('button',name=t['sp.roleplay.next'],exact=True).click();panel.get_by_role('button',name=t['sp.roleMeaning.show'],exact=True).click();panel.scroll_into_view_if_needed();page.screenshot(path=f'/downloads/henglish-{prefix}speaking-role-meaning-{lang}.png')
   panel.get_by_role('button',name=t['sp.roleplay.close'],exact=True).click();expect(panel.get_by_role('button',name=t['sp.rec.start'],exact=True)).to_have_count(0)
   panel.get_by_role('button',name=t['sp.roleplay.open'],exact=True).click();expect(hint).to_have_count(0);expect(panel.get_by_role('button',name=t['sp.roleplay.listenPartner'],exact=True)).to_be_visible()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   print(lang,'Arabicmeaninghintshowhide,Englishmodelhidden,role/turn/restart/closereset,micdenial, 390px PASS; no real mic used')
   page.close()
  b.close()
finally:server.shutdown();server.server_close()
