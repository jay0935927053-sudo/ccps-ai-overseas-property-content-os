import { BRAND_CTA } from "./ccps-rules.js";

export const GPT_ENDPOINT = "https://api.openai.com/v1/responses";
export const GPT_MODEL = "gpt-5.6-terra";
export const GPT_REASONING_EFFORT = "low";
export const GPT_MAX_OUTPUT_TOKENS = 8000;

export const ALLOWED_MATERIAL_PRIVACY = Object.freeze([
  "無個資，可作公開內容候選",
  "已匿名化客戶資料"
]);

export const BLOCKED_MATERIAL_PRIVACY = Object.freeze([
  "含內部資訊，禁止公開",
  "含客戶個資，需先移除",
  "僅供內部研究",
  "需主管確認公開範圍"
]);

const ARTICLE_FIELD_LABELS = Object.freeze({
  topic: "主題",
  category: "內容分類",
  content_role: "文章角色",
  hook_type: "開場方式",
  narrative_type: "敘事結構",
  goal: "文章目標",
  visual_type: "圖片類型",
  comment_question: "留言問題"
});

const BRAND_FIELD_LABELS = Object.freeze({
  brandPosition: "品牌定位",
  brandArea: "服務區域",
  brandAudience: "核心客群",
  brandTone: "品牌語氣",
  brandPrinciples: "品牌原則",
  brandForbidden: "禁用話術"
});

const VOICE_FIELD_LABELS = Object.freeze({
  voiceTone: "品牌常用語氣",
  voiceColloquial: "可接受口語程度",
  voicePerson: "第一／第三人稱",
  voiceWords: "常用詞",
  voiceForbidden: "禁用人工智慧套話",
  voiceNever: "品牌不能說的話",
  voicePrinciples: "品牌核心原則",
  voiceExamples: "寫作範例類型"
});

export class GptAdapterError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "GptAdapterError";
    this.code = code;
  }
}

const line = (label, value) => `${label}：${String(value || "未設定").trim() || "未設定"}`;
const serializeFields = (labels, values = {}) => Object.entries(labels).map(([key, label]) => line(label, values[key])).join("\n");

export function materialCloudEligibility(material) {
  if (!material) return { pass: true, code: "NO_MATERIAL_SELECTED" };
  if (material.visibility === "internal_only") return { pass: false, code: "MATERIAL_INTERNAL_ONLY" };
  if (material.visibility && material.visibility !== "public_candidate") return { pass: false, code: "MATERIAL_VISIBILITY_NOT_APPROVED" };
  if (BLOCKED_MATERIAL_PRIVACY.includes(material.privacy_note)) return { pass: false, code: "MATERIAL_PRIVACY_BLOCKED" };
  if (material.privacy_note && !ALLOWED_MATERIAL_PRIVACY.includes(material.privacy_note)) return { pass: false, code: "MATERIAL_PRIVACY_UNKNOWN" };
  if (!material.visibility && !ALLOWED_MATERIAL_PRIVACY.includes(material.privacy_note)) return { pass: false, code: "MATERIAL_CLOUD_PERMISSION_MISSING" };
  return { pass: true, code: "MATERIAL_ALLOWED" };
}

export function buildSystemPrompt() {
  return `你是 CCPS 家慶佳業的海外置產內容總監，專長是馬來西亞置產、跨境資產配置與台灣社群內容。輸出必須使用繁體中文，語氣專業、自然、具體、可執行，不使用浮誇成功學或人工智慧套話。你必須同時說明優點、限制、適合與不適合的對象；不得保證獲利、租金、增值、簽證、轉售或任何投資結果；不得杜撰客戶、成交、會議、現場紀錄、價格、政策、法規、稅率或投報數字。結尾只能使用「${BRAND_CTA}」。`;
}

function serializeMaterial(material) {
  if (!material) return "本次未選用素材；不得自行假設客戶、成交或現場故事。";
  return [
    line("素材標題", material.title),
    line("素材內容", material.body),
    line("素材來源", material.source),
    line("來源日期", material.source_date),
    line("證據狀態", material.evidence_state),
    line("時效性提醒", material.freshness_required ? "需要重新查證" : "一般資料")
  ].join("\n");
}

