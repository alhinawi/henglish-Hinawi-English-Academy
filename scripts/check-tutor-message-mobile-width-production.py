import functools,http.server,json,os,pathlib,threading,re
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4303),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4303');prefix='live-' if origin.startswith('https:') else ''
modes=['grammar-teacher','conversation-partner','vocabulary-coach','writing-assistant','pronunciation-coach','exam-trainer','interview-coach']
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width in [320,390]:
   for lang in ['en','ar']:
    page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');sent=[];page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-helper.hnz.workers.dev/**',lambda r:(sent.append(r.request.post_data),r.fulfill(status=503,json={'error':'UI test'})));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#ai-tutor');page.get_by_role('button',name='دخول' if lang=='ar' else 'Sign in',exact=True).wait_for()
    for mode in modes:
     page.get_by_role('button',name=re.compile(re.escape(t[f'atm.{mode}.name']))).filter(has=page.locator('[class*=font-mono]')).click();page.wait_for_timeout(350);copy=page.get_by_title(t['at.copyTitle'],exact=True).first;bubble=copy.locator('xpath=../../..');bubble.scroll_into_view_if_needed();assert bubble.bounding_box()['width']>=width-70,(width,lang,mode,bubble.bounding_box());expect(bubble.get_by_role('button',name=t['at.listenFullTitle'],exact=True)).to_be_visible();text=bubble.inner_text();assert len(text)>40;draft=page.get_by_role('textbox',name=t['at.askPre']+' '+t['atm.'+mode+'.name'],exact=True);draft.fill('Draft stays editable, not sent.');expect(draft).to_have_value('Draft stays editable, not sent.');draft.fill('');assert not sent;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
     if mode=='grammar-teacher':
      bubble.evaluate('(el)=>{document.activeElement.blur();window.scrollTo({top:window.scrollY+el.parentElement.getBoundingClientRect().top-100,behavior:"instant"})}');page.screenshot(path=f'/downloads/henglish-{prefix}tutor-message-mobile-width-{width}-{lang}.png')
    print(width,lang,'all7modes fullwidth greeting/copy/listen controls,editable draft,nohelper requests,nooverflow PASS');page.close()
  b.close()
finally:server.shutdown();server.server_close()
