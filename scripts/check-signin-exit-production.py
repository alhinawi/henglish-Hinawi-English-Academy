import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=401,json={'success':False,'error':'auth.invalidCredentials'}));t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#login');page.locator('form input').nth(0).fill('audit@example.invalid');page.locator('form input[type=password]').fill('Example123');page.locator('form button[type=submit]').click();expect(page.locator('form button[type=submit]')).to_be_enabled();assert '#login' in page.url;assert not page.evaluate("JSON.parse(localStorage.getItem('henglish_auth_session')||'{}').isLoggedIn===true");page.screenshot(path='/downloads/signin-exit-'+lang+'.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next mocked sign-in rejection stays signed out,form usable,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
