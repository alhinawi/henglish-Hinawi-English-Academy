import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();lessons=json.loads((root/'src/data/speakingAcademyData.ts').read_text().split('export const SPEAKING_LESSONS: SpeakingLesson[] = ')[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4297),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4297');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(w,l)for w in [320,390]for l in ['en','ar']]:
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang)
   for lesson in lessons:
    page.locator('button').filter(has=page.get_by_text(lesson['titleEn'],exact=True)).click();panel=page.get_by_role('region',name=t['sp.transfer.title'],exact=True);plan=panel.get_by_label(t['sp.transfer.plan'],exact=True);expect(plan).to_have_count(0);panel.get_by_role('button',name=t['sp.transfer.open'],exact=True).click()
    for task in [0,1]:
     panel.get_by_role('button',name=t[f'sp.transfer.choice.{task}'],exact=True).click();expect(plan).to_have_value('');expect(plan).to_have_attribute('maxlength','1500');expect(plan).to_have_attribute('dir','auto');expect(panel.get_by_text(t[f'sp.transfer.task.{lesson["level"]}.{task}'],exact=True)).to_be_visible()
     assert plan.evaluate('(e)=>parseFloat(getComputedStyle(e).paddingLeft)')==8;assert plan.evaluate('(e)=>parseFloat(getComputedStyle(e).paddingRight)')==8;assert plan.evaluate('(e)=>parseFloat(getComputedStyle(e).paddingTop)')==16;assert plan.evaluate('(e)=>e.clientWidth-16')>=width-98
     plan.fill('My private English plan.');expect(plan).to_have_value('My private English plan.');plan.fill('خطة خاصة للتدريب');expect(plan).to_have_value('خطة خاصة للتدريب');plan.fill('x'*1500);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');plan.fill('Ask one follow-up question.')
     if lesson==lessons[0]and task==1:plan.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-200,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-transfer-writing-width-{width}-{lang}.png')
    panel.get_by_role('button',name=t['sp.transfer.close'],exact=True).click();expect(plan).to_have_count(0);panel.get_by_role('button',name=t['sp.transfer.open'],exact=True).click();expect(plan).to_have_value('');page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   print(width,lang,'all32lessons x2followups/8pxhorizontal16pxwritinggain/1500limit/autodir/English-Arabicinput/task-close-lessonreset/nooverflow PASS; APIsblocked,noaudio/capture/assessment');page.close()
  b.close()
finally:server.shutdown();server.server_close()
