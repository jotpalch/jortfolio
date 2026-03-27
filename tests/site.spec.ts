import { test, expect } from "@playwright/test";

// ─── All pages load + no overflow ─────────────────────────
const pages = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Photography", path: "/photography" },
  { name: "Articles", path: "/articles" },
  { name: "About", path: "/about" },
  { name: "Experience", path: "/experience" },
  { name: "Education", path: "/education" },
];

for (const { name, path } of pages) {
  test(`${name} — loads successfully`, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
  });

  test(`${name} — no horizontal overflow`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
  });

  test(`${name} — has page title`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
}

// ─── Homepage: Hero ──────────────────────────────────────
test("Home — hero heading visible", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("Wei-Cheng Chen");
});

test("Home — subtitle visible", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Software Engineer & Film Photographer")).toBeVisible();
});

test("Home — profile photo loads", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const img = page.locator('img[alt="Wei-Cheng Chen"]');
  await expect(img).toBeVisible({ timeout: 5000 });
});

test("Home — CTA buttons present", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const hero = page.locator("section").first();
  await expect(hero.getByRole("link", { name: "Projects" })).toBeVisible();
  await expect(hero.getByRole("link", { name: "Photo Gallery" })).toBeVisible();
  await expect(hero.getByRole("link", { name: "About Me" })).toBeVisible();
});

test("Home — CTA Projects links to /projects", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const hero = page.locator("section").first();
  const link = hero.getByRole("link", { name: "Projects" });
  await expect(link).toHaveAttribute("href", "/projects");
});

// ─── Homepage: What I Do panel ──────────────────────────
test("Home — company logos visible on scroll", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForTimeout(500);
  for (const company of ["NVIDIA", "Intel", "ASML", "Realtek"]) {
    await expect(page.locator(`img[alt="${company}"]`).first()).toBeVisible({ timeout: 5000 });
  }
});

test("Home — skills categories displayed", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForTimeout(500);
  await expect(page.locator("text=Technologies").first()).toBeVisible();
  await expect(page.locator("text=Domain Expertise").first()).toBeVisible();
  await expect(page.locator("text=Languages").first()).toBeVisible();
});

// ─── Homepage: Featured Projects ────────────────────────
test("Home — featured projects section exists", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
  await page.waitForTimeout(500);
  const allProjectsLink = page.getByRole("link", { name: /All Projects/i });
  await expect(allProjectsLink).toBeVisible({ timeout: 5000 });
});

// ─── Homepage: Awards + CTA ─────────────────────────────
test("Home — awards section visible", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await expect(page.locator("text=Recognition").first()).toBeVisible();
});

test("Home — CTA say hello link", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const mailLink = page.getByRole("link", { name: "Say Hello" });
  await expect(mailLink).toBeVisible();
  await expect(mailLink).toHaveAttribute("href", /^mailto:/);
});

test("Home — CTA resume link", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const resumeLink = page.getByRole("link", { name: "Resume" });
  await expect(resumeLink).toBeVisible();
  await expect(resumeLink).toHaveAttribute("href", /resume/);
  await expect(resumeLink).toHaveAttribute("target", "_blank");
});

// ─── Navigation ───────────────────────────────────────────
test("Nav — capsule visible on every page", async ({ page }) => {
  for (const p of ["/", "/about", "/projects", "/photography"]) {
    await page.goto(p);
    await expect(page.locator("nav")).toBeVisible();
  }
});

test("Nav — all links present", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const nav = page.locator("nav");
  for (const label of ["jotpac", "Projects", "Photos", "Articles", "About"]) {
    await expect(nav.getByRole("link", { name: label })).toBeVisible();
  }
});

test("Nav — click Projects navigates", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator("nav").getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/projects/);
});

test("Nav — click Photos navigates", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator("nav").getByRole("link", { name: "Photos" }).click();
  await expect(page).toHaveURL(/\/photography/);
});

test("Nav — click Articles navigates", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator("nav").getByRole("link", { name: "Articles" }).click();
  await expect(page).toHaveURL(/\/articles/);
});

test("Nav — click About navigates", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator("nav").getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about/);
});

test("Nav — logo links home", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await page.locator("nav").getByRole("link", { name: "jotpac" }).click();
  await expect(page).toHaveURL("/");
});

