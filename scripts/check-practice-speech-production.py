import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});pending=[];page.route('**/api/tts/synthesize',lambda r:pending.append(r));page.add_init_script("window.__clips=[];window.Audio=class{constructor(){window.__clips.push(this)}play(){queueMicrotask(()=>this.onplay?.());return Promise.resolve()}pause(){this.paused=true}};delete window.speechSynthesis;");t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#practice');listen=page.get_by_role('button',name=t['sb.listen'],exact=True).first;stop=page.get_by_role('button',name=t['listen.stopAudio'],exact=True);listen.click();expect(stop).to_have_count(1);page.wait_for_timeout(100);stop.click()
   try:pending.pop(0).fulfill(json={'audioBase64':'dGVzdA=='})
   except:pass
   page.wait_for_timeout(100);assert page.evaluate('window.__clips.length')==0;listen.click();expect(stop).to_have_count(1);page.get_by_role('button',name=t['sb.reset'],exact=True).click();expect(stop).to_have_count(0);pending.clear();hunter=page.get_by_role('button',name=t['pp.listenSentence'],exact=True).nth(1);hunter.click();expect(stop).to_have_count(1);page.wait_for_timeout(100);pending.pop(0).fulfill(json={'audioBase64':'aHVudGVy'});page.wait_for_timeout(100);page.evaluate('window.__clips.at(-1).onerror()');error=page.get_by_role('status').filter(has_text=t['listen.audioError']);expect(error).to_be_visible();error.scroll_into_view_if_needed();page.screenshot(path='/downloads/practice-speech-error-'+lang+'.png');hunter.click();expect(stop).to_have_count(1);page.evaluate("location.hash='grammar'");expect(stop).to_have_count(0);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next practice pendingStop,lateignore,resetcancel,mistakeerror,routecancel,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
