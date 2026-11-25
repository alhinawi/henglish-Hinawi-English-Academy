import functools,http.server,json,os,pathlib,threading,re
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4296),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4296');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(int(w),l)for w in os.environ.get('TEST_WIDTHS','320,390').split(',')for l in ['en','ar']]:
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');sent=[];page.route('**/henglish-helper.hnz.workers.dev/**',lambda r:(sent.append(r.request.post_data),r.fulfill(status=503,json={'error':'UI test'})));page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#ai-tutor')
   modes=['grammar-teacher','conversation-partner','vocabulary-coach','writing-assistant','pronunciation-coach','exam-trainer','interview-coach'];buttons=page.locator('button').filter(has=page.locator('div.font-mono[lang=en]'));expect(buttons).to_have_count(7)
   for mode in modes:
    button=page.get_by_role('button',name=re.compile(re.escape(t['atm.'+mode+'.name']))).filter(has=page.locator('[class*=font-mono]'));subtitle=button.locator('div.font-mono');expect(subtitle).to_have_attribute('dir','ltr');expect(subtitle).to_have_attribute('lang','en');assert subtitle.evaluate('(e)=>e.scrollWidth<=e.clientWidth+1&&e.scrollHeight<=e.clientHeight+1&&getComputedStyle(e).whiteSpace==="normal"');assert button.bounding_box()['height']>=44;button.click();expect(button).to_have_attribute('aria-pressed','true');assert buttons.locator('[aria-pressed=true]').count()==0;assert sum(b.get_attribute('aria-pressed')=='true'for b in buttons.all())==1;draft=page.get_by_role('textbox',name=t['at.askPre']+' '+t['atm.'+mode+'.name'],exact=True);expect(draft).to_have_value('');assert not sent;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   buttons.first.evaluate('(e)=>window.scrollTo({top:window.scrollY+e.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}tutor-selector-mobile-reading-{width}-{lang}.png');print(width,lang,'7fullnames/lang/LTR/wrapping/target44/activeswitch/emptycomposer/noautosend/nooverflow PASS; noactualAIresponse');page.close()

  b.close()
finally:server.shutdown();server.server_close()
