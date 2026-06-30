import { chromium } from "@playwright/test";

const base = process.argv[2] || "http://localhost:3000/";
const sections = (process.argv[3] || "arrival,journey,systems,console,contact").split(",");

const browser = await chromium.launch({
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(base, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(6500);

for (const id of sections) {
  if (id === "arrival") {
    await page.evaluate(() => window.scrollTo({ top: 0 }));
  } else {
    await page.evaluate((sid) => {
      document.querySelector(`[data-section="${sid}"]`)?.scrollIntoView();
    }, id);
  }
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `shot-${id}.png` });
  console.log("captured", id);
}

console.log("ERRORS:" + (errors.length ? "\n" + errors.join("\n") : " none"));
await browser.close();
