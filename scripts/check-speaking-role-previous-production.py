import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/speakingAcademyData.ts').read_text().split('export const SPEAKING_LESSONS: SpeakingLesson[] = ')[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4214),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4214');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});");t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang)
   for level in ['A1','A2','B1','B2']:
    page.get_by_role('button',name=level,exact=True).click();lesson=next(x for x in data if x['level']==level);page.locator('button').filter(has=page.locator('h3')).first.click();panel=page.get_by_role('region',name=t['sp.roleplay.title'],exact=True);panel.get_by_role('button',name=t['sp.roleplay.open'],exact=True).click();hint=panel.locator('#speaking-role-meaning');previous=panel.get_by_role('button',name=t['sp.roleplay.previous'],exact=True)
    for role in ['A','B']:
     panel.get_by_role('button',name=t['sp.roleplay.role']+' '+role,exact=True).click()
     for i in [0,3,2,1,0]:
      line=lesson['dialogue'][i];expect(panel.get_by_role('status')).to_have_text(t['sp.roleplay.turn'].replace('{current}',str(i+1)).replace('{total}','4'));expect(hint).to_have_count(0);panel.get_by_role('button',name=t['sp.roleMeaning.show'],exact=True).click();expect(hint).to_have_text(line['ar'])
      if line['role']==role:
       expect(panel.get_by_text(line['en'],exact=True)).to_have_count(0);panel.get_by_role('button',name=t['sp.roleplay.reveal'],exact=True).click();expect(panel.get_by_text(line['en'],exact=True)).to_be_visible();panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible()
      if level=='A1' and role=='B' and i==3:previous.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-850,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-role-previous-{lang}.png')
      previous.click();expect(hint).to_have_count(0);expect(panel.get_by_role('alert')).to_have_count(0)
    panel.get_by_role('button',name=t['sp.roleplay.restart'],exact=True).click();expect(panel.get_by_role('status')).to_have_text(t['sp.roleplay.turn'].replace('{current}','1').replace('{total}','4'));assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   print(lang,'all4levels x2roles,previousturn/wrap,exactmeaning/model,hiddenreset,microphonedenialcleanup,restart,390px PASS; noactualcapture/audio');page.close()
  b.close()
finally:server.shutdown();server.server_close()
