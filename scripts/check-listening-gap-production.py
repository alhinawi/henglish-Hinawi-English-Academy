import functools,http.server,json,pathlib,threading,re
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4193),functools.partial(Quiet,directory=str(root/'out')))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050})
   page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'Offline UI test'}))
   t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'))
   page.goto(f'http://127.0.0.1:4193/listening/?lang={lang}')
   page.get_by_role('heading',name='First day in class' if lang=='en' else 'أول يوم في الفصل',exact=True).click()
   section=page.locator('section').filter(has=page.get_by_role('heading',name=re.compile('^'+re.escape(t['listen.gapTitle'])))).last
   options=section.locator('button').filter(has_not=page.locator('svg'))
   expect(options).to_have_count(4)
   before=options.all_text_contents()
   assert len(set(before))==4 and 'nine' in before
   wrong=next(w for w in before if w!='nine')
   section.get_by_role('button',name=wrong,exact=True).click()
   expect(section.get_by_text(t['listen.gapWrong'],exact=True)).to_be_visible()
   assert options.all_text_contents()==before,'answer click must not reshuffle'
   page.get_by_role('button',name=t['listen.revealTranscript'],exact=True).click()
   assert options.all_text_contents()==before,'transcript toggle must not reshuffle'
   section.scroll_into_view_if_needed()
   page.screenshot(path=f'/downloads/henglish-listening-gap-wrong-{lang}.png')
   section.get_by_role('button',name='nine',exact=True).click()
   expect(section.get_by_text(t['listen.gapCorrect'],exact=True)).to_be_visible()
   assert options.all_text_contents()==before
   section.scroll_into_view_if_needed()
   page.screenshot(path=f'/downloads/henglish-listening-gap-correct-{lang}.png')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.get_by_role('button',name=t['listen.nextLesson'],exact=False).click()
   assert section.get_by_text(t['listen.gapCorrect'],exact=True).count()==0
   print(lang,'390px wrong/retry/correct, transcript stability, next-lesson reset, no overflow PASS',before)
   page.close()
  b.close()
finally:
 server.shutdown();server.server_close()
