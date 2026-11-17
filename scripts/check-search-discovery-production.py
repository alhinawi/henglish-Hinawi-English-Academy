import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar','de']:
   page=b.new_page(viewport={'width':390,'height':1100});page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}));page.goto('http://127.0.0.1:4188/?lang='+lang+'#sources');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.get_by_role('button',name=t['header.searchTitle'],exact=True).first.click();dialog=page.get_by_role('dialog',name=t['header.search'],exact=True);expect(dialog).to_have_attribute('dir','rtl' if lang=='ar' else 'ltr');search=dialog.get_by_role('textbox',name=t['header.search'],exact=True);search.fill('vocabulary');result=dialog.get_by_role('button').filter(has=page.get_by_text(t['nav.vocabulary'],exact=True));expect(result).to_have_count(1);expect(result).to_be_visible();page.screenshot(path='/downloads/search-localized-'+lang+'.png');search.fill(t['nav.vocabulary']);expect(result).to_have_count(1);search.fill('zzzznoresult');expect(dialog.get_by_role('status')).to_contain_text(t['ex.noResults']);search.fill('vocabulary');result.click();expect(dialog).to_have_count(0);assert page.url.endswith('#vocabulary');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next localized title+aria+direction,English routealias,localized query,noresultcopy,actual navigation,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
