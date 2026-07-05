/**
 * Generates static per-locale home pages for SEO (hreflang + crawlable HTML).
 *
 * Edit templates/home.template.html (and site-strings.js / css / js), NOT index.html
 * or zh/index.html etc. — running this script overwrites those generated files.
 *
 * Usage (from website/):
 *   node scripts/build-home.js
 *   SITE_BASE_URL=https://your.domain node scripts/build-home.js
 */
const fs = require("fs");
const path = require("path");
const { STR, t } = require("./site-strings.js");

const WEBSITE_DIR = path.join(__dirname, "..");
const TEMPLATE_PATH = path.join(WEBSITE_DIR, "templates", "home.template.html");
const SITE_BASE = (process.env.SITE_BASE_URL || "https://plainbytes.studio").replace(/\/$/, "");

const LOCALES = [
  { id: "en", hreflang: "en", htmlLang: "en", outFile: "index.html", assetPrefix: "", manualFile: "en.html" },
  { id: "zh", hreflang: "zh-Hans", htmlLang: "zh-Hans", outFile: "zh/index.html", assetPrefix: "../", manualFile: "zh-Hans.html" },
  { id: "zh-Hant", hreflang: "zh-Hant", htmlLang: "zh-Hant", outFile: "zh-hant/index.html", assetPrefix: "../", manualFile: "zh-Hant.html" },
  { id: "ja", hreflang: "ja", htmlLang: "ja", outFile: "ja/index.html", assetPrefix: "../", manualFile: "ja.html" },
  { id: "ko", hreflang: "ko", htmlLang: "ko", outFile: "ko/index.html", assetPrefix: "../", manualFile: "ko.html" },
  { id: "de", hreflang: "de", htmlLang: "de", outFile: "de/index.html", assetPrefix: "../", manualFile: "de.html" },
  { id: "fr", hreflang: "fr", htmlLang: "fr", outFile: "fr/index.html", assetPrefix: "../", manualFile: "fr.html" },
  { id: "pt", hreflang: "pt", htmlLang: "pt", outFile: "pt/index.html", assetPrefix: "../", manualFile: "pt.html" },
  { id: "it", hreflang: "it", htmlLang: "it", outFile: "it/index.html", assetPrefix: "../", manualFile: "it.html" },
  { id: "es", hreflang: "es", htmlLang: "es", outFile: "es/index.html", assetPrefix: "../", manualFile: "es.html" },
  { id: "nl", hreflang: "nl", htmlLang: "nl", outFile: "nl/index.html", assetPrefix: "../", manualFile: "nl.html" },
  { id: "ru", hreflang: "ru", htmlLang: "ru", outFile: "ru/index.html", assetPrefix: "../", manualFile: "ru.html" },
];

function escHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replaceDataI18n(html, lang) {
  return html.replace(/data-i18n="([^"]+)"([^>]*)>([\s\S]*?)<\/(\w+)/g, function (_match, key, attrs, _inner, closeTag) {
    const text = escHtml(t(lang, key));
    return 'data-i18n="' + key + '"' + attrs + ">" + text + "</" + closeTag;
  });
}

