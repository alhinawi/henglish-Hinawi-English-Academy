import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/speakingAcademyData.ts').read_text().split('export const SPEAKING_LESSONS: SpeakingLesson[] = ')[1].strip().rstrip(';'))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4218),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4218');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang)
   for index,lesson in enumerate(data):
    page.locator('button').filter(has=page.locator('h3')).nth(index).click();panel=page.get_by_role('heading',name='4. '+t['sp.step4'],exact=True).locator('..');undo=panel.get_by_role('button',name=t['sp.step4.undo'],exact=True);tiles=panel.locator('div[dir="ltr"] button');answer=panel.locator('p[dir="ltr"]');feedback=panel.get_by_role('status');check=panel.get_by_role('button',name=t['sp.step4.check'],exact=True);expect(undo).to_be_disabled();count=tiles.count();words=lesson['phrase'].split(' ');assert count==len(words)
    tiles.nth(0).click();tiles.nth(1).click();check.click();expect(feedback).to_be_visible();undo.click();expect(feedback).to_have_count(0);expect(tiles.nth(1)).to_be_enabled();expect(tiles.nth(0)).to_be_disabled();expect(answer).to_have_text(words[-1]);undo.click();expect(undo).to_be_disabled();expect(answer).to_have_text('…')
    for i in reversed(range(count)):tiles.nth(i).click()
    check.click();expect(feedback).to_have_text(t['sp.step4.correct']);undo.click();expect(feedback).to_have_count(0);expect(tiles.nth(0)).to_be_enabled();expect(answer).to_have_text(' '.join(words[:-1]));expect(page.get_by_role('button',name=t['sp.complete.save'],exact=True)).to_be_disabled();tiles.nth(0).click();check.click();expect(feedback).to_have_text(t['sp.step4.correct']);panel.get_by_role('button',name=t['sp.step4.reset'],exact=True).click();expect(undo).to_be_disabled();expect(feedback).to_have_count(0);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if index==0:
     tiles.nth(count-1).click();tiles.nth(count-2).click();panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-order-undo-{lang}.png')
    page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   print(lang,'all32lessons,lastwordonly/tileenable,emptydisabled,incorrect/correctfeedbackinvalidated,recheck/reset,completiondisabled,390px PASS; noaudio');page.close()
  b.close()
finally:server.shutdown();server.server_close()