// ─── Projects page ────────────────────────────────────────
test("Projects — heading visible", async ({ page }) => {
  await page.goto("/projects", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("All Projects");
});

test("Projects — shows project count", async ({ page }) => {
  await page.goto("/projects", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=15 projects")).toBeVisible();
});

test("Projects — project cards render", async ({ page }) => {
  await page.goto("/projects", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=AIoT Texas").first()).toBeVisible();
});

// ─── Articles ─────────────────────────────────────────────
test("Articles — heading visible", async ({ page }) => {
  await page.goto("/articles", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("Articles");
});

test("Articles — list renders", async ({ page }) => {
  await page.goto("/articles", { waitUntil: "domcontentloaded" });
  const links = page.locator("a[href*='/articles/']");
  const count = await links.count();
  expect(count).toBeGreaterThanOrEqual(3);
});

test("Articles — can open film article", async ({ page }) => {
  await page.goto("/articles/why-i-shoot-film-zhtw", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("底片");
  await expect(page.locator(".prose-article")).toBeVisible();
});

test("Articles — can open poker AI article", async ({ page }) => {
  await page.goto("/articles/building-poker-ai-zhtw", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("德州撲克");
  await expect(page.locator(".prose-article")).toBeVisible();
});

test("Articles — can open GR3x article", async ({ page }) => {
  await page.goto("/articles/ricoh-gr3x-hdf-review-zhtw", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("GR3x");
  await expect(page.locator(".prose-article")).toBeVisible();
});

test("Articles — reading progress bar exists", async ({ page }) => {
  await page.goto("/articles/why-i-shoot-film-zhtw", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(300);
  await expect(page.locator(".origin-left")).toBeVisible();
});

test("Articles — back link returns to list", async ({ page }) => {
  await page.goto("/articles/why-i-shoot-film-zhtw", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: "All articles", exact: true }).click();
  await expect(page).toHaveURL(/\/articles$/);
});

test("Articles — tags displayed", async ({ page }) => {
  await page.goto("/articles/why-i-shoot-film-zhtw", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=攝影").first()).toBeVisible();
});

test("Articles — reading time displayed", async ({ page }) => {
  await page.goto("/articles/why-i-shoot-film-zhtw", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=min read").first()).toBeVisible();
});

// ─── Photography ──────────────────────────────────────────
test("Photography — filter buttons visible", async ({ page }) => {
  await page.goto("/photography", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("button", { name: "All" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ricoh GR3x" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Negative Film" })).toBeVisible();
});

test("Photography — photo count displayed", async ({ page }) => {
  await page.goto("/photography", { waitUntil: "domcontentloaded" });
  // The count badge shows total number
  const countBadge = page.locator("span.font-mono");
  await expect(countBadge.first()).toBeVisible();
});

test("Photography — filter changes count", async ({ page }) => {
  await page.goto("/photography", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const allCount = await page.locator("span.font-mono").first().textContent();
  await page.getByRole("button", { name: "Ricoh GR3x" }).click();
  await page.waitForTimeout(300);
  const filteredCount = await page.locator("span.font-mono").first().textContent();
  // Filtered count should be less than or equal to all
  expect(Number(filteredCount)).toBeLessThanOrEqual(Number(allCount));
});

// ─── About page ───────────────────────────────────────────
test("About — page loads", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  // Desktop: Terminal with boot sequence; Mobile: traditional about
  await expect(page.locator("text=NVIDIA").first()).toBeVisible({ timeout: 10000 });
});

test("About — terminal boot sequence", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") return test.skip();
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=jotpac kernel").first()).toBeVisible({ timeout: 5000 });
  await expect(page.locator("text=All systems nominal").first()).toBeVisible({ timeout: 5000 });
});

test("About — terminal help command", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") return test.skip();
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500); // wait for boot
  await page.locator("input").fill("help");
  await page.keyboard.press("Enter");
  await expect(page.locator("text=whoami").first()).toBeVisible();
  await expect(page.locator("text=neofetch").first()).toBeVisible();
});

test("About — terminal neofetch", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") return test.skip();
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.locator("input").fill("neofetch");
  await page.keyboard.press("Enter");
  await expect(page.locator("text=Ricoh GR IIIx HDF").first()).toBeVisible();
});

test("About — terminal lsmod", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") return test.skip();
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.locator("input").fill("lsmod");
  await page.keyboard.press("Enter");
  await expect(page.locator("text=nvidia_driver").first()).toBeVisible();
  await expect(page.locator("text=agentic_ai").first()).toBeVisible();
});

test("About — terminal ask command", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") return test.skip();
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.locator("input").fill("ask hello");
  await page.keyboard.press("Enter");
  await expect(page.locator("text=jotpac's agent").first()).toBeVisible();
});

test("About — terminal nvidia-smi easter egg", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") return test.skip();
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.locator("input").fill("nvidia-smi");
  await page.keyboard.press("Enter");
  await expect(page.locator("text=Wei-Cheng Chen").first()).toBeVisible();
});

test("About — terminal docker ps easter egg", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") return test.skip();
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.locator("input").fill("docker ps");
  await page.keyboard.press("Enter");
  await expect(page.locator("text=jotpac/portfolio").first()).toBeVisible();
});

test("About — terminal smart shortcut", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "desktop") return test.skip();
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.locator("input").fill("projects");
  await page.keyboard.press("Enter");
  await expect(page.locator("text=PROJECT").first()).toBeVisible();
});

