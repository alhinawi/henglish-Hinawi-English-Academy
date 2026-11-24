import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4248),functools.partial(Quiet,directory=str(root/'out')))
threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4248');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in os.environ.get('TEST_LANGS','en,ar').split(','):
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
   draft.fill('My replay draft');before=page.evaluate('window.__loads.length');panel.get_by_role('button',name=t['ms.recall.listen'],exact=True).click();assert page.evaluate('window.__loads.length')==before+1;load=page.evaluate('window.__loads.at(-1)');assert load['startSeconds']>=0;expect(draft).to_have_value('My replay draft');expect(panel.get_by_role('heading',name=t['ms.recall.answer'],exact=True)).to_have_count(0);expect(panel.get_by_text(t['ms.recall.listenNote'],exact=True)).to_be_visible()
   expect(panel.get_by_role('heading',name=t['ms.recall.answer'],exact=True)).to_have_count(0);draft.fill('My own recall draft');panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).click();expect(panel.get_by_role('heading',name=t['ms.recall.answer'],exact=True)).to_be_visible();assert panel.locator('p[lang="en"]').inner_text().strip()
   retry=panel.get_by_role('button',name=t['ms.recall.retry'],exact=True);expect(retry).to_be_enabled();review=panel.locator('details').filter(has=page.get_by_text(t['ms.recallReview.title'],exact=True));assert not review.evaluate('(el)=>el.open');review.locator('summary').click();checks=review.get_by_role('checkbox');expect(checks).to_have_count(3);clear=review.get_by_role('button',name=t['ms.recallReview.clear'],exact=True);expect(clear).to_be_disabled();note=review.get_by_label(t['ms.recallNext.label'],exact=True);clearNote=review.get_by_role('button',name=t['ms.recallNext.clear'],exact=True);expect(note).to_have_value('');expect(note).to_have_attribute('maxlength','300');expect(note).to_have_attribute('dir','auto');expect(clearNote).to_be_disabled();note.fill('One small word to listen for.');
   for c in checks.all():expect(c).not_to_be_checked();c.check()
   expect(draft).to_have_value('My own recall draft');review.locator('summary').click();review.locator('summary').click();expect(checks.first).to_be_checked();expect(note).to_have_value('One small word to listen for.');clear.click();expect(clear).to_be_disabled();expect(note).to_have_value('One small word to listen for.');
   for c in checks.all():expect(c).not_to_be_checked()
   checks.first.check();clearNote.click();expect(clearNote).to_be_disabled();expect(note).to_have_value('');expect(note).to_be_focused();expect(checks.first).to_be_checked();expect(draft).to_have_value('My own recall draft');note.fill('Discard on retry');retry.click();expect(review).to_have_count(0);expect(draft).to_have_value('');expect(draft).to_be_focused();expect(panel.get_by_role('heading',name=t['ms.recall.answer'],exact=True)).to_have_count(0);draft.fill('My second recall');panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).click();expect(panel.get_by_role('heading',name=t['ms.recall.firstDraft'],exact=True)).to_be_visible();expect(panel.get_by_text('My own recall draft',exact=True)).to_be_visible();expect(draft).to_have_value('My second recall');expect(retry).to_have_count(0);assert not review.evaluate('(el)=>el.open');review.locator('summary').click();
   for c in checks.all():expect(c).not_to_be_checked()
   expect(note).to_have_value('');note.fill('Discard on hide');checks.nth(1).check();expect(draft).to_have_value('My second recall');expect(panel.get_by_text('My own recall draft',exact=True)).to_be_visible();panel.get_by_role('button',name=t['ms.recall.hide'],exact=True).click();expect(review).to_have_count(0);panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).click();assert not review.evaluate('(el)=>el.open');review.locator('summary').click();expect(checks.nth(1)).not_to_be_checked();expect(note).to_have_value('');checks.nth(2).check();note.fill('Discard on cue change');
   choices=chooser.locator('option').count()
   if choices>1:
    chooser.select_option('1');expect(draft).to_have_value('');panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).click();expect(retry).to_be_disabled();draft.fill('   ');expect(retry).to_be_disabled();draft.fill('Separate cue');expect(retry).to_be_enabled();expect(panel.get_by_role('heading',name=t['ms.recall.firstDraft'],exact=True)).to_have_count(0);chooser.select_option('0');expect(draft).to_have_value('My second recall')
   if panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).count(): panel.get_by_role('button',name=t['ms.recall.reveal'],exact=True).click()
   note.fill('تفصيلة أركز عليها في السماع الجاي.' if lang=='ar' else 'One small word to listen for.');expect(draft).to_have_value('My second recall');expect(panel.get_by_text('My own recall draft',exact=True)).to_be_visible();note.evaluate('(el)=>{document.activeElement.blur();window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-550,behavior:"instant"})}');page.screenshot(path=f'/downloads/henglish-{prefix}movie-recall-next-note-{lang}.png')
   panel.get_by_role('button',name=t['ms.recall.close'],exact=True).click();expect(draft).to_have_count(0);panel.get_by_role('button',name=t['ms.recall.open'],exact=True).click();expect(draft).to_have_value('');expect(panel.get_by_role('heading',name=t['ms.recall.answer'],exact=True)).to_have_count(0)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.get_by_role('button',name=t['ms.backToLibrary'],exact=True).click();expect(panel).to_have_count(0)
   print(lang,'300charprivatenext-listeningnote,auto-direction,clearonly/focus,marks/draft/firstpreserved,hide/retryreset,3manualchecks,closeduncheckeddefault,clear,collapsepreserved,hide/retryreset,drafts/snapshotpreserved,sourcegated,close/exitreset,replaycallback,390px PASS; YouTube mocked,no playback claim')
   page.close()
  b.close()
finally:server.shutdown();server.server_close()
