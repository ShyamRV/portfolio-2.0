import { chromium } from "@playwright/test";

const url = process.argv[2] || "http://localhost:3000/experience";
const out = process.argv[3] || "shot.png";

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

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(6500); // let boot loader finish + figure assemble
await page.screenshot({ path: out });

console.log("ERRORS:" + (errors.length ? "\n" + errors.join("\n") : " none"));
await browser.close();
