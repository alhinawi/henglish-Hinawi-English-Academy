import subprocess,time,urllib.request,urllib.error,pathlib,json,os,signal
from playwright.sync_api import sync_playwright,expect
p=subprocess.Popen(['npm','run','preview'],stdout=open('/tmp/henglish-next-preview.log','w'),stderr=subprocess.STDOUT,start_new_session=True)
try:
 for _ in range(50):
  try: urllib.request.urlopen('http://127.0.0.1:5173/');break
  except: time.sleep(.1)
 worker=urllib.request.urlopen('http://127.0.0.1:5173/workers/pdf.worker-6.5.438.min.mjs');assert worker.headers['Content-Type']=='text/javascript'
 index=urllib.request.urlopen('http://127.0.0.1:5173/').read();assert b'/_next/' in index
 file=next(pathlib.Path('out/images').rglob('*.webp'));url='http://127.0.0.1:5173/'+str(file.relative_to('out'));r=urllib.request.urlopen(urllib.request.Request(url,headers={'Range':'bytes=0-9'}));assert r.status==206 and len(r.read())==10;r=urllib.request.urlopen(urllib.request.Request(url,method='HEAD'));assert r.headers['Content-Type']=='image/webp'
 for url,status in [('http://127.0.0.1:5173/missing-resource.mp3',404),('http://127.0.0.1:5173/..%2fpackage.json',403)]:
  try:urllib.request.urlopen(url);raise AssertionError(url)
  except urllib.error.HTTPError as e:assert e.code==status,(url,e.code)
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['ar','en','fr']:
   page=browser.new_page(viewport={'width':390,'height':900});page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}))
   for route in ['dashboard','vocabulary','listening','reading','writing','pronunciation','speaking','translation','practice']:
    page.goto('http://127.0.0.1:5173/?lang='+lang+'#'+route);page.wait_for_selector('main');page.wait_for_function('!document.querySelector("#boot-splash") && document.querySelector("main")?.innerText.length>50');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert page.evaluate("Array.from(document.scripts).some(s=>s.src.includes('/_next/'))");print(lang,route,'Next export main content/nooverflow PASS')
    if route=='dashboard':
     page.wait_for_function("(()=>{let e=document.querySelector('main h1,main h2');if(!e)return false;while(e){if(e.style.opacity && Number(e.style.opacity)<0.99)return false;e=e.parentElement}return true})()");page.screenshot(path='/downloads/next-canonical-home-'+lang+'.png')
   page.close()
  browser.close()
 print('Canonical npm build => Next output; npm preview => actual artifact with safe paths, MIME, HEAD, ranges and3locale9route browser smoke PASS')
finally:os.killpg(p.pid,signal.SIGTERM);p.wait()
