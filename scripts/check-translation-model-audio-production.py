import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4204),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4204');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#translation');page.get_by_role('button',name=t['ts.practice'],exact=True).click();draft=page.get_by_label(t['tpr.draft'],exact=True);prefixText=t['tpr.modelAudio.listen'].split('{number}')[0];buttons=page.get_by_role('button').filter(has_text=prefixText)
   for i in range(20):
    expect(buttons).to_have_count(0);draft.fill('My independent draft');page.get_by_role('button',name=t['tpr.show'],exact=True).click();assert buttons.count()>0;expect(page.get_by_text(t['tpr.modelAudio.note'],exact=True)).to_be_visible();models=page.get_by_role('heading',name=t['tpr.answers'],exact=True).locator('..').locator('div > p[lang]');assert models.count()==buttons.count()
    for j in range(buttons.count()):
     button=page.get_by_role('button',name=t['tpr.modelAudio.listen'].replace('{number}',str(j+1)),exact=True);expect(button).to_be_visible();assert models.nth(j).get_attribute('lang') in ['en','ar']
     if button.is_enabled():button.click()
    expect(draft).to_have_value('My independent draft');page.get_by_role('button',name=t['tpr.revise.open'],exact=True).click();revision=page.get_by_label(t['tpr.revise.label'],exact=True);revision.fill('My revision');page.get_by_role('button',name=t['tpr.hide'],exact=True).click();expect(buttons).to_have_count(0);page.get_by_role('button',name=t['tpr.show'],exact=True).click();expect(revision).to_have_value('My revision');expect(draft).to_have_value('My independent draft');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if i==0:
     page.get_by_role('heading',name=t['tpr.answers'],exact=True).evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-110,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}translation-model-audio-{lang}.png')
    page.get_by_role('button',name=t['tpr.next'],exact=True).click()
   print(lang,'20tasks,targetENAR,explicitnumberedmodelaudio,revealgate,draft/revisionpreserved,hide/navigationcleanup,390px PASS; audioAPIsunavailable,noactualplayback');page.close()
  b.close()
finally:server.shutdown();server.server_close()
