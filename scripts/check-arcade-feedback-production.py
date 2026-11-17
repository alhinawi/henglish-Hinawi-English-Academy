import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.clock.install();page.add_init_script("Math.random=()=>0.5;window.__delays={};window.__cleared=[];const st=window.setTimeout,ct=window.clearTimeout;window.setTimeout=(fn,ms,...args)=>{let id=st(fn,ms,...args);window.__delays[ms]=id;return id};window.clearTimeout=id=>{window.__cleared.push(id);ct(id)};");t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#games')
   def launch(key):
    page.get_by_role('heading',name=t[key],exact=True).locator('..').get_by_role('button',name=t['ah.playNow'],exact=True).click();page.get_by_role('button',name=t['as.start'],exact=True).click()
   launch('ah.gameWordMatch');grid=page.locator('div.grid.grid-cols-2[dir=ltr]');left=grid.locator(':scope > div').nth(0).get_by_role('button');right=grid.locator(':scope > div').nth(1).get_by_role('button');left.nth(0).click();right.nth(0).click()
   if page.locator('button.bg-rose-500\\/20').count()==0:
    left.nth(1).click();right.nth(2).click()
   expect(grid.get_by_role('button',disabled=True)).to_have_count(16);page.screenshot(path='/downloads/arcade-feedback-lock-'+lang+'.png');page.clock.run_for(550);assert grid.get_by_role('button',disabled=False).count()>=12
   enabled_left=left.locator(':scope:enabled');enabled_right=right.locator(':scope:enabled');enabled_left.nth(0).click();enabled_right.nth(0).click()
   if page.locator('button.bg-rose-500\\/20').count()==0:
    enabled_left.nth(0).click();enabled_right.nth(1).click()
   pending=page.evaluate('window.__delays[550]');page.get_by_role('button',name=t['as.quit'],exact=True).click();assert page.evaluate('(id)=>window.__cleared.includes(id)',pending);page.clock.run_for(1600)
   launch('ah.gameGapFill');page.locator('div.grid.grid-cols-2[dir=ltr] button').nth(0).click();pending=page.evaluate('window.__delays[1500]||window.__delays[700]');page.get_by_role('button',name=t['as.quit'],exact=True).click();assert page.evaluate('(id)=>window.__cleared.includes(id)',pending);page.clock.run_for(1700);assert page.evaluate("localStorage.getItem('henglish_arcade_v1:guest')") is None;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next WordMatch locked feedback/resume and pending cancellation on quit,GapFill cancellation,no completion afterexit,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
