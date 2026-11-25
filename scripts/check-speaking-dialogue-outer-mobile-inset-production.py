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
    page.locator('button').filter(has=page.locator('h3')).nth(index).click();panel=page.get_by_role('heading',name='1. '+t['sp.step1'],exact=True).locator('../..');assert panel.evaluate('(e)=>getComputedStyle(e).paddingLeft')=='0px';assert panel.evaluate('(e)=>getComputedStyle(e).borderLeftWidth')=='0px';lines=panel.locator('p[dir=ltr]');expect(lines).to_have_count(len(lesson['dialogue']))
    for i,line in enumerate(lesson['dialogue']):
     expect(lines.nth(i)).to_have_text(line['en']);assert lines.nth(i).bounding_box()['width']>=width-52;listen=panel.get_by_role('button',name=t['sp.listenLineAria']+' '+str(i+1),exact=True);assert listen.bounding_box()['height']>=44
    meanings=panel.locator('p[dir=auto]');count=meanings.count();assert count==sum(bool(line['ar']) for line in lesson['dialogue']);panel.get_by_role('button',name=t['sp.step1.hide'],exact=True).click();expect(meanings).to_have_count(0);expect(lines).to_have_count(len(lesson['dialogue']));panel.get_by_role('button',name=t['sp.step1.show'],exact=True).click();expect(meanings).to_have_count(count);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if index==0:panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-dialogue-outer-mobile-inset-{width}-{lang}.png')
    page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   print(width,lang,'all32lessons dialogue exacttext/width/meaninghide-show/listen44/nooverflow PASS; noactualaudio/capture',flush=True);page.close()
  b.close()
finally:server.shutdown();server.server_close()
