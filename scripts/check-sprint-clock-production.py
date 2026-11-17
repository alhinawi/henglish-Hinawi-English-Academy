import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.clock.install();page.add_init_script('Math.random=()=>0.5');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#games');page.get_by_role('heading',name=t['ah.gameWordSprint'],exact=True).locator('..').get_by_role('button',name=t['ah.playNow'],exact=True).click();page.get_by_role('button',name=t['as.start'],exact=True).click();options=page.locator('div.grid.grid-cols-1 button');elapsed=0;correct=None
   for i in range(4):
    options.nth(i).click()
    if 'bg-[#c4ff55]' in options.nth(i).get_attribute('class'):correct=i
    page.clock.run_for(800);elapsed+=800
    if correct is not None:break
   assert correct is not None;page.clock.run_for(59900-elapsed);options.nth(correct).click();page.clock.run_for(1200);saved=page.evaluate("JSON.parse(localStorage.getItem('henglish_arcade_v1:guest'))");assert saved['totalPlays']==1 and len(saved['history'])==1 and saved['best']['word-sprint']>=2;page.clock.run_for(5000);assert page.evaluate("JSON.parse(localStorage.getItem('henglish_arcade_v1:guest')).totalPlays")==1;page.screenshot(path='/downloads/sprint-stable-clock-'+lang+'.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next correctanswerat59.9s endsat60s,latestscoreincluded,oneplay,replaytimerstable,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
