import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4258),functools.partial(Quiet,directory=str(root/'out')))
threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4258');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce')
   page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.add_init_script("""window.__pauses=0;window.__loads=[];window.YT={Player:class{constructor(el,o){this.o=o;this.time=o.playerVars.start;queueMicrotask(()=>o.events.onReady({target:this}))}getCurrentTime(){return this.time}getAvailablePlaybackRates(){return[0.5,0.75,1]}loadVideoById(v){window.__loads.push(v);this.time=v.startSeconds}setPlaybackRate(){}pauseVideo(){window.__pauses++;this.o.events.onStateChange({data:2,target:this})}playVideo(){}destroy(){}}};Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>Promise.reject(Error('Test denial'))},configurable:true});""")
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'))
   page.goto(origin+'/movies/?lang='+lang)
   page.get_by_title(t['ms.saveClip'],exact=True).first.locator('..').locator('..').click()
   panel=page.get_by_role('region',name=t['ms.recall.title'],exact=True)
   panel.get_by_role('button',name=t['ms.recall.open'],exact=True).click()
   chooser=panel.get_by_role('combobox',name=t['ms.recall.cue'],exact=True);draft=panel.get_by_role('textbox',name=t['ms.recall.draft'],exact=True)
   expect(chooser).to_be_visible();assert page.evaluate('window.__pauses')>0
   draft.fill('My replay draft');before=page.evaluate('window.__loads.length');panel.get_by_role('button',name=t['ms.recall.listen'],exact=True).click();assert page.evaluate('window.__loads.length')==before+1;load=page.evaluate('window.__loads.at(-1)');assert load['startSeconds']<load['endSeconds'];expect(draft).to_have_value('My replay draft');expect(panel.get_by_role('heading',name=t['ms.recall.answer'],exact=True)).to_have_count(0);expect(panel.get_by_text(t['ms.recall.listenNote'],exact=True)).to_be_visible()
   expect(panel.get_by_role('heading',name=t['ms.recall.answer'],exact=True)).to_have_count(0);draft.fill('My own recall draft');panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).click();expect(panel.get_by_role('heading',name=t['ms.recall.answer'],exact=True)).to_be_visible();assert panel.locator('p[lang="en"]').inner_text().strip()
   focus=panel.get_by_role('combobox',name=t['ms.recallFocus.label'],exact=True);expect(focus).to_have_value('words');focus.select_option('smallWords');expect(panel.get_by_text(t['ms.recallFocus.prompt.smallWords'],exact=True)).to_be_visible();clear=panel.get_by_role('button',name=t['ms.recallFocus.clear'],exact=True);clear.click();expect(draft).to_have_value('');expect(draft).to_be_focused();expect(clear).to_be_disabled();expect(focus).to_have_value('smallWords');draft.fill('My own recall draft');retry=panel.get_by_role('button',name=t['ms.recall.retry'],exact=True);expect(retry).to_be_enabled();retry.click();expect(draft).to_have_value('');expect(draft).to_be_focused();expect(panel.get_by_role('heading',name=t['ms.recall.answer'],exact=True)).to_have_count(0);draft.fill('My second recall');panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).click();expect(panel.get_by_role('heading',name=t['ms.recall.firstDraft'],exact=True)).to_be_visible();expect(panel.get_by_text('My own recall draft',exact=True)).to_be_visible();expect(draft).to_have_value('My second recall');expect(retry).to_have_count(0);expect(focus).to_have_count(0);expect(panel.get_by_text(t['ms.recallFocus.prompt.smallWords'],exact=True)).to_be_visible();clear.click();expect(draft).to_have_value('');expect(draft).to_be_focused();expect(panel.get_by_text('My own recall draft',exact=True)).to_be_visible();draft.fill('My second recall')
   choices=chooser.locator('option').count()
   if choices>1:
    chooser.select_option('1');expect(draft).to_have_value('');panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).click();expect(focus).to_have_value('words');focus.select_option('spelling');expect(retry).to_be_disabled();draft.fill('   ');expect(retry).to_be_disabled();draft.fill('Separate cue');expect(retry).to_be_enabled();expect(panel.get_by_role('heading',name=t['ms.recall.firstDraft'],exact=True)).to_have_count(0);chooser.select_option('0');expect(draft).to_have_value('My second recall');panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).click();expect(panel.get_by_text(t['ms.recallFocus.prompt.smallWords'],exact=True)).to_be_visible()
   if panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).count(): panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).click()
   panel.get_by_role('heading',name=t['ms.recall.firstDraft'],exact=True).evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-500,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}movie-recall-focus-{lang}.png')
   panel.get_by_role('button',name=t['ms.recall.close'],exact=True).click();expect(draft).to_have_count(0);panel.get_by_role('button',name=t['ms.recall.open'],exact=True).click();expect(draft).to_have_value('');expect(panel.get_by_role('heading',name=t['ms.recall.answer'],exact=True)).to_have_count(0)
   panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).click();expect(focus).to_have_value('words');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.get_by_role('button',name=t['ms.backToLibrary'],exact=True).click();expect(panel).to_have_count(0)
   print(lang,'3focusoptions,percuefocus,firstsnapshotfrozen,currentclearretainsfirst/focus,closefocusreset,firstdraftsnapshot,retryhidesanswer,percuecompare,emptydisabled,close/exitreset,boundedreplaycallback,draft/modelpreserved,sourcevisibilitynote, reviewed caption recall/reveal, neutral chooser, separate drafts when multiple cues, close/reset, playerpause/exit,390px PASS; YouTube mocked,no playback claim')
   page.close()
  b.close()
finally:server.shutdown();server.server_close()
