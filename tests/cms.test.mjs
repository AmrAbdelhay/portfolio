import { registerHooks } from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';
registerHooks({resolve(specifier,context,next){try{return next(specifier,context)}catch(error){if(specifier.startsWith('.'))return next(specifier+'.ts',context);throw error;}}});
const {contentSchema,defaultContent,mergePortfolioContent}=await import('../app/cms/content.ts');
const {newItem,updateSection}=await import('../app/cms/editing.ts');
const {GET,POST}=await import('../app/api/admin/content/route.ts');
const {POST:upload}=await import('../app/api/admin/upload/route.ts');
test('preserves current portfolio and distinguishes paid from organic',()=>{
 assert.equal(contentSchema.safeParse(defaultContent).success,true);
 assert.equal(defaultContent.caseStudies.length,3);
 assert.equal(defaultContent.aleemDesigns.length,6);
 assert.deepEqual(defaultContent.rsWorks.map(x=>x.badge),['Organic + Paid','Organic','','','']);
});
test('rejects executable links, duplicate slugs and missing stories',()=>{
 for(const url of ['javascript:alert(1)','//evil.test','/\\evil.test','data:text/html,hello']) {
  const content=structuredClone(defaultContent);content.projects[0].link=url;
  assert.equal(contentSchema.safeParse(content).success,false,url);
 }
 const content=structuredClone(defaultContent);content.caseStudies[1].slug='noga';assert.equal(contentSchema.safeParse(content).success,false);
 const missing=structuredClone(defaultContent);delete missing.details.rs;assert.equal(contentSchema.safeParse(missing).success,false);
});
test('adding a brand creates a distinct route and its editable story',()=>{
 const brand=newItem('caseStudies',defaultContent.caseStudies);
 assert.notEqual(brand.slug,defaultContent.caseStudies[0].slug);
 assert.equal(brand.template,'standard');
 const content=updateSection(defaultContent,'caseStudies',[...defaultContent.caseStudies,brand]);
 assert.ok(content.details[brand.slug]);assert.equal(contentSchema.safeParse(content).success,true);
});
test('empty nested lists retain correct item shape',()=>{
 assert.deepEqual(Object.keys(newItem('chapters',[])),['number','title','text','evidence']);
 assert.deepEqual(Object.keys(newItem('metrics',[])),['value','label']);
});
test('unauthenticated requests cannot read drafts, save, publish or sign uploads',async()=>{
 const req=()=>new Request('http://localhost/api/admin/content');
 assert.equal((await GET(req())).status,401);
 assert.equal((await POST(req())).status,401);
 assert.equal((await upload(req())).status,401);
});

test('legacy content exposes missing links and metrics in the editor',()=>{
 const content=structuredClone(defaultContent);
 delete content.projects[0].link;delete content.caseStudies[0].metrics;
 const parsed=contentSchema.parse(content);
 assert.equal(parsed.projects[0].link,'');assert.deepEqual(parsed.caseStudies[0].metrics,[]);
});

test('renaming a brand moves its story and links without leaving stale entries',()=>{
 const content=structuredClone(defaultContent);
 content.projects[0].link='/work/noga#results';
 const brands=structuredClone(content.caseStudies);brands[0].slug='noga-home';
 const edited=updateSection(content,'caseStudies',brands);
 assert.deepEqual(edited.details['noga-home'],content.details.noga);
 assert.deepEqual(edited.brandPlatforms['noga-home'],content.brandPlatforms.noga);
 assert.equal(Object.hasOwn(edited.details,'noga'),false);
 assert.equal(edited.projects[0].link,'/work/noga-home#results');
 assert.equal(edited.projects[1].link,'/work/noga-home');
 assert.equal(edited.caseStudies[0].template,'noga');
 assert.equal(content.projects[0].link,'/work/noga#results');
 const renamedAgain=structuredClone(edited.caseStudies);renamedAgain[0].slug='noga';
 edited.details['noga-home'].intro='Updated story';
 assert.equal(updateSection(edited,'caseStudies',renamedAgain).details.noga.intro,'Updated story');
});

test('reordering and removing brands keeps each remaining story attached to its brand',()=>{
 const reversed=updateSection(defaultContent,'caseStudies',[...defaultContent.caseStudies].reverse());
 assert.deepEqual(reversed.details,defaultContent.details);
 const removed=updateSection(defaultContent,'caseStudies',defaultContent.caseStudies.slice(1));
 assert.equal(Object.hasOwn(removed.details,'noga'),false);
 assert.deepEqual(removed.details.rs,defaultContent.details.rs);
});

