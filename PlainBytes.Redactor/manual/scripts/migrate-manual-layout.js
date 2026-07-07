/**
 * Migrate legacy manual HTML to the en.html layout shell.
 * Usage: node scripts/migrate-manual-layout.js [zh-Hans.html ...]
 */
const fs = require("fs");
const path = require("path");
const { youtubeIdForManual } = require(path.join(
  __dirname,
  "..",
  "..",
  "website",
  "scripts",
  "youtube-videos.js"
));

const MANUAL_DIR = path.join(__dirname, "..");
const SHELL_PATH = path.join(MANUAL_DIR, "en.html");

const LOCALE = {
  "zh-Hans.html": {
    dataLang: "zh",
    htmlLang: "zh-Hans",
    title: "PlainBytes Redactor 使用手册",
    description: "PlainBytes Redactor 完整使用手册：工作流程、规则中心、批量处理与常见问题。",
    home: "../zh/index.html",
    self: "zh-Hans.html",
    navHome: "首页",
    navGuide: "使用手册",
    store: "在 Microsoft Store 获取",
    heroKicker: "使用手册",
    heroTitle: "PlainBytes Redactor 使用手册",
    heroLead: "与当前 Windows 客户端能力对齐；若与已安装版本不一致，以软件内界面为准。",
    tocMobile: "目录",
    videoLocale: "zh-Hans",
    videoCaption: "完整流程演示 · 2 分钟",
    footerNote: "© PlainBytes Studio · 文档随产品迭代更新，请以最新软件为准。",
  },
  "zh-Hant.html": {
    dataLang: "zh-Hant",
    htmlLang: "zh-Hant",
    title: "PlainBytes Redactor 使用手冊",
    description: "PlainBytes Redactor 完整使用手冊：工作流程、規則中心、批次處理與常見問題。",
    home: "../zh-hant/index.html",
    self: "zh-Hant.html",
    navHome: "首頁",
    navGuide: "使用手冊",
    store: "在 Microsoft Store 取得",
    heroKicker: "使用手冊",
    heroTitle: "PlainBytes Redactor 使用手冊",
    heroLead: "本手冊依目前 Windows 用戶端功能撰寫；若與您安裝的版本不完全一致，請以軟體內的介面為準。",
    tocMobile: "目錄",
    videoLocale: "zh-Hant",
    videoCaption: "完整流程演示 · 2 分鐘",
    footerNote: "© PlainBytes Studio · 文件隨產品迭代更新，請以最新軟體為準。",
  },
  "de.html": {
    dataLang: "de",
    htmlLang: "de",
    title: "Benutzerhandbuch — PlainBytes Redactor",
    description: "Benutzerhandbuch für PlainBytes Redactor: Workflow, Regeln, Stapelverarbeitung und FAQ.",
    home: "../de/index.html",
    self: "de.html",
    navHome: "Startseite",
    navGuide: "Benutzerhandbuch",
    store: "Im Microsoft Store",
    heroKicker: "dokumentation",
    heroTitle: "PlainBytes Redactor Benutzerhandbuch",
    heroLead:
      "Geschrieben für die aktuelle Windows-Desktop-App. Wenn etwas hier von Ihrer installierten Version abweicht, gilt die Benutzeroberfläche in der App.",
    tocMobile: "Inhalt",
    videoLocale: "de",
    videoCaption: "Vollständige Workflow-Demo · 2 Min.",
    footerNote:
      "© PlainBytes Studio · Wird mit dem Produkt aktualisiert; Ihre installierte Version ist maßgeblich.",
  },
  "fr.html": {
    dataLang: "fr",
    htmlLang: "fr",
    title: "Guide utilisateur — PlainBytes Redactor",
    description:
      "Guide utilisateur de PlainBytes Redactor : flux de travail, règles, traitement par lot et FAQ.",
    home: "../fr/index.html",
    self: "fr.html",
    navHome: "Accueil",
    navGuide: "Guide utilisateur",
    store: "Obtenir sur le Microsoft Store",
    heroKicker: "documentation",
    heroTitle: "Guide d'utilisation de PlainBytes Redactor",
    heroLead:
      "Rédigé pour la version actuelle de l'application Windows. Si un point ne correspond pas à la version installée chez vous, fiez-vous à l'interface de l'application.",
    tocMobile: "Sommaire",
    videoLocale: "fr",
    videoCaption: "Démonstration complète · 2 min",
    footerNote:
      "© PlainBytes Studio · Mis à jour avec le produit ; la version installée fait foi.",
  },
  "es.html": {
    dataLang: "es",
    htmlLang: "es",
    title: "Guía de usuario — PlainBytes Redactor",
    description:
      "Guía de usuario de PlainBytes Redactor: flujo de trabajo, reglas, procesamiento por lotes y FAQ.",
    home: "../es/index.html",
    self: "es.html",
    navHome: "Inicio",
    navGuide: "Guía de usuario",
    store: "Obtener en Microsoft Store",
    heroKicker: "documentación",
    heroTitle: "Guía de usuario de PlainBytes Redactor",
    heroLead:
      "Redactada para la aplicación de escritorio Windows actual. Si algo no coincide con la versión instalada, prevalece la interfaz de la aplicación.",
    tocMobile: "Contenido",
    videoLocale: "es",
    videoCaption: "Demostración completa · 2 min",
    footerNote:
      "© PlainBytes Studio · Se actualiza con el producto; la versión instalada es la referencia.",
  },
  "ja.html": {
    dataLang: "ja",
    htmlLang: "ja",
    title: "PlainBytes Redactor ユーザーガイド",
    description: "PlainBytes Redactor のユーザーガイド：ワークフロー、ルール、一括処理、FAQ。",
    home: "../ja/index.html",
    self: "ja.html",
    navHome: "ホーム",
    navGuide: "ユーザーガイド",
    store: "Microsoft Store で入手",
    heroKicker: "ユーザーガイド",
    heroTitle: "PlainBytes Redactor ユーザーガイド",
    heroLead:
      "現在の Windows デスクトップアプリ向けのガイドです。ここに書かれている内容とインストール済みビルドの表示が異なる場合は、アプリ内のUIを優先してください。",
    tocMobile: "目次",
    videoLocale: "ja",
    videoCaption: "ワークフロー全体のデモ · 2 分",
    footerNote:
      "© PlainBytes Studio · 製品の更新に合わせて改訂されます。最終的には、インストール済みのビルドが正です。",
  },
  "ko.html": {
    dataLang: "ko",
    htmlLang: "ko",
    title: "PlainBytes Redactor 사용자 가이드",
    description: "PlainBytes Redactor 사용자 가이드: 워크플로, 규칙, 일괄 처리 및 FAQ.",
    home: "../ko/index.html",
    self: "ko.html",
    navHome: "홈",
    navGuide: "사용자 가이드",
    store: "Microsoft Store에서 받기",
    heroKicker: "사용자 가이드",
    heroTitle: "PlainBytes Redactor 사용자 가이드",
    heroLead:
      "현재 Windows 데스크톱 앱 기준으로 작성되었습니다. 설치된 버전과 내용이 다를 경우 앱 안의 화면을 기준으로 삼으세요.",
    tocMobile: "목차",
    videoLocale: "ko",
    videoCaption: "전체 워크플로 데모 · 2분",
    footerNote:
      "© PlainBytes Studio · 문서는 제품 변화에 따라 업데이트됩니다. 설치된 버전이 최종 기준입니다.",
  },
  "pt.html": {
    dataLang: "pt",
    htmlLang: "pt",
    title: "Guia do usuário do PlainBytes Redactor",
    description:
      "Guia do usuário do PlainBytes Redactor: fluxo de trabalho, regras, processamento em lote e FAQ.",
    home: "../pt/index.html",
    self: "pt.html",
    navHome: "Início",
    navGuide: "Guia do usuário",
    store: "Baixar na Microsoft Store",
    heroKicker: "documentação",
    heroTitle: "Guia do usuário do PlainBytes Redactor",
    heroLead:
      "Escrito para o aplicativo desktop Windows atual. Se algo aqui não corresponder à versão instalada, confie na interface do aplicativo.",
    tocMobile: "Conteúdo",
    videoLocale: "pt",
    videoCaption: "Demonstração do fluxo completo · 2 min",
    footerNote:
      "© PlainBytes Studio · Documento atualizado conforme o produto evolui; a versão instalada continua sendo a fonte de referência.",
  },
  "it.html": {
    dataLang: "it",
    htmlLang: "it",
    title: "Guida utente di PlainBytes Redactor",
    description:
      "Guida utente di PlainBytes Redactor: flusso di lavoro, regole, elaborazione batch e FAQ.",
    home: "../it/index.html",
    self: "it.html",
    navHome: "Home",
    navGuide: "Guida utente",
    store: "Ottieni da Microsoft Store",
    heroKicker: "documentazione",
    heroTitle: "Guida utente di PlainBytes Redactor",
    heroLead:
      "Scritta per l'attuale app desktop per Windows. Se qualcosa non coincide con la versione installata, fa fede l'interfaccia dell'app.",
    tocMobile: "Sommario",
    videoLocale: "it",
    videoCaption: "Demo del flusso completo · 2 min",
    footerNote:
      "© PlainBytes Studio · Documento aggiornato con l'evoluzione del prodotto; la versione installata resta la fonte di riferimento.",
  },
  "nl.html": {
    dataLang: "nl",
    htmlLang: "nl",
    title: "Gebruikershandleiding voor PlainBytes Redactor",
    description:
      "Gebruikershandleiding voor PlainBytes Redactor: workflow, regels, batchverwerking en FAQ.",
    home: "../nl/index.html",
    self: "nl.html",
    navHome: "Start",
    navGuide: "Gebruikershandleiding",
    store: "Downloaden via Microsoft Store",
    heroKicker: "documentatie",
    heroTitle: "Gebruikershandleiding voor PlainBytes Redactor",
    heroLead:
      "Geschreven voor de huidige Windows-desktopapp. Als iets hier afwijkt van de versie die u hebt geïnstalleerd, vertrouw dan op de interface in de app.",
    tocMobile: "Inhoud",
    videoLocale: "nl",
    videoCaption: "Demo van de volledige workflow · 2 min",
    footerNote:
      "© PlainBytes Studio · Dit document wordt bijgewerkt naarmate het product evolueert; de geïnstalleerde versie blijft de bron van waarheid.",
  },
  "ru.html": {
    dataLang: "ru",
    htmlLang: "ru",
    title: "Руководство пользователя PlainBytes Redactor",
    description:
      "Руководство пользователя PlainBytes Redactor: рабочий процесс, правила, пакетная обработка и FAQ.",
    home: "../ru/index.html",
    self: "ru.html",
    navHome: "Главная",
    navGuide: "Руководство пользователя",
    store: "Получить в Microsoft Store",
    heroKicker: "документация",
    heroTitle: "Руководство пользователя PlainBytes Redactor",
    heroLead:
      "Написано для текущего настольного приложения Windows. Если что-то здесь отличается от установленной у вас сборки, ориентируйтесь на интерфейс приложения.",
    tocMobile: "Содержание",
    videoLocale: "ru",
    videoCaption: "Демонстрация полного процесса · 2 мин",
    footerNote:
      "© PlainBytes Studio · Обновляется по мере развития продукта; установленная у вас сборка остается источником истины.",
  },
};

