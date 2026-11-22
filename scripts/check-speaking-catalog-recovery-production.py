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
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/speaking/?lang='+lang)
   search=page.get_by_role('textbox',name=t['sa.searchAria'],exact=True);status=page.get_by_role('status').filter(has_text=t['sa.results'].split('{count}')[0])
   search.fill('  where are you from? ');expect(page.locator('button h3').filter(has_text='Introducing' if lang=='en' else 'تقديم صديق')).to_be_visible()
   page.get_by_role('button',name='B2',exact=True).click();expect(page.get_by_text(t['sa.noMatch'],exact=True)).to_be_visible();page.get_by_role('button',name=t['sa.clearSearch'],exact=True).last.click();expect(search).to_be_focused();expect(page.get_by_role('button',name='B2',exact=True)).to_have_attribute('aria-pressed','true');expect(page.locator('button h3')).to_have_count(8)
   search.fill('missing_zzz');search.press('Escape');expect(search).to_have_value('');expect(page.get_by_role('button',name='B2',exact=True)).to_have_attribute('aria-pressed','true')
   search.fill('missing_zzz');search.scroll_into_view_if_needed();page.screenshot(path=f'/downloads/henglish-{prefix}speaking-search-empty-{lang}.png');page.get_by_role('button',name=t['sa.resetFilters'],exact=True).click();expect(search).to_be_focused();expect(page.get_by_role('button',name=t['sa.all'],exact=True)).to_have_attribute('aria-pressed','true');expect(page.locator('button h3')).to_have_count(32)
   search.fill('ده صاحبي عمر' if lang=='ar' else 'nice to meet you');expect(page.locator('button h3').first).to_be_visible();search.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-125,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}speaking-search-results-{lang}.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');print(lang,'dialogue/phrase search, level intersection, clear/Escape keeps level, reset32cards/focus, mobile width PASS');page.close()
  b.close()
finally:server.shutdown();server.server_close()
