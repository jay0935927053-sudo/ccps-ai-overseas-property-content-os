import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createHash } from "node:crypto";

const ROOT=path.resolve(import.meta.dirname,"..");
const BASE="https://ccps-my.com";
const DELAY=Number(process.env.CCPS_CRAWL_DELAY_MS || 20000);
const PER_PAGE=10;
const fetchedAt=new Date().toISOString();
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let lastFetch=0;

async function get(url,{json=false}={}) {
  const remaining=DELAY-(Date.now()-lastFetch); if(remaining>0) await wait(remaining);
  console.log(`FETCH ${url}`); lastFetch=Date.now();
  const response=await fetch(url,{headers:{"User-Agent":"CCPS-Official-Material-Importer/1.0 (+https://github.com/jay0935927053-sudo/ccps-ai-overseas-property-content-os)"}});
  if(!response.ok) throw new Error(`${response.status} ${url}`);
  return json?response.json():response.text();
}
const decode=s=>s.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#039;|&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">");
const cleanHtml=html=>decode(String(html||"").replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ")).replace(/\s+/g," ").trim();
const trimBoilerplate=body=>{const i=body.slice(0,900).lastIndexOf("講座報名");return i>=0?body.slice(i+4).trim():body;};
const urlsFrom=xml=>[...xml.matchAll(/<loc>(https:\/\/ccps-my\.com\/[^<]+)<\/loc>/g)].map(x=>decode(x[1])).filter(x=>!x.includes("/wp-content/"));
const excludeReason=(slug,title)=>{
  const value=decodeURIComponent(`${slug} ${title}`).toLowerCase();
  if(/^en_|^cn_|(?:_|-)cn\d*(?:_|-|$)|(?:_|-)en(?:_|-|$)/.test(slug)) return "TRANSLATION_DUPLICATE";
  if(/404|測試|test|elementor|模板|版型|new-home|new_the-conlay/.test(value)) return "TEMPLATE_OR_TEST";
  if(/privacy|隱私|個人資料|terms|服務條款|contact|聯絡|联络/.test(value)) return "LEGAL_FORM_OR_CONTACT";
  return "";
};
const materialType=(title,slug,body,kind)=>{
  const x=`${title} ${decodeURIComponent(slug)} ${body.slice(0,350)}`;
  if(kind==="page"&&/Pavilion|Wyndham|Golden Crown|Skylon|Skyline|Quill|Oxley|Orion|Eaton|Agile|Lido|Conlay|Papyrus|Residences|Square|SOHO|KLCC/i.test(title)) return "建案研究";
  if(kind==="post" && /活動|講座|說明會|紀實/.test(x)) return "活動";
  if(/租管|交屋|維修|租賃|帳務/.test(x)) return "CCPS 工作幕後";
  if(/FAQ|QA|問答|問題/.test(x)) return "客戶問題";
  if(/國際學校/.test(x)) return "國際學校";
  if(/MM2H|第二家園|PVIP/.test(x)) return "MM2H / PVIP";
  if(/建案|公寓|住宅|KLCC|Residences|Square|Conlay|Pavilion|Wyndham/.test(x)) return "建案研究";
  if(/區域|吉隆坡|檳城|新山|柔佛/.test(x)) return "區域分析";
  if(/政策|稅|匯率|市場|投資|房產/.test(x)) return "市場數據";
  if(/家慶佳業|CCPS|創辦人|執行長|團隊/.test(x)) return "顧問觀察";
  return "顧問觀察";
};
const freshness=x=>/MM2H|PVIP|稅|匯率|法規|房價|租金|政策|建案|投資|市場|上線|開發中/.test(x);
const hash=x=>createHash("sha256").update(x).digest("hex");

async function fetchAll(type) {
  const first=await get(`${BASE}/wp-json/wp/v2/${type}?per_page=${PER_PAGE}&page=1&_fields=id,link,slug,date,modified,status,title,content,excerpt`,{json:true});
  const total=type==="pages"?107:113; const pages=Math.ceil(total/PER_PAGE); const all=[...first];
  for(let page=2;page<=pages;page++) all.push(...await get(`${BASE}/wp-json/wp/v2/${type}?per_page=${PER_PAGE}&page=${page}&_fields=id,link,slug,date,modified,status,title,content,excerpt`,{json:true}));
  return all;
}

const pageMap=urlsFrom(await get(`${BASE}/page-sitemap.xml`));
const postMap=urlsFrom(await get(`${BASE}/post-sitemap.xml`));
const pages=await fetchAll("pages");
const posts=await fetchAll("posts");
const expected=new Set([...pageMap,...postMap].map(x=>new URL(x).pathname.replace(/\/$/,"")||"/"));
const seen=new Map(); const materials=[]; const registry=[];
for(const [kind,items] of [["page",pages],["post",posts]]) for(const item of items) {
  const title=cleanHtml(item.title?.rendered); const body=trimBoilerplate(cleanHtml(item.content?.rendered)); const reason=excludeReason(item.slug,title);
  const digest=hash(body.slice(0,12000)); const duplicateOf=body.length>120 && seen.get(digest); if(!duplicateOf&&body.length>120) seen.set(digest,item.link);
  const status=reason?"DO_NOT_USE":duplicateOf?"DO_NOT_USE":body.length<80?"DO_NOT_USE":"REUSE";
  const finalReason=reason||(duplicateOf?"DUPLICATE_BODY":body.length<80?"INSUFFICIENT_CONTENT":"");
  const record={id:`ccps-web-${item.id}`,content_type:kind,title,source:item.link,source_date:item.modified||item.date,fetched_at:fetchedAt,status,reason:finalReason,duplicate_of:duplicateOf||null};
  registry.push(record);
  if(status==="REUSE") materials.push({...record,type:materialType(title,item.slug,body,kind),body:body.slice(0,2400),evidence_state:"VERIFIED_CURRENT",region:/吉隆坡|KLCC/i.test(body)?"吉隆坡":/新山|柔佛/i.test(body)?"新山／柔佛":/檳城/i.test(body)?"檳城":"馬來西亞",property:"",client_type:"海外置產客戶",tags:[kind,"CCPS官網",item.slug],freshness_required:freshness(`${title} ${body}`),privacy_note:"公開官網內容；不含表單與使用者提交資料",source_scope:"官網當日公開陳述，不代表第三方事實已獨立查證"});
}
const apiPaths=new Set(registry.map(x=>new URL(x.source).pathname.replace(/\/$/,"")||"/"));
for(const source of [...pageMap,...postMap]) {const p=new URL(source).pathname.replace(/\/$/,"")||"/";if(!apiPaths.has(p)) registry.push({id:`sitemap-${hash(source).slice(0,12)}`,content_type:"unknown",title:"Sitemap URL",source,source_date:null,fetched_at:fetchedAt,status:"UNKNOWN",reason:"SITEMAP_API_MISMATCH",duplicate_of:null});}
fs.mkdirSync(path.join(ROOT,"data"),{recursive:true});
fs.writeFileSync(path.join(ROOT,"data/ccps-official-materials.json"),JSON.stringify({schema_version:1,source:BASE,fetched_at:fetchedAt,count:materials.length,materials},null,2)+"\n");
fs.writeFileSync(path.join(ROOT,"data/ccps-official-source-registry.json"),JSON.stringify({schema_version:1,source:BASE,fetched_at:fetchedAt,sitemap_count:expected.size,registry_count:registry.length,registry},null,2)+"\n");
console.log(`DONE sitemap=${expected.size} registry=${registry.length} reusable=${materials.length}`);
