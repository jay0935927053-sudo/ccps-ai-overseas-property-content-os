import { BRAND_CTA, CONTENT_ROLES, HOOK_TYPES, NARRATIVE_TYPES } from "./ccps-rules.js";
import { runPreflight } from "./ccps-preflight.js";

export function differentDna(form, recent=[]) {
  const latest = recent.slice(0,2);
  const values = [form.content_role,form.hook_type,form.narrative_type,form.evidence_state,form.visual_type,form.CTA_type];
  const same = latest.length ? Math.max(...latest.map(p=>values.filter((v,i)=>v === [p.content_role,p.hook_type,p.narrative_type,p.evidence_type,p.visual_type,p.CTA_type][i]).length)) : 0;
  return {pass: 6-same >= 4, differences: 6-same};
}
export function rotateDna(form, recent=[]) {
  const next = (list,value,used) => list.find(x=>x!==value && !used.includes(x)) || list[(list.indexOf(value)+1)%list.length];
  return {...form,content_role:next(CONTENT_ROLES,form.content_role,recent.slice(0,2).map(x=>x.content_role)),hook_type:next(HOOK_TYPES,form.hook_type,recent.slice(0,2).map(x=>x.hook_type)),narrative_type:next(NARRATIVE_TYPES,form.narrative_type,recent.slice(0,2).map(x=>x.narrative_type))};
}
export function buildArticle(form,recent=[]) {
  if (form.evidence_state !== "VERIFIED_CURRENT" || !form.evidence.trim()) return {blocked:true,code:"EVIDENCE_REQUIRED"};
  const hook = `${form.topic}，真正要先看的不是宣傳，而是判斷順序。`;
  const body = `${hook}\n\n${form.evidence.trim()}\n\nCCPS 怎麼判斷：先盤點目的、預算與持有時間，再核對來源與退出條件。\n\n優點是多一個海外配置選項；缺點是匯率、持有成本與資訊落差都要先算。適合願意做完整查核的人，不適合只看單一報酬數字就決定的人。\n\n${form.comment_question || "你現在最想先查清楚哪一項？"}\n\n${BRAND_CTA}`;
  const dna=differentDna(form,recent);
  const checks=runPreflight({...form,body},recent);
  if (checks.fabricated_story_gate.startsWith("BLOCK")) return {blocked:true,code:checks.fabricated_story_gate,checks};
  return {blocked:false,role:form.content_role,hook,body,comment_question:form.comment_question,image_suggestion:form.visual_type,evidence_status:form.evidence_state,checks,why_different:`與最近兩篇有 ${dna.differences}/6 個 Content DNA 欄位不同`,dna_status:dna.pass?"PASS":"FAIL: LOW_CONTENT_DNA_VARIANCE",...form,evidence_type:form.evidence_state};
}
export function platformRewrite(article) {
  return {Threads:`${article.hook}\n${article.body.slice(0,180)}…\n${BRAND_CTA}`,LINE:`${article.hook}\n想了解完整判斷清單，歡迎回覆你的問題。\n${BRAND_CTA}`,Reels:`開場：${article.hook}\n重點：${article.body.slice(0,140)}…\nCTA：${BRAND_CTA}`};
}

