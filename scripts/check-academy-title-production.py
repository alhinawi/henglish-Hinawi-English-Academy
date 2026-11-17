import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['de','en','ar']:
   for route,module,search in [('speaking','speakingAcademyData','sa.searchAria'),('listening','listeningAcademyData','listen.searchAria')]:
    page=b.new_page(viewport={'width':390,'height':1100});page.goto('http://127.0.0.1:4188/?lang='+lang+'#'+route);t=json.load(open('src/i18n/locales/'+lang+'.json'));page.wait_for_timeout(250);titles=page.locator('button.group h3');expect(titles.first).to_be_visible();title=titles.first.inner_text();overlay_path=pathlib.Path('public/data/app-i18n/'+module+'/'+lang+'.json');overlay=json.load(open(overlay_path)) if overlay_path.exists() else {};translated=overlay.get(title,title);expect(titles.first).to_have_text(translated);title=translated;field=page.get_by_role('textbox',name=t[search],exact=True);field.fill(' '+title.upper()+' ');expect(titles.first).to_have_text(title);assert titles.count()>=1
    if lang=='de':
     overlay=json.load(open('public/data/app-i18n/'+module+'/de.json'));assert title in overlay.values()
    titles.first.scroll_into_view_if_needed();page.screenshot(path='/downloads/academy-title-'+route+'-'+lang+'.png',animations='disabled');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,route,'visible title searchable with case/whitespace,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
