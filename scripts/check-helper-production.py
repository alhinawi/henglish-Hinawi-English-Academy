import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['ar','en','de']:
   page=browser.new_page(viewport={'width':390,'height':1050});requests=[];pending=[];mode=['success']
   def helper(route):
    requests.append(route.request.post_data_json)
    if mode[0]=='pending':pending.append(route);return
    if mode[0]=='quota':route.fulfill(status=429,json={'code':'HELPER_DAILY_LIMIT','error':'synthetic quota test'});return
    route.fulfill(json={'text':'He goes to school every day. بنضيف es مع he، وفي النفي: He does not go.','provider':'helper','model':'learning-helper','isLocalFallback':False})
   page.route('**/henglish-helper.hnz.workers.dev/api/helper/chat',helper)
   page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}))
   page.add_init_script("localStorage.setItem('henglish_api_token','fixture-token');localStorage.setItem('henglish_auth_session',JSON.stringify({type:'authenticated',isLoggedIn:true,isEmailVerified:true,accessToken:'fixture-token',user:{id:'helper-fixture',name:'Private Test Name',email:'private@example.invalid',role:'student',currentLevel:'B1',targetLevel:'C1',xp:0,streakDays:0}}));")
   t=json.load(open('src/i18n/locales/'+lang+'.json'))
   page.goto('http://127.0.0.1:4188/?lang='+lang+'#ai-tutor')
   expect(page.get_by_text(t['helper.notice'],exact=True)).to_be_visible()
   text=page.locator('input[maxlength="1200"]');expect(text).to_be_visible()
   text.fill('Correct He go to school every day');page.get_by_role('button',name=t['at.sendAria'],exact=True).click()
   answer=page.get_by_text('He goes to school every day. بنضيف es مع he، وفي النفي: He does not go.',exact=True)
   expect(answer).to_have_count(1);expect(answer).to_be_visible();assert len(requests)==1
   body=requests[-1];assert set(body)=={'message','mode','userLevel','history'};assert body['mode']=='grammar-teacher';assert 'private@example.invalid' not in json.dumps(body);assert 'Private Test Name' not in json.dumps(body)
   assert not __import__('re').search(r'\b(AI|GPT|Gemini|Groq)\b|ذكاء اصطناعي',page.locator('main').inner_text(),__import__('re').I)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   answer.scroll_into_view_if_needed();page.screenshot(path='/downloads/helper-answer-'+lang+'.png')
   mode[0]='quota';text.fill('One more question');page.get_by_role('button',name=t['at.sendAria'],exact=True).click()
   quota=page.get_by_text('المساعد وصل لحده المجاني النهارده. جرّب بكرة، وتقدر تكمل دروسك وتدريباتك عادي.',exact=True);expect(quota).to_be_visible();expect(answer).to_have_count(1);assert len(requests)==2
   quota.scroll_into_view_if_needed();page.screenshot(path='/downloads/helper-quota-'+lang+'.png')
   mode[0]='pending';text.fill('Cancel this request');page.get_by_role('button',name=t['at.sendAria'],exact=True).click();page.wait_for_function("document.querySelector('input[maxlength=\"1200\"]').value === ''")
   page.evaluate("location.hash='grammar'");expect(text).to_have_count(0)
   for route in pending:
    try:route.fulfill(json={'text':'LATE_ANSWER_MUST_NOT_APPEAR','provider':'helper','model':'learning-helper'})
    except Exception:pass
   page.evaluate("location.hash='ai-tutor'");expect(page.locator('input[maxlength="1200"]')).to_be_visible();expect(page.get_by_text('LATE_ANSWER_MUST_NOT_APPEAR',exact=True)).to_have_count(0)
   page.close();print(lang,'Next production export: one POST, private-profile omission, exact real-answer rendering, honest quota error, request cancellation, no provider words and mobile width PASS')
  browser.close()
finally:server.shutdown();server.server_close()
