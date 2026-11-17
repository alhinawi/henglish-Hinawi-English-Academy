import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100});pending=[];page.route('**/api/tts/synthesize',lambda r:pending.append(r));page.add_init_script("window.__clips=[];window.Audio=class{constructor(){window.__clips.push(this)}play(){queueMicrotask(()=>this.onplay?.());return Promise.resolve()}pause(){this.paused=true}};delete window.speechSynthesis;");t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#pronunciation');quiz=page.get_by_role('button',name=t['pa.playRandom'],exact=True);stop=page.get_by_role('button',name=t['listen.stopAudio'],exact=True);guess=page.get_by_role('button').filter(has_text=t['pa.wasLabel']);quiz.click();expect(stop).to_have_count(1);expect(guess).to_have_count(0);page.wait_for_timeout(100);stop.click()
   try:pending.pop(0).fulfill(json={'audioBase64':'dGVzdA=='})
   except:pass
   page.wait_for_timeout(100);assert page.evaluate('window.__clips.length')==0;expect(guess).to_have_count(0);quiz.click();page.wait_for_timeout(100);pending.pop(0).fulfill(json={'audioBase64':'cXVpeg=='});page.wait_for_timeout(100);expect(stop).to_have_count(1);expect(guess).to_have_count(0);page.evaluate('window.__clips.at(-1).onended()');expect(stop).to_have_count(0);expect(guess).to_have_count(2);page.get_by_role('button',name=t['pa.listenA'],exact=True).click();expect(stop).to_have_count(1);expect(guess).to_have_count(0);page.wait_for_timeout(100)
   if pending:pending.pop(0).fulfill(json={'audioBase64':'d29yZA=='})
   page.wait_for_timeout(100);page.evaluate('window.__clips.at(-1).onerror()');error=page.get_by_role('alert').filter(has_text=t['listen.audioError']);expect(error).to_be_visible();error.scroll_into_view_if_needed();page.screenshot(path='/downloads/pronunciation-trainer-error-'+lang+'.png');ipa=page.get_by_role('button',name=t['pa.listenWords']+': see, sheep',exact=True);ipa.click();expect(stop).to_have_count(1);page.wait_for_timeout(100);stop.click();expect(stop).to_have_count(0);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next pronunciation quizpendingStop,lateignore,nogradeuntilend,wordStop+error,IPAStop,width PASS')
  b.close()
finally:server.shutdown();server.server_close()
