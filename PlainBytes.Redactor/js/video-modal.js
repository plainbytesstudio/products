/**
 * YouTube embed in overlay; click outside or Escape to close and stop playback.
 */
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

  var backdrop = root.querySelector(".video-modal__backdrop");
  var dialog = root.querySelector(".video-modal__dialog");
  var frameWrap = root.querySelector(".video-modal__frame-wrap");
  var iframe = root.querySelector(".video-modal__iframe");
  var caption = root.querySelector(".video-modal__caption");
  var btnClose = root.querySelector(".video-modal__close");

  function triggerLabel(trigger) {
    var label = trigger.querySelector("span:not(.btn__play)");
    return label ? label.textContent.trim() : trigger.textContent.trim();
  }

  function embedUrl(videoId) {
    var origin = window.location.origin;
    if (!origin || origin === "null") {
      origin = window.location.protocol + "//" + window.location.host;
    }
    var params = ["rel=0", "autoplay=1", "origin=" + encodeURIComponent(origin)];
    return (
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(videoId) +
      "?" +
      params.join("&")
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
