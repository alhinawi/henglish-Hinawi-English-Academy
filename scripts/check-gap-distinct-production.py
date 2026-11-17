import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.clock.install();page.add_init_script('Math.random=()=>0.5');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#games');page.get_by_role('heading',name=t['ah.gameGapFill'],exact=True).locator('..').get_by_role('button',name=t['ah.playNow'],exact=True).click();page.get_by_role('button',name=t['as.start'],exact=True).click();options=page.locator('div.grid.grid-cols-2[dir=ltr] button')
   for i in range(10):
    values=[v.strip().lower()for v in options.all_text_contents()];assert len(values)==4 and len(set(values))==4
    if i==0:page.screenshot(path='/downloads/gap-distinct-options-'+lang+'.png')
    options.nth(0).click();page.clock.run_for(1600)
   saved=page.evaluate("JSON.parse(localStorage.getItem('henglish_arcade_v1:guest'))");assert saved['totalPlays']==1 and len(saved['history'])==1;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next tenrounds fourdistinctchoices,completed game,onehistory,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
