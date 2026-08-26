export const CONTENT_ROLES = ["共鳴故事","專業判斷","反常識","避坑","幕後","案例","轉換"];
export const ARTICLE_TOPICS = [
  "吉隆坡置產怎麼判斷",
  "台灣家庭第一次買馬來西亞房產要先看什麼",
  "吉隆坡核心區與新興區怎麼選",
  "KLCC 與 TRX 適合哪種買家",
  "Mont Kiara 適合自住還是收租",
  "新山 RTS 沿線置產怎麼評估",
  "馬來西亞永久產權與租賃產權差在哪",
  "預售屋、新成屋與二手屋怎麼選",
  "海外房產持有成本怎麼估",
  "海外置產匯率風險怎麼看",
  "租金報酬不能只看表面數字",
  "海外房產出租代管要注意什麼",
  "建商與建案風險怎麼查",
  "海外購屋合約有哪些關鍵條款",
  "馬來西亞房產退出與轉售怎麼規劃",
  "MM2H 與買房要分開判斷",
  "子女國際教育與置產怎麼一起規劃",
  "退休第二生活圈的真實成本",
  "高資產家庭如何分散單一市場風險",
  "海外置產適合哪些台灣家庭"
];
export const IMAGE_TYPES = [
  "真實文件與區域地圖",
  "區域生活圈地圖",
  "建案外觀與周邊街景",
  "交通節點與通勤路線",
  "格局圖與空間重點",
  "持有成本比較圖表",
  "優缺點檢查清單",
  "顧問現場實拍"
];
export const COMMENT_QUESTIONS = [
  "你評估海外置產時，最想先查清楚哪一項？",
  "你目前最在意區域、總價、租金還是退場？",
  "你會先考慮自住、收租，還是家庭第二生活圈？",
  "哪一個海外置產風險最讓你猶豫？",
  "想看哪個馬來西亞區域或建案的下一篇分析？"
];
export const CONTENT_CATEGORIES = ["馬來西亞置產","吉隆坡區域分析","建案研究","海外置產避坑","客戶常見問題","成交案例","CCPS 辦公室日常","團隊幕後","海外資產配置","第二生活圈","MM2H／PVIP","國際學校","說明會／活動","客戶諮詢","房市觀察"];
export const HOOK_TYPES = ["情境開場","客戶問題","數字衝突","反常識","自我質疑","兩難選擇","直接結論","現場紀錄","錯誤 / 失敗"];
export const NARRATIVE_TYPES = ["Scene → Conflict → Judgment → Lesson","Contrarian → Evidence → Boundary → Conclusion","Question → Decision Tree → Recommendation","Mistake → Cost → Correction → Checklist","Case → Turning Point → Decision → Result","Behind-the-scenes → Invisible Work → Client Value","Data → Meaning → What It Does NOT Mean → Decision","A vs B → Comparison → Fit","Diary → Observation → Reflection","Myth → Why → Reality → Exception"];
export const MATERIAL_TYPES = ["客戶問題","真實成交案例","建案研究","區域分析","市場數據","政策資料","CCPS 工作幕後","顧問觀察","說明會","活動","國際學校","第二生活圈","MM2H／PVIP","真實照片","真實文件"];
export const EVIDENCE_STATES = ["VERIFIED_CURRENT","MEMORY_DERIVED","UNKNOWN"];
export const FRESH_TOPICS = /MM2H|PVIP|稅務|匯率|法規|房價|租金|政策|建案/;
export const FABRICATED_PATTERNS = [/昨天有位客戶/,/上週我們遇到/,/有一位客戶曾經/,/團隊昨天開會/];
export const CLICHES = ["在這個快速變化的時代","隨著科技日新月異","值得注意的是","不僅如此","透過這些內容","無論你是","讓我們一起","開啟全新篇章","賦能","打造屬於你的","不只是…更是…","在自媒體時代"];
export const SIMILARITY_THRESHOLDS = Object.freeze({ warn: 0.25, fail: 0.40 });
export const STORAGE_KEYS = Object.freeze({brand:"ccpsOsBrandV1",materials:"ccpsOsMaterialsV1",posts:"ccpsOsPostsV1",tracking:"ccpsOsTrackingV1",voice:"ccpsOsVoiceV1",settings:"ccpsOsSettingsV1"});
export const TRACKING_FIELDS = ["content_role","hook_type","narrative_type","visual_type","CTA_type","reach","reactions","comments","shares","saves","clicks","inquiries","follows","qualitative_notes"];
export const BRAND_CTA = "追蹤ccps家慶佳業";
