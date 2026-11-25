// Regenerate the committed static pages. No external packages required.
const fs=require("node:fs"),path=require("node:path");const root=path.resolve(__dirname,"..");const read=p=>fs.readFileSync(path.join(root,p),"utf8");const config=JSON.parse(read("site/catalog.json"));config.exampleBank=JSON.parse(read("site/examples.json"));
function generateSite(config,template,app,i18n){
 const {origin,langs,groups,catalog,labels}=config;
 const dict={};for(const m of i18n.matchAll(/const\s+\w+\s*=\s*(\{"en":\{.*?\}\})(?=;)/g)){try{const obj=JSON.parse(m[1]);for(const l of langs)Object.assign(dict[l]??={},obj[l]||{})}catch{}}
 if(!dict.en?.Solve||!dict.de?.["Method and applicability"])throw Error("Cannot load shared translations");
 const th=app.match(/const methodTheory=\{(.*?)\};/s)?.[1];if(!th)throw Error("Cannot locate theory");const theory={};for(const m of th.matchAll(/(\w+):(\[(?:"(?:[^"\\]|\\.)*"\s*,?\s*)+\])/g))theory[m[1]]=JSON.parse(m[2]);
 const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
 const route=(l,slug="")=>"/"+(l==="en"?"":l+"/")+(slug?slug+"/":"");
 const files={},urls=[];
 const header=template.match(/<header>.*?<\/header>/s)?.[0],layout=template.match(/<div class="layout">.*?<\/section><\/div><section id="report".*?<\/section>/s)?.[0];
 if(!header||!layout)throw Error("Template structure changed");
 const native={en:"English",ru:"Русский",fr:"Français",uk:"Українська",de:"Deutsch"};
 for(const [i,l] of langs.entries()){
 const tr=k=>dict[l]?.[k]||k,lab=k=>labels[k][i],url=slug=>route(l,slug),methodLink=m=>`<a href="${url(m[1])}">${esc(m[3][i])}</a>`;
 for(const item of [null,...catalog]){
 const slug=item?.[1]||"",id=item?.[0]||"",path=url(slug),title=item?item[3][i]+" "+lab("titleSuffix")+" | CMVI":lab("home")+" | CMVI",desc=item?item[4][i]:lab("homeDesc"),h1=item?item[3][i]:lab("home");
 const alternatives=langs.map(k=>`<link rel="alternate" hreflang="${k}" href="${origin+route(k,slug)}">`).join("")+`<link rel="alternate" hreflang="x-default" href="${origin+route("en",slug)}">`;
 let head=`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${origin+path}">${alternatives}<meta property="og:type" content="website"><meta property="og:site_name" content="CMVI"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${origin+path}"><script src="/i18n.js"></script><script src="/theme.js"></script><link rel="stylesheet" href="/styles.css">${item?'<script src="/math.js"></script><script src="/examples.js"></script><script defer src="/app.js"></script>':""}`;
 let hdr=header.replace("</a><div class=\"header-tools\">",`</a><a class="site-home" href="${url("")}" aria-label="${esc(lab("all"))}">CMVI</a><div class="header-tools">`).replace(/<span id="language-current"[^>]*>.*?<\/span>/,`<span id="language-current" aria-hidden="true">${l.toUpperCase()}</span>`).replace(/<select id="language-select".*?<\/select>/s,`<select id="language-select" aria-label="${esc(tr("Language"))}">${langs.map(k=>`<option value="${k}" data-url="${route(k,slug)}"${k===l?" selected":""}>${native[k]}</option>`).join("")}</select>`);
 const nav=`<nav class="breadcrumbs" aria-label="${esc(lab("all"))}"><a href="${url("")}">${esc(lab("all"))}</a>${item?` <span aria-hidden="true">/</span> <span>${esc(groups[item[2]][i])}</span>`:""}</nav>`;
 let main=`${item?nav:""}<div class="intro"><small>${esc(tr("COMPUTATIONAL MATHEMATICS"))}</small><h1>${esc(h1)}</h1><p>${esc(desc)}</p></div>`;
 if(!item){
 main+=groups.map((g,gi)=>`<section class="catalog-group"><h2>${esc(g[i])}</h2><div class="catalog-grid">${catalog.filter(m=>m[2]===gi).map(m=>`<a class="method-card" href="${url(m[1])}"><h3>${esc(m[3][i])}</h3><p>${esc(m[4][i])}</p><span aria-hidden="true">↗</span></a>`).join("")}</div></section>`).join("");
 }else{
 const eb=config.exampleBank,ex=eb.methods[id],el=k=>eb.labels[k][i];const selector=`<div class="example-picker" data-static><label for="example-select">${esc(el("chooseExample"))}</label><select id="example-select">${ex.map((e,k)=>`<option value="${esc(e.id)}">${esc(el(e.level))} ${k+1} — ${esc(e.problem)}</option>`).join("")}</select><p class="matrix-help">${esc(el("exampleHelp"))}</p><p id="example-loaded" role="status" hidden>${esc(el("loaded"))}</p></div>`;const cards=ex.map((e,k)=>`<article class="example-card" data-static><h3>${esc(el(e.level))} ${k+1}</h3><p class="example-math">${esc(e.problem)}</p><p><strong>${esc(el("expected"))}:</strong> ${esc(e.answer)}</p>${e.steps?.length?`<details><summary>${esc(lab("steps"))}</summary><ol class="example-steps">${e.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol></details>`:""}${e.note?`<p class="matrix-help">${esc(eb.notes[e.note][i])}</p>`:""}<p class="example-source">${esc(el("source"))}: ${e.source?`<a href="${esc(e.source.url)}">${esc(e.source.name)}</a>`:esc(el("custom"))}</p><button type="button" class="load-example" data-example="${esc(e.id)}">${esc(el("loadExample"))}</button></article>`).join("");
 const tt=theory[id];if(!tt)throw Error("Missing theory "+id);
 const staticTheory=`<div id="theory" class="method-theory" data-static="true"><details><summary>${esc(tr("Method and applicability"))}</summary>${tt.map((v,k)=>k===1?`<div class="theory-formula">${config.formulas[id]}</div>`:`<${k===0?"h3":"p"}>${esc(tr(v))}</${k===0?"h3":"p"}>`).join("")}</details></div>`;
 let calc=layout.replace('<label>Choose a method<select id="method"></select></label>',`<h2 class="calculator-heading">${esc(lab("calculator"))}</h2><select id="method" hidden aria-hidden="true" tabindex="-1"><option value="${id}" selected>${esc(h1)}</option></select>`);
 calc=calc.replace('<div id="fields"></div>',selector+staticTheory+'<div id="fields"></div>').replace('>Solve</button>',`>${esc(tr("Solve"))}</button>`).replace('>Reset example</button>',`>${esc(tr("Reset example"))}</button>`).replace('<h2>Results</h2>',`<h2>${esc(tr("Results"))}</h2>`).replace('>Export JSON</button>',`>${esc(tr("Export JSON"))}</button>`).replace('>Save report</button>',`>${esc(tr("Save report"))}</button>`).replace('>Print / PDF</button>',`>${esc(tr("Print / PDF"))}</button>`).replace('<h2>Solution report</h2>',`<h2>${esc(tr("Solution report"))}</h2>`);
 main+=`<noscript><p>${esc(lab("noscript"))}</p></noscript>${calc}<section class="example-section" id="examples"><h2>${esc(el("exampleBank"))}</h2><div class="example-grid">${cards}</div><h3>${esc(lab("pitfalls"))}</h3><p>${esc(config.pitfalls[id][i])}</p><h3>${esc(lab("references"))}</h3><ul class="references">${config.references.filter((_,r)=>r<2||[0,2].includes(item[2])).map(([name,href])=>`<li><a href="${esc(href)}">${esc(name)}</a></li>`).join("")}</ul>${id==="lagrange"?`<p><a href="https://lagrange.kramarenko.info/">${esc(lab("special"))}</a></p>`:""}</section>`;
 let related=catalog.filter(m=>m!==item&&m[2]===item[2]);if(!related.length)related=catalog.filter(m=>["gauss","newton","lagrange","trap"].includes(m[0])&&m!==item).slice(0,3);
 main+=`<nav class="related-methods"><h2>${esc(lab("related"))}</h2><div>${related.map(methodLink).join("")}<a href="${url("")}">${esc(lab("all"))}</a></div></nav>`;
 }
 main+=`<footer class="site-languages"><nav aria-label="${esc(lab("languages"))}">${langs.map(k=>`<a lang="${k}" hreflang="${k}" href="${route(k,slug)}"${k===l?' aria-current="page"':""}>${native[k]}</a>`).join("")}</nav></footer>`;
 const html=`<!doctype html><html lang="${l}" data-site-locale="${l}"${id?` data-method="${id}"`:""}><head>${head}</head><body>${hdr}<main>${main}</main></body></html>\n`;
 files["web"+path+"index.html"]=html;urls.push({l,slug,path});
 }}
 files["web/sitemap.xml"]=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map(({path,slug})=>`<url><loc>${origin+path}</loc>${langs.map(l=>`<xhtml:link rel="alternate" hreflang="${l}" href="${origin+route(l,slug)}"/>`).join("")}<xhtml:link rel="alternate" hreflang="x-default" href="${origin+route("en",slug)}"/></url>`).join("\n")}\n</urlset>\n`;
 files["web/robots.txt"]=`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`;
 files["web/math.js"]="window.cmviMath = "+JSON.stringify(config.formulas)+";\n";
 files["web/examples.js"]="window.cmviExamples = "+JSON.stringify(config.exampleBank.methods)+";\n";
 return files;
}
const files=generateSite(config,read("site/template.html"),read("web/app.js"),read("web/i18n.js"));for(const [p,s] of Object.entries(files)){let f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,s)}console.log("Generated "+Object.keys(files).length+" files");
