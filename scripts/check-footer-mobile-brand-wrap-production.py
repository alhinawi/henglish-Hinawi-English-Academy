import functools,http.server,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4296),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4296');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width in [320,390,1280]:
   for lang in ['en','ar']:
    page=b.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce');page.goto(origin+'/pronunciation/?lang='+lang);footer=page.locator('footer');expect(footer.locator('nav')).to_have_count(3);expect(footer.locator('nav button')).to_have_count(20)
    brand=footer.get_by_text('Henglish Academy',exact=True);expect(brand).to_be_visible();box=brand.bounding_box();assert box['x']>=19 and box['x']+box['width']<=width-19,(width,lang,box);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    footer.evaluate('(el)=>window.scrollTo({top:scrollY+el.getBoundingClientRect().top-80,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}footer-brand-{width}-{lang}.png');print(width,lang,'brand within footer padding,20links, nooverflow PASS');page.close()
  b.close()
finally:server.shutdown();server.server_close()