test("About — mobile shows traditional layout", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "mobile") return test.skip();
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("About Me");
});

test("About — mobile shows experience", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "mobile") return test.skip();
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  // Scroll in steps to trigger lazy rendering
  for (let i = 1; i <= 3; i++) {
    await page.evaluate((n) => window.scrollTo(0, document.body.scrollHeight * n / 3), i);
    await page.waitForTimeout(500);
  }
  await expect(page.locator("text=System Software Engineer").first()).toBeVisible({ timeout: 5000 });
});

// ─── Experience page ──────────────────────────────────────
test("Experience — heading visible", async ({ page }) => {
  await page.goto("/experience", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("Work Experience");
});

test("Experience — all companies listed", async ({ page }) => {
  await page.goto("/experience", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  for (const company of ["NVIDIA", "Intel", "ASML", "Realtek"]) {
    await expect(page.locator(`text=${company}`).first()).toBeVisible();
  }
});

test("Experience — NVIDIA role shows", async ({ page }) => {
  await page.goto("/experience", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=System Software Engineer").first()).toBeVisible();
});

test("Experience — tech stack badges render", async ({ page }) => {
  await page.goto("/experience", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=C/C++").first()).toBeVisible();
});

// ─── Education page ───────────────────────────────────────
test("Education — heading visible", async ({ page }) => {
  await page.goto("/education", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("Education");
});

test("Education — NYCU listed", async ({ page }) => {
  await page.goto("/education", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=NYCU").first()).toBeVisible();
});

test("Education — degrees listed", async ({ page }) => {
  await page.goto("/education", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=Master of Science").first()).toBeVisible();
  await expect(page.locator("text=Bachelor of Science").first()).toBeVisible();
});

// ─── 404 page ─────────────────────────────────────────────
test("404 — shows custom error page", async ({ page }) => {
  await page.goto("/this-page-does-not-exist", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=404")).toBeVisible();
  await expect(page.locator("text=Lost in the darkroom")).toBeVisible();
});

test("404 — go home button works", async ({ page }) => {
  await page.goto("/this-page-does-not-exist", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: /Go Home/i }).click();
  await expect(page).toHaveURL("/");
});

// ─── SEO / Meta ───────────────────────────────────────────
test("Home — has meta description", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const desc = page.locator('meta[name="description"]');
  await expect(desc).toHaveAttribute("content", /.+/);
});

test("Home — has OG title", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const og = page.locator('meta[property="og:title"]');
  await expect(og).toHaveAttribute("content", /Wei-Cheng Chen/);
});

test("Sitemap — accessible", async ({ page }) => {
  const response = await page.goto("/sitemap.xml", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
});

test("Robots.txt — accessible", async ({ page }) => {
  const response = await page.goto("/robots.txt", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
});

// ─── Accessibility basics ─────────────────────────────────
test("Home — images have alt text", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const images = page.locator("img");
  const count = await images.count();
  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute("alt");
    expect(alt).not.toBeNull();
  }
});

test("Home — no broken images", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const broken = await page.evaluate(() => {
    const imgs = document.querySelectorAll("img");
    return [...imgs].filter((img) => !img.complete || img.naturalWidth === 0).length;
  });
  expect(broken).toBe(0);
});

test("Nav — links have accessible names", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const links = page.locator("nav a");
  const count = await links.count();
  for (let i = 0; i < count; i++) {
    const text = await links.nth(i).textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  }
});

// ─── Mobile-specific ──────────────────────────────────────
test("Mobile — nav fits viewport", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "mobile") return test.skip();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const navBox = await page.locator("nav > div").boundingBox();
  const viewport = page.viewportSize();
  if (navBox && viewport) {
    expect(navBox.width).toBeLessThanOrEqual(viewport.width);
  }
});

test("Mobile — hero photo not clipped", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "mobile") return test.skip();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const img = page.locator('img[alt="Wei-Cheng Chen"]');
  await expect(img).toBeVisible({ timeout: 5000 });
  const box = await img.boundingBox();
  if (box) {
    expect(box.x).toBeGreaterThan(-50);
  }
});

