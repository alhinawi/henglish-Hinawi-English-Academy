import functools,http.server,json,os,pathlib,threading,re
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
import subprocess
goals=json.loads(subprocess.check_output(['node','--input-type=commonjs','-e',"const fs=require('fs'),ts=require('typescript'),vm=require('vm'),c={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/tutorPracticeGoals.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,c);console.log(JSON.stringify(c.exports.TUTOR_PRACTICE_GOALS));"],text=True))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4289),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4289');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in os.environ.get('TEST_LANGS','en,ar').split(','):
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');sent=[];page.route('**/henglish-helper.hnz.workers.dev/**',lambda r:(sent.append(r.request.post_data),r.fulfill(status=503,json={'error':'UI test'})));page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#ai-tutor');panel=page.get_by_role('region',name=t['at.photo.title'],exact=True);goal=panel.get_by_label(t['at.goal.label'],exact=True);draft=page.get_by_role('textbox',name=t['at.askPre']+' '+t['atm.grammar-teacher.name'],exact=True);preview=panel.get_by_test_id('tutor-starter-preview');use=panel.get_by_role('button',name=t['at.photo.use'],exact=True)
   for mode in ['grammar-teacher','conversation-partner','vocabulary-coach','writing-assistant','pronunciation-coach','exam-trainer','interview-coach']:
    page.get_by_role('button',name=re.compile(re.escape(t['atm.'+mode+'.name']))).filter(has=page.locator('[class*=font-mono]')).click();draft=page.get_by_role('textbox',name=t['at.askPre']+' '+t['atm.'+mode+'.name'],exact=True)
    details=panel.locator('details').filter(has=page.get_by_text(t['at.goalIdeas.title'],exact=True));assert not details.evaluate('(el)=>el.open');details.locator(':scope > summary').click();buttons=details.locator(':scope > ul > li > button');expect(buttons).to_have_count(9)
    for item in details.locator(':scope > ul > li').all():
     hint=item.locator('details');assert not hint.evaluate('(el)=>el.open');hint.locator('summary').click();meaning=hint.locator('p[lang="ar"]');expect(meaning).to_be_visible();expect(meaning).to_have_attribute('dir','rtl');expect(goal).to_have_value('');expect(draft).to_have_value('');assert not sent
    for text in goals[mode]:
     button=details.get_by_role('button',name=text,exact=True);expect(button).to_have_attribute('lang','en');expect(button).to_have_attribute('dir','ltr');button.click();expect(goal).to_have_value(text);expect(draft).to_have_value('');expect(preview).to_have_text(t['at.starter.'+mode]+' '+t['at.goal.prefix']+' '+text);assert not sent
     for index in range(9):expect(buttons.nth(index)).to_be_disabled()
     details.locator(':scope > summary').click();details.locator(':scope > summary').click();expect(goal).to_have_value(text);goal.fill(text+' Please help.');expect(draft).to_have_value('');panel.get_by_role('button',name=t['at.goal.clear'],exact=True).click();expect(goal).to_have_value('')
    draft.fill('Keep my unsent message');buttons.first.click();expect(draft).to_have_value('Keep my unsent message');expect(use).to_be_disabled();draft.fill('');expected=preview.text_content();use.click();expect(draft).to_have_value(expected);assert not sent;draft.fill('');panel.get_by_role('button',name=t['at.goal.clear'],exact=True).click()
    item=details.locator(':scope > ul > li').last;item.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-115,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}tutor-ninth-goal-{mode}-{lang}.png')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');print(lang,'7modes63nestedEgyptianArabicmeanings,closeddefault,noinsert/send,63originalgoals,closeddefault,Englishlanguage-direction,goalonly,nonemptyprotection,editable,clear,composerpreserved,explicitadd,noautosend,390px PASS;APIblockednoactualreply');page.close()
  b.close()
finally:server.shutdown();server.server_close()
