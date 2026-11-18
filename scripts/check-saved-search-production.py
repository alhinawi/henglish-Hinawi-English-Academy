import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright,expect
root=pathlib.Path.cwd();server=http.server.ThreadingHTTPServer(('127.0.0.1',4188),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root/'out')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  for lang in ['ar','en','de']:
   page=b.new_page(viewport={'width':390,'height':1050});page.route('**/henglish-api.hnz.workers.dev/**',lambda r:r.fulfill(json={'progress':None,'badges':[]}));t=json.load(open('src/i18n/locales/'+lang+'.json'))
   page.add_init_script("const entry={id:'saved-one',headword:'write',normalized:'write',pos:'verb',cefr:'A1',ipaUs:'/raɪt/',ipaUk:'',frequencyTier:'top500',domain:'study',formality:'',meaningAr:'يكتب',definitionEn:'Record words',exampleEn:'Please write to me.',exampleAr:'اكتب لي'};window.__savedFixture=JSON.stringify([{id:'one',word:'write',entry,savedAt:'2026-11-01',isLearned:false,repetitionCount:0,intervalDays:1,easeFactor:2.5,nextReviewAt:'2000-01-01'},{id:'two',word:'read',entry:{...entry,id:'saved-two',headword:'read',normalized:'read',meaningAr:'يقرأ',definitionEn:'Understand text',exampleEn:'I read books.',exampleAr:'أقرأ الكتب'},savedAt:'2026-11-01',isLearned:true,repetitionCount:4,intervalDays:30,easeFactor:2.5,nextReviewAt:'2099-01-01'}]);localStorage.setItem('henglish_saved_vocabulary_v1:guest',window.__savedFixture);")
   page.route('**/data/vocab/i18n/'+lang+'.json',lambda r:r.fulfill(json={'saved-one':{'m':'Translated saved meaning'},'saved-two':{'m':'Other meaning'}}))
   page.goto('http://127.0.0.1:4188/?lang='+lang+'#vocabulary');page.get_by_role('button',name=t['va.tabSrs'],exact=True).click();search=page.get_by_role('searchbox',name=t['mvt.search'],exact=True);expect(search).to_be_visible()
   search.fill('  WRITE  ');expect(page.get_by_text('write',exact=True)).to_be_visible();expect(page.get_by_text('read',exact=True)).to_have_count(0)
   if lang=='de':
    search.fill('Translated saved meaning');expect(page.get_by_text('write',exact=True)).to_be_visible()
   search.fill('no_such_saved_word');empty=page.get_by_role('status').filter(has_text=t['mvt.noMatches']);expect(empty).to_be_visible();expect(page.get_by_text(t['mvt.emptyTitle'],exact=True)).to_have_count(0);empty.scroll_into_view_if_needed();page.screenshot(path='/downloads/saved-search-empty-'+lang+'.png')
   page.get_by_role('button',name=t['mvt.clearFilters'],exact=True).click();expect(search).to_have_value('');expect(page.get_by_text('read',exact=True)).to_be_visible();expect(page.get_by_text('write',exact=True)).to_be_visible()
   page.get_by_role('button',name=t['mvt.fMastered']+' (1)',exact=True).click();search.fill('write');expect(empty).to_be_visible();page.get_by_role('button',name=t['mvt.clearFilters'],exact=True).click();search.fill('read')
   # Starting review still uses the original due queue, not the search result.
   page.get_by_role('button',name=t['mvt.startReview'],exact=True).click();expect(page.get_by_text('write',exact=True)).to_be_visible();assert page.evaluate("localStorage.getItem('henglish_saved_vocabulary_v1:guest')===window.__savedFixture")
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.close();print(lang,'Next saved search: original/translated matches,filtered-empty/reset,status composition,unchanged storage/review queue,mobile width PASS')
  b.close()
finally:server.shutdown();server.server_close()
