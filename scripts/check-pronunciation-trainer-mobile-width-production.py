import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4291),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4291');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for width,lang in [(int(w),l)for w in os.environ.get('TEST_WIDTHS','320,390').split(',')for l in ['en','ar']]:
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.add_init_script("window.__clips=[];window.Audio=class{constructor(){window.__clips.push(this)}play(){queueMicrotask(()=>this.onplay?.());return Promise.resolve()}pause(){this.paused=true}};delete window.speechSynthesis;Math.random=()=>0.75;");t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/pronunciation/?lang='+lang);picker=page.get_by_label(t['pa.navigator.choose'],exact=True);words=page.locator('div.en.text-4xl');game=page.get_by_role('heading',name=t['pa.earGameTitle'],exact=True).locator('..');quiz=game.get_by_role('button',name=t['pa.playRandom'],exact=True);guess=game.get_by_role('button').filter(has_text=t['pa.wasLabel'])
   for i in range(18):
    picker.select_option(str(i));option=picker.locator('option:checked').inner_text();assert words.count()==2
    for word in words.all():assert word.inner_text() in option;assert word.bounding_box()['width']>=width-70
    for listen in [page.get_by_role('button',name=t['pa.listenA'],exact=True),page.get_by_role('button',name=t['pa.listenB'],exact=True)]:assert listen.bounding_box()['height']>=44
    expect(guess).to_have_count(0);quiz.click();page.wait_for_function('window.__clips.length>0');page.evaluate('window.__clips.at(-1).onended()');expect(guess).to_have_count(2)
    for g in guess.all():assert g.bounding_box()['height']>=44;assert g.bounding_box()['x']>=0 and g.bounding_box()['x']+g.bounding_box()['width']<=width
    guess.first.click();expect(game.get_by_role('status')).to_have_text(t['pa.correct']);expect(guess.first).to_be_disabled();expect(guess.last).to_be_disabled();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if i in [0,17]:words.first.locator('..').evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-100,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}pronunciation-trainer-mobile-width-{width}-{lang}-{i}.png')
    if i<17:page.get_by_role('button',name=t['pa.navigator.next'],exact=True).click();expect(game.get_by_role('status')).to_have_count(0);expect(guess).to_have_count(0)
   page.get_by_role('button',name=t['pa.navigator.previous'],exact=True).click();expect(picker).to_have_value('16');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');print(width,lang,'18pairswidth/listen44/picker-next-previous/mockedquizend-guess-lock-reset/nooverflow PASS; noactualaudio');page.close()
  b.close()
finally:server.shutdown();server.server_close()
