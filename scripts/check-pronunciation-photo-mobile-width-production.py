import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4295),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4295');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width in [390,320]:
   for lang in ['en','ar']:
    page=b.new_page(viewport={'width':width,'height':1500},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/pronunciation/?lang='+lang);panel=page.get_by_role('region',name=t['pa.photo.title'],exact=True);selector=panel.get_by_label(t['pa.photo.choose'],exact=True);expect(selector.locator('option')).to_have_count(28)
    for i in range(28):
     selector.select_option(str(i));challenge=panel.locator('details').filter(has=page.get_by_text(t['pa.photoChallenge.title'],exact=True));challenge.locator(':scope > summary').click();frames=panel.locator('details').filter(has=page.get_by_text(t['pa.photoFrames.title'],exact=True)).last;frames.locator(':scope > summary').click();items=frames.locator('li');expect(items).to_have_count(2)
     for item in items.all():
      w=item.bounding_box()['width'];assert w>=width-100,(width,lang,w);hint=item.locator('details');hint.locator('summary').click();expect(hint.locator('p[lang=ar]')).to_be_visible();expect(hint.locator('p[lang=ar]')).to_have_attribute('dir','rtl');expect(item).to_have_attribute('dir','ltr');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
     if i==4:
      for name,target in [('scene',panel),('frames',frames)]:
       target.evaluate('(el)=>{document.activeElement.blur();window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-90,behavior:"instant"})}');page.screenshot(path=f'/downloads/henglish-{prefix}photo-mobile-width-{width}-{lang}-{name}.png')
    print(width,lang,'all28photos56frames width',w,'PASS, nooverflow, English/Arabic help intact');page.close()
  b.close()
finally:server.shutdown();server.server_close()
