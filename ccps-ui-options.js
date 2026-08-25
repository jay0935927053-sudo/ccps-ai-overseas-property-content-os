export const EVIDENCE_LABELS=Object.freeze({VERIFIED_CURRENT:"已查證且目前有效",MEMORY_DERIVED:"整理自既有資料，發布前須查證",UNKNOWN:"尚未確認"});
export const NARRATIVE_LABELS=Object.freeze([
  "場景 → 衝突 → 判斷 → 教訓","反常識 → 證據 → 界線 → 結論","問題 → 判斷流程 → 建議","錯誤 → 代價 → 修正 → 清單","案例 → 轉折 → 決定 → 結果","幕後 → 隱形工作 → 客戶價值","數據 → 意義 → 不代表什麼 → 決策","甲方案與乙方案 → 比較 → 適配","日記 → 觀察 → 反思","迷思 → 原因 → 真相 → 例外"
]);
export const MATERIAL_FORM_OPTIONS=Object.freeze({
  titles:["大馬置產常見問題","吉隆坡區域觀察","新山置產評估","建案比較重點","海外置產風險提醒","租賃管理實務","國際學校與家庭規劃","第二生活圈規劃"],
  sources:["使用者自行整理（尚待查證）","CCPS 官網","《馬來西亞置產寶典》","馬來西亞政府官方資料","建商官方資料","CCPS 顧問現場紀錄","客戶問題匿名彙整","公開媒體資料（須查證）"],
  regions:["馬來西亞全國","吉隆坡","雪蘭莪","新山／柔佛","檳城","台灣","跨境比較","不限定區域"],
  properties:["不指定建案","單一建案介紹","多建案比較","新建案／預售案","已完工成屋","交屋中建案","租賃中物業","建案名稱待補"],
  clients:["首次海外置產家庭","穩健型投資人","國際教育家庭","退休與第二生活圈族群","高資產配置客戶","馬來西亞既有屋主","租賃管理客戶","尚未確認客群"],
  privacy:["無個資，可作公開內容候選","已匿名化客戶資料","含內部資訊，禁止公開","含客戶個資，需先移除","僅供內部研究","需主管確認公開範圍"],
  tags:["馬來西亞置產","吉隆坡","新山／柔佛","檳城","建案研究","風險提醒","租賃管理","國際教育","第二生活圈","政策時效","客戶問答","市場觀察"],
  searchTopics:["全部主題","馬來西亞置產","吉隆坡","新山","建案","租金","稅務","政策","國際學校","第二生活圈","MM2H","風險"]
});
export const MATERIAL_CONTENT_TEMPLATES=Object.freeze([
  {label:"客戶問題整理",body:"客戶最常問的問題：\n\n目前掌握的重點：\n\n需要再次查證的部分：\n\nCCPS 建議的下一個判斷步驟："},
  {label:"區域觀察",body:"觀察區域：\n\n生活與交通條件：\n\n可能優勢：\n\n限制與風險：\n\n適合與不適合的客群："},
  {label:"建案研究",body:"建案基本資料：\n\n主要賣點：\n\n持有成本與管理條件：\n\n可能風險：\n\n待查證來源："},
  {label:"政策／市場資料",body:"資料主題：\n\n資料時點：\n\n原始來源：\n\n資料代表的意義：\n\n資料不代表什麼：\n\n更新前不得直接使用的部分："},
  {label:"顧問現場筆記",body:"現場觀察：\n\n客戶真正關心的問題：\n\nCCPS 判斷：\n\n後續行動：\n\n隱私與公開界線："},
  {label:"自由填寫",body:""}
]);
export const CHECK_LABELS=Object.freeze({fabricated_story_gate:"虛構故事檢查",freshness_warning:"時效性提醒",similarity_score:"內容相似度",similarity_status:"相似度狀態",cliche_warnings:"套話提醒",brand_pov:"品牌觀點",trade_off:"優缺點平衡"});
export const displayEvidence=value=>EVIDENCE_LABELS[value]||value||"尚未確認";
export function displayStatus(value){const map={PASS:"通過",FAIL:"未通過",WARN:"提醒",REVIEW_RECOMMENDED:"建議重新查證","BLOCK: FABRICATED_REAL_WORLD_EVENT":"阻擋：疑似虛構真實事件","FAIL: NO_BRAND_POINT_OF_VIEW":"未通過：缺少品牌判斷觀點","WARN: SALESY_ONE_SIDED_CONTENT":"提醒：內容過度偏向銷售","FAIL: LOW_CONTENT_DNA_VARIANCE":"未通過：內容指紋變化不足"};return map[value]||value}
