import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width in [390,1280]:
   for route in ['grammar','about']:
    page=browser.new_page(viewport={'width':width,'height':1000})
    page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}))
    page.goto('http://127.0.0.1:4188/?lang=ar#'+route)
    asset='modernClassroom' if route=='grammar' else 'learningStudyGroup'
    image=page.locator('img[src="/images/pool/'+asset+'.webp"]').first
    expect(image).to_be_visible()
    image.evaluate('(el)=>el.decode()')
    assert image.evaluate('(el)=>el.naturalWidth===1125 && el.naturalHeight===750')
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.screenshot(path='/downloads/photo-hero-'+route+'-'+str(width)+'.png')
    if route=='about':
     for asset in ['modernClassroom','mentorStudent','graduationCelebration']:
      card=page.locator('img[src="/images/pool/'+asset+'.webp"]');card.scroll_into_view_if_needed();card.evaluate('(el)=>el.decode()');assert card.evaluate('(el)=>el.naturalWidth===1125 && el.naturalHeight===750');page.screenshot(path='/downloads/photo-card-'+asset+'-'+str(width)+'.png')
    page.close()
    print(route,width,'photographic hero source,decoding,width PASS')
  browser.close()
finally:server.shutdown();server.server_close()