export function buildUserPrompt({ form, brand, voice, material }) {
  const eligibility = materialCloudEligibility(material);
  if (!eligibility.pass) throw new GptAdapterError(eligibility.code, "所選素材不可傳送到雲端，請改選可公開或已匿名化素材。");
  return `請依照以下已選條件，產生一篇可直接發布前送審的 CCPS 臉書信任文章。

【文章任務】
${serializeFields(ARTICLE_FIELD_LABELS, form)}

【品牌人設】
${serializeFields(BRAND_FIELD_LABELS, brand)}

【寫作指紋】
${serializeFields(VOICE_FIELD_LABELS, voice)}

【本次選用素材】
${serializeMaterial(material)}

【硬性生成規則】
1. 必須依「文章角色：${form.content_role}」決定觀點與內容任務，不得只把它當作標籤。
2. 第一段必須採用「開場方式：${form.hook_type}」，25 字內建立明確問題或張力。
3. 全文必須依「敘事結構：${form.narrative_type}」推進，各段功能要清楚但不要輸出英文框架標籤。
4. 素材只能作為本篇依據；證據狀態不是 VERIFIED_CURRENT 或標記需要重新查證時，必須保留查證界線，不得寫成已確認事實。
5. 提供 CCPS 的具體判斷，兼顧優點、缺點、適合對象、不適合對象與下一步。
6. 自然帶入留言問題，不得使用假見證、恐懼、稀缺或倒數逼迫成交。
7. 只輸出文章正文，不要輸出分析、提示詞、Markdown 程式碼框或額外區塊標題。
8. 最後一行必須且只能是：${BRAND_CTA}`;
}

export function buildRequestBody(context) {
  return {
    model: GPT_MODEL,
    instructions: buildSystemPrompt(),
    input: buildUserPrompt(context),
    max_output_tokens: GPT_MAX_OUTPUT_TOKENS,
    stream: true,
    reasoning: { effort: GPT_REASONING_EFFORT }
  };
}

function createStreamParser(onText) {
  let buffer = "";
  let output = "";
  const consume = chunk => {
    buffer += chunk;
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const rawLine of lines) {
      const lineText = rawLine.trim();
      if (!lineText.startsWith("data:")) continue;
      const data = lineText.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const event = JSON.parse(data);
        const text = event.type === "response.output_text.delta" ? event.delta : event.type === "response.output_text.done" && !output ? event.text : "";
        if (text) {
          output += text;
          onText(text);
        }
      } catch {
        // Ignore non-JSON SSE heartbeat events.
      }
    }
  };
  return { consume, result: () => output.trim() };
}

export async function requestGptArticle({ apiKey, form, brand, voice, material, fetchImpl = fetch, onText = () => {} }) {
  if (!apiKey || !apiKey.trim()) throw new GptAdapterError("MISSING_API_KEY", "請先輸入 OpenAI 應用程式金鑰。");
  const body = buildRequestBody({ form, brand, voice, material });
  let response;
  try {
    response = await fetchImpl(GPT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify(body)
    });
  } catch {
    throw new GptAdapterError("API_NETWORK_ERROR", "無法連線內容生成服務，請稍後再試。");
  }
  if (!response?.ok) throw new GptAdapterError("API_RESPONSE_ERROR", `內容生成服務暫時無法使用（${response?.status || "未知狀態"}）。`);
  if (!response.body?.getReader) throw new GptAdapterError("API_STREAM_ERROR", "內容生成服務沒有傳回可讀取的內容。");
  const parser = createStreamParser(onText);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    parser.consume(decoder.decode(value, { stream: true }));
  }
  parser.consume(decoder.decode() + "\n");
  const text = parser.result();
  if (!text) throw new GptAdapterError("EMPTY_API_OUTPUT", "內容生成服務已回應，但沒有產生文章文字。");
  return text;
}
