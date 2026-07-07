/**
 * Sync manual Quick Start YouTube IDs from website per-locale config.
 */
const fs = require("fs");
const path = require("path");

const MANUAL_DIR = path.join(__dirname, "..");
const { youtubeIdForManual } = require(path.join(
  __dirname,
  "..",
  "..",
  "website",
  "scripts",
  "youtube-videos.js"
));

const VIDEO_CSS = `  /* Quick start video (YouTube — same as website home) */
  .video-card{
    background:var(--bg-dark);border-radius:14px;overflow:hidden;
    margin:1.5rem 0 2.5rem;
  }
  .video-frame{
    aspect-ratio:16/9;background:linear-gradient(135deg,#241a14 0%,#1a1410 100%);
    display:flex;align-items:center;justify-content:center;position:relative;
    width:100%;border:0;padding:0;cursor:pointer;font:inherit;
  }
  .video-frame:hover .play-btn{transform:scale(1.06)}
  .play-btn{
    width:64px;height:64px;border-radius:50%;background:var(--red);
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 8px 24px rgba(179,54,43,.4);
    transition:transform .2s;pointer-events:none;
  }
  .play-btn::after{
    content:'';width:0;height:0;
    border-style:solid;border-width:9px 0 9px 15px;
    border-color:transparent transparent transparent #fff;
    margin-left:3px;
  }
  .video-caption{padding:1rem 1.25rem;color:rgba(255,255,255,.55);font-size:.82rem}

  body.video-modal-open{overflow:hidden}
  .video-modal{
    position:fixed;inset:0;z-index:2100;
    display:flex;align-items:center;justify-content:center;
  }
  .video-modal[hidden]{display:none}
  .video-modal__backdrop{
    position:absolute;inset:0;
    background:rgba(15,15,15,.9);cursor:pointer;
  }
  .video-modal__dialog{
    position:relative;z-index:1;
    width:70vw;max-width:70vw;padding:16px;box-sizing:border-box;
  }
  .video-modal__caption{
    margin:14px 0 0;text-align:center;
    font-size:.9375rem;font-weight:500;color:#e8e6e0;
  }
  .video-modal__frame-wrap{
    position:relative;width:100%;aspect-ratio:16/9;
    background:#000;border-radius:10px;overflow:hidden;
    box-shadow:0 24px 64px rgba(0,0,0,.5);
  }
  .video-modal__iframe{
    position:absolute;inset:0;width:100%;height:100%;border:0;
  }
  .video-modal__iframe iframe{
    width:100%;height:100%;border:0;
  }
  .modal-close{
    position:absolute;top:16px;right:16px;z-index:3;
    width:40px;height:40px;padding:0;
    border:.5px solid rgba(255,255,255,.28);border-radius:50%;
    background:rgba(255,255,255,.1);color:#f5f4f0;
    font-size:1.625rem;line-height:1;cursor:pointer;
    transition:background .15s ease;
  }
  .modal-close:hover{background:rgba(255,255,255,.18)}`;