function replaceDataI18nAlt(html, lang) {
  return html.replace(/\salt="[^"]*"\s+data-i18n-alt="([^"]+)"/g, function (_match, key) {
    return ' alt="' + escHtml(t(lang, key)) + '"';
  });
}

function stripDataI18n(html) {
  return html.replace(/\s*data-i18n="[^"]*"/g, "").replace(/\s*data-i18n-alt="[^"]*"/g, "");
}

function pageUrl(outFile) {
  if (outFile === "index.html") return SITE_BASE + "/";
  return SITE_BASE + "/" + outFile.replace(/index\.html$/, "");
}

function buildHreflangHead(canonicalOutFile) {
  const lines = [];
  for (const loc of LOCALES) {
    lines.push(
      '    <link rel="alternate" hreflang="' +
        loc.hreflang +
        '" href="' +
        pageUrl(loc.outFile) +
        '" />'
    );
  }
  lines.push('    <link rel="alternate" hreflang="x-default" href="' + pageUrl("index.html") + '" />');
  lines.push('    <link rel="canonical" href="' + pageUrl(canonicalOutFile) + '" />');
  return lines.join("\n");
}

function metaTitle(lang) {
  const tagline = t(lang, "hero_tagline").replace(/\.$/, "");
  return "PlainBytes Redactor — " + tagline;
}

function metaDescription(lang) {
  const lead = t(lang, "hero_lead");
  if (lead.length <= 160) return lead;
  return lead.slice(0, 157).trim() + "…";
}

function buildPage(template, locale) {
  let html = template;
  html = html.replace(/\{\{HTML_LANG\}\}/g, locale.htmlLang);
  html = html.replace(/\{\{DATA_LANG\}\}/g, locale.id);
  html = html.replace(/\{\{DATA_BASE\}\}/g, locale.assetPrefix);
  html = html.replace(/\{\{ASSET_PREFIX\}\}/g, locale.assetPrefix);
  html = html.replace(/\{\{MANUAL_FILE\}\}/g, locale.manualFile);
  html = html.replace(/\{\{PAGE_TITLE\}\}/g, escHtml(metaTitle(locale.id)));
  html = html.replace(/\{\{META_DESCRIPTION\}\}/g, escHtml(metaDescription(locale.id)));
  html = html.replace(/\{\{HREFLANG_HEAD\}\}/g, buildHreflangHead(locale.outFile));
  html = replaceDataI18n(html, locale.id);
  html = replaceDataI18nAlt(html, locale.id);
  html = stripDataI18n(html);
  return html;
}

function buildSitemap() {
  const urls = LOCALES.map(function (loc) {
    const locUrl = pageUrl(loc.outFile);
    const altLinks = LOCALES.map(function (alt) {
      return (
        '    <xhtml:link rel="alternate" hreflang="' +
        alt.hreflang +
        '" href="' +
        pageUrl(alt.outFile) +
        '" />'
      );
    }).join("\n");
    return (
      "  <url>\n" +
      "    <loc>" +
      locUrl +
      "</loc>\n" +
      altLinks +
      "\n" +
      "    <changefreq>monthly</changefreq>\n" +
      "    <priority>" +
      (loc.id === "en" ? "1.0" : "0.9") +
      "</priority>\n" +
      "  </url>"
    );
  }).join("\n");

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    urls +
    "\n</urlset>\n"
  );
}

function main() {
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");

  for (const locale of LOCALES) {
    const html = buildPage(template, locale);
    const outPath = path.join(WEBSITE_DIR, locale.outFile);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, "utf8");
    console.log("Wrote " + locale.outFile);
  }

  fs.writeFileSync(path.join(WEBSITE_DIR, "sitemap.xml"), buildSitemap(), "utf8");
  console.log("Wrote sitemap.xml");

  const redirectHtml =
    "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta http-equiv=\"refresh\" content=\"0;url=index.html\" />\n    <link rel=\"canonical\" href=\"index.html\" />\n    <title>Redirecting…</title>\n    <script>location.replace(\"index.html\");</script>\n  </head>\n  <body>\n    <p><a href=\"index.html\">PlainBytes Redactor</a></p>\n  </body>\n</html>\n";
  fs.writeFileSync(path.join(WEBSITE_DIR, "PlainBytes.Redactor.html"), redirectHtml, "utf8");
  console.log("Wrote PlainBytes.Redactor.html (redirect)");

  const robots = "User-agent: *\nAllow: /\n\nSitemap: " + SITE_BASE + "/sitemap.xml\n";
  fs.writeFileSync(path.join(WEBSITE_DIR, "robots.txt"), robots, "utf8");
  console.log("Wrote robots.txt");
  console.log("SITE_BASE_URL=" + SITE_BASE);
}

main();
