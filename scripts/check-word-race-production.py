import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.clock.install();page.add_init_script('Math.random=()=>0.5');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#games');page.get_by_role('heading',name=t['ah.gameWordRace'],exact=True).locator('..').get_by_role('button',name=t['ah.playNow'],exact=True).click();page.get_by_role('button',name=t['as.start'],exact=True).click();page.clock.run_for(9500);options=page.locator('div.grid.grid-cols-2[dir=ltr] button');options.nth(0).click();page.clock.run_for(10)
   if 'bg-rose' not in options.nth(0).get_attribute('class'):
    page.clock.run_for(2990);options.nth(1).click();assert 'bg-rose' in options.nth(1).get_attribute('class')
   page.clock.run_for(1600);saved=page.evaluate("JSON.parse(localStorage.getItem('henglish_arcade_v1:guest'))");assert saved['totalPlays']==1 and len(saved['history'])==1;page.screenshot(path='/downloads/word-race-finish-once-'+lang+'.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next wordrace wrong-answer/clock collision saves exactlyone play and history entry,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
