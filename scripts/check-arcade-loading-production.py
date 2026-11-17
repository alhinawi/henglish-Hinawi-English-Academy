import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   t=json.load(open('src/i18n/locales/'+lang+'.json'))
   for game,prefix in [('MovieMemory','mm'),('SentenceScramble','ss'),('TrueFalse','tf'),('ListeningChallenge','lc')]:
    page=b.new_page(viewport={'width':390,'height':1100});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));pending=[];page.route('**/data/sentences.json',lambda route:pending.append(route));page.goto('http://127.0.0.1:4188/?lang='+lang+'#games');heading=page.get_by_role('heading',name=t['ah.game'+game],exact=True)
    def launch():
     heading.locator('..').get_by_role('button',name=t['ah.playNow'],exact=True).click();page.get_by_role('button',name=t['as.start'],exact=True).click()
    launch();expect(page.get_by_role('status')).to_have_text(t[prefix+'.loading']);back=page.get_by_role('button',name=t['as.back'],exact=True);expect(back).to_be_visible();back.focus();page.screenshot(path='/downloads/arcade-loading-'+game+'-'+lang+'.png',animations='disabled');page.keyboard.press('Enter');expect(heading).to_be_visible();assert pending;pending[0].fulfill(path=str(root/'public/data/sentences.json'),content_type='application/json');expect(heading).to_be_visible();assert page.locator('div.grid.grid-cols-3.gap-2 > button').count()==0;assert page.evaluate("localStorage.getItem('henglish_arcade_v1:guest')") is None
    launch();expect(page.get_by_role('button',name=t['as.quit'],exact=True)).to_be_visible();assert page.get_by_role('status').count()==0;page.get_by_role('button',name=t['as.quit'],exact=True).click();expect(heading).to_be_visible();assert not errors,errors;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,game,'Next deferred load,status+keyboard back,late response stays exited,reentry playable,no XP writes/errors/overflow PASS')
  b.close()
finally:server.shutdown();server.server_close()
