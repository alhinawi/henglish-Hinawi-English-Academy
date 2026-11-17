import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar','de']:
   page=b.new_page(viewport={'width':390,'height':1100});t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#games');search=page.get_by_role('textbox',name=t['ah.searchAria'],exact=True);expect(search).to_be_visible();all_count=page.get_by_role('button',name=t['ah.playNow'],exact=True).count();assert all_count>10;title=t['ah.gameWordSprint'];search.fill(' '+title.upper()+' ');heading=page.get_by_role('heading',name=title,exact=True);expect(heading).to_be_visible();expect(page.get_by_role('button',name=t['ah.playNow'],exact=True)).to_have_count(1);heading.scroll_into_view_if_needed();page.screenshot(path='/downloads/arcade-title-search-'+lang+'.png',animations='disabled');search.fill('   ');expect(page.get_by_role('button',name=t['ah.playNow'],exact=True)).to_have_count(all_count);search.fill('not-a-real-game-xyz');expect(page.get_by_role('button',name=t['ah.playNow'],exact=True)).to_have_count(0);search.fill(title.lower());expect(page.get_by_role('button',name=t['ah.playNow'],exact=True)).to_have_count(1);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next displayed arcade title case/space search finds game,blankrestoresall,nomatchthenrecovery,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
