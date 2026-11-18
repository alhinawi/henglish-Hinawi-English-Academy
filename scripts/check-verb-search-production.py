import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['ar','en','de']:
   page=b.new_page(viewport={'width':390,'height':1050});page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}));t=json.load(open('src/i18n/locales/'+lang+'.json'))
   page.goto('http://127.0.0.1:4188/?lang='+lang+'#vocabulary');page.get_by_role('button',name=t['va.tabVerbs'],exact=True).click();search=page.get_by_role('searchbox',name=t['va.verbSearch'],exact=True);expect(search).to_be_visible();all_count=page.locator('[id^="vocab-verb-"]').count();assert all_count>20
   search.fill('  WRITTEN  ');expect(page.locator('[id="vocab-verb-write"]')).to_be_visible();assert page.locator('[id^="vocab-verb-"]').count()<all_count
   if lang=='de':
    translated=json.load(open('public/data/app-i18n/verbsData/de.json'))['يكتب / يؤلف'];search.fill('  '+translated.upper()+'  ');expect(page.locator('[id="vocab-verb-write"]')).to_be_visible();expect(page.locator('[id="vocab-verb-write"]')).to_contain_text(translated)
   search.fill('By 8 p.m.');expect(page.locator('[id="vocab-verb-finish"]')).to_be_visible()
   search.fill('no_such_verb_zzz');expect(page.get_by_role('status').filter(has_text=t['va.verbEmpty'])).to_be_visible();expect(page.locator('[id^="vocab-verb-"]')).to_have_count(0);page.screenshot(path='/downloads/verb-empty-'+lang+'.png')
   page.evaluate("location.hash='vocabulary?entry=verb:write'");expect(search).to_have_value('');expect(page.locator('[id="vocab-verb-write"]')).to_be_visible()
   search.fill('');expect(page.locator('[id^="vocab-verb-"]')).to_have_count(all_count);search.fill('written');expect(page.locator('[id="vocab-verb-write"]')).to_be_visible();search.scroll_into_view_if_needed();page.screenshot(path='/downloads/verb-search-'+lang+'.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next verb tab: V3/pasted/case/example/translated-meaning search,empty/recovery,stable IDs,mobile width PASS')
  b.close()
finally:server.shutdown();server.server_close()
