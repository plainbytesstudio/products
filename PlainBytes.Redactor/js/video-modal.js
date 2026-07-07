/**
 * YouTube embed in overlay; click outside or Escape to close and stop playback.
 * Prefers 1080p via IFrame API when the stream is available.
 */
(function () {
  var triggers = document.querySelectorAll(".js-video-modal");
  if (!triggers.length) return;

  var open = false;
  var player = null;
  var apiLoading = false;
  var apiReady = false;
  var apiQueue = [];

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
    '    <div id="video-modal-player" class="video-modal__iframe"></div>' +
    "  </div>" +
    '  <p class="video-modal__caption"></p>' +
    "</div>";

  document.body.appendChild(root);

  var backdrop = root.querySelector(".video-modal__backdrop");
  var dialog = root.querySelector(".video-modal__dialog");
  var frameWrap = root.querySelector(".video-modal__frame-wrap");
  var playerHost = root.querySelector("#video-modal-player");
  var caption = root.querySelector(".video-modal__caption");
  var btnClose = root.querySelector(".video-modal__close");

  function triggerLabel(trigger) {
    var label = trigger.querySelector("span:not(.btn__play)");
    return label ? label.textContent.trim() : trigger.textContent.trim();
  }

  function pageOrigin() {
    var origin = window.location.origin;
    if (!origin || origin === "null") {
      origin = window.location.protocol + "//" + window.location.host;
    }
    return origin;
  }

  function flushApiQueue() {
    while (apiQueue.length) apiQueue.shift()();
  }

  function ensureYouTubeApi(callback) {
    if (apiReady && window.YT && window.YT.Player) {
      callback();
      return;
    }
    apiQueue.push(callback);
    if (apiLoading) return;
    apiLoading = true;

    var prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      apiReady = true;
      if (typeof prevReady === "function") prevReady();
      flushApiQueue();
    };

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  }

  function prefer1080p(ytPlayer) {
    if (!ytPlayer || typeof ytPlayer.setPlaybackQuality !== "function") return;
    try {
      ytPlayer.setPlaybackQuality("hd1080");
    } catch (e) {}
    try {
      var levels = ytPlayer.getAvailableQualityLevels && ytPlayer.getAvailableQualityLevels();
      if (levels && levels.indexOf("hd1080") !== -1) {
        ytPlayer.setPlaybackQuality("hd1080");
      }
    } catch (e2) {}
  }

  function destroyPlayer() {
    if (player && typeof player.destroy === "function") {
      try {
        player.destroy();
      } catch (e) {}
    }
    player = null;
    playerHost.innerHTML = "";
  }

  function startPlayer(videoId) {
    destroyPlayer();
    player = new YT.Player("video-modal-player", {
      videoId: videoId,
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1,
        origin: pageOrigin(),
        enablejsapi: 1,
      },
      events: {
        onReady: function (event) {
          prefer1080p(event.target);
          event.target.playVideo();
        },
        onPlaybackQualityChange: function (event) {
          if (event.data !== "hd1080") prefer1080p(event.target);
        },
      },
    });
  }

  function openModal(videoId, title) {
    if (!videoId) return;
    caption.textContent = title || "";
    root.hidden = false;
    open = true;
    document.body.classList.add("video-modal-open");
    btnClose.focus();
    ensureYouTubeApi(function () {
      startPlayer(videoId);
    });
  }

  function closeModal() {
    destroyPlayer();
    root.hidden = true;
    open = false;
    document.body.classList.remove("video-modal-open");
    caption.textContent = "";
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      var videoId = trigger.getAttribute("data-youtube-id");
      openModal(videoId, triggerLabel(trigger));
    });
  });

  btnClose.addEventListener("click", function (e) {
    e.stopPropagation();
    closeModal();
  });

  backdrop.addEventListener("click", closeModal);

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
