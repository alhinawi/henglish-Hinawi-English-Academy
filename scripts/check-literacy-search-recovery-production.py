import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4194),functools.partial(Quiet,directory=str(root/'out')))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   for kind in ['reading','writing']:
    page=b.new_page(viewport={'width':390,'height':950},reduced_motion='reduce')
    page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'Offline UI test'}))
    t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'))
    page.goto(f'http://127.0.0.1:4194/{kind}/?lang={lang}')
    field=page.get_by_role('textbox',name=t['lit.search'],exact=True)
    page.get_by_role('button',name='B2',exact=True).click()
    expect(page.get_by_role('button',name='B2',exact=True)).to_have_attribute('aria-pressed','true')
    cards=page.locator('button').filter(has=page.locator('h3'));expect(cards).to_have_count(6)
    before=page.evaluate('JSON.stringify(localStorage)')
    field.fill('zzzznomatch')
    empty=page.get_by_role('status').filter(has_text=t['lit.noResults'])
    expect(empty).to_be_visible()
    empty.scroll_into_view_if_needed()
    page.screenshot(path=f'/downloads/henglish-{kind}-search-empty-{lang}.png')
    empty.get_by_role('button',name=t['se.clear'],exact=True).click()
    expect(field).to_be_focused();expect(field).to_have_value('');expect(cards).to_have_count(6)
    expect(page.get_by_role('button',name='B2',exact=True)).to_have_attribute('aria-pressed','true')
    field.fill('zzzznomatch');field.press('Escape')
    expect(field).to_have_value('');expect(field).to_be_focused();expect(cards).to_have_count(6)
    field.fill('zzzznomatch');page.get_by_role('button',name=t['se.clear'],exact=True).first.click()
    expect(field).to_be_focused();expect(field).to_have_value('');expect(cards).to_have_count(6)
    assert page.evaluate('JSON.stringify(localStorage)')==before
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    field.scroll_into_view_if_needed();page.screenshot(path=f'/downloads/henglish-{kind}-search-restored-{lang}.png')
    print(lang,kind,'empty recovery, inline clear, Escape, focus, B2 preserved, 6 cards restored, storage unchanged, 390px PASS')
    page.close()
  b.close()
finally:server.shutdown();server.server_close()
