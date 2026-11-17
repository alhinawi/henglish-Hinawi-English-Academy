import functools, http.server, json, pathlib, threading
from playwright.sync_api import sync_playwright, expect
root = pathlib.Path.cwd()
server = http.server.ThreadingHTTPServer(('127.0.0.1', 4188), functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(root / 'out')))
threading.Thread(target=server.serve_forever, daemon=True).start()
try:
 with sync_playwright() as p:
  browser = p.chromium.launch(executable_path='/opt/google/chrome/chrome', headless=True, args=['--no-sandbox'])
  for lang in ['en', 'ar']:
   page = browser.new_page(viewport={'width':390,'height':844}, reduced_motion='reduce')
   page.goto('http://127.0.0.1:4188/?lang=' + lang + '#vocabulary?entry=verb:write')
   card = page.locator('#vocab-verb-write')
   expect(card).to_be_visible()
   example = card.locator('div').filter(has_text='Ex: She will have written the entire dissertation by June.').last
   expect(example).to_be_visible()
   style = example.evaluate('(e) => ({whiteSpace:getComputedStyle(e).whiteSpace,overflow:getComputedStyle(e).overflow,textOverflow:getComputedStyle(e).textOverflow,scroll:e.scrollWidth,width:e.clientWidth})')
   assert style['whiteSpace'] == 'normal', style
   assert style['textOverflow'] != 'ellipsis', style
   assert style['scroll'] <= style['width'] + 1, style
   ids = page.locator('[id^="vocab-verb-"]').evaluate_all('(els) => els.map(e=>e.id)')
   assert len(ids) == 60 and len(set(ids)) == 60, ids
   assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Horizontal overflow'
   card.scroll_into_view_if_needed()
   page.screenshot(path='/downloads/verb-examples-' + lang + '.png')
   page.close()
   print(lang, 'full verb example visible at390px,60source cards preserved,unique DOM IDs,canonical deep link,no overflow PASS')
  browser.close()
finally:
 server.shutdown(); server.server_close()