test("Mobile — full page scroll no overflow", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "mobile") return test.skip();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(overflow).toBe(false);
});

test("Mobile — about page no overflow", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "mobile") return test.skip();
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(overflow).toBe(false);
});

test("Mobile — articles page readable", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "mobile") return test.skip();
  await page.goto("/articles/why-i-shoot-film-zhtw", { waitUntil: "domcontentloaded" });
  const article = page.locator(".prose-article");
  const box = await article.boundingBox();
  const viewport = page.viewportSize();
  if (box && viewport) {
    expect(box.width).toBeLessThanOrEqual(viewport.width);
  }
});

// ─── Photography: Three.js canvas ──────────────────────
test("Photography — canvas renders", async ({ page }) => {
  await page.goto("/photography", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000);
  const canvas = page.locator("canvas").first();
  const count = await canvas.count();
  if (count === 0) { test.skip(); return; }
  await expect(canvas).toBeVisible();
});

test("Photography — canvas has dimensions", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile") return test.skip();
  await page.goto("/photography", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000);
  const canvas = page.locator("canvas").first();
  const count = await canvas.count();
  if (count === 0) { test.skip(); return; }
  const box = await canvas.boundingBox();
  if (!box) { test.skip(); return; }
  expect(box.width).toBeGreaterThan(50);
  expect(box.height).toBeGreaterThan(50);
});

test("Photography — shuffle button visible", async ({ page }) => {
  await page.goto("/photography", { waitUntil: "domcontentloaded" });
  // Dice is now a Three.js canvas inside a div with title="Shuffle"
  const dice = page.locator("[title='Shuffle']");
  await expect(dice).toBeVisible({ timeout: 10000 });
});

test("Photography — filter changes photo count", async ({ page }) => {
  await page.goto("/photography", { waitUntil: "domcontentloaded" });
  const countEl = page.locator("span.font-mono").first();
  const allCount = await countEl.textContent();
  await page.getByRole("button", { name: "Negative Film" }).click();
  await page.waitForTimeout(500);
  const filmCount = await countEl.textContent();
  expect(Number(filmCount)).toBeLessThan(Number(allCount));
});

test("Photography — filter Ricoh GR3x works", async ({ page }) => {
  await page.goto("/photography", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Ricoh GR3x" }).click();
  await page.waitForTimeout(500);
  const count = await page.locator("span.font-mono").first().textContent();
  expect(Number(count)).toBeGreaterThan(0);
});

test("Photography — filter All restores count", async ({ page }) => {
  await page.goto("/photography", { waitUntil: "domcontentloaded" });
  const countEl = page.locator("span.font-mono").first();
  const allCount = await countEl.textContent();
  await page.getByRole("button", { name: "Negative Film" }).click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "All" }).click();
  await page.waitForTimeout(300);
  const restored = await countEl.textContent();
  expect(restored).toBe(allCount);
});

