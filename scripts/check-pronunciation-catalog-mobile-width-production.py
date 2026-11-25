import functools,http.server,json,os,pathlib,threading
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
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.add_init_script("window.__clips=[];window.Audio=class{constructor(){window.__clips.push(this)}play(){queueMicrotask(()=>this.onplay?.());return Promise.resolve()}pause(){this.paused=true}};delete window.speechSynthesis;Math.random=()=>0.75;");t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/pronunciation/?lang='+lang);group=page.get_by_role('group',name=t['pa.vowelFilter']);buttons=page.get_by_role('button',name=t['pa.practiseSound']+' ',exact=False);panel=page.get_by_role('region',name=t['pa.workshopTitle']);expect(buttons).to_have_count(20)
   for count,key in [(8,'glide'),(12,'pure'),(20,'all')]:group.get_by_role('button',name=t['pa.group.'+key],exact=True).click();expect(buttons).to_have_count(count)
   for index,button in enumerate(buttons.all()):
    card=button.locator('..');symbol=card.locator('div.en').first.inner_text();assert card.locator('div.en').nth(1).inner_text().strip();assert card.locator('div.en').nth(1).bounding_box()['width']>=(width-94)/2;assert button.bounding_box()['height']>=44;assert card.get_by_role('button').first.bounding_box()['height']>=44;button.click();expect(button).to_have_attribute('aria-pressed','true');expect(panel.get_by_role('heading')).to_contain_text(symbol);assert sum(b.get_attribute('aria-pressed')=='true'for b in buttons.all())==1;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   buttons.first.locator('..').evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}pronunciation-catalog-mobile-width-{width}-{lang}.png');print(width,lang,'20soundslabels/width/44pxtargets/20-12-8filters/workshopselection/singleactive/nooverflow PASS; noactualaudio');page.close()
  b.close()
finally:server.shutdown();server.server_close()
