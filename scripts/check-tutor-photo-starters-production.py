import functools,http.server,json,os,pathlib,threading,re
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4197),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4197');prefix='live-' if origin.startswith('https:') else ''
modes=['grammar-teacher','conversation-partner','vocabulary-coach','writing-assistant','pronunciation-coach','exam-trainer','interview-coach']
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');sent=[]
   page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-helper.hnz.workers.dev/**',lambda r:(sent.append(r.request.post_data),r.fulfill(status=503,json={'error':'UI test'})))
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#ai-tutor')
   panel=page.get_by_role('region',name=t['at.photo.title'],exact=True);use=panel.get_by_role('button',name=t['at.photo.use'],exact=True)
   for mode in modes:
    page.get_by_role('button',name=re.compile(re.escape(t[f'atm.{mode}.name']))).filter(has=page.locator('[class*=font-mono]')).click()
    image=panel.get_by_role('img',name=t['at.photo.'+mode],exact=True);image.scroll_into_view_if_needed();expect(image).to_be_visible();image.evaluate('(img)=>img.decode()');assert image.evaluate('(img)=>img.naturalWidth>0')
    use.click();draft=page.get_by_role('textbox',name=t['at.askPre']+' '+t['atm.'+mode+'.name'],exact=True);expect(draft).to_have_value(t['at.starter.'+mode]);expect(use).to_be_disabled();assert not sent
    draft.fill('My own draft');expect(use).to_be_disabled();expect(draft).to_have_value('My own draft');draft.fill('');expect(use).to_be_enabled()
    if mode=='interview-coach':
     panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-96,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}tutor-photo-starter-{lang}.png')
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   print(lang,'7 scene photos loaded, captions/mode switch, editable starter, no autosend, draft preservation,390px PASS; helper/API blocked')
   page.close()
  b.close()
finally:server.shutdown();server.server_close()
