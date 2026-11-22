import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4197),functools.partial(Quiet,directory=str(root/'out')))
threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4197');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce')
   page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}))
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'))
   page.goto(origin+'/real-life/?lang='+lang)
   cards=page.locator('button').filter(has=page.locator('img[src^="/images/reallife/sim-"]'))
   expect(cards).to_have_count(9)
   cats=page.get_by_role('group',name=t['rle.filterLabel'])
   counts={'travel':1,'hospitality':2,'healthcare':2,'professional':1,'daily':3,'all':9}
   for key,n in counts.items():
    cats.get_by_role('button',name=t['rle.cat.'+key],exact=True).click();expect(cards).to_have_count(n)
   cats.get_by_role('button',name=t['rle.cat.daily'],exact=True).click()
   clothing=cards.filter(has=page.locator('img[src="/images/reallife/sim-clothing-shopping.webp"]'))
   clothing.scroll_into_view_if_needed()
   expect(clothing.locator('img')).to_be_visible()
   assert clothing.locator('img').evaluate('(e)=>e.complete&&e.naturalWidth>0')
   page.screenshot(path=f'/downloads/henglish-{prefix}real-life-photo-library-{lang}.png')
   clothing.click();expect(page.get_by_role('button',name=t['rle.playAudio'],exact=True)).to_be_visible()
   page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click();expect(cards).to_have_count(3)
   cats.get_by_role('button',name=t['rle.cat.all'],exact=True).click();expect(cards).to_have_count(9)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   for i in range(9):
    card=cards.nth(i);card.scroll_into_view_if_needed();expect(card.locator('img')).to_be_visible();assert card.locator('img').evaluate('(e)=>e.complete&&e.naturalWidth>0')
   print(lang,'9 loaded photos; 1/2/2/1/3 category counts; daily scene entry/back; retained filter; all cards restored; 390px no overflow PASS')
   page.close()
  b.close()
finally:server.shutdown();server.server_close()
