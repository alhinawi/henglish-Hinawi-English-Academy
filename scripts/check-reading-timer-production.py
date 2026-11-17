import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');page.clock.install();t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#reading');page.locator('button').filter(has=page.locator('h3')).first.click();page.get_by_role('button',name=t['lw.timer'],exact=True).click();page.clock.fast_forward(65000);expect(page.get_by_text('1:05',exact=True)).to_be_visible();page.get_by_role('button',name=t['lw.pause'],exact=True).click();page.clock.fast_forward(90000);expect(page.get_by_text('1:05',exact=True)).to_be_visible();page.get_by_role('button',name=t['lw.timer'],exact=True).click();page.clock.fast_forward(5000);expect(page.get_by_text('1:10',exact=True)).to_be_visible();page.get_by_role('button',name=t['lw.reset'],exact=True).click();expect(page.get_by_text('0:00',exact=True)).to_be_visible();page.clock.fast_forward(5000);expect(page.get_by_text('0:00',exact=True)).to_be_visible();page.close();print(lang,'delayed65sec tick,pause excludes90sec,resume+5,reset stays0 PASS')
  b.close()
finally:server.shutdown();server.server_close()
