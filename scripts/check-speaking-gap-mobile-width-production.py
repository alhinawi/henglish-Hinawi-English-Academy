import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/speakingAcademyData.ts').read_text().split('export const SPEAKING_LESSONS: SpeakingLesson[] = ')[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4297),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4297');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(w,l) for w in [320,390] for l in ['en','ar']]:
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang)
   for index,lesson in enumerate(data):
    page.locator('button').filter(has=page.locator('h3')).nth(index).click();panel=page.get_by_role('heading',name='3. '+t['sp.step3'],exact=True).locator('..');prompt=panel.locator('p[dir=ltr]');expect(prompt).to_have_text(lesson['gapPrompt']);expect(prompt).to_have_attribute('lang','en');assert prompt.bounding_box()['width']>=width-68
    gap=panel.get_by_role('textbox',name=t['sp.step3.aria'],exact=True);assert gap.evaluate('(e)=>e.clientWidth-parseFloat(getComputedStyle(e).paddingLeft)-parseFloat(getComputedStyle(e).paddingRight)')>=width-86;assert gap.bounding_box()['height']>=48;check=panel.get_by_role('button',name=t['sp.step3.check'],exact=True);assert check.bounding_box()['height']>=48;complete=page.get_by_role('button',name=t['sp.complete.save'],exact=True);expect(complete).to_be_disabled()
    gap.fill('wrong');check.click();expect(panel.get_by_role('status')).to_contain_text(t['sp.step3.hintA']);gap.fill(lesson['gap']);expect(panel.get_by_role('status')).to_have_count(0);check.click();expect(panel.get_by_role('status')).to_have_text(t['sp.step3.correct']);gap.fill('edited');expect(panel.get_by_role('status')).to_have_count(0);expect(complete).to_be_disabled();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if index in [0,31]:panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-gap-mobile-width-{width}-{lang}-{index}.png')
    page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   print(width,lang,'all32prompts exacttext/lang/LTR/usablewidth/input48/check48/wrong-correct-editfeedback/completiongate/nooverflow PASS; noactualaudio/capture',flush=True);page.close()
  b.close()
finally:server.shutdown();server.server_close()
