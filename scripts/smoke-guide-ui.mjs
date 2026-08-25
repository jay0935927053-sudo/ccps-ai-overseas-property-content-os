import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.CCPS_PLAYWRIGHT_PATH || "playwright");

const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const checks = [];
const check = (name, pass, detail = "") => checks.push({ name, pass: Boolean(pass), detail });

await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
check("article evidence fields absent",await page.locator("#evidenceState,#sourceDate,#evidence").count()===0);
await page.click("#generate");
check("direct article generation",(await page.textContent("#gate")).includes("PASS"));
check("article output CTA",(await page.textContent("#output")).includes("追蹤ccps家慶佳業"));
await page.click('[data-tab="materials"]');
await page.waitForFunction(() => document.querySelector("#officialSummary")?.textContent?.includes("置產寶典 34"));
check("combined count", (await page.textContent("#officialSummary")).includes("共 185 筆"));
check("guide count", (await page.textContent("#officialSummary")).includes("置產寶典 34"));
check("mobile no horizontal overflow", await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
await page.selectOption("#officialSource", { label: "馬來西亞置產寶典" });
check("source filter", (await page.textContent("#officialSummary")).includes("30／34 筆"));
check("memory boundary visible", (await page.locator("#officialList article").first().textContent()).includes("MEMORY_DERIVED"));
await page.fill("#officialSearch", "MM2H");
check("search result", await page.locator("#officialList article").count() >= 1);
check("source link", (await page.locator("#officialList article a").first().getAttribute("href")).startsWith("https://ccps-malaysia-property-guide.netlify.app/"));
await page.fill("#officialSearch", "");
check("sealed source option absent", !(await page.locator("#officialSource").textContent()).includes("公司股權"));
check("internal marker absent", !(await page.locator("body").textContent()).includes("INTERNAL_ONLY"));

checks.forEach(x => console.log(`${x.pass ? "PASS" : "FAIL"} ${x.name}${x.detail ? ` — ${x.detail}` : ""}`));
const failed = checks.filter(x => !x.pass);
console.log(`\n${checks.length - failed.length}/${checks.length} PASS`);
await browser.close();
process.exit(failed.length ? 1 : 0);
