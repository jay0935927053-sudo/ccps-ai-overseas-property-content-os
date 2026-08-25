import { BRAND_CTA } from "./ccps-rules.js";

export const PLATFORM_ASSET_TYPES = ["FB 單張圖片", "IG 五張輪播", "YouTube 封面", "影片腳本與分鏡"];
export const VIDEO_DURATIONS = [15, 30, 60];
export const VIDEO_STYLES = ["顧問直說", "避坑清單", "區域導覽", "數據解讀", "客戶問答", "A／B 比較", "幕後紀錄", "故事情境"];
export const ASPECT_RATIOS = ["9:16 直式短影音", "16:9 YouTube 橫式", "1:1 社群方形", "4:5 動態貼文"];

const clean = value => String(value || "海外置產判斷").replace(/\s+/g, " ").trim();
const baseVisual = (article, ratio) => `主題：${clean(article.topic)}；核心觀點：${clean(article.hook)}；CCPS 家慶佳業品牌視覺，深海軍藍、青綠與低調金色，台灣繁體中文，專業可信、真實房產顧問感，馬來西亞城市與住宅情境，${ratio}，保留清楚標題安全區；禁止誇大報酬、虛構客戶、假造文件、錯字、浮水印與其他品牌 Logo。`;

export function buildFacebookImagePrompt(article, options={}) {
  return `【FB 單張圖片提示詞】\n${baseVisual(article, options.aspect_ratio || ASPECT_RATIOS[2])}\n主標題：${clean(article.topic)}\n構圖：一個明確視覺焦點，搭配區域地圖、真實建築或顧問判斷清單；資訊層級適合手機閱讀。\n貼文方向：先判斷、再選案。\n品牌署名：CCPS 家慶佳業。`;
}

export function buildInstagramCarouselPrompts(article, options={}) {
  const frames=[
    ["封面", clean(article.topic), "城市或住宅主視覺，強烈但不聳動的問題式封面"],
    ["判斷起點", "先釐清目的、預算與持有時間", "顧問筆記、三項條件圖示與乾淨資訊卡"],
    ["比較重點", "區域條件、持有成本、退出彈性", "三欄比較圖、區域地圖與住宅細節"],
    ["風險提醒", "匯率、管理與資訊落差都要評估", "風險清單與克制的警示視覺"],
    ["行動頁", BRAND_CTA, "CCPS 品牌收尾、留言提問與清楚 CTA"]
  ];
  return `【IG 五張輪播提示詞】\n整組規格：1080×1350、4:5、相同網格與品牌色、繁體中文、每張只傳達一個重點。\n\n${frames.map(([role,title,visual],i)=>`第 ${i+1} 張｜${role}\n文字：${title}\n畫面：${visual}。${baseVisual(article,options.aspect_ratio||ASPECT_RATIOS[3])}`).join("\n\n")}`;
}

export function buildYoutubeThumbnailPrompt(article) {
  return `【YouTube 封面提示詞】\n${baseVisual(article,ASPECT_RATIOS[1])}\n尺寸：1280×720。主標題控制 6–10 個中文字：${clean(article.topic)}。右側保留人物或建築主體，左側放高對比標題；縮小後仍可辨識。使用真實、理性的顧問表情或馬來西亞城市地標；禁止收益保證、紅圈箭頭氾濫與誤導性豪宅拼貼。`;
}

export function buildVideoPackage(article, options={}) {
  const duration=VIDEO_DURATIONS.includes(Number(options.duration))?Number(options.duration):30;
  const count={15:5,30:7,60:10}[duration];
  const style=VIDEO_STYLES.includes(options.video_style)?options.video_style:VIDEO_STYLES[0];
  const ratio=options.aspect_ratio||ASPECT_RATIOS[0];
  const beats=["痛點開場","提出判斷框架","目的與預算","區域條件","持有成本","退出彈性","風險提醒","適合對象","留言互動","品牌 CTA"];
  const seconds=duration/count;
  const rows=Array.from({length:count},(_,i)=>{
    const start=Math.round(i*seconds*10)/10,end=Math.round((i+1)*seconds*10)/10;
    const beat=i===count-1?"品牌 CTA":beats[i];
    const voice=i===0?clean(article.hook):i===count-1?BRAND_CTA:`${beat}：用一個具體判斷重點說明，不承諾收益。`;
    return `鏡 ${i+1}｜${start}–${end} 秒｜${beat}\n畫面：馬來西亞房產實景、地圖、文件或顧問工作畫面；避免假客戶情節。\n鏡位：${i%3===0?"中近景緩慢推進":i%3===1?"俯拍資訊卡與文件":"廣角環境建立鏡頭"}\n字幕：${voice}\n口白：${voice}\n分鏡圖提示詞：${baseVisual(article,ratio)} 本鏡重點為「${beat}」，${style}風格，電影感自然光，畫面內文字保持最少。`;
  });
  return `【${duration} 秒影片腳本與逐鏡分鏡】\n影片風格：${style}\n畫面比例：${ratio}\n腳本結構：開場問題 → 判斷框架 → 風險邊界 → 品牌 CTA\n\n${rows.join("\n\n")}`;
}

export function generatePlatformAsset(article, options={}) {
  if(options.asset_type===PLATFORM_ASSET_TYPES[0]) return buildFacebookImagePrompt(article,options);
  if(options.asset_type===PLATFORM_ASSET_TYPES[1]) return buildInstagramCarouselPrompts(article,options);
  if(options.asset_type===PLATFORM_ASSET_TYPES[2]) return buildYoutubeThumbnailPrompt(article,options);
  return buildVideoPackage(article,options);
}
