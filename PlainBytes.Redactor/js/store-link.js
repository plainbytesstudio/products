/**
 * Microsoft Store links: never navigate the marketing page in-place.
 * Windows → ms-windows-store:// (same as desktop app); others → new browser tab.
 */
(function () {
  var STORE_WEB = "https://apps.microsoft.com/detail/9n2vlpn4wdk1";
  var STORE_WINDOWS = "ms-windows-store://pdp/?ProductId=9N2VLPN4WDK1";

  function isWindows() {
    return /Windows/i.test(navigator.userAgent || "");
  }

  function launchWindowsStore() {
    var link = document.createElement("a");
    link.href = STORE_WINDOWS;
    link.rel = "noopener noreferrer";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function openStoreWebTab() {
    var opened = window.open(STORE_WEB, "_blank", "noopener,noreferrer");
    if (!opened) {
      // Popup blocked: fall back without replacing current page when possible.
      var link = document.createElement("a");
      link.href = STORE_WEB;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }

  function onStoreClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isWindows()) {
      launchWindowsStore();
      return;
    }
    openStoreWebTab();
  }

  function init() {
    var links = document.querySelectorAll(".js-store-link");
    links.forEach(function (a) {
      if (a.getAttribute("data-store-link") === "1") return;
      a.setAttribute("data-store-link", "1");
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
      a.addEventListener("click", onStoreClick);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
