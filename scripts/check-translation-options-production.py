import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.add_init_script('Math.random=()=>0.5;');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#games')
   for game,selector in [('WordSprint','div.grid.grid-cols-1 > button'),('WordRace','div.grid.grid-cols-2[dir=ltr] > button')]:
    page.get_by_role('heading',name=t['ah.game'+game],exact=True).locator('..').get_by_role('button',name=t['ah.playNow'],exact=True).click();page.get_by_role('button',name=t['as.start'],exact=True).click();buttons=page.locator(selector);expect(buttons).to_have_count(4);labels=[x.strip()for x in buttons.all_text_contents()];assert len(set(labels))==4;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path='/downloads/translation-options-'+game.lower()+'-'+lang+'.png');page.get_by_role('button',name=t['as.quit'],exact=True).click()
   page.close();print(lang,'Next sprint/race real content four distinct options,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
