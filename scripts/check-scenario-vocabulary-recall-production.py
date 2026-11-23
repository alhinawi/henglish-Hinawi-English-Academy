import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4194),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4194');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/real-life/?lang='+lang)
   def enter():page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}','Airport Check-in & Baggage Drop'),exact=True)).click()
   enter();cards=page.locator('article');expect(cards).to_have_count(5);meaning=cards.first.locator(':scope > p.text-sm');original=meaning.inner_text();page.get_by_role('button',name=t['rle.recall.start'],exact=True).click();expect(cards.first.locator(':scope > p.text-sm')).to_have_count(0);expect(page.get_by_role('button',name=t['rle.recall.reveal'],exact=True)).to_have_count(5)
   cards.first.get_by_role('button',name=t['rle.recall.reveal'],exact=True).click();expect(cards.first.locator(':scope > p.text-sm')).to_be_visible();expect(page.get_by_role('button',name=t['rle.recall.reveal'],exact=True)).to_have_count(4);cards.first.get_by_role('button',name=t['rle.recall.hide'],exact=True).click();expect(cards.first.locator(':scope > p.text-sm')).to_have_count(0);cards.first.get_by_role('button',name=t['rle.recall.reveal'],exact=True).click()
   cards.first.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-96,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}scenario-vocabulary-recall-{lang}.png');page.get_by_role('button',name=t['rle.recall.end'],exact=True).click();expect(page.get_by_role('button',name=t['rle.recall.reveal'],exact=True)).to_have_count(0);expect(cards.first.locator(':scope > p.text-sm')).to_be_visible()
   page.get_by_role('button',name=t['rle.recall.start'],exact=True).click();page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click();enter();expect(page.get_by_role('button',name=t['rle.recall.start'],exact=True)).to_be_visible();expect(cards.first.locator(':scope > p.text-sm')).to_be_visible();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');print(lang,'meaning recall, individual reveal/hide, all-meaning recovery, scenario exit reset,390px PASS');page.close()
  b.close()
finally:server.shutdown();server.server_close()
