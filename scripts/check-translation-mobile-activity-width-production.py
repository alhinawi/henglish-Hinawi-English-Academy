import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4294),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4294');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width in [390,320]:
   for lang in ['en','ar']:
    page=b.new_page(viewport={'width':width,'height':1500},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#translation');page.get_by_role('button',name=t['ts.practice'],exact=True).click();panel=page.get_by_role('region',name=t['tpr.help.title'],exact=True);panel.get_by_role('button',name=t['tpr.help.open'],exact=True).click();term=panel.locator('dl > div').first;box=term.locator('details');box.locator('summary').click();sentence=box.get_by_label(t['tpr.wordSentence.label'],exact=True);sentence.fill('I use this word in a sentence of my own.');box.get_by_role('button',name=t['tpr.wordSentenceRetry.start'],exact=True).click();sentence.fill('I use this word in a clear situation of my own.');group=box.get_by_role('group',name=t['tpr.wordReview.title'],exact=True);group.get_by_role('checkbox').nth(1).check();card=group.locator('label').first;w=card.bounding_box()['width'];assert w>=width-120,(width,lang,w);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');expect(sentence).to_have_value('I use this word in a clear situation of my own.');expect(page.get_by_role('button',name=t['tpr.wordReview.clear'],exact=True).first).to_be_visible()
    if width<768:
     term.screenshot(path=f'/downloads/henglish-{prefix}translation-mobile-width-{width}-{lang}-complete-word.png')
     page.locator('#translation-practice-task').evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-90,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}translation-mobile-width-{width}-{lang}-activity-start.png')
     for name,target in [('whole',term),('review',group)]:
      target.evaluate('(el)=>{document.activeElement.blur();window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-90,behavior:"instant"})}');page.screenshot(path=f'/downloads/henglish-{prefix}translation-mobile-width-{width}-{lang}-{name}.png')
    print(width,lang,'check card width',w,'PASS, nooverflow, content and interactions intact');page.close()
  b.close()
finally:server.shutdown();server.server_close()
