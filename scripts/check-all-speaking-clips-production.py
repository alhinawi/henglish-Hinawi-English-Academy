import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
rows=json.load(open('docs/speaking-audio-manifest.json'))
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox','--autoplay-policy=document-user-activation-required'])
  context=b.new_context(**p.devices['Pixel 7']);page=context.new_page();requests=[];page.on('request',lambda r:requests.append(r.url));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}));page.add_init_script('delete window.speechSynthesis;window.__audio=[];const Original=window.Audio;window.Audio=class extends Original{constructor(...args){super(...args);window.__audio.push(this)}};')
  t=json.load(open('src/i18n/locales/ar.json'));page.goto('http://127.0.0.1:4188/?lang=ar#speaking');page.get_by_role('button',name=t['sa.startFirst'],exact=True).click()
  for lesson in range(1,33):
   for line in range(1,5):
    row=next(r for r in rows if r['id']=='conversation-'+str(lesson).zfill(2)+'-line-'+str(line));page.get_by_role('button',name=t['sp.listenLineAria']+' '+str(line),exact=True).click();page.wait_for_function('window.__audio.at(-1)?.currentTime>0.04');assert page.evaluate('window.__audio.at(-1).error===null');assert page.evaluate('window.__audio.at(-1).src').endswith(row['src']);page.get_by_role('button',name=t['listen.stopAudio'],exact=True).click();assert page.evaluate('window.__audio.at(-1).paused');expect(page.get_by_role('button',name=t['sp.listenLineAria']+' '+str(line),exact=True)).to_be_enabled()
   if lesson in [1,32]:
    page.get_by_role('button',name=t['sp.listenLineAria']+' 1',exact=True).scroll_into_view_if_needed();page.evaluate('window.scrollBy(0,-140)');page.screenshot(path='/downloads/static-speaking-lesson-'+str(lesson)+'.png')
   assert page.get_by_role('status').filter(has_text=t['listen.audioError']).count()==0
   if lesson<32:page.get_by_role('button',name=t['sa.nextLesson'],exact=True).click()
   print('lesson',lesson,'all4 actual MP3 playtime/Stop/retry PASS')
  assert not any('/api/tts/' in u for u in requests);print('ALL128 speaking dialogue clips actual mobile Chromium playback,zero voices,zero API,zeroerrors PASS');context.close();b.close()
finally:server.shutdown();server.server_close()