test('admin routes validate drafts, pass publish intent and report conflicts and outages',async(t)=>{
 const previousUrl=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const previousKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 process.env.NEXT_PUBLIC_SUPABASE_URL='https://cms-test.invalid';
 process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='test-only-key';
 t.after(()=>{
  if(previousUrl===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_URL;else process.env.NEXT_PUBLIC_SUPABASE_URL=previousUrl;
  if(previousKey===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=previousKey;
 });
 let mode='admin';const saved=[];
 t.mock.method(globalThis,'fetch',async(input,init)=>{
  const path=new URL(typeof input==='string'?input:input.url??String(input)).pathname;
  if(mode==='outage')return Response.json({message:'Unavailable'},{status:503});
  if(path.endsWith('/auth/v1/user'))return Response.json({id:'test-owner',aud:'authenticated',email:'owner@example.test'});
  if(path.endsWith('/portfolio_admins'))return Response.json(mode==='denied'?null:{user_id:'test-owner'});
  if(path.endsWith('/portfolio_content'))return Response.json({document:defaultContent,revision:7});
  if(path.endsWith('/rpc/save_portfolio')){
   saved.push(JSON.parse(init.body));
   return mode==='conflict'?Response.json({message:'REVISION_CONFLICT'},{status:400}):Response.json(8);
  }
  throw new Error(`Unexpected test request: ${path}`);
 });
 const request=(body)=>new Request('http://localhost/api/admin/content',{method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer test-only-token'},...(body===undefined?{}:{body:JSON.stringify(body)})});
 assert.equal((await GET(request())).status,200);
 for(const action of ['save','publish']){
  const response=await POST(request({document:defaultContent,revision:7,action}));
  assert.equal(response.status,200);assert.deepEqual(await response.json(),{revision:8});
  assert.equal(saved.at(-1).publish_now,action==='publish');
  assert.equal(saved.at(-1).expected_revision,7);
 }
 assert.equal((await POST(request(null))).status,400);
 assert.equal((await POST(request({document:{},revision:7,action:'publish'}))).status,400);
 assert.equal(saved.length,2);
 mode='conflict';assert.equal((await POST(request({document:defaultContent,revision:7,action:'save'}))).status,409);
 mode='denied';assert.equal((await GET(request())).status,403);assert.equal((await upload(request({}))).status,403);
 mode='outage';assert.equal((await upload(request({}))).status,503);
});

test('RS legacy documents gain galleries without losing existing videos and results',()=>{
 const legacy=structuredClone(defaultContent);
 delete legacy.rsDesigns;delete legacy.rsCampaigns;delete legacy.rsContent;
 const parsed=contentSchema.parse(legacy);
 assert.deepEqual(parsed.rsDesigns,[]);assert.deepEqual(parsed.rsCampaigns,[]);assert.deepEqual(parsed.rsContent,[]);
 assert.equal(parsed.rsWorks.length,5);assert.equal(parsed.caseStudies.find(b=>b.template==='rs').metrics.length,2);
 for(const section of ['rsDesigns','rsCampaigns','rsContent']) {
  parsed[section].push(newItem(section,[]));
  assert.equal(contentSchema.safeParse(parsed).success,true);
  assert.equal(newItem(section,parsed[section]).title,'');
 }
});
test('RS media round-trips carousels, campaign metrics and Arabic copy and rejects unsafe images',()=>{
 const c=structuredClone(defaultContent);
 c.rsDesigns=[{title:'Carousel',description:'',role:'Designer',url:'/work/rs/designs/rs-de-01.jpeg',images:[{image:'https://example.com/a.webp',label:'Slide 1'},{image:'/slide2.png',label:'Slide 2'}]}];
 c.rsCampaigns=[{title:'Campaign',description:'',role:'Media buyer',objective:'Messages',period:'2026',metrics:[{value:'100',label:'Messages'}],images:[],note:'Reported results'}];
 c.rsContent=[{title:'Caption',description:'',role:'Writer',format:'Caption',text:'نص عربي\nسطر جديد',url:'',images:[]}];
 assert.deepEqual(contentSchema.parse(c),c);
 c.rsDesigns[0].images[0].image='javascript:alert(1)';assert.equal(contentSchema.safeParse(c).success,false);
});

test('RS design cards accept direct links to each creative asset',()=>{
 const parsed = contentSchema.parse(defaultContent);
 assert.equal(parsed.rsDesigns[0].url, 'https://www.facebook.com/share/p/19aJDo4GhU/');
 assert.equal(parsed.rsDesigns[0].images[0].image, '/work/rs/designs/rs-de-01.jpeg');
});

test('Noga designs can be added with uploaded images and older content defaults safely',()=>{
 const legacy=structuredClone(defaultContent);delete legacy.nogaDesigns;
 const parsed=contentSchema.parse(legacy);
 assert.deepEqual(parsed.nogaDesigns,[]);
 parsed.nogaDesigns.push(newItem('nogaDesigns',[]));
 parsed.nogaDesigns[0].title='Noga product design';
 parsed.nogaDesigns[0].images=[{image:'https://example.com/noga.webp',label:'Product design'}];
 assert.equal(contentSchema.safeParse(parsed).success,true);
 parsed.nogaDesigns[0].images[0].image='javascript:alert(1)';
 assert.equal(contentSchema.safeParse(parsed).success,false);
});

test('RS reels expose numeric results without screenshot-only fields',()=>{
 const parsed=contentSchema.parse(defaultContent);
 assert.equal(parsed.rsWorks.length,5);
 assert.equal(Object.hasOwn(parsed.rsWorks.find(work=>work.id==='financial-accountant'),'resultsImage'),false);
 const secondReel=parsed.rsWorks.find(work=>work.id==='financial-accountant-2');
 assert.equal(Object.hasOwn(secondReel,'resultsImage'),false);
 assert.deepEqual([secondReel.views,secondReel.likes,secondReel.comments,secondReel.shares],['1M','2.9K','227','150']);
 assert.equal(secondReel.url,'https://www.facebook.com/reel/1817130995470717');
 assert.equal(parsed.rsWorks.find(work=>work.id==='graduation').badge,'');
 const legacy=structuredClone(defaultContent);delete legacy.rsWorks[0].resultsImage;
 assert.equal(contentSchema.safeParse(legacy).success,true);
});

test('old live RS documents gain new reels once and preserve intentional removals',()=>{
 const legacy=structuredClone(defaultContent);legacy.rsWorks=legacy.rsWorks.slice(0,2);delete legacy.rsWorksVersion;
 const migrated=mergePortfolioContent(legacy);
 assert.equal(migrated.rsWorks.length,5);
 assert.equal(migrated.rsWorksVersion,2);
 migrated.rsWorks=migrated.rsWorks.filter(work=>work.id!=='graduation');
 const saved=mergePortfolioContent(migrated);
 assert.equal(saved.rsWorks.length,4);
 assert.equal(saved.rsWorks.some(work=>work.id==='graduation'),false);
});

test('RS design update removes the known screenshot and adds four designs once',()=>{
 const legacy=structuredClone(defaultContent);delete legacy.rsDesignsVersion;
 legacy.rsDesigns=legacy.rsDesigns.slice(0,4);
 legacy.rsDesigns.push({title:'SC 3',description:'',role:'',url:'/work/rs/designs/rs-sc-03.jpeg',images:[{image:'/work/rs/designs/rs-sc-03.jpeg',label:'SC 3'}]});
 const migrated=mergePortfolioContent(legacy);
 assert.equal(migrated.rsDesigns.length,8);
 assert.equal(migrated.rsDesigns.some(work=>work.images.some(picture=>picture.image.includes('rs-sc-03'))),false);
 assert.equal(mergePortfolioContent(migrated).rsDesigns.length,8);
 migrated.rsDesigns=migrated.rsDesigns.slice(0,7);
 assert.equal(mergePortfolioContent(migrated).rsDesigns.length,7);
 assert.equal(migrated.rsWorks.length,5);
});

test('RS excludes the rejected tax-return design from bundled and saved galleries',()=>{
 assert.equal(defaultContent.rsDesigns.some(work=>work.images.some(image=>image.image.includes('rs-de-05'))),false);
 const saved=structuredClone(defaultContent);
 saved.rsDesigns.push({title:'RS DE 5',description:'',role:'',url:'/work/rs/designs/rs-de-05.jpeg',images:[{image:'/work/rs/designs/rs-de-05.jpeg',label:'Rejected'}]});
 assert.equal(mergePortfolioContent(saved).rsDesigns.length,8);
 assert.equal(defaultContent.rsDesigns.some(work=>work.images.some(image=>image.image.includes('rs-de-04'))),true);
});


test("RS designs open the supplied Facebook posts and credit content plus design",()=>{
 const parsed=mergePortfolioContent(defaultContent);
 assert.equal(parsed.rsDesigns.length,8);
 assert.equal(new Set(parsed.rsDesigns.map(work=>work.url)).size,8);
 for(const work of parsed.rsDesigns) { assert.match(work.url,/^https:\/\/www\.facebook\.com\/share\/p\//); assert.equal(work.role,"Content writing & graphic design"); }
});
