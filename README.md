# CCPS AI Overseas Property Content OS

CCPS 專用海外置產內容系統。本機 V1 完全獨立於 UHOS 與 `uncle-house-ai-tool`，不共享可寫狀態。

## 本機執行

```bash
python3 -m http.server 8080
```

瀏覽 `http://127.0.0.1:8080/`。文章生成已接回原版 OpenAI Responses API 動態引擎；API Key 只存在當前分頁記憶體，不寫入 localStorage。只有使用者按下「生成文章」才會呼叫一次 API；檢查、素材、品牌、Voice、月曆、Tracking 及圖片／影片製作稿仍是本機功能。

文章產生不要求使用者提供證據狀態、來源日期或證據文字；即時性主題只顯示複核提醒，不阻擋生成。防杜撰客戶、成交或會議故事的檢查仍保留。

首頁使用使用者提供的 CCPS 家慶佳業 Logo。品牌人設 6 欄與寫作指紋 8 欄各提供 8 種品牌選項，共 112 個選擇；既有自訂值可繼續載入。固定 CTA 仍鎖定為 `追蹤ccps家慶佳業`。

## 素材庫使用方式

1. 從下拉選單選擇標題主題、來源、區域、建案狀態、客戶類型與隱私狀態。
2. 勾選一個或多個標籤，方便日後分類及搜尋。
3. 選擇內容範本，系統會帶入問題、觀察、建案研究或政策資料的填寫框架；再補上真實內容。
4. 涉及政策、法律、稅務、匯率、價格、租金或市場數據時，勾選「需要時效性檢查」。
5. 在「CCPS 信任內容來源庫」選擇搜尋主題，也可加上自訂關鍵字及來源篩選；找到資料後加入個人素材庫。
6. 回到「自媒體產生器」，於「生成時選用素材」明確選擇一筆素材；只有「無個資，可作公開內容候選」、「已匿名化客戶資料」或 `public_candidate` 素材可以送入生成提示詞。

證據狀態在畫面顯示為中文，但資料層仍保留 `VERIFIED_CURRENT`、`MEMORY_DERIVED`、`UNKNOWN` 代碼，以維持舊資料相容。素材庫提供寫作依據，不等於可直接發布；使用法律、稅務、政策、匯率、價格及市場數據前仍須回到最新權威來源查證。

## CCPS 官網官方素材

- `data/ccps-official-source-registry.json`：完整官網來源清單、採用狀態與排除原因。
- `data/ccps-official-materials.json`：去重後的繁中可用素材；每筆保留來源、更新日、Evidence 與 Freshness。
- `scripts/import-ccps-website.mjs`：遵守官網 `Crawl-Delay: 20` 的低頻率快照匯入器。
- 官方素材以靜態唯讀資料載入；只有使用者選取「加入我的素材庫」時才寫入該瀏覽器的 localStorage。

## 馬來西亞置產寶典知識庫

- `data/ccps-malaysia-guide-knowledge.json`：完整保存 V2.0 前言、32 章與附錄，共 34 章 Markdown 與章節 metadata。
- `data/ccps-malaysia-guide-materials.json`：每章一筆可搜尋信任內容素材，與官網 141 筆素材合併為 175 筆來源庫。
- `scripts/import-malaysia-guide.mjs`：依來源站章節清單建立本機快照；不下載圖片與樣式。
- `scripts/validate-guide-knowledge.mjs`：驗證章數、內容完整性、來源與 Evidence/Freshness 邊界。
- 寶典內容一律標記 `MEMORY_DERIVED`。法律、稅務、政策、匯率、重大建設與市場數據須另查權威來源，不能直接視為 `VERIFIED_CURRENT`。

## 本機文件與品牌視覺來源庫

- `data/ccps-local-source-registry.json`：7 個公開候選來源的別名、SHA-256、可見範圍與證據狀態；不保存本機絕對路徑。
- `data/ccps-local-knowledge.json`：2 份公開候選研究／指南文件的完整文字快照；PDF 保留頁碼。
- `data/ccps-local-materials.json`：10 筆章節、頁面與視覺素材，合併後來源庫共 185 筆。
- `assets/trust-library/`（信任內容品牌視覺）：5 張使用者提供圖片，複製後雜湊與來源一致。
- 2026-08-25 人工確認：2 份內部文件、1 份舊版政策文件及私人雲端資料完全排除於 Repository、資料檔與網站載入流程之外。

## 來源證據

- Source: `jay0935927053-sudo/uncle-house-ai-tool`
- Branch: `main`
- Inventory HEAD: `3e73dc96c3e3cf22e9e8d5d90c186551e6140888`
- 承接：分頁暫存 API Key 流程、內容 UI、素材庫、品牌設定、月曆、多平台改寫、Preflight、Project History、Content Tracking
- GPT 動態生成 Adapter：固定使用 `gpt-5.6-terra`、`reasoning: low` 與單次 Responses API 串流；文章表單、品牌人設、寫作指紋和一筆明確選用素材會進入提示詞，輸出仍須通過既有 Preflight。
- 多平台圖片與影片腳本生成器 V1：FB 單圖、IG 五張輪播、YouTube 封面提示詞，以及 15／30／60 秒影片腳本與逐鏡分鏡提示詞；本機生成製作稿，不呼叫付費 API。
- 首頁快速工作入口：ChatGPT 圖片生成、ChatArt Pro 與房叔 AI Director 影片生成，以及 CCPS 的 Facebook、Instagram、YouTube、LINE＠、Threads 帳號與使用者指定的 TikTok 繁中首頁；全部以固定白名單在新分頁開啟，不傳送本機資料。
- 獨立 CCPS 公司網站入口：公司官網、Railway 後台系統與線上活動名單後台。Meta 廣告投放管理另設獨立區塊；登入與權限仍由各正式網站處理，本系統不保存帳密。
- 「廣告投手」獨立按鈕：新分頁開啟 `https://growth-staging.unclehouse.net/`，不自動傳送內容或執行投放。
- 首頁品牌與資訊架構：標題為「UHOS 自媒體工廠」，使用 Uncle House Logo；公司網站、廣告管理、快速工作平台及最近文章收進三條線功能目錄。首頁第一功能為「自媒體產生器」，下方提供「快速工作入口」。頁尾連結房叔 UHOS 著作權聲明與使用規則。
- 不承接：教育模組、舊品牌 CTA、CRM／成交漏斗、非 CCPS Storyboard、UHOS 功能與任何舊 localStorage key
