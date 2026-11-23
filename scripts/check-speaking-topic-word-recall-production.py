import functools,http.server,json,os,pathlib,threading,subprocess
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();lessons=json.loads((root/'src/data/speakingAcademyData.ts').read_text().split('export const SPEAKING_LESSONS: SpeakingLesson[] = ')[1].strip().rstrip(';'));prompts=json.loads(subprocess.check_output(['node','--input-type=commonjs','-e',"const fs=require('fs'),ts=require('typescript'),vm=require('vm'),c={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/speakingTransferPrompts.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,c);console.log(JSON.stringify(c.exports.SPEAKING_TRANSFER_PROMPTS));"],text=True))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4243),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4243');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang)
   for lesson in lessons:
    page.locator('button').filter(has=page.get_by_text(lesson['titleEn'],exact=True)).click();panel=page.get_by_role('region',name=t['sp.transfer.title'],exact=True);expect(panel.get_by_text(t['sp.topicWords.title'],exact=True)).to_have_count(0);panel.get_by_role('button',name=t['sp.transfer.open'],exact=True).click();details=panel.locator('details').filter(has=page.get_by_text(t['sp.topicWords.title'],exact=True));summary=details.locator(':scope > summary');plan=panel.get_by_label(t['sp.transfer.plan'],exact=True)
    for mode in [0,1]:
     if mode:panel.get_by_role('button',name=t['sp.transfer.choice.1'],exact=True).click()
     expect(plan).to_have_value('');assert not details.evaluate('(el)=>el.open');summary.click();expect(details.locator('dt')).to_have_count(4);expect(details.locator('dd[lang="ar"]')).to_have_count(4);
     for text in details.locator('dt').all():expect(text).to_be_visible();expect(text).to_have_attribute('lang','en');expect(text).to_have_attribute('dir','ltr')
     for meaning in details.locator('dd[lang="ar"]').all():expect(meaning).to_be_visible();expect(meaning).to_have_attribute('lang','ar');expect(meaning).to_have_attribute('dir','rtl')
     plan.fill('My own role-play plan');
     for term in details.locator('dl > div').all():
      english=term.locator('dt').text_content();meaning=term.locator('dd[lang="ar"]').text_content();term.get_by_role('button',name=t['sp.topicRecall.hide'],exact=True).click();expect(term.locator('dt')).to_have_text(t['sp.topicRecall.hidden']);expect(term.locator('dd[lang="ar"]')).to_have_text(meaning);expect(plan).to_have_value('My own role-play plan');term.get_by_role('button',name=t['sp.topicRecall.show'],exact=True).click();expect(term.locator('dt')).to_have_text(english)
     details.get_by_role('button',name=t['sp.topicRecall.hide'],exact=True).first.click();summary.click();summary.click();expect(details.get_by_role('button',name=t['sp.topicRecall.show'],exact=True)).to_have_count(1);expect(details.get_by_role('button',name=t['sp.topicRecall.hide'],exact=True)).to_have_count(3);expect(plan).to_have_value('My own role-play plan');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
     if lesson['id']=='conversation-12' and mode==1:details.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-120,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-topic-word-recall-{lang}.png')
    panel.get_by_role('button',name=t['sp.transfer.close'],exact=True).click();expect(details).to_have_count(0);panel.get_by_role('button',name=t['sp.transfer.open'],exact=True).click();assert not details.evaluate('(el)=>el.open');expect(plan).to_have_value('');page.get_by_role('button',name=t['sa.allUnits'],exact=True).click()
   print(lang,'32lessons128independenthide-showrecalls,meaningandplanpreserved,128topicwords/meanings x2followups,closeddefault,Englishlanguage/direction,planpreserved,mode/close/lessonreset,390px PASS; noaudio/capture');page.close()
  b.close()
finally:server.shutdown();server.server_close()
