import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4236),functools.partial(Quiet,directory=str(root/'out')))
threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4236');prefix='live-' if origin.startswith('https:') else ''
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
   attempt=panel.get_by_label(t['ms.retelling.label'],exact=True);expect(attempt).to_have_count(0);panel.get_by_role('button',name=t['ms.own.own'],exact=True).click();details=panel.locator('details').filter(has=page.get_by_text(t['ms.retelling.title'],exact=True));summary=details.locator(':scope > summary');assert not details.evaluate('(el)=>el.open');summary.click();expect(attempt).to_have_value('');expect(attempt).to_have_attribute('maxlength','1500');expect(attempt).to_have_attribute('lang','en');expect(attempt).to_have_attribute('dir','ltr');plan.fill('My plan, not the attempt');attempt.fill('My own version of the source.');panel.get_by_role('button',name=t['ms.own.sourceHide'],exact=True).click();expect(attempt).to_have_value('My own version of the source.');panel.get_by_role('button',name=t['ms.own.sourceShow'],exact=True).click();expect(attempt).to_have_value('My own version of the source.');expect(plan).to_have_value('My plan, not the attempt');summary.click();summary.click();expect(attempt).to_have_value('My own version of the source.');attempt.fill('x'*1500);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');attempt.fill('My own version, with the same meaning.');details.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-110,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}movie-private-retelling-{lang}.png');panel.get_by_role('button',name=t['sp.rec.start'],exact=True).click();expect(panel.get_by_role('alert')).to_be_visible();expect(attempt).to_have_value('My own version, with the same meaning.');panel.get_by_role('button',name=t['ms.own.echo'],exact=True).click();expect(attempt).to_have_count(0);expect(panel.get_by_role('alert')).to_have_count(0);panel.get_by_role('button',name=t['ms.own.own'],exact=True).click();assert not details.evaluate('(el)=>el.open');summary.click();expect(attempt).to_have_value('');attempt.fill('A second private attempt.');assert page.evaluate('window.__pauses')>0
   choices=chooser.locator('option').count()
   if choices>1:
    chooser.select_option(index=1);expect(plan).to_have_count(0);panel.get_by_role('button',name=t['ms.own.own'],exact=True).click();expect(plan).to_have_value('')
   expect(attempt).to_have_value('A second private attempt.')
   panel.get_by_role('button',name=t['ms.echoClose'],exact=True).click();expect(plan).to_have_count(0);panel.get_by_role('button',name=t['ms.echoOpen'],exact=True).click();expect(panel.get_by_role('button',name=t['ms.own.echo'],exact=True)).to_have_attribute('aria-pressed','true');panel.get_by_role('button',name=t['ms.own.own'],exact=True).click();expect(plan).to_have_value('');assert not details.evaluate('(el)=>el.open');summary.click();expect(attempt).to_have_value('')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.get_by_role('button',name=t['ms.backToLibrary'],exact=True).click();expect(panel).to_have_count(0)
   print(lang,'privateretelling,ownmodeonly,closeddefault,1500chars,Englishdirection/language,planseparate,hide/reveal/collapsepreserves,mode/close/exitreset,micdenialcleanup,playerpause,390px PASS; firstcliponecue,cueresetstructural,YouTubemocked,noactualaudio/capture')
   page.close()
  b.close()
finally:server.shutdown();server.server_close()
