import functools,http.server,json,os,pathlib,threading,subprocess
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();lessons=json.loads((root/'src/data/speakingAcademyData.ts').read_text().split('export const SPEAKING_LESSONS: SpeakingLesson[] = ')[1].strip().rstrip(';'));prompts=json.loads(subprocess.check_output(['node','--input-type=commonjs','-e',"const fs=require('fs'),ts=require('typescript'),vm=require('vm'),c={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/speakingTopicReview.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,c);console.log(JSON.stringify(c.exports.SPEAKING_TOPIC_REVIEW));"],text=True))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4231),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4231');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang)
   for lesson in lessons:
    page.locator('button').filter(has=page.get_by_text(lesson['titleEn'],exact=True)).click();panel=page.get_by_role('region',name=t['sp.transfer.title'],exact=True);expect(panel.get_by_text(t['sp.lessonPrompt.title'],exact=True)).to_have_count(0);panel.get_by_role('button',name=t['sp.transfer.open'],exact=True).click();details=panel.locator('details').filter(has=page.get_by_text(t['sp.transferReview.title'],exact=True));summary=details.locator('summary');plan=panel.get_by_label(t['sp.transfer.plan'],exact=True)
    for mode in [0,1]:
     if mode:panel.get_by_role('button',name=t['sp.transfer.choice.1'],exact=True).click()
     expect(plan).to_have_value('');assert not details.evaluate('(el)=>el.open');summary.click();group=details.get_by_role('group',name=t['sp.topicReview.title'],exact=True);checks=group.get_by_role('checkbox');expect(checks).to_have_count(3)
     for index,criterion in enumerate(prompts[lesson['id']]):
      label=group.get_by_text(criterion,exact=True);expect(label).to_be_visible();expect(label).to_have_attribute('lang','en');expect(label).to_have_attribute('dir','ltr');expect(checks.nth(index)).not_to_be_checked()
     checks.nth(1).check();expect(checks.nth(0)).not_to_be_checked();expect(checks.nth(2)).not_to_be_checked();plan.fill('My private practice notes');summary.click();summary.click();expect(checks.nth(1)).to_be_checked();expect(plan).to_have_value('My private practice notes');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
     if lesson['id']=='conversation-12' and mode==1:group.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-120,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-topic-review-{lang}.png')
    panel.get_by_role('button',name=t['sp.transfer.close'],exact=True).click();expect(details).to_have_count(0);panel.get_by_role('button',name=t['sp.transfer.open'],exact=True).click();assert not details.evaluate('(el)=>el.open');expect(plan).to_have_value('');summary.click();expect(details.get_by_role('group',name=t['sp.topicReview.title'],exact=True).get_by_role('checkbox').nth(1)).not_to_be_checked();page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   print(lang,'32lessons96originaltopicchecks x2modes,closeddefault,independentcheckboxes,collapsepreserves,Englishlanguage/direction,planpreserved,mode/close/lessonreset,390px PASS; noaudio/capture');page.close()
  b.close()
finally:server.shutdown();server.server_close()
