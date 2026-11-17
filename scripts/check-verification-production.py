import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}));page.add_init_script("localStorage.setItem('henglish_api_token','audit-A');localStorage.setItem('henglish_auth_session',JSON.stringify({type:'authenticated',isLoggedIn:true,isEmailVerified:false,accessToken:'audit-A',user:{id:'audit-A',name:'Audit',email:'audit@example.invalid',role:'student',currentLevel:'A1',targetLevel:'A1',xp:0,streakDays:0}}));");t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#verify-email')
   for i in range(6):page.locator('#otp-input-'+str(i)).fill(str(i+1))
   page.locator('form button[type=submit]').click();expect(page.get_by_text(t['auth.otpUnavailable'],exact=True)).to_be_visible();assert page.evaluate("JSON.parse(localStorage.getItem('henglish_auth_session')).isEmailVerified")==False;page.screenshot(path='/downloads/verification-owner-safe-'+lang+'.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next absentprovider verification nofalsebadge,localizedfailure,no accountmutation,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
