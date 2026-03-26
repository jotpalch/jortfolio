import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
const page = await context.newPage();
await page.goto("http://localhost:4173/");
await page.waitForTimeout(1000);

const result = await page.evaluate(() => {
  const docWidth = document.documentElement.clientWidth;
  const scrollWidth = document.documentElement.scrollWidth;
  // Find the widest element
  const all = document.querySelectorAll("*");
  let widest = { tag: "", class: "", width: 0 };
  for (const el of all) {
    const rect = el.getBoundingClientRect();
    if (rect.right > widest.width) {
      widest = { tag: el.tagName, class: el.className?.toString?.().slice(0, 80) || "", width: rect.right };
    }
  }
  return { docWidth, scrollWidth, widest };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
