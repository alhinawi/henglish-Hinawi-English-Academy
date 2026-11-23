import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4246),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4246');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/pronunciation/?lang='+lang);panel=page.get_by_role('region',name=t['pa.photo.title'],exact=True);selector=panel.get_by_label(t['pa.photo.choose'],exact=True)
   for i in range(20):
    selector.select_option(str(i));challenge=panel.locator('details').filter(has=page.get_by_text(t['pa.photoChallenge.title'],exact=True));frames=panel.locator('details').filter(has=page.get_by_text(t['pa.photoFrames.title'],exact=True)).last;assert not challenge.evaluate('(el)=>el.open');assert not frames.evaluate('(el)=>el.open');challenge.locator(':scope > summary').click();frames.locator(':scope > summary').click();items=frames.locator('li');expect(items).to_have_count(2)
    for item in items.all():expect(item).to_be_visible();expect(item).to_have_attribute('lang','en');expect(item).to_have_attribute('dir','ltr');assert '...' in item.text_content()
    plan=panel.get_by_label(t['pa.photoPlan.label'],exact=True);planDetails=panel.locator('details').filter(has=page.get_by_text(t['pa.photoPlan.title'],exact=True));planDetails.locator(':scope > summary').click();plan.fill('My own idea, not an answer frame.');frames.locator(':scope > summary').click();frames.locator(':scope > summary').click();expect(plan).to_have_value('My own idea, not an answer frame.');expect(panel.get_by_role('button',name=t['pa.photo.listen'],exact=True)).to_have_count(0);panel.get_by_role('button',name=t['pa.photo.show'],exact=True).click();expect(plan).to_have_value('My own idea, not an answer frame.');panel.get_by_role('button',name=t['pa.photo.hide'],exact=True).click();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if i==4:frames.evaluate('(el)=>{document.activeElement.blur();window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-130,behavior:"instant"})}');page.screenshot(path=f'/downloads/henglish-{prefix}pronunciation-photo-answer-frames-{lang}.png')
   selector.select_option('0');assert not frames.evaluate('(el)=>el.open');assert not challenge.evaluate('(el)=>el.open');print(lang,'20photos40frames,nestedclosed,Englishlang-direction,plan/modelindependence,collapsepreserves,scenereset,390px PASS;noaudio/capture');page.close()
  b.close()
finally:server.shutdown();server.server_close()
