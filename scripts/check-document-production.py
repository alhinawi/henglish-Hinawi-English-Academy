# Run after npm run build:next. Uses real exported JS and its real PDF worker.
import functools,http.server,json,pathlib,threading,sys
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path(__file__).resolve().parent.parent
lang=sys.argv[1] if len(sys.argv)>1 else 'en'
handler=functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out'))
server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),handler)
thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':1100});requests=[];workers=[]
  page.on('response',lambda response:workers.append(response.status) if '/workers/pdf.worker-' in response.url else None)
  page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}))
  page.route('**/api/ai/translate',lambda r:(requests.append(r.request.post_data_json),r.fulfill(json={'translatedText':'Production export translated actual PDF text.'})))
  page.add_init_script("localStorage.setItem('henglish_api_token','audit-A');localStorage.setItem('henglish_auth_session',JSON.stringify({type:'authenticated',isLoggedIn:true,isEmailVerified:true,accessToken:'audit-A',user:{id:'audit-A',name:'Audit',role:'student',currentLevel:'A1',targetLevel:'A1',xp:0,streakDays:0}}));")
  page.goto('http://127.0.0.1:4188/?lang='+lang+'#translation');t=json.loads((root/('src/i18n/locales/'+lang+'.json')).read_text())
  page.get_by_role('button',name=t['ts.documents'],exact=True).evaluate('(e)=>e.click()')
  page.locator('input[type=file]').set_input_files(str(root/'scripts/fixtures/document-text.pdf'));page.get_by_role('button',name=t['dt.start'],exact=True).click();expect(page.get_by_text('Production export translated actual PDF text.',exact=True)).to_be_visible(timeout=30000)
  assert 'First compressed PDF page.' in requests[-1]['text'] and 'Second PDF page.' in requests[-1]['text'];assert 200 in workers
  heading=page.get_by_text(t['dt.preview'],exact=True);download=page.get_by_role('button',name=t['dt.download'],exact=True);heading.scroll_into_view_if_needed();a=heading.bounding_box();b=download.bounding_box();assert a['y']+a['height']<=b['y'];page.screenshot(path='/downloads/document-result-mobile-'+lang+'.png')
  before=len(requests);page.locator('input[type=file]').set_input_files(str(root/'scripts/fixtures/document-scan.pdf'));page.get_by_role('button',name=t['dt.start'],exact=True).click();expect(page.get_by_text(t['dt.errNoPdfText'],exact=True)).to_be_visible(timeout=30000);assert len(requests)==before
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path='/downloads/document-scan-error-'+lang+'.png');browser.close();print('Next static production export: real two-page compressed PDF extracts text via200same-origin worker; scanned PDF rejected withoutAIrequest;390px width PASS')
finally:server.shutdown();server.server_close()
