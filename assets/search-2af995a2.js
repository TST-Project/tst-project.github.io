import{s as d,h as p,D as g}from"./hyphenate-65d9bac0.js";/* empty css                          *//* empty css              */import{S as y}from"./index-311b339f.js";import{Sanscript as r}from"https://tst-project.github.io/lib/js/sanscript.mjs";const f=async t=>{document.getElementById("spinner").style.display="flex";const e=await d("/mss/db/fts.db"),s=t.replaceAll("ए","ऎ").replaceAll("ओ","ऒ").replaceAll("े","ॆ").replaceAll("ो","ॊ"),n=r.t(r.t(s,"tamil","iast"),"devanagari","iast").replace(/^⁰|([^\d⁰])⁰/g,"$1¹⁰"),o=y.escape(n).replace(/"/g,'""').replace(/^'/,`'"`).replace(/'$/,`"'`),l=await e.db.exec(`SELECT filename, shelfmark, title, snippet(fulltext,3,'<span class="highlit">','</span>','…',200) AS snippet FROM fulltext WHERE text MATCH ${o} ORDER BY rank`);if(document.getElementById("spinner").style.display="none",l.length===0){document.getElementById("noresulttext").textContent=n,document.getElementById("noresult").style.visibility="visible";return}const c=l[0].values.map(a=>{const u=`<a href="/mss/${a[0]}" class="shelfmark">${a[1]}</a>`,m=p(a[2]);return[u,m,a[3]]});document.getElementById("index").style.visibility="visible",new g("#index",{searchable:!0,language:{search:"Filter:"},paging:!0,pageLength:100,lengthMenu:[[25,50,100,-1],[25,50,100,"All"]],sortable:!0,scrollX:!0,data:c,columns:[{title:"shelfmark",type:"shelfmark"},{title:"title",type:"tamil"},{title:"search result"}]})},i=t=>{const e=new URLSearchParams(window.location.search);e.set("q",t),window.location.search=e};document.getElementById("ftsinput").addEventListener("keyup",t=>{if(event.keyCode!==13)return;const e=t.target.value.trim();e!==""&&i(e)});document.getElementById("ftsbutton").addEventListener("click",t=>{const e=document.getElementById("ftsinput").value.trim();e!==""&&i(e)});const h=t=>{const e=document.getElementById("ftsinput"),n=new URLSearchParams(window.location.search).get("q");n&&(e.value=n,f(n)),e.style.visibility="visible"};window.addEventListener("DOMContentLoaded",h);
