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
  await expect(page.locator("h1")).toContainText("About Me");
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
  await page.goto("/articles/why-i-shoot-film", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("Film");
  await expect(page.locator(".prose-article")).toBeVisible();
});

test("Articles — can open poker AI article", async ({ page }) => {
  await page.goto("/articles/building-poker-ai", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("Poker");
  await expect(page.locator(".prose-article")).toBeVisible();
});

test("Articles — can open GR3x article", async ({ page }) => {
  await page.goto("/articles/ricoh-gr3x-hdf-review", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("Ricoh");
  await expect(page.locator(".prose-article")).toBeVisible();
});

test("Articles — reading progress bar exists", async ({ page }) => {
  await page.goto("/articles/why-i-shoot-film", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(300);
  await expect(page.locator(".origin-left")).toBeVisible();
});

test("Articles — back link returns to list", async ({ page }) => {
  await page.goto("/articles/why-i-shoot-film", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: "All articles", exact: true }).click();
  await expect(page).toHaveURL(/\/articles$/);
});

test("Articles — tags displayed", async ({ page }) => {
  await page.goto("/articles/why-i-shoot-film", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=photography").first()).toBeVisible();
});

test("Articles — reading time displayed", async ({ page }) => {
  await page.goto("/articles/why-i-shoot-film", { waitUntil: "domcontentloaded" });
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
test("About — heading visible", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("About Me");
});

test("About — bio mentions NVIDIA", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=NVIDIA").first()).toBeVisible();
});

test("About — bio mentions Taipei", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await expect(page.locator("text=Taipei").first()).toBeVisible();
});

test("About — experience timeline renders", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(500);
  for (const company of ["NVIDIA", "Intel", "ASML", "Realtek"]) {
    await expect(page.locator(`text=${company}`).first()).toBeVisible();
  }
});

test("About — education timeline renders", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await expect(page.locator("text=NYCU").first()).toBeVisible();
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
  await page.goto("/articles/why-i-shoot-film", { waitUntil: "domcontentloaded" });
  const article = page.locator(".prose-article");
  const box = await article.boundingBox();
  const viewport = page.viewportSize();
  if (box && viewport) {
    expect(box.width).toBeLessThanOrEqual(viewport.width);
  }
});
