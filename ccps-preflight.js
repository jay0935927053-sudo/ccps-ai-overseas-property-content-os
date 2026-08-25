import { CLICHES, FABRICATED_PATTERNS, FRESH_TOPICS, SIMILARITY_THRESHOLDS } from "./ccps-rules.js";

const grams = text => {
  const clean = text.replace(/\s/g, "");
  const out = new Set();
  for (let i=0;i<clean.length-2;i++) out.add(clean.slice(i,i+3));
  return out;
};
function jaccard(a,b) {
  const A=grams(a), B=grams(b), union=new Set([...A,...B]);
  if (!union.size) return 0;
  return [...A].filter(x=>B.has(x)).length/union.size;
}
export function similarityScore(text, post) {
  const content = post.body || post.text || "";
  const lexical = jaccard(`${text.slice(0,80)}${text.slice(-120)}`, `${content.slice(0,80)}${content.slice(-120)}`);
  const structure = text.split(/\n\s*\n/).length === content.split(/\n\s*\n/).length ? .08 : 0;
  return Math.min(1, lexical + structure + (post.hook_type && text.includes(post.hook_type) ? .04 : 0));
}
export function runPreflight(input, recent=[]) {
  const text = input.body || "";
  const maxSimilarity = Math.max(0, ...recent.slice(0,20).map(p=>similarityScore(text,p)));
  const similarity_status = maxSimilarity >= SIMILARITY_THRESHOLDS.fail ? "FAIL" : maxSimilarity >= SIMILARITY_THRESHOLDS.warn ? "WARN" : "PASS";
  const cliches = CLICHES.filter(word=>text.includes(word));
  const fabricated = FABRICATED_PATTERNS.filter(rule=>rule.test(text)).map(rule=>rule.source);
  const evidence_gate = input.evidence_state === "VERIFIED_CURRENT" ? "PASS" : "EVIDENCE_REQUIRED";
  const fabricated_story_gate = fabricated.length && input.evidence_state !== "VERIFIED_CURRENT" ? "BLOCK: FABRICATED_REAL_WORLD_EVENT" : "PASS";
  const freshness_warning = FRESH_TOPICS.test(`${input.topic||""} ${text}`) && (!input.source_date || input.evidence_state !== "VERIFIED_CURRENT") ? "EVIDENCE_REQUIRED" : "PASS";
  const brand_pov = /CCPS.*(判斷|不建議|選案|盤點|流程)/s.test(text) ? "PASS" : "FAIL: NO_BRAND_POINT_OF_VIEW";
  const trade_off = /(優點.*缺點|適合.*不適合|機會.*成本|短期.*長期)/s.test(text) ? "PASS" : "WARN: SALESY_ONE_SIDED_CONTENT";
  return {evidence_gate,fabricated_story_gate,freshness_warning,similarity_score:Number(maxSimilarity.toFixed(3)),similarity_status,cliche_warnings:cliches,brand_pov,trade_off};
}

