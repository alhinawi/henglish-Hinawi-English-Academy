import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['de','en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.goto('http://127.0.0.1:4188/?lang='+lang+'#grammar');t=json.load(open('src/i18n/locales/'+lang+'.json'));titles=page.locator('h3 a[href^="#grammar/"]');expect(titles.first).to_be_visible();original=titles.first.inner_text();path=pathlib.Path('public/data/app-i18n/allGrammarRules/'+lang+'.json');overlay=json.load(open(path))if path.exists()else{};title=overlay.get(original,original);expect(titles.first).to_have_text(title);field=page.get_by_role('textbox',name=t['grammar.searchPlaceholder'],exact=True);field.fill(' '+title.upper()+' ');expect(titles.first).to_have_text(title);assert titles.count()>=1;titles.first.scroll_into_view_if_needed();page.screenshot(path='/downloads/grammar-title-'+lang+'.png',animations='disabled');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next visible grammar title finds its lesson,case/space tolerance,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
