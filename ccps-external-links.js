export const EXTERNAL_LINK_GROUPS = Object.freeze({
  image: Object.freeze([
    {label:"ChatGPT｜圖片生成",url:"https://chatgpt.com/"}
  ]),
  video: Object.freeze([
    {label:"ChatArt Pro｜AI 影片生成",url:"https://app.chatartpro.com/"}
  ]),
  social: Object.freeze([
    {label:"Facebook 首頁",url:"https://www.facebook.com/"},
    {label:"Instagram 首頁",url:"https://www.instagram.com/"},
    {label:"YouTube 首頁",url:"https://www.youtube.com/"},
    {label:"TikTok 首頁",url:"https://www.tiktok.com/"},
    {label:"LINE 官方帳號管理",url:"https://manager.line.biz/"},
    {label:"Threads 首頁",url:"https://www.threads.net/"}
  ])
});

export function isApprovedExternalUrl(url) {
  return Object.values(EXTERNAL_LINK_GROUPS).flat().some(item=>item.url===url);
}
