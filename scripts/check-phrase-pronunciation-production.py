import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for route in ['idioms','ielts']:
   for lang in ['en','ar']:
    page=b.new_page(viewport={'width':390,'height':1100});pending=[];page.route('**/api/tts/synthesize',lambda r:pending.append(r));page.add_init_script("window.__clips=[];window.Audio=class{constructor(){window.__clips.push(this)}play(){queueMicrotask(()=>this.onplay?.());return Promise.resolve()}pause(){this.paused=true}};delete window.speechSynthesis;");page.goto('http://127.0.0.1:4188/?lang='+lang+'#'+route);t=json.load(open('src/i18n/locales/'+lang+'.json'));button=page.get_by_role('button',name=t['pr.play'],exact=True).first;button.wait_for(timeout=20000);button.focus();page.keyboard.press('Enter');stop=page.get_by_role('button',name=t['pr.stop'],exact=True).first;expect(stop).to_have_attribute('aria-pressed','true');page.wait_for_timeout(100);assert len(pending)==1;assert page.get_by_role('dialog').count()==0;stop.evaluate('(e)=>e.click()')
    try:pending.pop(0).fulfill(json={'audioBase64':'dGVzdA=='})
    except:pass
    page.wait_for_timeout(100);assert page.evaluate('window.__clips.length')==0;button.click();page.wait_for_timeout(100);pending.pop(0).fulfill(json={'audioBase64':'YmFuaw=='});page.wait_for_timeout(100);assert page.evaluate('window.__clips.length')==1;page.evaluate('window.__clips[0].onended()');expect(page.get_by_role('button',name=t['pr.stop'],exact=True)).to_have_count(0);button.click();page.wait_for_timeout(100);page.evaluate('window.__clips.at(-1).onerror()');error=page.get_by_role('status').filter(has_text=t['listen.audioError']);expect(error).to_have_count(1);error.scroll_into_view_if_needed();page.screenshot(path='/downloads/phrase-'+route+'-production-error-'+lang+'.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(route,lang,'Next production keyboardisolated,pendingStop,lateignore,realend,specificerror,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
