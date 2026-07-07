const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "..", "website");
const files = [
  "index.html",
  "zh/index.html",
  "zh-hant/index.html",
  "ja/index.html",
  "ko/index.html",
  "de/index.html",
  "fr/index.html",
  "pt/index.html",
  "it/index.html",
  "es/index.html",
  "nl/index.html",
  "ru/index.html",
];

for (const f of files) {
  const h = fs.readFileSync(path.join(dir, f), "utf8");
  const ids = [...h.matchAll(/data-youtube-id="([^"]+)"/g)].map((m) => m[1]);
  console.log(f, "->", ids.length ? ids.join(", ") : "NONE");
}
