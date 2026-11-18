import functools,http.server,json,pathlib,threading,re
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
titles=re.findall(r"    title: '([^']+)'",(root/'src/data/dialoguesData.ts').read_text())
expected={'/images/pool/av-'+name+'.webp' for name in ['mona','omar','laila','karim','tariq','hassan','interviewer','nour','salma','youssef']}
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width in [390,1280]:
   page=b.new_page(viewport={'width':width,'height':1100});page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}));t=json.load(open('src/i18n/locales/ar.json'));page.goto('http://127.0.0.1:4188/?lang=ar#speaking');page.get_by_text(t['sa.legacy'],exact=True).click();seen=set()
   for index,title in enumerate(titles):
    button=page.get_by_role('button').filter(has_text=title).first;button.click();images=page.locator('img[src^="/images/pool/av-"]');expect(images).to_have_count(4)
    for image in images.all():
     image.scroll_into_view_if_needed();image.evaluate('(el)=>el.decode()');assert image.evaluate('(el)=>el.naturalWidth===400 && el.naturalHeight===400');assert image.get_attribute('alt')=='';seen.add(image.get_attribute('src'))
    if index in [0,1,2]:
     images.first.scroll_into_view_if_needed();page.evaluate('window.scrollBy(0,-140)');page.screenshot(path='/downloads/dialogue-photos-'+str(index)+'-'+str(width)+'.png')
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   assert seen==expected,(seen,expected);page.close();print(width,'all ten real portraits rendered and decoded,decorative alt,scenario switching,no overflow PASS')
  b.close()
finally:server.shutdown();server.server_close()
