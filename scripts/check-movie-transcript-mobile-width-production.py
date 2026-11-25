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
  for width,lang in [(w,l)for w in [320,390]for l in ['en','ar']]:
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.add_init_script("""window.__pauses=0;window.__loads=[];window.YT={Player:class{constructor(el,o){this.o=o;this.time=o.playerVars.start;queueMicrotask(()=>o.events.onReady({target:this}))}getCurrentTime(){return this.time}getAvailablePlaybackRates(){return[0.5,0.75,1]}loadVideoById(v){window.__loads.push(v);this.time=v.startSeconds}setPlaybackRate(){}pauseVideo(){window.__pauses++;this.o.events.onStateChange({data:2,target:this})}playVideo(){}destroy(){}}};Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});""")
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/movies/?lang='+lang);search=page.get_by_role('textbox',name=t['ms.searchPlaceholder'],exact=True);level=page.get_by_label(t['ms.cefrLabel'],exact=True);accent=page.get_by_label(t['ms.accentLabel'],exact=True)
   cards=page.get_by_title(t['ms.saveClip'],exact=True);expect(cards.first).to_be_visible();count=cards.count();checked=0;unavailable=0
   for i in range(count):
    cards.nth(i).locator('../..').click();cues=page.locator('.movie-studio-cue');page.wait_for_function('document.querySelector(".movie-studio-cue")||document.querySelector("section h2 svg")');
    if not cues.count():
     expect(page.get_by_role('heading',name=t['ms.unavailableTitle'],exact=True)).to_be_visible();page.get_by_role('button',name=t['ms.backToResults'],exact=True).click();expect(cards).to_have_count(count);unavailable+=1;continue
    expect(cues.first).to_be_visible();before=cues.locator('[lang=en]').all_text_contents();assert before
    for cue in cues.all():
     english=cue.locator('[lang=en]');assert english.bounding_box()['width']>=width-68;assert cue.bounding_box()['height']>=44;assert english.inner_text().strip();assert english.evaluate('(e)=>getComputedStyle(e).direction')=='ltr';checked+=1
    last=cues.last;last.evaluate('(e)=>e.click()');assert page.evaluate('window.__loads.length')>0;assert cues.locator('[lang=en]').all_text_contents()==before;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if i==0:page.get_by_test_id('cue-list').evaluate('(e)=>e.scrollTop=0');page.get_by_test_id('pinned-player').evaluate('(e)=>window.scrollTo({top:window.scrollY+e.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}movie-transcript-mobile-width-{width}-{lang}.png')
    page.get_by_role('button',name=t['ms.backToSearch'],exact=True).click();expect(cards).to_have_count(count)
   print(width,lang,count,'firstpageclips',unavailable,'reviewgatedclips',checked,'cues width/text/LTR/target44/mockseek/back/nooverflow PASS; YouTubemocked,noactualaudio/transcriptaccuracyclaim');page.close()

  b.close()
finally:server.shutdown();server.server_close()
