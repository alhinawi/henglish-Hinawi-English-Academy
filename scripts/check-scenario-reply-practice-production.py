import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4197),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4197');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/real-life/?lang='+lang)
   def enter():page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}','Airport Check-in & Baggage Drop'),exact=True)).click()
   enter();panel=page.get_by_role('region',name=t['rle.draft.title'],exact=True);draft=page.get_by_role('textbox',name=t['rle.draft.label'],exact=True);choose=panel.get_by_role('button').filter(has=page.locator('div[lang="en"]'))
   options=panel.locator('button[lang="en"]');expect(options).to_have_count(4);panel.get_by_role('button',name=t['rle.draft.open'],exact=True).click();expect(options).to_have_count(0);draft.fill('Here is my passport. I have one bag.');expect(draft).to_have_attribute('dir','ltr');panel.get_by_role('button',name=t['rle.draft.compare'],exact=True).click();expect(options).to_have_count(4);review=panel.get_by_role('checkbox');review.check();draft.fill('Here is my passport, please.');expect(review).not_to_be_checked();review.check();panel.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-105,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}scenario-reply-draft-{lang}.png')
   panel.get_by_role('button',name=t['rle.draft.hide'],exact=True).click();expect(options).to_have_count(0);expect(draft).to_have_value('Here is my passport, please.');panel.get_by_role('button',name=t['rle.draft.close'],exact=True).click();expect(draft).to_have_count(0);expect(options).to_have_count(4);panel.get_by_role('button',name=t['rle.draft.open'],exact=True).click();expect(draft).to_have_value('');draft.fill('Reset on restart');page.get_by_role('button',name=t['rle.restartDialogue'],exact=True).click();expect(draft).to_have_count(0);panel.get_by_role('button',name=t['rle.draft.open'],exact=True).click();expect(draft).to_have_value('');draft.fill('Reset on next scene');panel.get_by_role('button',name=t['rle.draft.compare'],exact=True).click();options.first.click();page.get_by_role('button',name=t['rle.continueDialogue'],exact=True).click();expect(draft).to_have_count(0);panel.get_by_role('button',name=t['rle.draft.open'],exact=True).click();expect(draft).to_have_value('');page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click();enter();expect(draft).to_have_count(0);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');print(lang,'draft hides/reveals unchanged4choices,self-review edit reset,close/restart/turn/exit reset,390px PASS; no grading/network');page.close()
  b.close()
finally:server.shutdown();server.server_close()