const EXTRA_CSS = `
  .content .example{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:1.4rem 1.5rem;margin:1rem 0}
  .content .example h3{margin-top:0;color:var(--red-dk);font-size:1rem}
  .content .note{border-left:3px solid var(--red);background:var(--accent-lt);padding:1rem 1.25rem;border-radius:0 10px 10px 0;margin:1.5rem 0;font-size:.95rem}
`;

function buildToc(oldHtml) {
  const navMatch = oldHtml.match(/<div class="toc-chapters">([\s\S]*?)<\/div>\s*<\/nav>/);
  if (!navMatch) return '<div class="toc-content"></div>';
  const inner = navMatch[1];
  let out = '<div class="toc-content">\n';

  const qs = inner.match(
    /<a href="#quick-start" class="toc-chapter-link">([^<]+)<\/a>/
  );
  if (qs) {
    out += `      <div class="toc-block">\n        <a href="#quick-start" class="toc-link">${qs[1]}</a>\n      </div>\n\n`;
  }

  const detailsRe = /<details class="toc-chapter"[^>]*>([\s\S]*?)<\/details>/g;
  let m;
  while ((m = detailsRe.exec(inner))) {
    const block = m[1];
    const chap = block.match(/<a href="#([^"]+)" class="toc-chapter-link">([^<]+)<\/a>/);
    if (!chap || chap[1] === "quick-start") continue;
    out += `      <div class="toc-block">\n        <div class="toc-block-label">${chap[2]}</div>\n        <div class="toc-sub">\n`;
    const ul = block.match(/<ul class="toc-sublist">([\s\S]*?)<\/ul>/);
    if (ul) {
      const linkRe = /<a href="#([^"]+)">([^<]+)<\/a>/g;
      let lm;
      while ((lm = linkRe.exec(ul[1]))) {
        out += `          <a href="#${lm[1]}" class="toc-link">${lm[2]}</a>\n`;
      }
    }
    out += "        </div>\n      </div>\n\n";
  }
  out += "    </div>";
  return out;
}

