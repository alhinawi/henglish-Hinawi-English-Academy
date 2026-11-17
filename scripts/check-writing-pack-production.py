import functools,http.server,json,pathlib,threading,subprocess
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
resources=json.loads(subprocess.check_output(['node','-e',"const fs=require('fs'),ts=require('typescript');require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,f);process.stdout.write(JSON.stringify(require('./src/data/resourcesData.ts').DOWNLOADABLE_RESOURCES));"],text=True))
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['en','ar']:
   page=b.new_page(viewport={'width':390,'height':1100},accept_downloads=True,reduced_motion='reduce');t=json.load(open('src/i18n/locales/'+lang+'.json'));page.goto('http://127.0.0.1:4188/?lang='+lang+'#resources')
   for resource in [r for r in resources if r['id'] in ['res-writing-pack']]:
    card=page.get_by_text(resource['subtitle'],exact=True).locator('..').locator('..');card.get_by_role('button',name=t['rs.preview']+':',exact=False).click();pre=page.locator('pre');expect(pre).to_have_text(resource['contentMarkdown']);expect(pre).to_have_attribute('dir','ltr');pre.scroll_into_view_if_needed();page.wait_for_timeout(350);page.evaluate('(el)=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-90,behavior:"instant"})',pre.element_handle());expect(pre).to_be_in_viewport();page.screenshot(path='/downloads/writing-pack-'+resource['id']+'-'+lang+'.png',animations='disabled')
    with page.expect_download() as event:card.get_by_role('button',name=t['rs.download'],exact=True).click()
    download=event.value;assert download.suggested_filename==resource['downloadFilename'];assert pathlib.Path(download.path()).read_text()==resource['contentMarkdown'];assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.close();print(lang,'Next five-templatepack preview/realTXTdownload exactlymatch teachingcontent,nooverflow PASS')
  b.close()
finally:server.shutdown();server.server_close()
