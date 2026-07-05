/**
 * Private Label QR site language switcher.
 */
(function () {
  var HOME_ROUTES = {
    en: "index.html",
    zh: "zh-hans.html",
    "zh-Hant": "zh-hant.html",
    de: "de.html",
    fr: "fr.html",
    ja: "ja.html",
    kr: "kr.html",
    it: "it.html",
    es: "es.html",
    pt: "pt.html",
    nl: "nl.html",
    ru: "ru.html",
  };

  function assetBase() {
    var fromAttr = document.documentElement.getAttribute("data-base");
    if (fromAttr !== null) return fromAttr;
    return "";
  }

  function currentLang() {
    var fromPage = document.documentElement.getAttribute("data-lang");
    if (fromPage && HOME_ROUTES[fromPage]) return fromPage;
    try {
      var saved = localStorage.getItem("plainbytes-site-lang");
      if (saved && HOME_ROUTES[saved]) return saved;
    } catch (e) {}
    return "en";
  }

  function homeUrl(lang) {
    var route = HOME_ROUTES[lang];
    if (!route) return null;
    return assetBase() + route;
  }

  function initLangSelect() {
    var sel = document.getElementById("lang-select");
    if (!sel || sel.getAttribute("data-lang-nav") === "1") return;
    sel.setAttribute("data-lang-nav", "1");

    var current = currentLang();
    if (HOME_ROUTES[current]) sel.value = current;

    sel.addEventListener("change", function () {
      var lang = sel.value;
      if (lang === currentLang()) return;
      var url = homeUrl(lang);
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
})();
