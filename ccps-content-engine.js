import { BRAND_CTA, CONTENT_ROLES, HOOK_TYPES, NARRATIVE_TYPES } from "./ccps-rules.js";
import { runPreflight } from "./ccps-preflight.js";

export function differentDna(form, recent=[]) {
  const latest = recent.slice(0,2);
  const values = [form.content_role,form.hook_type,form.narrative_type,form.visual_type,form.CTA_type];
  const same = latest.length ? Math.max(...latest.map(p=>values.filter((v,i)=>v === [p.content_role,p.hook_type,p.narrative_type,p.visual_type,p.CTA_type][i]).length)) : 0;
  return {pass: 5-same >= 3, differences: 5-same};
}
export function rotateDna(form, recent=[]) {
  const next = (list,value,used) => list.find(x=>x!==value && !used.includes(x)) || list[(list.indexOf(value)+1)%list.length];
  return {...form,content_role:next(CONTENT_ROLES,form.content_role,recent.slice(0,2).map(x=>x.content_role)),hook_type:next(HOOK_TYPES,form.hook_type,recent.slice(0,2).map(x=>x.hook_type)),narrative_type:next(NARRATIVE_TYPES,form.narrative_type,recent.slice(0,2).map(x=>x.narrative_type))};
}
export function buildArticle(form,recent=[]) {
  const hook = `${form.topic}，真正要先看的不是宣傳，而是判斷順序。`;
  const body = `${hook}\n\nCCPS 怎麼判斷：先盤點目的、預算與持有時間，再依序比較區域條件、持有成本與退出彈性。\n\n優點是多一個海外配置選項；缺點是匯率、管理與資訊落差都要納入評估。適合願意先釐清需求再選案的人，不適合只看單一報酬數字就決定的人。\n\n提醒：政策、價格與市場資訊可能變動，實際決策前請確認最新條件。\n\n${form.comment_question || "你現在最想先查清楚哪一項？"}\n\n${BRAND_CTA}`;
  const dna=differentDna(form,recent);
  const checks=runPreflight({...form,body},recent);
  if (checks.fabricated_story_gate.startsWith("BLOCK")) return {blocked:true,code:checks.fabricated_story_gate,checks};
  return {blocked:false,role:form.content_role,hook,body,comment_question:form.comment_question,image_suggestion:form.visual_type,checks,why_different:`與最近兩篇有 ${dna.differences}/5 個內容指紋欄位不同`,dna_status:dna.pass?"PASS":"FAIL: LOW_CONTENT_DNA_VARIANCE",...form};
}
export function platformRewrite(article) {
  return {脆文:`${article.hook}\n${article.body.slice(0,180)}…\n${BRAND_CTA}`,LINE訊息:`${article.hook}\n想了解完整判斷清單，歡迎回覆你的問題。\n${BRAND_CTA}`,短影音口播:`開場：${article.hook}\n重點：${article.body.slice(0,140)}…\n行動呼籲：${BRAND_CTA}`};
}
