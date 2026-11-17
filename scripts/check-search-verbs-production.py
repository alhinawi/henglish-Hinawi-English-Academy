import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#sources');page.get_by_role('button',name=t['header.searchTitle'],exact=True).first.click();dialog=page.get_by_role('dialog');field=dialog.get_by_role('textbox');field.fill('buy');title=dialog.get_by_text('buy · bought · bought',exact=True);expect(title).to_have_count(1);field.fill('يقتني');expect(title).to_have_count(1);page.screenshot(path='/downloads/search-distinct-verbs-'+lang+'.png');title.click();expect(page).to_have_url('http://127.0.0.1:4188/?lang='+lang+'#vocabulary?entry=verb%3Abuy');expect(page.locator('#vocab-verb-buy')).to_be_visible();page.close();print(lang,'single canonical buy result,alternate Arabic meaning retained,exact deep link PASS')
  b.close()
finally:server.shutdown();server.server_close()
