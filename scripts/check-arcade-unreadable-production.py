import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.clock.install();page.add_init_script("if(localStorage.getItem('henglish_arcade_v1:guest')===null)localStorage.setItem('henglish_arcade_v1:guest','broken original progress');");t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#games');warning=page.get_by_role('status').filter(has_text=t['ap.unreadable']);expect(warning).to_be_visible();page.get_by_role('heading',name=t['ah.gameWordSprint'],exact=True).locator('..').get_by_role('button',name=t['ah.playNow'],exact=True).click();page.get_by_role('button',name=t['as.start'],exact=True).click();page.clock.run_for(61000);expect(warning).to_be_visible();expect(warning.get_by_role('button')).to_have_count(0);assert page.evaluate("localStorage.getItem('henglish_arcade_v1:guest')")=='broken original progress';warning.scroll_into_view_if_needed();page.screenshot(path='/downloads/arcade-unreadable-progress-'+lang+'.png');page.reload();expect(warning).to_be_visible();assert page.evaluate("localStorage.getItem('henglish_arcade_v1:guest')")=='broken original progress';assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next arcade unreadablewarning,originalpreserved,roundmemoryonly,nofalseretry,reload,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