function videoCard(manualFile, caption) {
  const youtubeId = youtubeIdForManual(manualFile);
  const label = caption.replace(/"/g, "&quot;");
  return `<div class="video-card">
      <button type="button" class="video-frame js-video-modal" data-youtube-id="${youtubeId}" aria-label="${label}">
        <span class="play-btn" aria-hidden="true"></span>
      </button>
      <div class="video-caption">${caption}</div>
    </div>`;
}

function transformContent(raw, meta, manualFile) {
  let content = raw;
  content = content.replace(/<h1>[\s\S]*?<\/h1>\s*/i, "");
  content = content.replace(/<p class="sub">[\s\S]*?<\/p>\s*/i, "");
  content = content.replace(/<\/?section[^>]*>/gi, "");
  content = content.replace(/<h2>(\d+)\.\s*([^<]+)<\/h2>/g, '<h2><span class="num">$1</span>$2</h2>');
  content = content.replace(/<h2>([^<]+)<\/h2>/, '<h2 id="quick-start">$1</h2>');
  content = content.replace(/table class="compare"/g, "table");
  content = content.replace(
    /<figure class="doc-screenshot doc-video"[\s\S]*?<\/figure>/,
    videoCard(manualFile, meta.videoCaption)
  );
  content = content.replace(/<footer>[\s\S]*?<\/footer>\s*/i, "");
  content = content.trim();
  content += `\n\n    <div class="footer-note">\n      ${meta.footerNote}\n    </div>`;
  return content;
}

function extractMain(oldHtml, meta, manualFile) {
  const m = oldHtml.match(/<div class="doc-main">([\s\S]*?)<\/div>\s*<\/div>\s*<script>/);
  if (!m) throw new Error("Could not find doc-main");
  return transformContent(m[1], meta, manualFile);
}

function buildPage(fileName, meta, oldHtml, shell) {
  let css = shell.css;
  if (!css.includes(".content .example")) {
    css = css.replace("</style>", EXTRA_CSS + "\n</style>");
  }

  const head = `<!DOCTYPE html>
<html lang="${meta.htmlLang}" data-lang="${meta.dataLang}" data-base="../" data-page="manual">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${meta.title}</title>
<meta name="description" content="${meta.description}" />
<link rel="icon" type="image/x-icon" href="../assets/Redactor_Logo.ico" />

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />

<style>
${css}
</style>
</head>
<body class="manual-page">

<header class="site-header site-header--on-dark">
  <div class="container inner">
    <a class="brand" href="${meta.home}">
      <img
        class="brand-logo"
        src="../assets/Redactor_Logo.png"
        alt=""
        aria-hidden="true"
        width="28"
        height="28"
      />
      <span>PlainBytes Redactor</span>
    </a>
    <div class="header-actions">
      <a class="site-nav-link" href="${meta.home}">${meta.navHome}</a>
      <a class="site-nav-link site-nav-link--current" href="${meta.self}" aria-current="page">${meta.navGuide}</a>
      <label class="visually-hidden" for="lang-select">Language</label>
      <select id="lang-select" class="lang-select" aria-label="Language">
        <option value="en">English</option>
        <option value="zh">中文</option>
        <option value="zh-Hant">繁體中文</option>
        <option value="ja">日本語</option>
        <option value="ko">한국어</option>
        <option value="de">Deutsch</option>
        <option value="fr">Français</option>
        <option value="pt">Português</option>
        <option value="it">Italiano</option>
        <option value="es">Español</option>
        <option value="nl">Nederlands</option>
        <option value="ru">Русский</option>
      </select>
      <a
        class="btn btn-accent btn-accent--sm js-store-link"
        href="https://apps.microsoft.com/detail/9n2vlpn4wdk1"
        target="_blank"
        rel="noopener noreferrer"
        >${meta.store}</a
      >
    </div>
  </div>
</header>

<div class="manual-top">
  <section class="manual-hero">
    <div class="manual-hero__inner">
      <div class="manual-hero__copy">
        <p class="manual-hero__kicker">${meta.heroKicker}</p>
        <h1>${meta.heroTitle}</h1>
        <p class="manual-hero__lead">${meta.heroLead}</p>
      </div>
    </div>
  </section>
</div>

<!-- ═══════════════════ MAIN LAYOUT ═══════════════════ -->
<div class="page-wrap">

  <aside class="toc-sidebar" id="tocSidebar">
    <button class="mobile-toc-toggle" onclick="document.getElementById('tocSidebar').classList.toggle('collapsed')">
      <span>${meta.tocMobile}</span><span>▾</span>
    </button>
    ${buildToc(oldHtml)}
  </aside>

  <main class="content">
${extractMain(oldHtml, meta, fileName)}
  </main>
</div>

${shell.scripts}
`;

  return head;
}

function parseShell(enHtml) {
  const styleMatch = enHtml.match(/<style>\s*([\s\S]*?)<\/style>/);
  const scriptsMatch = enHtml.match(/(<script>\s*\n  \/\/ Highlight active TOC[\s\S]*<\/html>)/);
  return {
    css: styleMatch ? styleMatch[1].trim() : "",
    scripts: scriptsMatch ? scriptsMatch[1].replace(/<\/html>\s*$/, "") : "",
  };
}

function main() {
  const targets = process.argv.slice(2).length
    ? process.argv.slice(2)
    : ["zh-Hans.html", "zh-Hant.html", "de.html", "fr.html", "es.html"];

  const enHtml = fs.readFileSync(SHELL_PATH, "utf8");
  const shell = parseShell(enHtml);

  for (const file of targets) {
    const meta = LOCALE[file];
    if (!meta) {
      console.error("Unknown locale:", file);
      process.exitCode = 1;
      continue;
    }
    const oldPath = path.join(MANUAL_DIR, file);
    const oldHtml = fs.readFileSync(oldPath, "utf8");
    const out = buildPage(file, meta, oldHtml, shell);
    fs.writeFileSync(oldPath, out, "utf8");
    console.log("Wrote", file);
  }
}

main();
