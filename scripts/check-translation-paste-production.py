import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.add_init_script("window.__paste=[];Object.defineProperty(navigator,'clipboard',{value:{readText:()=>new Promise(resolve=>window.__paste.push(resolve))}})");t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#translation');source=page.get_by_placeholder(t['se.placeholder'],exact=True);paste=page.get_by_title(t['se.paste'],exact=True);paste.click();source.fill('Newer text I typed myself.');page.evaluate("window.__paste[0]('Old clipboard content')");expect(source).to_have_value('Newer text I typed myself.');paste.click();paste.click();page.evaluate("window.__paste[2]('Latest requested paste.')");expect(source).to_have_value('Latest requested paste.');page.evaluate("window.__paste[1]('Earlier pending paste')");expect(source).to_have_value('Latest requested paste.');source.scroll_into_view_if_needed();page.screenshot(path='/downloads/translation-paste-safe-'+lang+'.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next deferred clipboard cannot overwrite newer typing,latestpastewins,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
