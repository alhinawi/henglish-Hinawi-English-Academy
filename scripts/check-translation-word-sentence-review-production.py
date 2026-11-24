import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4293),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4293');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in os.environ.get('TEST_LANGS','en,ar').split(','):
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#translation');page.get_by_role('button',name=t['ts.practice'],exact=True).click();panel=page.get_by_role('region',name=t['tpr.help.title'],exact=True);draft=page.get_by_label(t['tpr.draft'],exact=True)
   total=0
   for i in range(44):
    draft.fill('My own translation');panel.get_by_role('button',name=t['tpr.help.open'],exact=True).click();terms=panel.locator('dl > div');expect(terms.first).to_be_visible()
    for term in terms.all():
     total+=1;box=term.locator('details');box.locator('summary').click();group=box.get_by_role('group',name=t['tpr.wordReview.title'],exact=True);checks=group.get_by_role('checkbox');expect(checks).to_have_count(3);clearChecks=group.get_by_role('button',name=t['tpr.wordReview.clear'],exact=True);expect(clearChecks).to_be_disabled();sentence=box.get_by_label(t['tpr.wordSentence.label'],exact=True);wordAttempt=term.get_by_label(t['tpr.wordAttempt.label'],exact=True);expect(sentence).to_have_value('')
     for check in checks.all():expect(check).not_to_be_checked();check.check();expect(check).to_be_checked()
     expect(sentence).to_have_value('');focus=box.get_by_label(t['tpr.wordFocus.label'],exact=True);focus.select_option('context');sentence.fill('My first original sentence.');box.get_by_role('button',name=t['tpr.wordSentenceRetry.start'],exact=True).click();first=box.get_by_text('My first original sentence.',exact=True);expect(first).to_be_visible();sentence.fill('My revised sentence with the word.');wordAttempt.fill('My recalled word');clearChecks.click();expect(clearChecks).to_be_disabled();expect(sentence).to_have_value('My revised sentence with the word.');expect(first).to_be_visible();expect(wordAttempt).to_have_value('My recalled word');expect(draft).to_have_value('My own translation');expect(box.get_by_text(t['tpr.wordFocus.prompt.context'],exact=True)).to_be_visible();checks.nth(1).check();box.locator('summary').click();box.locator('summary').click();expect(checks.nth(1)).to_be_checked();term.get_by_role('button',name=t['tpr.wordRecall.hide'],exact=True).click();expect(checks.nth(1)).to_be_checked();term.get_by_role('button',name=t['tpr.wordRecall.show'],exact=True).click();box.get_by_role('button',name=t['tpr.wordSentence.clear'],exact=True).click();expect(checks.nth(1)).to_be_checked();sentence.fill('My revised sentence with the word.');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if i==0:terms.first.get_by_role('group',name=t['tpr.wordReview.title'],exact=True).evaluate('(el)=>{document.activeElement.blur();window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-250,behavior:"instant"})}');page.screenshot(path=f'/downloads/henglish-{prefix}translation-word-sentence-review-{lang}.png')
    panel.get_by_role('button',name=t['tpr.help.close'],exact=True).click();panel.get_by_role('button',name=t['tpr.help.open'],exact=True).click()
    for box in panel.locator('details').all():
     assert not box.evaluate('(el)=>el.open');box.locator('summary').click();expect(box.get_by_role('button',name=t['tpr.wordReview.clear'],exact=True)).to_be_disabled()
     for check in box.get_by_role('checkbox').all():expect(check).not_to_be_checked()
    expect(draft).to_have_value('My own translation');page.get_by_role('button',name=t['tpr.next'],exact=True).click();expect(panel.get_by_role('definition')).to_have_count(0)
   print(lang,total,'wordactivities across44tasks,3manualselfchecks,independenttoggles,clearonly,drafts/recall/translation/focuspreserved,collapse/hide/clear-sentencepreservechecks,helpclosereset,390px PASS;noaudio/assessment');page.close()
  b.close()
finally:server.shutdown();server.server_close()
