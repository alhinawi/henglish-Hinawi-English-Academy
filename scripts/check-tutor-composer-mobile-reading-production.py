import functools,http.server,json,os,pathlib,threading,re
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4298),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4298');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(int(w),l)for w in os.environ.get('TEST_WIDTHS','320,390').split(',')for l in ['en','ar']]:
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');sent=[];page.route('**/henglish-helper.hnz.workers.dev/**',lambda r:(sent.append(r.request.post_data),r.fulfill(status=503,json={'error':'UI test'})));page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#ai-tutor')
   modes=['grammar-teacher','conversation-partner','vocabulary-coach','writing-assistant','pronunciation-coach','exam-trainer','interview-coach'];buttons=page.locator('button').filter(has=page.locator('div.font-mono[lang=en]'));expect(buttons).to_have_count(7)
   for mode in modes:
    button=page.get_by_role('button',name=re.compile(re.escape(t['atm.'+mode+'.name']))).filter(has=page.locator('[class*=font-mono]'));button.click();draft=page.get_by_role('textbox',name=t['at.askPre']+' '+t['atm.'+mode+'.name'],exact=True);expect(draft).to_have_value('');expect(draft).to_have_attribute('maxlength','1200');expect(draft).to_have_attribute('dir','auto');assert draft.evaluate('(e)=>parseFloat(getComputedStyle(e).fontSize)')==16;assert draft.evaluate('(e)=>parseFloat(getComputedStyle(e).paddingLeft)')==8;assert draft.evaluate('(e)=>parseFloat(getComputedStyle(e).paddingRight)')==8;assert draft.bounding_box()['height']>=44
    for value in ['My unsent English question.','سؤالي من غير إرسال','x'*1200]:
     draft.fill(value);expect(draft).to_have_value(value);assert not sent;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    draft.fill('My unsent question.');draft.evaluate('(e)=>e.blur()');expect(draft).to_have_value('My unsent question.');draft.fill('')
   draft.fill('My question.');draft.evaluate('(e)=>window.scrollTo({top:window.scrollY+e.getBoundingClientRect().top-220,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}tutor-composer-mobile-reading-{width}-{lang}.png');assert not sent;print(width,lang,'7modes16pxfont/8pxhorizontal/44pxtarget/1200limit/autodir/English-Arabicinput/blurretention/noautosend/nooverflow PASS; noactualAIresponse');page.close()

  desktop=b.new_page(viewport={'width':768,'height':1050});desktop.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));desktop.goto(origin+'/?lang=en#ai-tutor');field=desktop.get_by_role('textbox',name='Ask Grammar Teacher',exact=True)
  field=desktop.locator('input[maxlength="1200"]');expect(field).to_be_visible();assert field.evaluate('(e)=>parseFloat(getComputedStyle(e).fontSize)')==14;assert field.evaluate('(e)=>parseFloat(getComputedStyle(e).paddingLeft)')==16;print('768 desktop14pxfont/16pxhorizontal PASS');desktop.close()
  b.close()
finally:server.shutdown();server.server_close()
