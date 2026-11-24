import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4196),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4196');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(w,l)for w in [320,390]for l in ['en','ar']]:
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.add_init_script("""window.__pauses=0;window.__loads=[];window.YT={Player:class{constructor(el,o){this.o=o;this.time=o.playerVars.start;queueMicrotask(()=>o.events.onReady({target:this}))}getCurrentTime(){return this.time}getAvailablePlaybackRates(){return[0.5,0.75,1]}loadVideoById(v){window.__loads.push(v);this.time=v.startSeconds}setPlaybackRate(){}pauseVideo(){window.__pauses++;this.o.events.onStateChange({data:2,target:this})}playVideo(){}destroy(){}}};Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});""")
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/movies/?lang='+lang);search=page.get_by_role('textbox',name=t['ms.searchPlaceholder'],exact=True);level=page.get_by_label(t['ms.cefrLabel'],exact=True);accent=page.get_by_label(t['ms.accentLabel'],exact=True)
   cards=page.get_by_title(t['ms.saveClip'],exact=True);expect(cards.first).to_be_visible();assert cards.count()>0
   for i in range(cards.count()):
    card=cards.nth(i).locator('../..');title=card.locator('h4');expect(title).to_have_attribute('dir','ltr');expect(title).to_have_attribute('lang','en');assert title.bounding_box()['width']>=width-55;assert title.evaluate('(el)=>el.scrollHeight<=el.clientHeight+1');quote=card.locator('p[dir=ltr]')
    if quote.count():assert quote.bounding_box()['width']>=width-70
   card=cards.first.locator('../..');card.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}movie-catalog-card-mobile-width-{width}-{lang}.png')
   level.select_option('B1');accent.select_option('British');search.fill('zzzzmissingclip');expect(page.get_by_role('heading',name=t['ms.noResults'],exact=True)).to_be_visible();search.press('Escape');expect(search).to_have_value('');expect(search).to_be_focused();expect(level).to_have_value('B1');expect(accent).to_have_value('British')
   search.fill('zzzzmissingclip');page.get_by_role('button',name=t['ms.clearSearch'],exact=True).last.click();expect(search).to_have_value('');expect(search).to_be_focused();expect(level).to_have_value('B1');expect(accent).to_have_value('British')
   search.fill('zzzzmissingclip');reset=page.get_by_role('button',name=t['ms.resetFilters'],exact=True);reset.scroll_into_view_if_needed();page.screenshot(path=f'/downloads/henglish-{prefix}movie-catalog-recovery-{lang}.png');reset.click();expect(search).to_have_value('');expect(search).to_be_focused();expect(level).to_have_value('all');expect(accent).to_have_value('all');expect(page.get_by_role('heading',name=t['ms.noResults'],exact=True)).to_have_count(0);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.get_by_title(t['ms.saveClip'],exact=True).first.locator('../..').click();expect(page.get_by_role('region',name=t['ms.recall.title'],exact=True)).to_be_visible();print(width,lang,'mockedclipopen,allvisiblecardtitle/quote width/fullwrap/LTR,clear/Escape retains filters, empty-state recovery, reset restores catalog/focus,390px PASS');page.close()
  b.close()
finally:server.shutdown();server.server_close()
