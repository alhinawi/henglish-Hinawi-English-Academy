import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');t=json.load(open('src/i18n/locales/'+lang+'.json'))
   page.add_init_script('''const key='henglish_video_search_history:guest';if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(['saved search']));window.__denyClear=true;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.__denyClear&&k===key)throw Error('quota');return original.call(this,k,v)};''')
   page.goto('http://127.0.0.1:4188/?lang='+lang+'#movies');field=page.get_by_placeholder(t['ms.searchPlaceholder'],exact=True);field.fill('test search');expect(field).to_have_value('test search');expect(page.get_by_role('alert').filter(has_text=t['vocab.saveError'])).to_be_visible();expect(page.get_by_role('button',name='saved search',exact=True)).to_be_visible();assert page.evaluate("localStorage.getItem('henglish_video_search_history:guest')")=='["saved search"]';page.evaluate('scrollTo(0,0)');page.screenshot(path='/downloads/movie-search-error-'+lang+'.png');page.evaluate('window.__denyClear=false');field.fill('retry search');expect(page.get_by_role('alert').filter(has_text=t['vocab.saveError'])).to_have_count(0);expect(page.get_by_role('button',name='retry search',exact=True)).to_be_visible();assert json.loads(page.evaluate("localStorage.getItem('henglish_video_search_history:guest')"))==['retry search','saved search'];page.close();print(lang,'failed history write disclosed,query still changes,old search retained,retry saves PASS')
  b.close()
finally:server.shutdown();server.server_close()
