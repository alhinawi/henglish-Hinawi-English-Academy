import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   for route,count in [('login',2),('register',6),('forgot-password',1),('reset-password',2)]:
    page=b.new_page(viewport={'width':390,'height':1100});page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'google':False}));page.goto('http://127.0.0.1:4188/?lang='+lang+'#'+route);labels=page.locator('form label[for]');expect(labels).to_have_count(count)
    for label in labels.all():
     id=label.get_attribute('for');field=page.locator('#'+id);expect(field).to_have_count(1);label.click();expect(field).to_be_focused();assert field.evaluate('(el)=>!!el.labels.length')
    assert page.locator('form').evaluate('(el)=>getComputedStyle(el).direction')==('rtl' if lang=='ar' else 'ltr')
    if route=='register':
     t=json.load(open('src/i18n/locales/'+lang+'.json'));toggle=page.get_by_role('button',name=t['rp.show'],exact=True);toggle.click();expect(page.locator('#register-password')).to_have_attribute('type','text');expect(page.locator('#register-confirm-password')).to_have_attribute('type','text');expect(page.get_by_role('button',name=t['rp.hide'],exact=True)).to_have_attribute('aria-pressed','true');page.get_by_role('button',name=t['rp.hide'],exact=True).click();expect(page.locator('#register-password')).to_have_attribute('type','password');page.screenshot(path='/downloads/register-labels-'+lang+'.png',full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,route,'label-focus,accessible control,direction,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
