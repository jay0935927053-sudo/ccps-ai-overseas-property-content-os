# CCPS AI Overseas Property Content OS

CCPS 專用海外置產內容系統。本機 V1 完全獨立於 UHOS 與 `uncle-house-ai-tool`，不共享可寫狀態。

## 本機執行

```bash
python3 -m http.server 8080
```

瀏覽 `http://127.0.0.1:8080/`。API Key 只存在當前分頁記憶體，不寫入 localStorage；V1 的確定性文章產生、檢查、素材、品牌、Voice、月曆及 Tracking 不需付費 API。

## 來源證據

- Source: `jay0935927053-sudo/uncle-house-ai-tool`
- Branch: `main`
- Inventory HEAD: `3e73dc96c3e3cf22e9e8d5d90c186551e6140888`
- 承接：分頁暫存 API Key 流程、內容 UI、素材庫、品牌設定、月曆、多平台改寫、Preflight、Project History、Content Tracking
- 不承接：教育模組、舊品牌 CTA、CRM／成交漏斗、非 CCPS Storyboard、UHOS 功能與任何舊 localStorage key

