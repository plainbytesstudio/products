import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "release-notes");

const langSelect = `      <select id="lang-select" class="lang-select" aria-label="Language">
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
      </select>`;

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildPage(L) {
  const featuresHtml = L.features
    .map(
      (f) => `          <li class="release-notes-item release-notes-item--feature">
            <span class="release-notes-item__icon" aria-hidden="true"><i class="ti ti-circle-plus"></i></span>
            <div class="release-notes-item__body">
              <p class="release-notes-item__label">${esc(f.label)}</p>
              <p class="release-notes-item__desc">${esc(f.desc)}</p>
            </div>
          </li>`
    )
    .join("\n");

  const fixesHtml = L.fixes
    .map(
      (t) => `          <li class="release-notes-item release-notes-item--fix">
            <span class="release-notes-item__icon" aria-hidden="true"><i class="ti ti-adjustments"></i></span>
            <div class="release-notes-item__body">
              <p class="release-notes-item__desc">${esc(t)}</p>
            </div>
          </li>`
    )
    .join("\n");

  const historyHtml = L.history
    .map((h) => {
      const tagClass = h.launch ? " release-notes-history__tag--launch" : "";
      const tag = h.launch ? L.tagLaunch : L.tagFeature;
      return `          <div class="release-notes-history__row">
            <div class="release-notes-history__left">
              <span class="release-notes-history__ver">${L.versionPrefix} ${h.ver}</span>
              <span class="release-notes-history__tag${tagClass}">${esc(tag)}</span>
            </div>
            <time class="release-notes-history__date" datetime="${h.iso}">${h.date}</time>
          </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<!-- Template: copy to {locale}.html and translate title + body -->
<html lang="${L.htmlLang}" data-lang="${L.dataLang}" data-base="../" data-page="release-notes">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(L.title)}</title>
<meta name="description" content="${esc(L.metaDesc)}" />
<link rel="icon" type="image/x-icon" href="../assets/Redactor_Logo.ico" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="../css/site.css" />
<link rel="stylesheet" href="../css/release-notes.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.34.0/dist/tabler-icons.min.css" />
</head>
<body class="site-light site-home release-notes-page">
<header class="site-header site-header--on-dark">
  <div class="container inner">
    <a class="brand" href="${L.home}">
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
      <a class="site-nav-link" href="${L.home}">${esc(L.navHome)}</a>
      <a class="site-nav-link" href="${L.manual}">${esc(L.navManual)}</a>
      <a class="site-nav-link site-nav-link--current" href="${L.file}" aria-current="page">${esc(L.navRelease)}</a>
      <label class="visually-hidden" for="lang-select">Language</label>
${langSelect}
      <a
        class="btn btn-accent btn-accent--sm js-store-link"
        href="https://apps.microsoft.com/detail/9n2vlpn4wdk1"
        target="_blank"
        rel="noopener noreferrer"
        >${esc(L.storeBtn)}</a
      >
    </div>
  </div>
</header>

<div class="hero-screen">
  <div class="container">
    <section class="hero hero--dark release-notes-hero release-notes-hero--left">
      <div class="release-notes-hero__copy">
        <p class="hero-kicker">${esc(L.kicker)}</p>
        <h1>${L.versionPrefix} 1.3.0</h1>
        <p class="lead">${esc(L.lead)}</p>
      </div>
    </section>
  </div>
</div>

<main class="site-main release-notes-main">
  <div class="container">
    <div class="release-notes-inner release-notes-inner--plain">
      <section class="release-notes-section">
        <header class="release-notes-section__head">
          <h2>${esc(L.sectionNewTitle)}</h2>
          <p>${esc(L.sectionNewDesc)}</p>
        </header>
        <ul class="release-notes-item-list">
${featuresHtml}
        </ul>
      </section>
      <section class="release-notes-section release-notes-section--divider">
        <header class="release-notes-section__head">
          <h2>${esc(L.sectionFixTitle)}</h2>
          <p>${esc(L.sectionFixDesc)}</p>
        </header>
        <ul class="release-notes-item-list">
${fixesHtml}
        </ul>
      </section>
      <section class="release-notes-section release-notes-section--divider">
        <header class="release-notes-section__head">
          <h2>${esc(L.sectionHistoryTitle)}</h2>
          <p>${esc(L.sectionHistoryDesc)}</p>
        </header>
        <div class="release-notes-history">
${historyHtml}
        </div>
      </section>
    </div>
  </div>

  <footer class="screen-band screen-band--dark screen-band--footer">
    <div class="container">
      <div class="screen-band__footer">
        <p class="panel-footer__support">
          <span>${L.footerSupport.includes("&") ? L.footerSupport : esc(L.footerSupport)}</span> —
          <a href="https://github.com/PlainBytes/PlainBytes.Redactor">GitHub</a>
          ·
          <a href="mailto:plainbytes.studio@gmail.com">plainbytes.studio@gmail.com</a>
        </p>
        <p class="panel-footer__legal">
          <a href="${L.privacy}">${esc(L.footerPrivacy)}</a>
          <span aria-hidden="true"> · </span>
          <span>${esc(L.footerCopyright)}</span>
        </p>
      </div>
    </div>
  </footer>
</main>
<script src="../js/lang-nav.js"></script>
<script src="../js/store-link.js"></script>
</body>
</html>
`;
}

const locales = [
  {
    file: "en.html",
    htmlLang: "en",
    dataLang: "en",
    home: "../index.html",
    manual: "../manual/en.html",
    privacy: "../privacy.html",
    title: "Release notes — PlainBytes Redactor",
    metaDesc: "What's new in PlainBytes Redactor.",
    navHome: "Home",
    navManual: "User Guide",
    navRelease: "Release notes",
    storeBtn: "Get on Microsoft Store",
    kicker: "release notes",
    versionPrefix: "Version",
    lead: "Text search, cross-line recognition, automatic region detection on first launch, and improved preview–audit list sync.",
    sectionNewTitle: "New features",
    sectionNewDesc: "Notable additions in this release.",
    features: [
      { label: "Text search", desc: "Quickly locate content to redact in PDFs for review and manual boxes." },
      { label: "Cross-line recognition", desc: "Improved auto-detection and boxing for fields that span multiple lines." },
      { label: "Automatic region on first launch", desc: "Pre-selects recognition rules based on your system locale." },
    ],
    sectionFixTitle: "Improvements & fixes",
    sectionFixDesc: "UX polish and stability fixes.",
    fixes: [
      "Preview and audit list sync: selecting an entry locates the preview more consistently.",
      "More accurate auto-detection boxes for Japanese label-and-value fields (phone, My Number, URLs).",
      "Preview scrollbar corner styling when both axes scroll.",
      "Scheme coordinates use absolute page geometry for consistent template placement.",
    ],
    sectionHistoryTitle: "Version history",
    sectionHistoryDesc: "Previously shipped releases.",
    tagFeature: "Feature update",
    tagLaunch: "First stable release",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "June 1, 2026", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "May 1, 2026", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "April 18, 2026", launch: true },
    ],
    footerSupport: "Support &amp; feedback",
    footerPrivacy: "Privacy Policy",
    footerCopyright: "© 2026 PlainBytes Studio",
  },
  {
    file: "zh-Hans.html",
    htmlLang: "zh-Hans",
    dataLang: "zh",
    home: "../zh/index.html",
    manual: "../manual/zh-Hans.html",
    privacy: "../privacy.html",
    title: "版本更新 — PlainBytes Redactor",
    metaDesc: "PlainBytes Redactor 当前版本更新说明。",
    navHome: "首页",
    navManual: "使用手册",
    navRelease: "版本更新",
    storeBtn: "在 Microsoft Store 获取",
    kicker: "版本更新",
    versionPrefix: "版本",
    lead: "新增文本搜索、跨行识别及首次启动自动区域检测，并优化预览窗口与追踪列表联动行为。",
    sectionNewTitle: "新功能",
    sectionNewDesc: "本版本新增的可直接感知能力。",
    features: [
      { label: "文本搜索", desc: "在 PDF 中快速定位待脱敏内容，便于复核与补框。" },
      { label: "跨行识别", desc: "改进跨行字段的自动检测与框选精度。" },
      { label: "首次启动自动区域检测", desc: "根据系统区域设置预选识别规则范围。" },
    ],
    sectionFixTitle: "改进与修复",
    sectionFixDesc: "体验优化与稳定性修复。",
    fixes: [
      "优化预览窗口与追踪列表的联动行为，选中条目时预览定位更一致。",
      "优化日文「标签：值」字段（电话、My Number、URL 等）自动识别框精度。",
      "预览区横竖滚动条同时出现时的右下角样式。",
      "脱敏方案坐标改为绝对页面几何，套打位置更稳定。",
    ],
    sectionHistoryTitle: "历史版本",
    sectionHistoryDesc: "此前已发布的正式版本记录。",
    tagFeature: "功能更新",
    tagLaunch: "首个正式版本",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "2026年6月1日", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "2026年5月1日", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "2026年4月18日", launch: true },
    ],
    footerSupport: "支持与反馈",
    footerPrivacy: "隐私政策",
    footerCopyright: "© 2026 PlainBytes Studio. 保留所有权利。",
  },
  {
    file: "zh-Hant.html",
    htmlLang: "zh-Hant",
    dataLang: "zh-Hant",
    home: "../zh-hant/index.html",
    manual: "../manual/zh-Hant.html",
    privacy: "../privacy.html",
    title: "版本更新 — PlainBytes Redactor",
    metaDesc: "PlainBytes Redactor 目前版本更新說明。",
    navHome: "首頁",
    navManual: "使用手冊",
    navRelease: "版本更新",
    storeBtn: "在 Microsoft Store 取得",
    kicker: "版本更新",
    versionPrefix: "版本",
    lead: "新增文字搜尋、跨行識別及首次啟動自動區域偵測，並優化預覽視窗與追蹤清單聯動行為。",
    sectionNewTitle: "新功能",
    sectionNewDesc: "本版本新增的可直接感知能力。",
    features: [
      { label: "文字搜尋", desc: "在 PDF 中快速定位待脫敏內容，便於複核與補框。" },
      { label: "跨行識別", desc: "改進跨行欄位的自動偵測與框選精度。" },
      { label: "首次啟動自動區域偵測", desc: "根據系統區域設定預選識別規則範圍。" },
    ],
    sectionFixTitle: "改進與修復",
    sectionFixDesc: "體驗優化與穩定性修復。",
    fixes: [
      "優化預覽視窗與追蹤清單的聯動行為，選中項目時預覽定位更一致。",
      "優化日文「標籤：值」欄位（電話、My Number、URL 等）自動識別框精度。",
      "預覽區橫豎捲軸同時出現時的右下角樣式。",
      "脫敏方案座標改為絕對頁面幾何，套打位置更穩定。",
    ],
    sectionHistoryTitle: "歷史版本",
    sectionHistoryDesc: "此前已發佈的正式版本記錄。",
    tagFeature: "功能更新",
    tagLaunch: "首個正式版本",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "2026年6月1日", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "2026年5月1日", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "2026年4月18日", launch: true },
    ],
    footerSupport: "支援與回饋",
    footerPrivacy: "隱私政策",
    footerCopyright: "© 2026 PlainBytes Studio. 保留所有權利。",
  },
  {
    file: "ja.html",
    htmlLang: "ja",
    dataLang: "ja",
    home: "../ja/index.html",
    manual: "../manual/ja.html",
    privacy: "../privacy.html",
    title: "リリースノート — PlainBytes Redactor",
    metaDesc: "PlainBytes Redactor の更新内容。",
    navHome: "ホーム",
    navManual: "ユーザーガイド",
    navRelease: "リリースノート",
    storeBtn: "Microsoft Store で入手",
    kicker: "リリースノート",
    versionPrefix: "バージョン",
    lead: "テキスト検索、複数行認識、初回起動時の自動リージョン検出、プレビューと監査リストの連動改善。",
    sectionNewTitle: "新機能",
    sectionNewDesc: "このリリースで追加された主な機能。",
    features: [
      { label: "テキスト検索", desc: "PDF 内のマスキング対象を素早く見つけ、確認と手動枠追加を支援。" },
      { label: "複数行認識", desc: "複数行にまたがるフィールドの自動検出と枠精度を改善。" },
      { label: "初回起動時の自動リージョン検出", desc: "システムのロケールに基づき認識ルール範囲を事前選択。" },
    ],
    sectionFixTitle: "改善と修正",
    sectionFixDesc: "UX の改善と安定性の修正。",
    fixes: [
      "プレビューと監査リストの連動：項目選択時のプレビュー位置合わせを改善。",
      "日本語の「ラベル：値」フィールド（電話、マイナンバー、URL など）の自動検出枠精度を改善。",
      "縦横スクロールバーが同時に表示される際のプレビュー右下角のスタイル。",
      "マスキングスキーム座標を絶対ページ幾何に変更し、テンプレート配置を安定化。",
    ],
    sectionHistoryTitle: "バージョン履歴",
    sectionHistoryDesc: "これまでにリリースした正式版。",
    tagFeature: "機能更新",
    tagLaunch: "初の安定版",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "2026年6月1日", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "2026年5月1日", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "2026年4月18日", launch: true },
    ],
    footerSupport: "サポートとフィードバック",
    footerPrivacy: "プライバシーポリシー",
    footerCopyright: "© 2026 PlainBytes Studio. All rights reserved.",
  },
  {
    file: "ko.html",
    htmlLang: "ko",
    dataLang: "ko",
    home: "../ko/index.html",
    manual: "../manual/ko.html",
    privacy: "../privacy.html",
    title: "릴리스 노트 — PlainBytes Redactor",
    metaDesc: "PlainBytes Redactor 업데이트 내용.",
    navHome: "홈",
    navManual: "사용자 가이드",
    navRelease: "릴리스 노트",
    storeBtn: "Microsoft Store에서 받기",
    kicker: "릴리스 노트",
    versionPrefix: "버전",
    lead: "텍스트 검색, 여러 줄 인식, 첫 실행 시 자동 지역 감지, 미리보기와 감사 목록 연동 개선.",
    sectionNewTitle: "새 기능",
    sectionNewDesc: "이번 릴리스의 주요 추가 사항.",
    features: [
      { label: "텍스트 검색", desc: "PDF에서 마스킹 대상을 빠르게 찾아 검토 및 수동 상자 추가에 활용." },
      { label: "여러 줄 인식", desc: "여러 줄에 걸친 필드의 자동 감지 및 상자 정확도 개선." },
      { label: "첫 실행 시 자동 지역 감지", desc: "시스템 로케일에 따라 인식 규칙 범위를 미리 선택." },
    ],
    sectionFixTitle: "개선 및 수정",
    sectionFixDesc: "UX 개선 및 안정성 수정.",
    fixes: [
      "미리보기와 감사 목록 연동: 항목 선택 시 미리보기 위치 정렬 개선.",
      "일본어 「라벨:값」 필드(전화, My Number, URL 등) 자동 감지 상자 정확도 개선.",
      "가로·세로 스크롤바가 동시에 표시될 때 미리보기 우하단 스타일.",
      "마스킹 스킴 좌표를 절대 페이지 기하로 변경하여 템플릿 배치 안정화.",
    ],
    sectionHistoryTitle: "버전 기록",
    sectionHistoryDesc: "이전에 출시된 정식 버전.",
    tagFeature: "기능 업데이트",
    tagLaunch: "첫 정식 버전",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "2026년 6월 1일", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "2026년 5월 1일", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "2026년 4월 18일", launch: true },
    ],
    footerSupport: "지원 및 피드백",
    footerPrivacy: "개인정보 처리방침",
    footerCopyright: "© 2026 PlainBytes Studio",
  },
  {
    file: "de.html",
    htmlLang: "de",
    dataLang: "de",
    home: "../de/index.html",
    manual: "../manual/de.html",
    privacy: "../privacy.html",
    title: "Versionshinweise — PlainBytes Redactor",
    metaDesc: "Neuigkeiten in PlainBytes Redactor.",
    navHome: "Startseite",
    navManual: "Benutzerhandbuch",
    navRelease: "Versionshinweise",
    storeBtn: "Im Microsoft Store",
    kicker: "Versionshinweise",
    versionPrefix: "Version",
    lead: "Textsuche, mehrzeilige Erkennung, automatische Regionserkennung beim ersten Start und verbesserte Vorschau–Prüflisten-Synchronisation.",
    sectionNewTitle: "Neue Funktionen",
    sectionNewDesc: "Wichtige Ergänzungen in dieser Version.",
    features: [
      { label: "Textsuche", desc: "Inhalte zum Schwärzen in PDFs schnell finden – für Prüfung und manuelle Markierungen." },
      { label: "Mehrzeilige Erkennung", desc: "Verbesserte automatische Erkennung und Rahmen für mehrzeilige Felder." },
      { label: "Automatische Region beim ersten Start", desc: "Wählt Erkennungsregeln anhand der Systemlokalisierung vor." },
    ],
    sectionFixTitle: "Verbesserungen & Fehlerbehebungen",
    sectionFixDesc: "UX-Optimierungen und Stabilitätsfixes.",
    fixes: [
      "Synchronisation von Vorschau und Prüfliste: Auswahl eines Eintrags positioniert die Vorschau konsistenter.",
      "Genauere Erkennungsrahmen für japanische Label-Wert-Felder (Telefon, My Number, URLs).",
      "Ecke der Vorschau bei gleichzeitigen Scrollbalken auf beiden Achsen.",
      "Schema-Koordinaten nutzen absolute Seitengeometrie für stabile Vorlagenplatzierung.",
    ],
    sectionHistoryTitle: "Versionsverlauf",
    sectionHistoryDesc: "Zuvor veröffentlichte Versionen.",
    tagFeature: "Funktionsupdate",
    tagLaunch: "Erste stabile Version",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "1. Juni 2026", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "1. Mai 2026", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "18. April 2026", launch: true },
    ],
    footerSupport: "Support &amp; Feedback",
    footerPrivacy: "Datenschutz",
    footerCopyright: "© 2026 PlainBytes Studio. All rights reserved.",
  },
  {
    file: "fr.html",
    htmlLang: "fr",
    dataLang: "fr",
    home: "../fr/index.html",
    manual: "../manual/fr.html",
    privacy: "../privacy.html",
    title: "Notes de version — PlainBytes Redactor",
    metaDesc: "Nouveautés de PlainBytes Redactor.",
    navHome: "Accueil",
    navManual: "Guide utilisateur",
    navRelease: "Notes de version",
    storeBtn: "Obtenir sur le Microsoft Store",
    kicker: "notes de version",
    versionPrefix: "Version",
    lead: "Recherche de texte, reconnaissance multiligne, détection automatique de région au premier lancement et meilleure synchronisation aperçu–liste d'audit.",
    sectionNewTitle: "Nouvelles fonctionnalités",
    sectionNewDesc: "Principales additions de cette version.",
    features: [
      { label: "Recherche de texte", desc: "Localisez rapidement le contenu à masquer dans les PDF pour la révision et les zones manuelles." },
      { label: "Reconnaissance multiligne", desc: "Détection automatique et encadrement améliorés pour les champs sur plusieurs lignes." },
      { label: "Région automatique au premier lancement", desc: "Présélectionne les règles de reconnaissance selon la locale système." },
    ],
    sectionFixTitle: "Améliorations et corrections",
    sectionFixDesc: "Polissage UX et corrections de stabilité.",
    fixes: [
      "Synchronisation aperçu et liste d'audit : la sélection d'un élément positionne l'aperçu de façon plus cohérente.",
      "Encadrements plus précis pour les champs japonais étiquette-valeur (téléphone, My Number, URL).",
      "Style du coin de l'aperçu lorsque les deux barres de défilement sont visibles.",
      "Les coordonnées de schéma utilisent la géométrie absolue de page pour un placement stable.",
    ],
    sectionHistoryTitle: "Historique des versions",
    sectionHistoryDesc: "Versions stables publiées précédemment.",
    tagFeature: "Mise à jour",
    tagLaunch: "Première version stable",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "1 juin 2026", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "1 mai 2026", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "18 avril 2026", launch: true },
    ],
    footerSupport: "Support et commentaires",
    footerPrivacy: "Politique de confidentialité",
    footerCopyright: "© 2026 PlainBytes Studio. Tous droits réservés.",
  },
  {
    file: "es.html",
    htmlLang: "es",
    dataLang: "es",
    home: "../es/index.html",
    manual: "../manual/es.html",
    privacy: "../privacy.html",
    title: "Notas de la versión — PlainBytes Redactor",
    metaDesc: "Novedades de PlainBytes Redactor.",
    navHome: "Inicio",
    navManual: "Guía de usuario",
    navRelease: "Notas de la versión",
    storeBtn: "Obtener en Microsoft Store",
    kicker: "notas de la versión",
    versionPrefix: "Versión",
    lead: "Búsqueda de texto, reconocimiento multilínea, detección automática de región en el primer inicio y mejor sincronización entre vista previa y lista de auditoría.",
    sectionNewTitle: "Novedades",
    sectionNewDesc: "Principales adiciones en esta versión.",
    features: [
      { label: "Búsqueda de texto", desc: "Localice rápidamente el contenido a enmascarar en PDF para revisión y cajas manuales." },
      { label: "Reconocimiento multilínea", desc: "Detección automática y encuadre mejorados para campos en varias líneas." },
      { label: "Región automática en el primer inicio", desc: "Preselecciona reglas de reconocimiento según la configuración regional del sistema." },
    ],
    sectionFixTitle: "Mejoras y correcciones",
    sectionFixDesc: "Pulido de UX y correcciones de estabilidad.",
    fixes: [
      "Sincronización de vista previa y lista de auditoría: al seleccionar un elemento, la vista previa se posiciona con mayor coherencia.",
      "Cuadros de detección más precisos para campos japoneses etiqueta-valor (teléfono, My Number, URL).",
      "Estilo de la esquina de la vista previa cuando aparecen ambas barras de desplazamiento.",
      "Las coordenadas del esquema usan geometría absoluta de página para una colocación estable.",
    ],
    sectionHistoryTitle: "Historial de versiones",
    sectionHistoryDesc: "Versiones estables publicadas anteriormente.",
    tagFeature: "Actualización",
    tagLaunch: "Primera versión estable",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "1 de junio de 2026", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "1 de mayo de 2026", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "18 de abril de 2026", launch: true },
    ],
    footerSupport: "Soporte y comentarios",
    footerPrivacy: "Política de privacidad",
    footerCopyright: "© 2026 PlainBytes Studio",
  },
  {
    file: "pt.html",
    htmlLang: "pt",
    dataLang: "pt",
    home: "../pt/index.html",
    manual: "../manual/pt.html",
    privacy: "../privacy.html",
    title: "Notas de versão — PlainBytes Redactor",
    metaDesc: "Novidades do PlainBytes Redactor.",
    navHome: "Início",
    navManual: "Guia do usuário",
    navRelease: "Notas de versão",
    storeBtn: "Baixar na Microsoft Store",
    kicker: "notas de versão",
    versionPrefix: "Versão",
    lead: "Pesquisa de texto, reconhecimento multilinha, detecção automática de região na primeira execução e melhor sincronização entre pré-visualização e lista de auditoria.",
    sectionNewTitle: "Novos recursos",
    sectionNewDesc: "Principais adições nesta versão.",
    features: [
      { label: "Pesquisa de texto", desc: "Localize rapidamente conteúdo a mascarar em PDFs para revisão e caixas manuais." },
      { label: "Reconhecimento multilinha", desc: "Detecção automática e enquadramento aprimorados para campos em várias linhas." },
      { label: "Região automática na primeira execução", desc: "Pré-seleciona regras de reconhecimento com base na localidade do sistema." },
    ],
    sectionFixTitle: "Melhorias e correções",
    sectionFixDesc: "Refinamentos de UX e correções de estabilidade.",
    fixes: [
      "Sincronização de pré-visualização e lista de auditoria: selecionar um item posiciona a pré-visualização de forma mais consistente.",
      "Caixas de detecção mais precisas para campos japoneses rótulo-valor (telefone, My Number, URL).",
      "Estilo do canto da pré-visualização quando ambas as barras de rolagem aparecem.",
      "Coordenadas do esquema usam geometria absoluta da página para posicionamento estável.",
    ],
    sectionHistoryTitle: "Histórico de versões",
    sectionHistoryDesc: "Versões estáveis publicadas anteriormente.",
    tagFeature: "Atualização",
    tagLaunch: "Primeira versão estável",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "1 de junho de 2026", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "1 de maio de 2026", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "18 de abril de 2026", launch: true },
    ],
    footerSupport: "Suporte e feedback",
    footerPrivacy: "Política de privacidade",
    footerCopyright: "© 2026 PlainBytes Studio",
  },
  {
    file: "it.html",
    htmlLang: "it",
    dataLang: "it",
    home: "../it/index.html",
    manual: "../manual/it.html",
    privacy: "../privacy.html",
    title: "Note di rilascio — PlainBytes Redactor",
    metaDesc: "Novità di PlainBytes Redactor.",
    navHome: "Home",
    navManual: "Guida utente",
    navRelease: "Note di rilascio",
    storeBtn: "Ottieni da Microsoft Store",
    kicker: "note di rilascio",
    versionPrefix: "Versione",
    lead: "Ricerca testo, riconoscimento multilinea, rilevamento automatico della regione al primo avvio e migliore sincronizzazione anteprima–lista di audit.",
    sectionNewTitle: "Nuove funzionalità",
    sectionNewDesc: "Principali aggiunte in questa versione.",
    features: [
      { label: "Ricerca testo", desc: "Individua rapidamente i contenuti da oscurare nei PDF per revisione e riquadri manuali." },
      { label: "Riconoscimento multilinea", desc: "Rilevamento automatico e inquadratura migliorati per campi su più righe." },
      { label: "Regione automatica al primo avvio", desc: "Preseleziona le regole di riconoscimento in base alla locale di sistema." },
    ],
    sectionFixTitle: "Miglioramenti e correzioni",
    sectionFixDesc: "Rifiniture UX e correzioni di stabilità.",
    fixes: [
      "Sincronizzazione anteprima e lista di audit: la selezione di una voce posiziona l'anteprima in modo più coerente.",
      "Riquadri di rilevamento più precisi per campi giapponesi etichetta-valore (telefono, My Number, URL).",
      "Stile dell'angolo dell'anteprima quando compaiono entrambe le barre di scorrimento.",
      "Le coordinate dello schema usano geometria assoluta di pagina per un posizionamento stabile.",
    ],
    sectionHistoryTitle: "Cronologia versioni",
    sectionHistoryDesc: "Versioni stabili pubblicate in precedenza.",
    tagFeature: "Aggiornamento",
    tagLaunch: "Prima versione stabile",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "1 giugno 2026", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "1 maggio 2026", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "18 aprile 2026", launch: true },
    ],
    footerSupport: "Supporto e feedback",
    footerPrivacy: "Informativa sulla privacy",
    footerCopyright: "© 2026 PlainBytes Studio",
  },
  {
    file: "nl.html",
    htmlLang: "nl",
    dataLang: "nl",
    home: "../nl/index.html",
    manual: "../manual/nl.html",
    privacy: "../privacy.html",
    title: "Release notes — PlainBytes Redactor",
    metaDesc: "Wat is nieuw in PlainBytes Redactor.",
    navHome: "Start",
    navManual: "Gebruikershandleiding",
    navRelease: "Release notes",
    storeBtn: "Downloaden via Microsoft Store",
    kicker: "release notes",
    versionPrefix: "Versie",
    lead: "Tekstzoeken, meerdere-regelsherkenning, automatische regiodetectie bij eerste start en betere synchronisatie tussen voorbeeld en auditlijst.",
    sectionNewTitle: "Nieuwe functies",
    sectionNewDesc: "Belangrijkste toevoegingen in deze release.",
    features: [
      { label: "Tekstzoeken", desc: "Vind snel te maskeren inhoud in PDF's voor controle en handmatige vakken." },
      { label: "Meerdere-regelsherkenning", desc: "Verbeterde automatische detectie en kaders voor velden over meerdere regels." },
      { label: "Automatische regio bij eerste start", desc: "Selecteert herkenningsregels vooraf op basis van systeemlocale." },
    ],
    sectionFixTitle: "Verbeteringen en fixes",
    sectionFixDesc: "UX-verfijning en stabiliteitsfixes.",
    fixes: [
      "Synchronisatie van voorbeeld en auditlijst: selectie van een item positioneert het voorbeeld consistenter.",
      "Nauwkeurigere detectievakken voor Japanse label-waarde-velden (telefoon, My Number, URL's).",
      "Hoekstijl van het voorbeeld wanneer beide schuifbalken zichtbaar zijn.",
      "Schema-coördinaten gebruiken absolute paginageometrie voor stabiele sjabloonplaatsing.",
    ],
    sectionHistoryTitle: "Versiegeschiedenis",
    sectionHistoryDesc: "Eerder uitgebrachte stabiele versies.",
    tagFeature: "Functie-update",
    tagLaunch: "Eerste stabiele versie",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "1 juni 2026", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "1 mei 2026", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "18 april 2026", launch: true },
    ],
    footerSupport: "Ondersteuning en feedback",
    footerPrivacy: "Privacybeleid",
    footerCopyright: "© 2026 PlainBytes Studio",
  },
  {
    file: "ru.html",
    htmlLang: "ru",
    dataLang: "ru",
    home: "../ru/index.html",
    manual: "../manual/ru.html",
    privacy: "../privacy.html",
    title: "Примечания к выпуску — PlainBytes Redactor",
    metaDesc: "Что нового в PlainBytes Redactor.",
    navHome: "Главная",
    navManual: "Руководство пользователя",
    navRelease: "Примечания к выпуску",
    storeBtn: "Получить в Microsoft Store",
    kicker: "примечания к выпуску",
    versionPrefix: "Версия",
    lead: "Поиск текста, распознавание многострочных полей, автоматическое определение региона при первом запуске и улучшенная синхронизация предпросмотра со списком аудита.",
    sectionNewTitle: "Новые возможности",
    sectionNewDesc: "Основные дополнения в этом выпуске.",
    features: [
      { label: "Поиск текста", desc: "Быстро находите содержимое для маскировки в PDF для проверки и ручных рамок." },
      { label: "Многострочное распознавание", desc: "Улучшенное автоматическое обнаружение и рамки для полей на нескольких строках." },
      { label: "Автоматический регион при первом запуске", desc: "Предварительный выбор правил распознавания по системной локали." },
    ],
    sectionFixTitle: "Улучшения и исправления",
    sectionFixDesc: "Доработка UX и исправления стабильности.",
    fixes: [
      "Синхронизация предпросмотра и списка аудита: выбор записи точнее позиционирует предпросмотр.",
      "Более точные рамки для японских полей «метка: значение» (телефон, My Number, URL).",
      "Стиль угла предпросмотра при одновременном появлении обеих полос прокрутки.",
      "Координаты схемы используют абсолютную геометрию страницы для стабильного размещения шаблонов.",
    ],
    sectionHistoryTitle: "История версий",
    sectionHistoryDesc: "Ранее выпущенные стабильные версии.",
    tagFeature: "Обновление",
    tagLaunch: "Первый стабильный выпуск",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "1 июня 2026 г.", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "1 мая 2026 г.", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "18 апреля 2026 г.", launch: true },
    ],
    footerSupport: "Поддержка и обратная связь",
    footerPrivacy: "Политика конфиденциальности",
    footerCopyright: "© 2026 PlainBytes Studio",
  },
  {
    file: "ar.html",
    htmlLang: "ar",
    dataLang: "ar",
    home: "../index.html",
    manual: "../manual/en.html",
    privacy: "../privacy.html",
    title: "Release notes — PlainBytes Redactor",
    metaDesc: "What's new in PlainBytes Redactor.",
    navHome: "Home",
    navManual: "User Guide",
    navRelease: "Release notes",
    storeBtn: "Get on Microsoft Store",
    kicker: "release notes",
    versionPrefix: "Version",
    lead: "Text search, cross-line recognition, automatic region detection on first launch, and improved preview–audit list sync.",
    sectionNewTitle: "New features",
    sectionNewDesc: "Notable additions in this release.",
    features: [
      { label: "Text search", desc: "Quickly locate content to redact in PDFs for review and manual boxes." },
      { label: "Cross-line recognition", desc: "Improved auto-detection and boxing for fields that span multiple lines." },
      { label: "Automatic region on first launch", desc: "Pre-selects recognition rules based on your system locale." },
    ],
    sectionFixTitle: "Improvements & fixes",
    sectionFixDesc: "UX polish and stability fixes.",
    fixes: [
      "Preview and audit list sync: selecting an entry locates the preview more consistently.",
      "More accurate auto-detection boxes for Japanese label-and-value fields (phone, My Number, URLs).",
      "Preview scrollbar corner styling when both axes scroll.",
      "Scheme coordinates use absolute page geometry for consistent template placement.",
    ],
    sectionHistoryTitle: "Version history",
    sectionHistoryDesc: "Previously shipped releases.",
    tagFeature: "Feature update",
    tagLaunch: "First stable release",
    history: [
      { ver: "1.2.0", iso: "2026-06-01", date: "June 1, 2026", launch: false },
      { ver: "1.1.0", iso: "2026-05-01", date: "May 1, 2026", launch: false },
      { ver: "1.0.0", iso: "2026-04-18", date: "April 18, 2026", launch: true },
    ],
    footerSupport: "Support &amp; feedback",
    footerPrivacy: "Privacy Policy",
    footerCopyright: "© 2026 PlainBytes Studio",
  },
];

for (const L of locales) {
  const path = join(outDir, L.file);
  writeFileSync(path, buildPage(L), "utf8");
  console.log("Wrote", path);
}

const en = locales.find((l) => l.file === "en.html");
let template = buildPage(en).replace('href="en.html"', 'href="{locale}.html"');
writeFileSync(join(outDir, "release-notes-template.html"), template, "utf8");
console.log("Wrote template");
