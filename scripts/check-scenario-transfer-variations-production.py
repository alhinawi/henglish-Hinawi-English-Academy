import functools,http.server,json,os,pathlib,threading,subprocess
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();data=json.loads((root/'src/data/realLifeSimulationsData.ts').read_text().split('export const REAL_LIFE_SCENARIOS: SimulationScenario[] = ')[1].strip().rstrip(';'));variations=json.loads(subprocess.check_output(['node','--input-type=commonjs','-e',"const fs=require('fs'),ts=require('typescript'),vm=require('vm'),c={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/scenarioTransferVariations.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,c);console.log(JSON.stringify(c.exports.SCENARIO_TRANSFER_VARIATIONS));"],text=True))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4229),functools.partial(Quiet,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
origin=os.environ.get('TEST_ORIGIN','http://127.0.0.1:4229');prefix='live-' if origin.startswith('https:') else ''
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1050},reduced_motion='reduce');page.route('**/api/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(status=503,json={'error':'UI test'}));t=json.load(open(root/'src/i18n/locales'/f'{lang}.json'));page.goto(origin+'/real-life/?lang='+lang);panel=page.get_by_role('region',name=t['rle.transfer.title'],exact=True)
   for scenario in data:
    page.get_by_role('button').filter(has=page.get_by_role('img',name=t['rle.topicPhoto'].replace('{title}',scenario['title']),exact=True)).click();expect(panel).to_have_count(0)
    for i,turn in enumerate(scenario['turns']):
     choice=next(o for o in turn['options'] if o['isOptimal']);page.locator('button[lang="en"]').filter(has_text=choice['textEn']).click();page.get_by_role('button',name=t['rle.continueDialogue'] if i<len(scenario['turns'])-1 else t['rle.finishScenario'],exact=True).click()
    expect(panel.get_by_text(t['rle.variation.title'],exact=True)).to_have_count(0);panel.get_by_role('button',name=t['rle.transfer.open'],exact=True).click();details=panel.locator('details').filter(has=page.get_by_text(t['rle.variation.title'],exact=True));assert not details.evaluate('(el)=>el.open');details.locator(':scope > summary').click();expect(details.locator(':scope > ol > li')).to_have_count(4)
    for text in variations[scenario['id']]:
     prompt=details.get_by_text(text,exact=True);expect(prompt).to_be_visible();expect(prompt).to_have_attribute('lang','en');expect(prompt).to_have_attribute('dir','ltr')
    plan=panel.get_by_label(t['rle.transfer.plan'],exact=True);plan.fill('My answer to a new situation.');details.locator(':scope > summary').click();details.locator(':scope > summary').click();expect(plan).to_have_value('My answer to a new situation.');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    if scenario==data[0]:details.evaluate('(el)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-120,behavior:"instant"})');page.screenshot(path=f'/downloads/henglish-{prefix}scenario-transfer-variations-{lang}.png')
    panel.get_by_role('button',name=t['rle.transfer.close'],exact=True).click();expect(details).to_have_count(0);panel.get_by_role('button',name=t['rle.transfer.open'],exact=True).click();assert not details.evaluate('(el)=>el.open');expect(plan).to_have_value('');page.get_by_role('button',name=t['rle.replay'],exact=True).click();expect(panel).to_have_count(0);page.get_by_role('button',name=t['rle.allScenarios'],exact=True).click()
   print(lang,'all9scenarios36originalvariations,completion/opengate,closeddefault,Englishlanguage/direction,planpreservation,close/replayreset,390px PASS; noaudio/capture');page.close()
  b.close()
finally:server.shutdown();server.server_close()
