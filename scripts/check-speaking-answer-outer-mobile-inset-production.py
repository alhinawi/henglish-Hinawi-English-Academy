import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/speakingAcademyData.ts').read_text().split('export const SPEAKING_LESSONS: SpeakingLesson[] = ')[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN',f'http://127.0.0.1:{server.server_port}');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(w,l) for w in [320,390] for l in ['en','ar']]:
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang)
   for index in range(int(os.environ.get('TEST_START','0')),int(os.environ.get('TEST_END','32'))):
    lesson=data[index]
    page.locator('button').filter(has=page.locator('h3')).nth(index).click();panel=page.get_by_role('heading',name='2. '+t['sp.step2'],exact=True).locator('..');assert panel.evaluate('(e)=>getComputedStyle(e).paddingLeft')=='0px';assert panel.evaluate('(e)=>getComputedStyle(e).borderLeftWidth')=='0px';options=panel.get_by_role('button');expect(options).to_have_count(3);expect(panel.locator('p[dir=ltr]')).to_have_text(lesson['dialogue'][0]['en']);gap=page.get_by_role('textbox',name=t['sp.step3.aria'],exact=True);gap.fill('retained gap draft');complete=page.get_by_role('button',name=t['sp.complete.save'],exact=True);expect(complete).to_be_disabled()
    for i,optionindex in enumerate([1,0,2]):
     button=options.nth(i);expect(button).to_have_text(lesson['options'][optionindex]);assert button.evaluate('(e)=>e.clientWidth-parseFloat(getComputedStyle(e).paddingLeft)-parseFloat(getComputedStyle(e).paddingRight)')>=width-50;assert button.bounding_box()['height']>=56;button.click();expect(panel.get_by_role('status')).to_contain_text(t['sp.step2.correct']if optionindex==lesson['answer']else t['sp.step2.retry']);expect(gap).to_have_value('retained gap draft');expect(complete).to_be_disabled();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if index in [0,31]:panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-answer-outer-mobile-inset-{width}-{lang}-{index}.png')
    page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   print(width,lang,'all32lessons/96options exacttext/usablewidth/choice56/wrong-correctfeedback/gapretention/completiongate/nooverflow PASS; noactualaudio/capture',flush=True);page.close()
  b.close()
finally:server.shutdown();server.server_close()
