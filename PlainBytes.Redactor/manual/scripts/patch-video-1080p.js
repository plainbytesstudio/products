/**
 * Upgrade manual YouTube modal to IFrame API (prefer 1080p).
 */
const fs = require("fs");
const path = require("path");

const MANUAL_DIR = path.join(__dirname, "..");
const VIDEO_MODAL_JS = fs.readFileSync(
  path.join(__dirname, "..", "..", "website", "js", "video-modal.js"),
  "utf8"
);

const VIDEO_MODAL_SCRIPT =
  "<script>\n" +
  VIDEO_MODAL_JS.replace(/^\/\*\*[\s\S]*?\*\/\s*/, "") +
  "\n</script>";

const OLD_SCRIPT_RE =
  /<script>\s*\(function \(\) \{\s*var triggers = document\.querySelectorAll\("\.js-video-modal"\);[\s\S]*?\}\)\(\);\s*<\/script>/;

const IFRAME_CSS = `  .video-modal__iframe iframe{
    width:100%;height:100%;border:0;
  }`;

function patchFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  let changed = false;

  if (OLD_SCRIPT_RE.test(html)) {
    html = html.replace(OLD_SCRIPT_RE, VIDEO_MODAL_SCRIPT);
    changed = true;
  }

  if (!html.includes(".video-modal__iframe iframe{")) {
    html = html.replace(
      /  \.video-modal__iframe\{\s*position:absolute;inset:0;width:100%;height:100%;border:0;\s*\}/,
      `  .video-modal__iframe{
    position:absolute;inset:0;width:100%;height:100%;border:0;
  }
${IFRAME_CSS}`
    );
    changed = true;
  }

  if (html.includes('<iframe class="video-modal__iframe"')) {
    html = html.replace(
      /'    <iframe class="video-modal__iframe"[^']*'<\/iframe>' \+/,
      "'    <div id=\"video-modal-player\" class=\"video-modal__iframe\"></div>' +"
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, "utf8");
    console.log("Updated", path.basename(filePath));
  } else {
    console.log("Skip", path.basename(filePath));
  }
}

for (const file of fs.readdirSync(MANUAL_DIR).filter((f) => f.endsWith(".html"))) {
  patchFile(path.join(MANUAL_DIR, file));
}
