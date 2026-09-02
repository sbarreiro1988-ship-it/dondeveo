"use strict";(()=>{var e={};e.id=163,e.ids=[163],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7147:e=>{e.exports=require("fs")},7923:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>x,patchFetch:()=>f,requestAsyncStorage:()=>m,routeModule:()=>d,serverHooks:()=>h,staticGenerationAsyncStorage:()=>g});var r={};n.r(r),n.d(r,{GET:()=>w,dynamic:()=>i,revalidate:()=>l,runtime:()=>u});var s=n(9303),a=n(8716),o=n(3131);let i="force-dynamic",l=0,u="nodejs";async function p(){let e=process.env.NEWS_FILE_PATH;if(e)try{let t=(await Promise.resolve().then(n.t.bind(n,7147,23))).readFileSync(`${e}/index.json`,"utf8");return JSON.parse(t).articles??[]}catch{}let t=process.env.NEWS_DATA_URL;if(t)try{let e=await fetch(`${t}/index.json`,{next:{revalidate:0},signal:AbortSignal.timeout(5e3)});if(e.ok)return(await e.json()).articles??[]}catch{}return[]}function c(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}async function w(){let e=await p(),t=Date.now()-1728e5,n=e.filter(e=>{try{return new Date(e.publishedAt).getTime()>=t}catch{return!1}}).map(e=>{let t=(e.tags??[]).join(", ");return`  <url>
    <loc>https://www.uru2.com/noticias/${c(e.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>DondeVeo Uruguay</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${function(e){try{return new Date(e).toISOString()}catch{return new Date().toISOString()}}(e.publishedAt)}</news:publication_date>
      <news:title>${c(e.title)}</news:title>
      ${t?`<news:keywords>${c(t)}</news:keywords>`:""}
    </news:news>
  </url>`}).join("\n");return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${n}
</urlset>`,{headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"no-cache, no-store"}})}let d=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/news-sitemap.xml/route",pathname:"/news-sitemap.xml",filename:"route",bundlePath:"app/news-sitemap.xml/route"},resolvedPagePath:"/home/runner/work/dondeveo/dondeveo/app/news-sitemap.xml/route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:m,staticGenerationAsyncStorage:g,serverHooks:h}=d,x="/news-sitemap.xml/route";function f(){return(0,o.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:g})}},9303:(e,t,n)=>{e.exports=n(517)}};var t=require("../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),r=t.X(0,[948],()=>n(7923));module.exports=r})();