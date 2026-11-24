import functools,http.server,json,os,pathlib,threading,re
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4304),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4304');prefix='live-' if origin.startswith('https:') else ''
modes=['grammar-teacher','conversation-partner','vocabulary-coach','writing-assistant','pronunciation-coach','exam-trainer','interview-coach']
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width in [320,390]:
   for lang in ['en','ar']:
    page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');sent=[];page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-helper.hnz.workers.dev/**',lambda r:(sent.append(r.request.post_data),r.fulfill(status=503,json={'error':'UI test'})));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#ai-tutor');page.get_by_role('button',name='دخول' if lang=='ar' else 'Sign in',exact=True).wait_for()
    for mode in modes:
     page.get_by_role('button',name=re.compile(re.escape(t[f'atm.{mode}.name']))).filter(has=page.locator('[class*=font-mono]')).click();page.wait_for_timeout(350);bar=page.locator('div.overflow-x-auto').filter(has=page.get_by_text(t['at.suggestions'],exact=True));buttons=bar.locator('button');assert buttons.count()>0
     for button in buttons.all():
      original=button.inner_text();assert original.strip();assert button.get_attribute('title');runs=button.locator('bdi');
      if lang=='en':assert runs.count()==0
      for run in runs.all():
       expect(run).to_have_attribute('dir','ltr');expect(run).to_have_attribute('lang','en');assert re.fullmatch(r'[A-Za-z][A-Za-z0-9 ]*[A-Za-z0-9]|[A-Za-z]',run.inner_text());assert run.evaluate('(el)=>getComputedStyle(el).direction')=='ltr'
      assert button.text_content()==original
     assert not sent;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
     if mode in ['grammar-teacher','exam-trainer']:
      bar.evaluate('(el)=>el.scrollLeft=0');page.wait_for_timeout(300);bar.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-180,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}tutor-suggestion-english-direction-{mode}-{width}-{lang}.png')
    print(width,lang,'all7modes suggestion labels/title preserved,Latin LTR isolation,nohelper requests,nooverflow PASS');page.close()
  b.close()
finally:server.shutdown();server.server_close()
