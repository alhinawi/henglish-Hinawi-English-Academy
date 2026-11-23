import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4212),functools.partial(Quiet,directory=str(root/'out')))
threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4212');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce')
   page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.add_init_script("""window.__pauses=0;window.YT={Player:class{constructor(el,o){this.o=o;this.time=o.playerVars.start;queueMicrotask(()=>o.events.onReady({target:this}))}getCurrentTime(){return this.time}getAvailablePlaybackRates(){return[0.5,0.75,1]}loadVideoById(v){this.time=v.startSeconds}setPlaybackRate(){}pauseVideo(){window.__pauses++;this.o.events.onStateChange({data:2,target:this})}playVideo(){}destroy(){}}};Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});""")
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'))
   page.goto(origin+'/movies/?lang='+lang)
   page.get_by_title(t['ms.saveClip'],exact=True).first.locator('..').locator('..').click()
   panel=page.get_by_role('region',name=t['ms.echoTitle'],exact=True)
   panel.get_by_role('button',name=t['ms.echoOpen'],exact=True).click()
   chooser=panel.get_by_role('combobox',name=t['ms.echoChoose'],exact=True);plan=panel.get_by_label(t['ms.own.plan'],exact=True)
   expect(panel.get_by_role('button',name=t['ms.own.echo'],exact=True)).to_have_attribute('aria-pressed','true');expect(plan).to_have_count(0)
   panel.get_by_role('button',name=t['ms.own.own'],exact=True).click();plan.fill('Keep the meaning; use simpler words.');details=panel.locator('details');summary=details.locator('summary');checks=details.get_by_role('checkbox');target=panel.get_by_label(t['ms.ownReview.target'],exact=True);assert not details.evaluate('(el)=>el.open');summary.click();expect(checks).to_have_count(3);expect(target).to_have_value('');checks.nth(0).check();checks.nth(2).check();expect(checks.nth(1)).not_to_be_checked();target.fill('Use a different opening');assert target.get_attribute('maxlength')=='300';summary.click();summary.click();expect(target).to_have_value('Use a different opening');expect(checks.nth(0)).to_be_checked();expect(checks.nth(2)).to_be_checked();expect(plan).to_have_value('Keep the meaning; use simpler words.');details.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}movie-own-words-review-{lang}.png');panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible();panel.get_by_role('button',name=t['ms.own.echo'],exact=True).click();expect(panel.get_by_role('alert')).to_have_count(0);expect(plan).to_have_count(0);panel.get_by_role('button',name=t['ms.own.own'],exact=True).click();assert not details.evaluate('(el)=>el.open');summary.click();expect(target).to_have_value('');
   for i in range(3):expect(checks.nth(i)).not_to_be_checked()
   expect(plan).to_have_value('');plan.fill('New plan, private in this open task.');assert page.evaluate('window.__pauses')>0
   choices=chooser.locator('option').count()
   if choices>1:
    chooser.select_option(index=1);expect(plan).to_have_count(0);panel.get_by_role('button',name=t['ms.own.own'],exact=True).click();expect(plan).to_have_value('')
   panel.get_by_role('heading',name=t['ms.own.title'],exact=True).evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-105,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}movie-own-words-{lang}.png')
   panel.get_by_role('button',name=t['ms.echoClose'],exact=True).click();expect(plan).to_have_count(0);panel.get_by_role('button',name=t['ms.echoOpen'],exact=True).click();expect(panel.get_by_role('button',name=t['ms.own.echo'],exact=True)).to_have_attribute('aria-pressed','true');panel.get_by_role('button',name=t['ms.own.own'],exact=True).click();expect(plan).to_have_value('')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.get_by_role('button',name=t['ms.backToLibrary'],exact=True).click();expect(panel).to_have_count(0)
   print(lang,'ownwords-only3checkreview,300chartarget,closeddefault,collapsepreserves,planunchanged,echo/mode/close/exitreset,micdenialcleanup,playerpause,390px PASS; firstcliponecue,cueresetstructural,YouTubemocked,noactualaudio/capture')
   page.close()
  b.close()
finally:server.shutdown();server.server_close()
