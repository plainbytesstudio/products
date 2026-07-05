/**
 * Site-wide language switcher: home pages and manual pages (SEO static HTML).
 */
(function () {
  var HOME_ROUTES = {
    en: "index.html",
    zh: "zh/index.html",
    "zh-Hant": "zh-hant/index.html",
    ja: "ja/index.html",
    ko: "ko/index.html",
    de: "de/index.html",
    fr: "fr/index.html",
    pt: "pt/index.html",
    it: "it/index.html",
    es: "es/index.html",
    nl: "nl/index.html",
    ru: "ru/index.html",
  };

  var MANUAL_FILES = {
    en: "en.html",
    zh: "zh-Hans.html",
    "zh-Hant": "zh-Hant.html",
    ja: "ja.html",
    ko: "ko.html",
    de: "de.html",
    fr: "fr.html",
    pt: "pt.html",
    it: "it.html",
    es: "es.html",
    nl: "nl.html",
    ru: "ru.html",
  };

  function assetBase() {
    var fromAttr = document.documentElement.getAttribute("data-base");
    if (fromAttr !== null) return fromAttr;
    var path = window.location.pathname.replace(/\\/g, "/");
    if (/\/manual\//i.test(path)) return "../";
    if (/\/(zh-hant|zh|ja|ko|de|fr|pt|it|es|nl|ru)\//i.test(path)) return "../";
    return "";
  }

  function isManualPage() {
    if (document.documentElement.getAttribute("data-page") === "manual") return true;
    return /\/manual\//i.test(window.location.pathname.replace(/\\/g, "/"));
  }

  function homeUrl(lang) {
    var route = HOME_ROUTES[lang];
    if (!route) return null;
    return assetBase() + route;
  }

  function manualUrl(lang) {
    var file = MANUAL_FILES[lang];
    if (!file) return null;
    if (isManualPage()) return file;
    return assetBase() + "manual/" + file;
  }

  function langFromManualFilename() {
    var path = window.location.pathname.replace(/\\/g, "/");
    var m = path.match(/\/([^/]+)\.html$/i);
    if (!m) return null;
    var stem = m[1];
    if (stem === "en") return "en";
    if (stem === "zh-Hans") return "zh";
    if (stem === "zh-Hant") return "zh-Hant";
    if (MANUAL_FILES[stem]) return stem;
    return null;
  }

  function currentLang() {
    var fromPage = document.documentElement.getAttribute("data-lang");
    if (fromPage && (HOME_ROUTES[fromPage] || MANUAL_FILES[fromPage])) return fromPage;
    if (isManualPage()) {
      var fromFile = langFromManualFilename();
      if (fromFile) return fromFile;
    }
    try {
      var saved = localStorage.getItem("plainbytes-site-lang");
      if (saved && (HOME_ROUTES[saved] || MANUAL_FILES[saved])) return saved;
    } catch (e) {}
    return "en";
  }

  function targetUrl(lang) {
    if (isManualPage()) return manualUrl(lang);
    return homeUrl(lang);
  }

  function initLangSelect() {
    var sel = document.getElementById("lang-select");
    if (!sel || sel.getAttribute("data-lang-nav") === "1") return;
    sel.setAttribute("data-lang-nav", "1");

    var current = currentLang();
    sel.value = current;

    sel.addEventListener("change", function () {
      var lang = sel.value;
      if (lang === currentLang()) return;
      var url = targetUrl(lang);
      if (!url) return;
      try {
        localStorage.setItem("plainbytes-site-lang", lang);
      } catch (e) {}
      window.location.href = url;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLangSelect);
  } else {
    initLangSelect();
  }

  window.PlainBytesLangNav = {
    HOME_ROUTES: HOME_ROUTES,
    MANUAL_FILES: MANUAL_FILES,
    homeUrl: homeUrl,
    manualUrl: manualUrl,
    assetBase: assetBase,
    currentLang: currentLang,
    isManualPage: isManualPage,
  };
})();
