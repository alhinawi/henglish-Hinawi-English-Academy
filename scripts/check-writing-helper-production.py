import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['ar','en','de']:
   page=b.new_page(viewport={'width':390,'height':1050});requests=[];pending=[];mode=['success'];old_calls=[]
   def helper(route):
    requests.append(route.request.post_data_json)
    if mode[0]=='pending':pending.append(route);return
    if mode[0]=='quota':route.fulfill(status=429,json={'code':'HELPER_DAILY_LIMIT'});return
    route.fulfill(json={'text':'Use "I agree", not "I am agree". بنستخدم agree كفعل، من غير am.','provider':'helper','model':'learning-helper'})
   page.route('**/henglish-helper.hnz.workers.dev/api/helper/chat',helper)
   page.route('**/api/ai/chat',lambda r:(old_calls.append(r.request.url),r.fulfill(status=500)))
   page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}));t=json.load(open('src/i18n/locales/'+lang+'.json'))
   page.goto('http://127.0.0.1:4188/?lang='+lang+'#writing');page.locator('summary').filter(has_text=t['wa.section.templates']).click();text=page.get_by_role('textbox',name=t['wa.lab.title'],exact=True);expect(text).to_be_visible()
   original='I am agree with this plan because it helps students practice every single day.';text.fill(original);button=page.get_by_role('button',name=t['wa.analyze'],exact=True);button.click();feedback=page.get_by_text('Use "I agree", not "I am agree". بنستخدم agree كفعل، من غير am.',exact=True);expect(feedback).to_be_visible();assert len(requests)==1;assert requests[0]=={'message':original,'mode':'writing-assistant','userLevel':'B2','history':[]};assert not old_calls
   text.fill('x'*1201);button.click();expect(page.get_by_text(t['wa.feedback.tooLong'],exact=True)).to_be_visible();expect(text).to_have_value('x'*1201);assert len(requests)==1
   mode[0]='quota';text.fill(original);button.click();quota=page.get_by_text('المساعد وصل لحده المجاني النهارده. جرّب بكرة، وتقدر تكمل دروسك وتدريباتك عادي.',exact=True);expect(quota).to_be_visible();quota.scroll_into_view_if_needed();page.screenshot(path='/downloads/writing-helper-quota-'+lang+'.png');assert len(requests)==2
   mode[0]='pending';text.fill(original);button.click();page.wait_for_function('document.querySelector("textarea[aria-describedby=writing-helper-notice]").value.length>0');text.fill('My changed draft stays here.');expect(button).to_be_enabled()
   for route in pending:
    try:route.fulfill(json={'text':'STALE_REVIEW_MUST_NOT_APPEAR'})
    except Exception:pass
   expect(page.get_by_text('STALE_REVIEW_MUST_NOT_APPEAR',exact=True)).to_have_count(0);expect(text).to_have_value('My changed draft stays here.');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next writing review: shared bounded helper,no legacy endpoint,real feedback,quota,no truncation,edit cancellation and mobile width PASS')
  b.close()
finally:server.shutdown();server.server_close()
