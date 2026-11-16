// Static Next export serves the same verification shell for arbitrary signed IDs.
export const onRequest:PagesFunction<{ASSETS:Fetcher}>=async(context)=>{
 const url=new URL(context.request.url);url.pathname='/verify/index.html';
 return context.env.ASSETS.fetch(new Request(url.toString(),context.request));
};
