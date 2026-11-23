import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();lessons=json.loads((root/'src/data/speakingAcademyData.ts').read_text().split('export const SPEAKING_LESSONS: SpeakingLesson[] = ')[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4237),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4237');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang)
   for lesson in lessons:
    page.locator('button').filter(has=page.get_by_text(lesson['titleEn'],exact=True)).click();panel=page.get_by_role('region',name=t['sp.roleplay.title'],exact=True);attempt=panel.get_by_label(t['sp.roleDraft.label'],exact=True);expect(attempt).to_have_count(0);panel.get_by_role('button',name=t['sp.roleplay.open'],exact=True).click();expect(attempt).to_have_count(0)
    for role in ['A','B']:
     panel.get_by_role('button',name=t['sp.roleplay.role']+' '+role,exact=True).click()
     if role=='B':panel.get_by_role('button',name=t['sp.roleplay.next'],exact=True).click()
     details=panel.locator('details');assert not details.evaluate('(el)=>el.open');details.locator('summary').click();expect(attempt).to_have_value('');expect(attempt).to_have_attribute('maxlength','500');expect(attempt).to_have_attribute('lang','en');expect(attempt).to_have_attribute('dir','ltr');attempt.fill('My own reply for this turn.');panel.get_by_role('button',name=t['sp.roleMeaning.show'],exact=True).click();expect(attempt).to_have_value('My own reply for this turn.');panel.get_by_role('button',name=t['sp.roleplay.reveal'],exact=True).click();expect(attempt).to_have_value('My own reply for this turn.');details.locator('summary').click();details.locator('summary').click();expect(attempt).to_have_value('My own reply for this turn.');attempt.fill('x'*500);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');attempt.fill('My own reply, ready to say aloud.')
     if lesson==lessons[0] and role=='B':details.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-110,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-role-written-attempt-{lang}.png')
     panel.get_by_role('button',name=t['sp.roleplay.next'],exact=True).click();expect(attempt).to_have_count(0);panel.get_by_role('button',name=t['sp.roleplay.previous'],exact=True).click();assert not details.evaluate('(el)=>el.open');details.locator('summary').click();expect(attempt).to_have_value('');attempt.fill('Discard on close');panel.get_by_role('button',name=t['sp.roleplay.close'],exact=True).click();expect(attempt).to_have_count(0);panel.get_by_role('button',name=t['sp.roleplay.open'],exact=True).click()
    page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   print(lang,'all32lessonsbothroles,yourturnonly,closeddefault,500chars,Englishlangdir,meaning/model/collapsepreserve,turn-role-close-lessonreset,390px PASS;noaudio/capture');page.close()
  b.close()
finally:server.shutdown();server.server_close()