const VIDEO_MODAL_SCRIPT = `<script>
(function () {
  var triggers = document.querySelectorAll(".js-video-modal");
  if (!triggers.length) return;

  var open = false;
  var root = document.createElement("div");
  root.className = "video-modal";
  root.hidden = true;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Product demo video");
  root.innerHTML =
    '<div class="video-modal__backdrop" data-video-modal-close></div>' +
    '<button type="button" class="modal-close video-modal__close" aria-label="Close">&times;</button>' +
    '<div class="video-modal__dialog">' +
    '  <div class="video-modal__frame-wrap">' +
    '    <iframe class="video-modal__iframe" title="PlainBytes Redactor demo" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>' +
    "  </div>" +
    '  <p class="video-modal__caption"></p>' +
    "</div>";
  document.body.appendChild(root);

  var iframe = root.querySelector(".video-modal__iframe");
  var caption = root.querySelector(".video-modal__caption");
  var btnClose = root.querySelector(".video-modal__close");
  var dialog = root.querySelector(".video-modal__dialog");
  var frameWrap = root.querySelector(".video-modal__frame-wrap");

  function embedUrl(videoId) {
    var origin = window.location.origin;
    if (!origin || origin === "null") {
      origin = window.location.protocol + "//" + window.location.host;
    }
    return (
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(videoId) +
      "?rel=0&autoplay=1&origin=" +
      encodeURIComponent(origin)
    );
  }

  function openModal(videoId, title) {
    if (!videoId) return;
    iframe.src = embedUrl(videoId);
    caption.textContent = title || "";
    root.hidden = false;
    open = true;
    document.body.classList.add("video-modal-open");
    btnClose.focus();
  }

  function closeModal() {
    root.hidden = true;
    open = false;
    document.body.classList.remove("video-modal-open");
    iframe.src = "";
    caption.textContent = "";
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var videoId = trigger.getAttribute("data-youtube-id");
      var title =
        trigger.getAttribute("aria-label") ||
        (trigger.nextElementSibling &&
          trigger.nextElementSibling.classList.contains("video-caption")
          ? trigger.nextElementSibling.textContent.trim()
          : "");
      openModal(videoId, title);
    });
  });

  btnClose.addEventListener("click", function (e) {
    e.stopPropagation();
    closeModal();
  });
  root.querySelector(".video-modal__backdrop").addEventListener("click", closeModal);
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog || e.target === caption) closeModal();
  });
  frameWrap.addEventListener("click", function (e) {
    e.stopPropagation();
  });
  document.addEventListener("keydown", function (e) {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
    }
  });
})();
</script>`;

function videoCardHtml(youtubeId, caption) {
  const label = caption.replace(/"/g, "&quot;");
  return `<div class="video-card">
      <button type="button" class="video-frame js-video-modal" data-youtube-id="${youtubeId}" aria-label="${label}">
        <span class="play-btn" aria-hidden="true"></span>
      </button>
      <div class="video-caption">${caption}</div>
    </div>`;
}

function patchFile(filePath) {
  const base = path.basename(filePath);
  const youtubeId = youtubeIdForManual(base);
  let html = fs.readFileSync(filePath, "utf8");
  let changed = false;

  const videoBlockRe =
    /<div class="video-card">[\s\S]*?<div class="video-caption">([^<]*)<\/div>\s*<\/div>/;
  const vm = html.match(videoBlockRe);
  if (vm) {
    const next = videoCardHtml(youtubeId, vm[1]);
    if (vm[0] !== next) {
      html = html.replace(videoBlockRe, next);
      changed = true;
    }
  } else if (html.includes('class="video-frame js-video-modal"')) {
    const oldId = html.match(/data-youtube-id="([^"]+)"/);
    if (!oldId || oldId[1] !== youtubeId) {
      html = html.replace(/data-youtube-id="[^"]+"/, `data-youtube-id="${youtubeId}"`);
      changed = true;
    }
  }

  const cssRe =
    /  \/\* Quick start video[^*]*\*\/[\s\S]*?\.modal-close:hover\{background:rgba\(255,255,255,\.18\)\}/;
  if (!cssRe.test(html)) {
    const oldCssRe =
      /  \/\* Quick start video[^*]*\*\/[\s\S]*?\.video-caption\{[^}]+\}/;
    if (oldCssRe.test(html)) {
      html = html.replace(oldCssRe, VIDEO_CSS);
      changed = true;
    }
  }

  if (!html.includes("js-video-modal") || !html.includes("video-modal__iframe")) {
    if (html.includes("Product demo video")) {
      // already has modal script from partial patch
    } else {
      html = html.replace(/\s*<\/body>/, "\n" + VIDEO_MODAL_SCRIPT + "\n</body>");
      changed = true;
    }
  } else if (!html.includes("Product demo video")) {
    html = html.replace(/\s*<\/body>/, "\n" + VIDEO_MODAL_SCRIPT + "\n</body>");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, "utf8");
    console.log("Patched", base, "->", youtubeId);
  } else {
    console.log("Skip (up to date)", base, "->", youtubeId);
  }
}

const files = fs
  .readdirSync(MANUAL_DIR)
  .filter((f) => f.endsWith(".html"))
  .map((f) => path.join(MANUAL_DIR, f));

for (const file of files) patchFile(file);