// ─── Articles: all zh-TW articles ───────────────────────
test("Articles — first-roll article loads", async ({ page }) => {
  await page.goto("/articles/first-roll", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("第一卷底片");
});

test("Articles — naval article loads", async ({ page }) => {
  await page.goto("/articles/almanack-of-naval-ravikant", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("納瓦爾寶典");
});

test("Articles — oral exam guide loads", async ({ page }) => {
  await page.goto("/articles/nycu-cs-masters-oral-exam-guide", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("口試");
});

test("Articles — exam notes loads", async ({ page }) => {
  await page.goto("/articles/nycu-cs-practice-group-exam-notes", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("筆試");
});

test("Articles — article count is 7", async ({ page }) => {
  await page.goto("/articles", { waitUntil: "domcontentloaded" });
  const links = page.locator("a[href*='/articles/']");
  const count = await links.count();
  expect(count).toBe(7);
});

test("Articles — sorted by date descending", async ({ page }) => {
  await page.goto("/articles", { waitUntil: "domcontentloaded" });
  const dates = await page.locator("time").allTextContents();
  const filtered = dates.filter((d) => d.match(/\d{4}/));
  for (let i = 1; i < filtered.length; i++) {
    expect(filtered[i - 1] >= filtered[i]).toBeTruthy();
  }
});

// ─── Homepage: film strip uses real photos ──────────────
test("Home — film strip shows photos", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
  await page.waitForTimeout(500);
  await expect(page.locator("text=Recent Shots").first()).toBeVisible({ timeout: 5000 });
});

// ─── Experience: NVIDIA details ─────────────────────────
test("Experience — NVIDIA location shows Taipei", async ({ page }) => {
  await page.goto("/experience", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=Taipei").first()).toBeVisible();
});

test("Experience — shows Linux driver", async ({ page }) => {
  await page.goto("/experience", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=Linux").first()).toBeVisible();
});

test("Experience — shows Agentic AI", async ({ page }) => {
  await page.goto("/experience", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=Agentic").first()).toBeVisible();
});

// ─── Skills on homepage ─────────────────────────────────
test("Home — skills include Linux Driver Development", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForTimeout(500);
  await expect(page.locator("text=Linux Driver Development").first()).toBeVisible({ timeout: 5000 });
});

test("Home — skills include Agentic AI", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForTimeout(500);
  await expect(page.locator("text=Agentic AI").first()).toBeVisible({ timeout: 5000 });
});

// ─── Dark theme ─────────────────────────────────────────
test("Home — dark background", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  // Should be dark (#0c0c0c = rgb(12,12,12))
  expect(bg).toMatch(/rgb\(12,\s*12,\s*12\)/);
});

// ─── Resume link ────────────────────────────────────────
test("Home — resume PDF accessible", async ({ page }) => {
  const res = await page.request.head("http://localhost:4173/resume/resume.pdf");
  expect(res.ok()).toBeTruthy();
});

// ─── Cross-page navigation flow ─────────────────────────
test("Nav — full navigation flow", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const nav = page.locator("nav");

  // Home → Projects
  await nav.getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/projects/);

  // Projects → Photos
  await nav.getByRole("link", { name: "Photos" }).click();
  await expect(page).toHaveURL(/\/photography/);

  // Photos → Articles
  await nav.getByRole("link", { name: "Articles" }).click();
  await expect(page).toHaveURL(/\/articles/);

  // Articles → About
  await nav.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about/);

  // About → Home
  await nav.getByRole("link", { name: "jotpac" }).click();
  await expect(page).toHaveURL("/");
});

// ─── Mobile: photography ────────────────────────────────
test("Mobile — photography page loads", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "mobile") return test.skip();
  await page.goto("/photography", { waitUntil: "domcontentloaded" });
  // Mobile shows grid, not canvas
  const grid = page.locator(".grid");
  await expect(grid).toBeVisible({ timeout: 5000 });
});

test("Mobile — photography filter visible", async ({ page }, testInfo) => {
  if (testInfo.project.name !== "mobile") return test.skip();
  await page.goto("/photography", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("button", { name: "All" })).toBeVisible();
});

// ─── Performance: page load time ────────────────────────
test("Home — loads within 5 seconds", async ({ page }) => {
  const start = Date.now();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(5000);
});

test("Articles — list loads within 5 seconds", async ({ page }) => {
  const start = Date.now();
  await page.goto("/articles", { waitUntil: "domcontentloaded" });
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(5000);
});
