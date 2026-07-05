/**
 * Image lightbox: overlay, keyboard navigation, click-outside to close.
 */
(function () {
  var items = [];
  var seen = Object.create(null);

  function stepCaption(step) {
    var nameEl = step.querySelector(".workflow-step__name");
    var descEl = step.querySelector(".workflow-step__desc");
    var title = nameEl ? nameEl.textContent.trim() : "";
    var desc = descEl ? descEl.textContent.trim() : "";
    if (title && desc) return title + " - " + desc;
    return title || desc;
  }

  document.querySelectorAll(".workflow-step").forEach(function (step) {
    var img = step.querySelector(".js-lightbox");
    if (!img) return;
    var src = img.getAttribute("src");
    if (!src || seen[src]) return;
    seen[src] = true;
    items.push({
      src: src,
      alt: img.getAttribute("alt") || "",
      caption: stepCaption(step),
    });
  });

  var triggers = document.querySelectorAll(".js-lightbox");
  if (!triggers.length || !items.length) return;

  var index = 0;
  var open = false;

  var root = document.createElement("div");
  root.className = "lightbox";
  root.hidden = true;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Image preview");

  root.innerHTML =
    '<div class="lightbox__backdrop" data-lightbox-close></div>' +
    '<button type="button" class="modal-close lightbox__close" aria-label="Close">&times;</button>' +
    '<div class="lightbox__dialog">' +
    '  <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">&#10094;</button>' +
    '  <figure class="lightbox__figure">' +
    '    <img class="lightbox__img" src="" alt="" decoding="async" />' +
    '    <figcaption class="lightbox__caption"></figcaption>' +
    "  </figure>" +
    '  <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next image">&#10095;</button>' +
    "</div>";

  document.body.appendChild(root);

  var backdrop = root.querySelector(".lightbox__backdrop");
  var dialog = root.querySelector(".lightbox__dialog");
  var figure = root.querySelector(".lightbox__figure");
  var image = root.querySelector(".lightbox__img");
  var caption = root.querySelector(".lightbox__caption");
  var btnClose = root.querySelector(".lightbox__close");
  var btnPrev = root.querySelector(".lightbox__nav--prev");
  var btnNext = root.querySelector(".lightbox__nav--next");

  function srcIndex(src) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].src === src) return i;
    }
    return 0;
  }

  function showAt(i) {
    index = (i + items.length) % items.length;
    var item = items[index];
    image.src = item.src;
    image.alt = item.alt;
    caption.textContent = item.caption || "";
    var single = items.length <= 1;
    btnPrev.hidden = single;
    btnNext.hidden = single;
  }

  function openAt(i) {
    showAt(i);
    root.hidden = false;
    open = true;
    document.body.classList.add("lightbox-open");
    btnClose.focus();
  }

  function close() {
    root.hidden = true;
    open = false;
    document.body.classList.remove("lightbox-open");
    image.removeAttribute("src");
    caption.textContent = "";
  }

  function step(delta) {
    showAt(index + delta);
  }

  triggers.forEach(function (trigger) {
    trigger.style.cursor = "zoom-in";
    trigger.addEventListener("click", function () {
      openAt(srcIndex(trigger.getAttribute("src")));
    });
  });

  btnClose.addEventListener("click", function (e) {
    e.stopPropagation();
    close();
  });

  btnPrev.addEventListener("click", function (e) {
    e.stopPropagation();
    step(-1);
  });

  btnNext.addEventListener("click", function (e) {
    e.stopPropagation();
    step(1);
  });

  backdrop.addEventListener("click", close);

  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) close();
  });

  figure.addEventListener("click", function (e) {
    if (e.target === figure || e.target === caption) close();
  });

  image.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("keydown", function (e) {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    }
  });
})();
