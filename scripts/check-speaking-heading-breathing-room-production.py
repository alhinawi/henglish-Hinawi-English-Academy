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
    lesson=data[index];page.locator('button').filter(has=page.locator('h3')).nth(index).click();panel=page.get_by_role('heading',name='5. '+t['sp.step5'],exact=True).locator('..');assert panel.evaluate('(e)=>getComputedStyle(e).paddingLeft')=='0px';assert panel.evaluate('(e)=>getComputedStyle(e).borderLeftWidth')=='0px';prompt=panel.locator('p[dir=ltr]');expect(prompt).to_have_text(lesson['prompt']);assert prompt.bounding_box()['width']>=width-52;heading=panel.locator('h3');assert heading.evaluate('(e)=>getComputedStyle(e).paddingRight')=='8px';assert heading.evaluate('(e)=>parseFloat(getComputedStyle(e).lineHeight)')>=32;follow=page.get_by_role('region',name=t['sp.transfer.title'],exact=True).locator('h3');assert follow.evaluate('(e)=>getComputedStyle(e).paddingRight')=='8px';assert follow.evaluate('(e)=>parseFloat(getComputedStyle(e).lineHeight)')>=32;rec=panel.get_by_role('button',name=t['sp.rec.start'],exact=True);assert rec.bounding_box()['height']>=48;expect(panel.get_by_text(t['sp.rec.note'],exact=True)).to_be_visible();checks=panel.get_by_role('checkbox');assert checks.count()==3;complete=panel.get_by_role('button',name=t['sp.complete.save'],exact=True);expect(complete).to_be_disabled()
    for i in range(3):checks.nth(i).check()
    expect(complete).to_be_disabled();checks.nth(1).uncheck();expect(checks.nth(0)).to_be_checked();expect(checks.nth(1)).not_to_be_checked();expect(checks.nth(2)).to_be_checked();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if index in [0,31]:panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-heading-breathing-room-{width}-{lang}-{index}.png')
    page.get_by_role('button',name=t['sa.allUnits'],exact=True).click();page.locator('button').filter(has=page.locator('h3')).nth(index).click();expect(page.get_by_role('checkbox').first).not_to_be_checked();page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   print(width,lang,f'lessons{os.environ.get("TEST_START","0")}-{os.environ.get("TEST_END","32")} outer0inset/border/exactprompt/LTR/width/record48/privacynote/independentchecks/completiongate/lessonreset/overflow PASS; noactualaudio/capture',flush=True);page.close()
  b.close()
finally:server.shutdown();server.server_close()
