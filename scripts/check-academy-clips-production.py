import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
rows=json.load(open('docs/academy-audio-manifest.json'))[128:]
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox','--autoplay-policy=document-user-activation-required']);page=b.new_page(**p.devices['Pixel 7']);page.goto('http://127.0.0.1:4188/');page.add_init_script('delete window.speechSynthesis');page.evaluate("document.body.innerHTML='<button id=play>play</button>';window.clip=null;document.querySelector('button').onclick=()=>{window.clip=new Audio(window.src);window.clip.play()}")
  for i,row in enumerate(rows):
   page.evaluate('(src)=>window.src=src',row['src']);page.locator('#play').click();page.wait_for_function('window.clip.currentTime>0.03');assert page.evaluate('window.clip.error===null && window.clip.duration>0.1');page.evaluate('window.clip.pause()');assert page.evaluate('window.clip.paused');print(i+1,row['id'],'real mobile audio decode/play/stop PASS')
  b.close()
 print('All232 new static recordings actual mobile browser playback PASS; this resource fixture does not replace academy-control smoke testing.')
finally:server.shutdown();server.server_close()
