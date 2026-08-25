export const EXTERNAL_LINK_GROUPS = Object.freeze({
  image: Object.freeze([
    {label:"ChatGPT｜圖片生成",url:"https://chatgpt.com/"}
  ]),
  video: Object.freeze([
    {label:"ChatArt Pro｜AI 影片生成",url:"https://app.chatartpro.com/"}
  ]),
  company: Object.freeze([
    {label:"CCPS 公司官網",url:"https://ccps-my.com/"},
    {label:"CCPS 後台系統",url:"https://glorious-curiosity-production-964b.up.railway.app/login"},
    {label:"線上活動後台",url:"https://ccps-airline-webinar.unclehouse.chatgpt.site/admin/leads"}
  ]),
  ads: Object.freeze([
    {label:"Meta 廣告投放管理",url:"https://adsmanager.facebook.com/"}
  ]),
  social: Object.freeze([
    {label:"Facebook｜CCPS",url:"https://www.facebook.com/CcpsmyInvestmentig"},
    {label:"Instagram｜@ccpsmy_investment",url:"https://www.instagram.com/ccpsmy_investment/"},
    {label:"YouTube｜@ccpsmy-investment",url:"https://www.youtube.com/@ccpsmy-investment"},
    {label:"TikTok｜繁中首頁",url:"https://www.tiktok.com/zh-Hant-TW/"},
    {label:"LINE＠｜@392okwmj",url:"https://manager.line.biz/account/@392okwmj"},
    {label:"Threads｜@ccpsmy_investment",url:"https://www.threads.com/@ccpsmy_investment"}
  ])
});

export function isApprovedExternalUrl(url) {
  return Object.values(EXTERNAL_LINK_GROUPS).flat().some(item=>item.url===url);
}
