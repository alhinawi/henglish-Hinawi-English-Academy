import functools,http.server,json,os,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4217),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4217');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/?lang='+lang+'#translation');page.get_by_role('button',name=t['ts.practice'],exact=True).click();picker=page.get_by_label(t['tpr.taskPicker.label'],exact=True);draft=page.get_by_label(t['tpr.draft'],exact=True);revision=page.get_by_label(t['tpr.revise.label'],exact=True);model=page.get_by_role('heading',name=t['tpr.answers'],exact=True);helpPanel=page.get_by_role('region',name=t['tpr.help.title'],exact=True);level=page.get_by_label(t['tpr.filter.level'],exact=True);direction=page.get_by_label(t['tpr.filter.direction'],exact=True);expect(picker.locator('option')).to_have_count(32)
   for i in range(32):
    picker.select_option(str(i));expect(model).to_have_count(0);expect(revision).to_have_count(0);expect(helpPanel.get_by_role('definition')).to_have_count(0);expect(draft).to_have_value('');draft.fill('Draft '+str(i));page.get_by_role('button',name=t['tpr.show'],exact=True).click();page.get_by_role('button',name=t['tpr.revise.open'],exact=True).click();revision.fill('Revision '+str(i));page.get_by_role('checkbox',name=t['tpr.check.meaning'],exact=True).check();helpPanel.get_by_role('button',name=t['tpr.help.open'],exact=True).click()
   picker.select_option('0');expect(draft).to_have_value('Draft 0');expect(model).to_have_count(0);expect(revision).to_have_count(0);expect(helpPanel.get_by_role('definition')).to_have_count(0);page.get_by_role('button',name=t['tpr.show'],exact=True).click();page.get_by_role('button',name=t['tpr.revise.open'],exact=True).click();expect(revision).to_have_value('Revision 0');expect(page.get_by_role('checkbox',name=t['tpr.check.meaning'],exact=True)).to_be_checked()
   for value in ['A1','A2','B1','B2','C1','C2']:
    level.select_option(value)
    for way in ['ar-to-en','en-to-ar']:
     direction.select_option(way);expect(picker).to_have_value('0');expect(model).to_have_count(0);count=picker.locator('option').count();assert count>=2
     for j in range(count):
      picker.select_option(str(j));expect(draft).to_have_attribute('dir','ltr' if way=='ar-to-en' else 'rtl');assert value in picker.locator('option:checked').inner_text();assert t['tpr.arEn' if way=='ar-to-en' else 'tpr.enAr'] in picker.locator('option:checked').inner_text()
   level.select_option('all');direction.select_option('all');expect(picker.locator('option')).to_have_count(32);expect(draft).to_have_value('Draft 0');page.get_by_role('button',name=t['tpr.previous'],exact=True).click();expect(picker).to_have_value('31');expect(draft).to_have_value('Draft 31');page.get_by_role('button',name=t['tpr.next'],exact=True).click();expect(picker).to_have_value('0');expect(draft).to_have_value('Draft 0');picker.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-155,behavior:"instant"})');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path=f'/downloads/henglish-{prefix}translation-task-picker-{lang}.png');print(lang,'all32directtasks/isolateddrafts/revisions/checks,all12filteredcombinations,hiddenmodel/help/revision,previous/nextwrap,390px PASS; noaudio/network');page.close()
  b.close()
finally:server.shutdown();server.server_close()
