import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/speakingAcademyData.ts').read_text().split('export const SPEAKING_LESSONS: SpeakingLesson[] = ')[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4210),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4210');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang)
   for level in ['A1','A2','B1','B2']:
    page.get_by_role('button',name=level,exact=True).click()
    for index,lesson in enumerate([x for x in data if x['level']==level]):
     page.locator('button').filter(has=page.locator('h3')).nth(index).click();panel=page.get_by_role('region',name=t['sp.roleplay.title'],exact=True);panel.get_by_role('button',name=t['sp.roleplay.open'],exact=True).click();hint=panel.locator('#speaking-role-meaning')
     for role in ['A','B']:
      panel.get_by_role('button',name=t['sp.roleplay.role']+' '+role,exact=True).click()
      for i,line in enumerate(lesson['dialogue']):
       expect(hint).to_have_count(0);panel.get_by_role('button',name=t['sp.roleMeaning.show'],exact=True).click();expect(hint).to_have_text(line['ar']);assert hint.get_attribute('lang')=='ar';assert hint.get_attribute('dir')=='rtl'
       if line['role']==role:expect(panel.get_by_text(line['en'],exact=True)).to_have_count(0)
       panel.get_by_role('button',name=t['sp.roleMeaning.hide'],exact=True).click();expect(hint).to_have_count(0);panel.get_by_role('button',name=t['sp.roleMeaning.show'],exact=True).click()
       if level=='A1' and index==0 and role=='A' and i==0:panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-dialogue-meanings-{lang}.png')
       panel.get_by_role('button',name=t['sp.roleplay.again'] if i==3 else t['sp.roleplay.next'],exact=True).click();expect(hint).to_have_count(0)
     assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   print(lang,'all32lessons x4turns x2roles,128Egyptianmeanings,explicitshowhide,modelhidden,turn/rolereset,390px PASS; noactualaudio/capture');page.close()
  b.close()
finally:server.shutdown();server.server_close()
