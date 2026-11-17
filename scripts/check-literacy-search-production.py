import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   for kind in ['reading','writing']:
    page=b.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#'+kind);field=page.get_by_role('textbox',name=t['lit.search'],exact=True);expect(field).to_be_visible();cards=page.locator('button').filter(has=page.locator('h3'));count=cards.count();title=cards.first.locator('h3').inner_text();field.fill('  '+title.upper()+'  ');expect(cards.filter(has_text=title)).to_have_count(1);field.fill('   ');expect(cards).to_have_count(count);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,kind,'padded displayed title,blank recovery,390px PASS')
  b.close()
finally:server.shutdown();server.server_close()
