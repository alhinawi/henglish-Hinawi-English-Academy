import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}));t=json.load(open('src/i18n/locales/'+lang+'.json'))
   for fragment in ['sources/dictionaries','sources-dictionaries']:
    page.goto('http://127.0.0.1:4188/?lang='+lang+'#'+fragment);target=page.locator('#sources-dictionaries');target.wait_for();page.wait_for_timeout(300);assert -5<=target.bounding_box()['y']<=210,(fragment,target.bounding_box());page.reload();target.wait_for();page.wait_for_timeout(300);assert -5<=target.bounding_box()['y']<=210
   page.goto('http://127.0.0.1:4188/?lang='+lang+'#sources');page.get_by_role('button',name=t['so.filters'],exact=True).click();link=page.locator('a[href="#sources/apps"]');link.click();expect(page).to_have_url('http://127.0.0.1:4188/?lang='+lang+'#sources/apps');target=page.locator('#sources-apps');page.wait_for_timeout(300);assert -5<=target.bounding_box()['y']<=210;expect(page.get_by_role('button',name=t['so.filters'],exact=True)).to_have_attribute('aria-expanded','false');page.screenshot(path='/downloads/source-category-production-'+lang+'.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next canonical+legacy deep link direct/reload scroll,category shortcut canonicalhash and closesfilter,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
