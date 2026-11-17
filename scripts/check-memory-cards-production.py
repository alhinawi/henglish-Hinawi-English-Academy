import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.clock.install();page.add_init_script('Math.random=()=>0.5;');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#games')
   for title,start,selector,count in [('ah.gameMovieMemory','as.start','div.grid.grid-cols-3.gap-2 > button',12),('pz.game.word-memory.title','wl.start','div.grid.grid-cols-2.gap-2 > button',10)]:
    page.get_by_role('heading',name=t[title],exact=True).locator('..').get_by_role('button',name=t['ah.playNow'],exact=True).click();page.get_by_role('button',name=t[start],exact=True).click();cards=page.locator(selector);expect(cards).to_have_count(count)
    for i,card in enumerate(cards.all()):
     expect(card).to_have_attribute('aria-label',t[title]+' '+str(i+1));expect(card).to_have_attribute('aria-pressed','false');assert card.inner_text().strip()in ['?','؟'];assert card.evaluate('(el)=>getComputedStyle(el).color')!='rgba(0, 0, 0, 0)'
    cards.nth(0).focus();page.keyboard.press('Enter');expect(cards.nth(0)).to_have_attribute('aria-pressed','true');assert cards.nth(0).get_attribute('aria-label')==cards.nth(0).inner_text();page.screenshot(path='/downloads/memory-cards-'+('movie'if count==12 else'word')+'-'+lang+'.png',animations='disabled');page.get_by_role('button',name=t['as.quit'],exact=True).click();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.close();print(lang,'Next both memory games visible anonymous numbered backs,keyboard reveal announces visible text/pressed state,no hidden answer leak,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
