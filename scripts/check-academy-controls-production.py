import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox','--autoplay-policy=document-user-activation-required']);t=json.load(open('src/i18n/locales/en.json'))
  for lang in ['en','ar']:
   ctx=b.new_context(**p.devices['Pixel 7']);page=ctx.new_page();requests=[];page.on('request',lambda r:requests.append(r.url));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}));page.add_init_script('delete window.speechSynthesis;window.__audio=[];const Original=window.Audio;window.Audio=class extends Original{constructor(...args){super(...args);window.__audio.push(this)}};');t=json.load(open('src/i18n/locales/'+lang+'.json'))
   def play(button,part):
    button.click();page.wait_for_function('window.__audio.at(-1)?.currentTime>0.04');assert page.evaluate('window.__audio.at(-1).error===null');assert part in page.evaluate('window.__audio.at(-1).src');stop=page.get_by_role('button',name=t['listen.stopAudio'],exact=True);stop.first.click();assert page.evaluate('window.__audio.at(-1).paused')
   page.goto('http://127.0.0.1:4188/?lang='+lang+'#listening');page.get_by_role('button').filter(has=page.locator('h3',has_text='First day in class' if lang=='en' else 'أول يوم في الفصل')).first.click();play(page.get_by_role('button',name=t['listen.playClip'],exact=True),'listening-');play(page.get_by_role('button',name=t['listen.dictSentence'],exact=True),'dictation');page.get_by_role('button',name=t['listen.playClip'],exact=True).scroll_into_view_if_needed();page.screenshot(path='/downloads/academy-static-listening-'+lang+'.png')
   for route in ['reading','writing']:
    page.goto('http://127.0.0.1:4188/?lang='+lang+'#'+route);page.locator('button').filter(has=page.locator('h3')).first.click()
    if route=='writing':page.get_by_role('button',name=t['lw.showModel'],exact=True).click()
    button=page.get_by_role('button',name=t['lw.speech'] if route=='reading' else t['lw.modelSpeech'],exact=True);play(button,route+'-');button.scroll_into_view_if_needed();page.screenshot(path='/downloads/academy-static-'+route+'-'+lang+'.png')
   page.goto('http://127.0.0.1:4188/?lang='+lang+'#pronunciation');play(page.get_by_role('button',name=t['pa.listenA'],exact=True),'pronunciation-');page.get_by_role('button',name=t['pa.listenA'],exact=True).scroll_into_view_if_needed();page.screenshot(path='/downloads/academy-static-pronunciation-'+lang+'.png')
   page.goto('http://127.0.0.1:4188/?lang='+lang+'#speaking');page.locator('summary').filter(has_text=t['sa.legacy']).click();play(page.get_by_role('button',name=t['slp.listenTitle']+' 1',exact=True),'legacy-');page.get_by_role('button',name=t['slp.listenTitle']+' 1',exact=True).scroll_into_view_if_needed();page.screenshot(path='/downloads/academy-static-legacy-'+lang+'.png')
   print(lang,'listening/dictation,reading,writing actual UI playback PASS');assert not any('/api/tts/'in r for r in requests);ctx.close()
  b.close()
finally:server.shutdown();server.server_close()
