"use strict";(()=>{var e={};e.id=163,e.ids=[163],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7147:e=>{e.exports=require("fs")},18:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>h,patchFetch:()=>x,requestAsyncStorage:()=>m,routeModule:()=>w,serverHooks:()=>g,staticGenerationAsyncStorage:()=>d});var s={};n.r(s),n.d(s,{GET:()=>c,dynamic:()=>o,revalidate:()=>l,runtime:()=>u});var r=n(9303),a=n(8716),i=n(670);let o="force-dynamic",l=0,u="nodejs";async function p(){let e=process.env.NEWS_FILE_PATH;if(e)try{let t=(await Promise.resolve().then(n.t.bind(n,7147,23))).readFileSync(`${e}/index.json`,"utf8");return JSON.parse(t).articles??[]}catch{}let t=process.env.NEWS_DATA_URL;if(t)try{let e=await fetch(`${t}/index.json`,{next:{revalidate:0},signal:AbortSignal.timeout(5e3)});if(e.ok)return(await e.json()).articles??[]}catch{}return[]}async function c(){let e=await p(),t=Date.now()-1728e5;function n(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}let s=e.filter(e=>{try{return new Date(e.publishedAt).getTime()>t}catch{return!1}}).slice(0,1e3).map(e=>{let t;let s=n(e.title),r=n((e.tags??[]).slice(0,10).join(", "));try{t=new Date(e.publishedAt).toISOString()}catch{t=new Date().toISOString()}return`  <url>
    <loc>https://www.uru2.com/noticias/${e.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>DondeVeo Uruguay</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${t}</news:publication_date>
      <news:title>${s}</news:title>
      ${r?`<news:keywords>${r}</news:keywords>`:""}
    </news:news>
  </url>`}).join("\n");return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${s}
</urlset>`,{headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, max-age=1800, stale-while-revalidate=300"}})}let w=new r.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/news-sitemap.xml/route",pathname:"/news-sitemap.xml",filename:"route",bundlePath:"app/news-sitemap.xml/route"},resolvedPagePath:"C:\\Users\\jupit\\Desktop\\donde2.2\\app\\news-sitemap.xml\\route.ts",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:m,staticGenerationAsyncStorage:d,serverHooks:g}=w,h="/news-sitemap.xml/route";function x(){return(0,i.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:d})}},9303:(e,t,n)=>{e.exports=n(517)}};var t=require("../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),s=t.X(0,[948],()=>n(18));module.exports=s})();