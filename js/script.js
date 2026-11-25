(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var menuButton = document.querySelector(".menu-toggle");
  var mobileMenu = document.querySelector("#mobile-menu");
  var form = document.querySelector("#contact-form");
  var feedback = document.querySelector("#form-feedback");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var packageField = form && form.elements.package;

  document.querySelectorAll(".pricing-cta[data-package][data-price]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (packageField) packageField.value = button.getAttribute("data-package") + " — " + button.getAttribute("data-price");
    });
  });

  document.querySelectorAll(".content-photo").forEach(function (image) {
    function useFallback() {
      image.classList.add("is-failed");
      image.parentElement.classList.add("photo-fallback");
    }
    image.addEventListener("error", useFallback);
    if (image.complete && image.naturalWidth === 0) useFallback();
  });

  document.querySelectorAll(".why-preview-image").forEach(function (image) {
    var previewCard = image.closest(".why-preview-card");
    function showPreviewFallback() {
      if (previewCard) previewCard.classList.add("image-failed");
    }
    image.addEventListener("error", showPreviewFallback);
    if (image.complete && image.naturalWidth === 0) showPreviewFallback();
  });

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    mobileMenu.setAttribute("aria-hidden", String(!open));
    mobileMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (open) {
      var firstLink = mobileMenu.querySelector("a");
      if (firstLink) firstLink.focus();
    } else {
      menuButton.focus();
    }
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
    mobileMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 992 && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
      }
    }, { passive: true });
  }

  if (header) {
    var ticking = false;
    function updateHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
    updateHeader();
  }

  var typedText = document.querySelector("#hero-typed-text");
  if (typedText && !reducedMotion) {
    var phrases = [
      "Your ideas, online.",
      "Websites that grow your business.",
      "Digital experiences that convert.",
      "Modern websites, made simple."
    ];
    var phraseIndex = 0;
    var characterIndex = phrases[0].length;
    var deleting = true;
    typedText.textContent = phrases[0];
    window.setTimeout(function typePhrase() {
      var phrase = phrases[phraseIndex];
      if (deleting) {
        characterIndex -= 1;
      } else {
        characterIndex += 1;
      }
      typedText.textContent = phrase.slice(0, characterIndex);
      if (!deleting && characterIndex >= phrase.length) {
        deleting = true;
        window.setTimeout(typePhrase, 1900);
        return;
      }
      if (deleting && characterIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window.setTimeout(typePhrase, 450);
        return;
      }
      window.setTimeout(typePhrase, deleting ? 38 : 69);
    }, 1900);
  }

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }

  // MSME card: if the official logo file is not added yet, show a plain text label instead of a broken image.
  var msmeLogo = document.querySelector(".msme-logo");
  if (msmeLogo) {
    var showMsmeFallback = function () {
      var fallback = document.querySelector(".msme-logo-fallback");
      msmeLogo.hidden = true;
      if (fallback) { fallback.hidden = false; }
    };
    msmeLogo.addEventListener("error", showMsmeFallback);
    if (msmeLogo.complete && msmeLogo.naturalWidth === 0 && msmeLogo.getAttribute("src")) { showMsmeFallback(); }
  }

  var whySection = document.querySelector(".why");
  if (whySection) {
    var counters = whySection.querySelectorAll(".why-stat-counter[data-count-target]");
    function showFinalCounts() {
      counters.forEach(function (counter) {
        counter.textContent = counter.getAttribute("data-count-target");
      });
    }

    if (reducedMotion || !("IntersectionObserver" in window)) {
      showFinalCounts();
    } else {
      whySection.classList.add("why-motion-ready");
      var whyObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            whySection.querySelectorAll(".why-stat, .why-feature-card").forEach(function (item) {
              item.classList.add("is-visible");
            });
            counters.forEach(function (counter) {
              if (counter.getAttribute("data-counted") === "true") return;
              counter.setAttribute("data-counted", "true");
              var target = Number(counter.getAttribute("data-count-target"));
              var duration = 2000;
              var startTime = null;

              function updateCounter(timestamp) {
                if (startTime === null) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var easedProgress = 1 - Math.pow(1 - progress, 3);
                counter.textContent = String(Math.round(target * easedProgress));
                if (progress < 1) window.requestAnimationFrame(updateCounter);
              }

              window.requestAnimationFrame(updateCounter);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18, rootMargin: "0px 0px -20px 0px" });
      whyObserver.observe(whySection);
    }
  }

  var year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();

  var generalWhatsAppMessage = "Hello OdishaTech! I'd love to know more about your services and discuss my project idea.";
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (link) {
    link.href = "https://wa.me/917064331920?text=" + encodeURIComponent(generalWhatsAppMessage);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      var name = form.elements.name.value.trim();
      var business = form.elements.business.value.trim();
      var contact = form.elements.contact.value.trim();
      var type = form.elements.type.value;
      var requirements = form.elements.requirements.value.trim();
      var selectedPackage = packageField ? packageField.value : "";
      var looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
      var digits = contact.replace(/\D/g, "");
      var looksLikePhone = digits.length >= 7 && digits.length <= 15;

      if (!looksLikeEmail && !looksLikePhone) {
        form.elements.contact.setCustomValidity("Enter a valid email address or phone number.");
        form.elements.contact.reportValidity();
        form.elements.contact.addEventListener("input", function clearContactError() {
          form.elements.contact.setCustomValidity("");
          form.elements.contact.removeEventListener("input", clearContactError);
        });
        return;
      }
      form.elements.contact.setCustomValidity("");

      var messageLines = [
        "Hello OdishaTech, I’d like to discuss a website project.",
        "",
        "Name: " + name,
        "Business: " + (business || "Not provided"),
        "Email or phone: " + contact,
        "Website type: " + type
      ];
      if (selectedPackage) messageLines.push("Selected package: " + selectedPackage);
      messageLines.push(
        "",
        "Project requirements:",
        requirements
      );
      var message = messageLines.join("\n");
      var whatsappUrl = "https://wa.me/917064331920?text=" + encodeURIComponent(message);
      if (feedback) feedback.textContent = "Opening WhatsApp with your message. Review it there, then choose Send.";
      var newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!newWindow) {
        window.location.href = whatsappUrl;
      }
    });
  }
}());

/* Callback requests are prepared for WhatsApp or email; neither is sent automatically. */
(function () {
  "use strict";

  var backdrop = document.querySelector("[data-callback-backdrop]");
  var dialog = document.querySelector("[data-callback-dialog]");
  var form = document.querySelector("[data-callback-form]");
  var success = document.querySelector("[data-callback-success]");
  var closeButton = dialog && dialog.querySelector("[data-callback-close]");
  var openButton = document.querySelector("[data-callback-open]");
  var message = form && form.querySelector("[data-callback-message]");
  var whatsappLink = success && success.querySelector("[data-callback-whatsapp]");
  var emailLink = success && success.querySelector("[data-callback-email]");
  if (!backdrop || !dialog || !form || !success || !closeButton || !openButton || !message || !whatsappLink || !emailLink) return;

  document.body.appendChild(backdrop);
  var opener = null;
  var backgroundState = [];
  var priorBodyOverflow = "";

  function closeDialog(restoreFocus) {
    if (dialog.hidden) return;
    dialog.hidden = true;
    backdrop.hidden = true;
    document.body.style.overflow = priorBodyOverflow;
    document.body.classList.remove("tm-modal-open");
    backgroundState.forEach(function (entry) { entry.element.inert = entry.wasInert; });
    backgroundState = [];
    if (restoreFocus && opener) opener.focus();
    opener = null;
  }

  function openDialog() {
    if (!success.hidden) {
      form.reset();
      form.hidden = false;
      success.hidden = true;
      message.textContent = "";
    }
    opener = openButton;
    dialog.hidden = false;
    backdrop.hidden = false;
    priorBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("tm-modal-open");
    backgroundState = Array.prototype.slice.call(document.body.children).filter(function (child) {
      return child !== backdrop && child.tagName !== "SCRIPT";
    }).map(function (child) {
      var wasInert = child.inert;
      child.inert = true;
      return { element: child, wasInert: wasInert };
    });
    closeButton.focus();
  }

  openButton.addEventListener("click", openDialog);
  closeButton.addEventListener("click", function () { closeDialog(true); });
  backdrop.addEventListener("click", function (event) {
    if (event.target === backdrop) closeDialog(true);
  });

  document.addEventListener("keydown", function (event) {
    if (dialog.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog(true);
      return;
    }
    if (event.key !== "Tab") return;
    var focusable = Array.prototype.slice.call(dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')).filter(function (item) {
      return !item.hidden && item.offsetParent !== null;
    });
    if (!focusable.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  form.addEventListener("input", function (event) {
    if (event.target.name) event.target.setCustomValidity("");
    message.textContent = "";
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var nameField = form.elements.name;
    var phoneField = form.elements.phone;
    var name = nameField.value.trim();
    var phone = phoneField.value.trim();
    var digits = phone.replace(/\D/g, "");
    nameField.setCustomValidity(name ? "" : "Enter your name.");
    phoneField.setCustomValidity(digits.length >= 7 && digits.length <= 15 ? "" : "Enter a valid phone number.");
    if (!form.reportValidity()) return;

    var service = form.elements.service.value || "Not specified";
    var callbackMessage = [
      "Hello OdishaTech! I would like to request a callback.",
      "",
      "Name: " + name,
      "Phone: " + phone,
      "Interested Service: " + service,
      "",
      "Please contact me regarding my project. Thank you!"
    ].join("\n");
    var emailBody = [
      "Hello OdishaTech,",
      "",
      "I would like to request a callback.",
      "",
      "Name: " + name,
      "Phone: " + phone,
      "Interested Service: " + service,
      "",
      "Please contact me regarding my project. Thank you!"
    ].join("\n");

    whatsappLink.href = "https://wa.me/917064331920?text=" + encodeURIComponent(callbackMessage);
    emailLink.href = "mailto:odishaatech.support@gmail.com?subject=" +
      encodeURIComponent("Callback Request – OdishaTech") + "&body=" + encodeURIComponent(emailBody);
    form.hidden = true;
    success.hidden = false;
    success.querySelector("h3").focus();
  });
}());

/* Automatically shown project promotion, independent from the welcome assistant. */
(function () {
  "use strict";

  var overlay = document.querySelector("[data-promo-overlay]");
  var dialog = document.querySelector("[data-promo-dialog]");
  var closeButton = document.querySelector("[data-promo-close]");
  var cta = document.querySelector("[data-promo-cta]");
  var banner = document.querySelector("[data-promo-banner]");
  var bannerFallback = document.querySelector("[data-promo-banner-fallback]");
  var bannerWrap = banner && banner.parentElement;
  var closeTimer = 0;
  if (!overlay || !dialog || !closeButton) return;

  if (banner && bannerFallback) {
    function updateBannerFallback() {
      var hasImage = banner.complete && banner.naturalWidth > 0;
      banner.hidden = !hasImage;
      bannerFallback.hidden = hasImage;
      if (bannerWrap) bannerWrap.classList.toggle("has-fallback", !hasImage);
    }
    banner.addEventListener("load", updateBannerFallback);
    banner.addEventListener("error", updateBannerFallback);
    if (banner.complete) updateBannerFallback();
  }

  function closePromo() {
    window.clearTimeout(closeTimer);
    overlay.classList.add("is-closing");
    closeTimer = window.setTimeout(function () {
      overlay.hidden = true;
      overlay.setAttribute("aria-hidden", "true");
      overlay.classList.remove("is-closing");
    }, 230);
  }

  closeButton.focus();
  closeButton.addEventListener("click", function () {
    closePromo();
  });
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) closePromo();
  });
  if (cta) {
    cta.addEventListener("click", function () {
      closePromo();
    });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !overlay.hidden) closePromo();
  });
}());

/* Scripted welcome assistant with navigation actions; it does not provide AI or live replies. */
(function () {
  "use strict";

  var widget = document.querySelector("[data-assistant]");
  if (!widget) return;

  var launcher = widget.querySelector("[data-assistant-launcher]");
  var panel = widget.querySelector("[data-assistant-panel]");
  var minimize = widget.querySelector(".assistant-minimize");
  var close = widget.querySelector(".assistant-close");
  var typing = widget.querySelector("[data-assistant-typing]");
  var greeting = widget.querySelector("[data-assistant-greeting]");
  var actions = widget.querySelector("[data-assistant-actions]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var typingTimer = 0;
  var welcomeShown = false;

  function updateLauncherState(isOpen) {
    launcher.setAttribute("aria-expanded", String(isOpen));
    launcher.setAttribute("aria-label", isOpen ? "OdishaTech welcome assistant is open" : "Open OdishaTech welcome assistant");
  }

  function showWelcome(useTyping) {
    if (welcomeShown) return;
    welcomeShown = true;

    function revealMessage() {
      typing.hidden = true;
      greeting.hidden = false;
      actions.hidden = false;
    }

    if (useTyping && !reducedMotion.matches) {
      typingTimer = window.setTimeout(function () {
        typing.hidden = false;
        typingTimer = window.setTimeout(revealMessage, 750);
      }, 400);
    } else {
      revealMessage();
    }
  }

  function openPanel() {
    panel.hidden = false;
    updateLauncherState(true);
    showWelcome(true);
  }

  function closePanel(restoreFocus) {
    window.clearTimeout(typingTimer);
    panel.hidden = true;
    typing.hidden = true;
    greeting.hidden = false;
    actions.hidden = false;
    updateLauncherState(false);
    if (restoreFocus) launcher.focus();
  }

  launcher.addEventListener("click", openPanel);
  minimize.addEventListener("click", function () {
    closePanel(true);
  });
  close.addEventListener("click", function () {
    closePanel(true);
  });
  actions.querySelectorAll("a").forEach(function (action) {
    action.addEventListener("click", function () {
      closePanel(false);
    });
  });
}());


/* ==========================================================================
   HOW IT WORKS — four-step workflow animation
   ========================================================================== */
(function () {
  "use strict";

  var section = document.querySelector("#process");
  if (!section) return;

  var curve = section.querySelector("#mainCurve");
  var slider = section.querySelector("[data-workflow-scrubber]");
  var replayButton = section.querySelector("[data-workflow-replay]");
  var startNode = section.querySelector("[data-workflow-start]");
  var board = section.querySelector(".process-board");
  var journeyStart = section.querySelector("[data-journey-start]");
  var autoLabel = section.querySelector("[data-autoplay-label]");
  var canvas = section.querySelector(".workflow-canvas");
  if (!curve || !slider || !replayButton || !canvas) return;

  var pathLength = curve.getTotalLength();
  var currentProgress = 0;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var timeline = [
    { t: .04, node: "node-start", dot: "dot-start" },
    { t: .10, node: "node-card-1", dot: "dot-1", stem: "stem-1" },
    { t: .24, node: "node-tag-1", dot: "dot-tag-1" },
    { t: .36, node: "node-card-2", dot: "dot-2", stem: "stem-2" },
    { t: .97, node: "node-note-2" },
    { t: .46, node: "node-tag-2", dot: "dot-tag-2" },
    { t: .58, node: "node-card-3", dot: "dot-3", stem: "stem-3" },
    { t: .68, node: "node-tag-3", dot: "dot-tag-3" },
    { t: .78, node: "node-card-4", dot: "dot-4", stem: "stem-4" },
    { t: .87, node: "node-tag-4", dot: "dot-tag-4" },
    { t: .97, node: "node-finish", dot: "dot-finish" }
  ];

  /* Split hand-written notes into letters so they can be "written" one character at a time. */
  section.querySelectorAll(".sketch-accent").forEach(function (note) {
    var index = 0;
    Array.prototype.slice.call(note.childNodes).forEach(function (child) {
      if (child.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      child.textContent.split("").forEach(function (character) {
        var span = document.createElement("span");
        span.className = "ch";
        span.style.setProperty("--i", String(index++));
        span.textContent = character;
        frag.appendChild(span);
      });
      note.replaceChild(frag, child);
    });
    var holder = note.closest(".workflow-node");
    if (holder) holder.style.setProperty("--write-end", (350 + index * 45 + 80) + "ms");
  });

  curve.style.strokeDasharray = String(pathLength);
  curve.style.strokeDashoffset = String(pathLength);

  function setWorkflowProgress(progress) {
    currentProgress = Math.max(0, Math.min(1, progress));
    curve.style.strokeDashoffset = String(pathLength * (1 - currentProgress));
    curve.style.opacity = currentProgress <= .005 ? "0" : "1";
    slider.value = String(Math.round(currentProgress * 100));
    canvas.classList.toggle("is-started", currentProgress >= .04);
    canvas.classList.toggle("is-late", currentProgress >= .78);
    if (board) {
      var intro = isPinned();
      board.classList.toggle("has-intro", intro);
      board.classList.toggle("is-intro", intro && currentProgress < INTRO_END);
    }

    timeline.forEach(function (item) {
      var node = section.querySelector("#" + item.node);
      var dot = section.querySelector("#" + item.dot);
      var stem = item.stem ? section.querySelector("#" + item.stem) : null;
      var active = currentProgress >= item.t;
      if (node) node.classList.toggle("active", active);
      if (dot) dot.classList.toggle("active", active);
      if (stem) stem.classList.toggle("active", active);
    });

    if (window.matchMedia("(max-width: 1200px)").matches) {
      // The line runs from the centre of marker 01 to the centre of marker 04 and stops there.
      var first = section.querySelector("#node-card-1");
      var last = section.querySelector("#node-card-4");
      if (first && last) {
        var lineTop = first.offsetTop + first.offsetHeight / 2;
        var lineLen = Math.max(0, last.offsetTop + last.offsetHeight / 2 - lineTop);
        canvas.style.setProperty("--line-top", Math.round(lineTop) + "px");
        canvas.style.setProperty("--line-len", Math.round(lineLen) + "px");
        // The filled part follows the scroll: it reaches a marker just as that card is revealed.
        var reveal = window.innerHeight * STACK_REVEAL - canvas.getBoundingClientRect().top + first.offsetHeight / 2;
        var filled = reducedMotion.matches ? lineLen : Math.max(0, Math.min(lineLen, reveal - lineTop));
        canvas.style.setProperty("--workflow-line-progress", Math.round(filled) + "px");
      }
    }
  }

  /* Scroll-driven journey.
     Desktop: the stage is pinned inside a tall runway and the page scroll position drives the
     progress, so Step 1 -> Step 4 -> Go-Live appear one after another (and un-appear on the way
     back up). It is ordinary sticky positioning, so scrolling is never trapped or delayed.
     Tablet / mobile / short screens: the stacked timeline fills as the section scrolls past. */
  var runway = section.querySelector("[data-process-runway]");
  var pinQuery = window.matchMedia("(min-width: 1201px) and (min-height: 560px)");
  var INTRO_END = .02;   // first scroll tick hands the centred intro over to Step 1
  var PIN_END = .92;
  var STACK_REVEAL = .8;  // stacked layout: a card appears when its top reaches 80% of the viewport height     // journey completes at 92% of the runway, leaving a short rest at the end
  var ticking = false;

  function isPinned() { return pinQuery.matches && !reducedMotion.matches && !!runway; }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function runwayRange() { return Math.max(1, runway.offsetHeight - window.innerHeight); }
  function runwayTop() { return runway.getBoundingClientRect().top + window.pageYOffset; }

  function progressFromScroll() {
    if (reducedMotion.matches) return 1;
    if (isPinned()) {
      return clamp01((-runway.getBoundingClientRect().top / runwayRange()) / PIN_END);
    }
    return stackedProgress(window.pageYOffset);
  }

  /* Stacked layout: map the scroll position to progress so that Step k becomes active exactly when
     its card reaches the reveal line, giving a one-by-one reveal that follows the real card positions. */
  function stackedPoints() {
    var vh = window.innerHeight;
    var canvasTop = canvas.getBoundingClientRect().top + window.pageYOffset;
    var pts = [];
    for (var n = 1; n <= 4; n++) {
      var card = section.querySelector("#node-card-" + n);
      var item = timeline.filter(function (entry) { return entry.node === "node-card-" + n; })[0];
      if (!card || !item) continue;
      var y = canvasTop + card.offsetTop - vh * STACK_REVEAL;
      if (pts.length && y <= pts[pts.length - 1].y) y = pts[pts.length - 1].y + 1;
      pts.push({ y: y, t: item.t });
    }
    if (!pts.length) return pts;
    pts.unshift({ y: pts[0].y - vh * .25, t: 0 });
    pts.push({ y: pts[pts.length - 1].y + vh * .35, t: 1 });
    return pts;
  }
  function stackedProgress(scrollY) {
    var pts = stackedPoints();
    if (!pts.length) return 0;
    if (scrollY <= pts[0].y) return 0;
    for (var i = 1; i < pts.length; i++) {
      if (scrollY <= pts[i].y) {
        var a = pts[i - 1], b = pts[i];
        return a.t + (b.t - a.t) * (scrollY - a.y) / (b.y - a.y);
      }
    }
    return 1;
  }
  function stackedScrollFor(value) {
    var pts = stackedPoints();
    if (!pts.length) return window.pageYOffset;
    for (var i = 1; i < pts.length; i++) {
      if (value <= pts[i].t) {
        var a = pts[i - 1], b = pts[i];
        return a.y + (b.y - a.y) * (value - a.t) / Math.max(.0001, b.t - a.t);
      }
    }
    return pts[pts.length - 1].y;
  }

  function update() {
    ticking = false;
    setWorkflowProgress(progressFromScroll());
  }
  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function scrollToProgress(value, behavior) {
    var top;
    if (isPinned()) {
      top = runwayTop() + value * PIN_END * runwayRange();
    } else {
      top = stackedScrollFor(value);
    }
    window.scrollTo({ top: Math.max(0, top), behavior: behavior || "instant" });
  }

  function scrollTopOfJourney(behavior) {
    var top = isPinned() ? runwayTop() : section.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: top, behavior: behavior });
  }

  /* Auto-play: scrolls the page through the journey at a gentle pace. Any manual scroll stops it. */
  var autoFrame = 0;
  var autoLast = 0;
  var autoplaying = false;
  var AUTO_SPEED = 400; // px per second (recomputed per run so the whole journey takes about 8 seconds)

  function setAutoUi(on) {
    autoplaying = on;
    replayButton.setAttribute("aria-pressed", on ? "true" : "false");
    if (autoLabel) autoLabel.textContent = on ? "Pause" : "Auto-play";
  }
  function stopAuto() {
    if (autoFrame) window.cancelAnimationFrame(autoFrame);
    autoFrame = 0;
    if (autoplaying) setAutoUi(false);
  }
  function autoTick(now) {
    var dt = Math.min(64, now - autoLast);
    autoLast = now;
    window.scrollBy({ top: AUTO_SPEED * dt / 1000, behavior: "instant" });
    if (progressFromScroll() >= 1) { stopAuto(); return; }
    autoFrame = window.requestAnimationFrame(autoTick);
  }
  function startAuto() {
    if (reducedMotion.matches) { scrollToProgress(1); return; }
    if (progressFromScroll() >= .995) window.scrollTo({ top: isPinned() ? runwayTop() : window.pageYOffset, behavior: "instant" });
    AUTO_SPEED = isPinned() ? Math.max(320, PIN_END * runwayRange() / 8) : 420;
    setAutoUi(true);
    autoLast = performance.now();
    autoFrame = window.requestAnimationFrame(autoTick);
  }
  function toggleAuto() { if (autoplaying) stopAuto(); else startAuto(); }
  ["wheel", "touchstart", "keydown"].forEach(function (type) {
    window.addEventListener(type, function () { if (autoplaying) stopAuto(); }, { passive: true });
  });

  replayButton.addEventListener("click", toggleAuto);
  if (startNode) startNode.addEventListener("click", function () {
    stopAuto();
    scrollTopOfJourney("instant");
    startAuto();
  });
  /* "Watch how it works" (Who We Build For section): jump to the journey, then auto-play it. */
  var pendingAuto = false;
  function cancelPending() { pendingAuto = false; }
  ["wheel", "touchstart", "keydown"].forEach(function (type) {
    window.addEventListener(type, cancelPending, { passive: true });
  });
  document.querySelectorAll("[data-watch-process]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      stopAuto();
      var target = isPinned() ? runwayTop() : section.getBoundingClientRect().top + window.pageYOffset;
      if (reducedMotion.matches) { window.scrollTo({ top: target, behavior: "auto" }); scrollToProgress(1); return; }
      pendingAuto = true;
      window.scrollTo({ top: target, behavior: "smooth" });
      var started = performance.now();
      (function waitForArrival() {
        if (!pendingAuto) return;
        var arrived = Math.abs(window.pageYOffset - target) < 3;
        if (arrived || performance.now() - started > 4500) {
          pendingAuto = false;
          startAuto();
          return;
        }
        window.requestAnimationFrame(waitForArrival);
      }());
    });
  });
  if (journeyStart) journeyStart.addEventListener("click", function () {
    scrollToProgress(.12, reducedMotion.matches ? "auto" : "smooth");
  });
  slider.addEventListener("input", function () { scrollToProgress(Number(slider.value) / 100); });
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("load", requestUpdate);
  setWorkflowProgress(progressFromScroll());
}());
/* ==========================================================================
   BEFORE & AFTER COMPARISON SLIDER (reusable: any element with [data-ba])
   ========================================================================== */
(function () {
  "use strict";

  function initCompare(root) {
    var handle = root.querySelector(".ba-handle");
    if (!handle) return;
    var rect = null, pos = 50, frame = 0, dragging = false;

    function clamp(v) { return Math.min(100, Math.max(0, v)); }

    function render() {
      frame = 0;
      root.style.setProperty("--pos", pos + "%");
      handle.setAttribute("aria-valuenow", String(Math.round(pos)));
    }

    function set(value) {
      pos = clamp(value);
      if (!frame) frame = requestAnimationFrame(render); // real-time, one paint per frame
    }

    function fromEvent(e) {
      return ((e.clientX - rect.left) / rect.width) * 100;
    }

    function easeOnce() {
      root.classList.add("is-easing");
      window.setTimeout(function () { root.classList.remove("is-easing"); }, 380);
    }

    root.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      rect = root.getBoundingClientRect();
      dragging = true;
      root.classList.remove("is-easing");
      // Clicking/tapping the track animates there; grabbing the handle follows directly.
      if (!e.target.closest(".ba-handle")) easeOnce();
      root.classList.add("is-dragging");
      try { root.setPointerCapture(e.pointerId); } catch (err) {}
      set(fromEvent(e));
    });

    root.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      set(fromEvent(e));
    });

    function stop(e) {
      if (!dragging) return;
      dragging = false;
      root.classList.remove("is-dragging");
      try { root.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    root.addEventListener("pointerup", stop);
    root.addEventListener("pointercancel", stop);
    root.addEventListener("lostpointercapture", stop);
    root.addEventListener("dragstart", function (e) { e.preventDefault(); });

    handle.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 10 : 2, next = null;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = pos - step;
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = pos + step;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = 100;
      if (next === null) return;
      e.preventDefault();
      set(next);
    });

    set(parseFloat(root.getAttribute("data-ba-start")) || 50);
    render();
  }

  document.querySelectorAll("[data-ba]").forEach(initCompare);
}());
/* ==========================================================================
   CLIENT REVIEWS — published Google Sheets reviews and independent modals
   ========================================================================== */
(function () {
  "use strict";

  var CACHE_MAX_AGE = 120000;
  var REFRESH_INTERVAL = 120000;
  var CACHE_KEY = "odishatech:published-reviews:v1:";
  var section = document.querySelector("#testimonials");
  var root = section && section.querySelector("[data-tm]");
  if (!root) return;
  var GOOGLE_REVIEWS_ENDPOINT = section.getAttribute("data-review-endpoint") || window.ODISHA_REVIEWS_ENDPOINT || "";

  var track = root.querySelector("[data-review-featured]");
  var viewport = root.querySelector(".tm-viewport");
  var controls = root.querySelector("[data-review-controls]");
  var dotsBox = root.querySelector(".tm-dots");
  var prev = root.querySelector(".tm-prev");
  var next = root.querySelector(".tm-next");
  var featuredMessage = root.querySelector("[data-review-featured-message]");
  var reviewCount = section.querySelector("[data-review-count]");
  var skeleton = root.querySelector("[data-review-skeleton]");
  var backdrop = section.querySelector("[data-review-backdrop]");
  var allDialog = section.querySelector('[data-review-dialog="all"]');
  var writeDialog = section.querySelector('[data-review-dialog="write"]');
  var list = section.querySelector("[data-review-list]");
  var listMessage = section.querySelector("[data-review-list-message]");
  var form = section.querySelector("[data-review-form]");
  var formMessage = section.querySelector("[data-review-form-message]");
  var ratingError = section.querySelector("[data-review-rating-error]");
  var submitButton = section.querySelector(".tm-submit");
  var submitLabel = section.querySelector("[data-review-submit-label]");
  if (!track || !viewport || !controls || !dotsBox || !prev || !next || !featuredMessage || !reviewCount || !skeleton || !backdrop || !allDialog || !writeDialog || !list || !form) return;

  document.body.appendChild(backdrop);

  var reviews = [];
  var slides = [];
  var index = 0, perView = 1, dots = [];
  var autoplayTimer = 0, resizeTimer = 0, refreshTimer = 0;
  var hovering = false, startX = null, activeDialog = null, opener = null, backgroundState = [];
  var sectionNear = false, lastFetchedAt = 0, requestPromise = null, requestController = null;
  var intersectionObserver = null;
  var priorBodyOverflow = "";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var cacheKey = CACHE_KEY + GOOGLE_REVIEWS_ENDPOINT;

  function endpointUrl(action) {
    var separator = GOOGLE_REVIEWS_ENDPOINT.indexOf("?") === -1 ? "?" : "&";
    return GOOGLE_REVIEWS_ENDPOINT + separator + "action=" + encodeURIComponent(action);
  }

  function setMessage(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.classList.toggle("is-error", type === "error");
    element.classList.toggle("is-success", type === "success");
  }

  function readPerView() {
    var value = parseInt(getComputedStyle(section).getPropertyValue("--tm-per-view"), 10);
    return value > 0 ? value : 1;
  }
  function pageCount() { return Math.ceil(slides.length / perView); }
  function startIndexForPage(pageIndex) {
    return Math.min(pageIndex * perView, Math.max(0, slides.length - perView));
  }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = 0;
  }

  function startAutoplay() {
    stopAutoplay();
    if (reducedMotion.matches || document.hidden || hovering || !sectionNear || activeDialog || pageCount() < 2) return;
    autoplayTimer = window.setInterval(function () {
      go(index + 1, false, true);
    }, 4500);
  }

  function go(nextIndex, manual, wrap) {
    var count = pageCount();
    if (!count) {
      index = 0;
      track.style.transform = "none";
      return;
    }
    if (wrap && count) index = ((nextIndex % count) + count) % count;
    else index = Math.min(count - 1, Math.max(0, nextIndex));
    var target = slides[startIndexForPage(index)];
    var first = slides[0];
    var distance = target && first ? target.offsetLeft - first.offsetLeft : 0;
    track.style.transform = target ? "translate3d(" + (-distance) + "px, 0, 0)" : "none";
    dots.forEach(function (dot, dotIndex) {
      if (dotIndex === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (manual) {
      stopAutoplay();
      startAutoplay();
    }
  }

  function buildDots() {
    dotsBox.innerHTML = "";
    dots = [];
    for (var dotIndex = 0; dotIndex < pageCount(); dotIndex += 1) {
      (function (pageIndex) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "tm-dot";
        dot.setAttribute("aria-label", "Go to featured review group " + (pageIndex + 1));
        dot.addEventListener("click", function () { go(pageIndex, true, false); });
        dotsBox.appendChild(dot);
        dots.push(dot);
      }(dotIndex));
    }
  }

  function layout() {
    perView = readPerView();
    index = Math.min(index, pageCount() - 1);
    controls.hidden = pageCount() < 2;
    buildDots();
    go(index, false, false);
    startAutoplay();
  }

  function buildCard(review) {
    var card = document.createElement("article");
    card.className = "tm-review";

    var stars = document.createElement("div");
    stars.className = "tm-stars";
    stars.setAttribute("role", "img");
    stars.setAttribute("aria-label", review.rating + " out of 5 stars");
    for (var star = 1; star <= 5; star += 1) {
      var starNode = document.createElement("span");
      starNode.className = star <= review.rating ? "tm-star is-filled" : "tm-star";
      starNode.setAttribute("aria-hidden", "true");
      starNode.textContent = star <= review.rating ? "★" : "☆";
      stars.appendChild(starNode);
    }

    var text = document.createElement("p");
    text.className = "tm-text";
    text.textContent = review.review;

    var meta = document.createElement("footer");
    meta.className = "tm-meta";
    var name = document.createElement("b");
    name.textContent = review.name;
    var date = document.createElement("time");
    date.dateTime = review.date;
    date.textContent = new Date(review.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    meta.appendChild(name);
    meta.appendChild(date);
    card.appendChild(stars);
    card.appendChild(text);
    card.appendChild(meta);
    return card;
  }

  function normalizeReviews(data) {
    if (!data || !Array.isArray(data.reviews)) throw new Error("The review service returned an invalid response.");
    return data.reviews.filter(function (review) {
      var status = review && String(review.status || "").trim().toLowerCase();
      return review && (!status || status === "published");
    }).map(function (review) {
      var rating = Number(review.rating);
      var date = String(review.date || review.submittedAt || "");
      if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !Number.isFinite(Date.parse(date))) return null;
      var name = String(review.name || "").trim();
      var text = String(review.review || "").trim();
      if (!name || name.length > 80 || !text || text.length > 2000) return null;
      return { name: name, rating: rating, review: text, date: new Date(date).toISOString() };
    }).filter(Boolean);
  }

  function sameReviews(first, second) {
    return first.length === second.length && first.every(function (review, reviewIndex) {
      var other = second[reviewIndex];
      return other && review.name === other.name && review.rating === other.rating &&
        review.review === other.review && review.date === other.date;
    });
  }

  function setReviewState(state, errorMessage) {
    skeleton.hidden = state !== "loading";
    featuredMessage.hidden = true;
    if (state === "loading") {
      reviewCount.textContent = "Loading published reviews…";
      return;
    }
    if (state === "error" && !reviews.length) {
      featuredMessage.textContent = errorMessage || "Unable to load published reviews right now.";
      featuredMessage.hidden = false;
      reviewCount.textContent = "Reviews unavailable";
      return;
    }
    if (!reviews.length) {
      featuredMessage.textContent = "No published reviews yet.";
      featuredMessage.hidden = false;
      reviewCount.textContent = "0 published reviews";
      return;
    }
    reviewCount.textContent = reviews.length + (reviews.length === 1 ? " published review" : " published reviews");
    if (state === "error") reviewCount.textContent += " · showing saved reviews";
  }

  function renderReviews() {
    track.innerHTML = "";
    list.innerHTML = "";
    slides = [];

    reviews.forEach(function (review, reviewIndex) {
      var slide = document.createElement("div");
      slide.className = "tm-slide";
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", "Review " + (reviewIndex + 1) + " of " + reviews.length);
      slide.appendChild(buildCard(review));
      track.appendChild(slide);
      slides.push(slide);
    });

    reviews.forEach(function (review) {
      var item = document.createElement("li");
      item.appendChild(buildCard(review));
      list.appendChild(item);
    });

    setReviewState("success");
    if (listMessage) {
      var label = reviews.length + (reviews.length === 1 ? " published review." : " published reviews.");
      setMessage(listMessage, reviews.length ? label : "No published reviews yet.", "");
    }
    index = 0;
    layout();
  }

  function readCache() {
    try {
      var cached = JSON.parse(window.sessionStorage.getItem(cacheKey) || "null");
      if (!cached || !Number.isFinite(cached.savedAt) || !Array.isArray(cached.reviews)) return;
      reviews = normalizeReviews({ reviews: cached.reviews });
      lastFetchedAt = cached.savedAt;
      renderReviews();
    } catch (error) {
      try {
        window.sessionStorage.removeItem(cacheKey);
      } catch (storageError) {
        // Session storage is optional; the live review list remains usable.
      }
    }
  }

  function saveCache() {
    try {
      window.sessionStorage.setItem(cacheKey, JSON.stringify({ savedAt: lastFetchedAt, reviews: reviews }));
    } catch (error) {
      // Session storage is optional; the live review list remains usable.
    }
  }

  function scheduleRefresh() {
    window.clearTimeout(refreshTimer);
    refreshTimer = 0;
    if (!sectionNear || document.hidden) return;
    refreshTimer = window.setTimeout(function () {
      refreshTimer = 0;
      refreshReviews(true);
    }, REFRESH_INTERVAL);
  }

  function refreshReviews(force) {
    if (!GOOGLE_REVIEWS_ENDPOINT) {
      skeleton.hidden = true;
      setReviewState("error", "Published customer reviews are temporarily unavailable.");
      if (listMessage) setMessage(listMessage, "The review service is unavailable right now.", "error");
      return Promise.resolve();
    }
    if (requestPromise) return requestPromise;
    if (!force && lastFetchedAt && Date.now() - lastFetchedAt < CACHE_MAX_AGE) {
      scheduleRefresh();
      return Promise.resolve();
    }
    if (!reviews.length) setReviewState("loading");
    if (listMessage && activeDialog === allDialog && !reviews.length) setMessage(listMessage, "Loading published reviews…", "");

    requestController = new AbortController();
    requestPromise = fetch(endpointUrl("reviews"), {
      method: "GET",
      cache: "no-store",
      signal: requestController.signal
    }).then(function (response) {
      if (!response.ok) throw new Error("The review service could not be reached. Please try again.");
      return response.json();
    }).then(function (data) {
      if (!data || (data.ok !== true && data.success !== true)) {
        throw new Error(data && data.error ? data.error : "Unable to load reviews.");
      }
      var latestReviews = normalizeReviews(data);
      if (!sameReviews(reviews, latestReviews)) {
        reviews = latestReviews;
        renderReviews();
      } else {
        setReviewState("success");
        if (listMessage) {
          var label = reviews.length + (reviews.length === 1 ? " published review." : " published reviews.");
          setMessage(listMessage, reviews.length ? label : "No published reviews yet.", "");
        }
      }
      lastFetchedAt = Date.now();
      saveCache();
      scheduleRefresh();
    }).catch(function (error) {
      if (error.name === "AbortError") return;
      setReviewState("error", error.message);
      if (listMessage && activeDialog === allDialog) {
        setMessage(listMessage, error.message || "Unable to load reviews. Please try again.", "error");
      }
    }).then(function () {
      requestPromise = null;
      requestController = null;
    });
    return requestPromise;
  }

  function openDialog(dialog, trigger) {
    closeDialog(false);
    opener = trigger;
    activeDialog = dialog;
    stopAutoplay();
    allDialog.hidden = dialog !== allDialog;
    writeDialog.hidden = dialog !== writeDialog;
    backdrop.hidden = false;
    priorBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("tm-modal-open");
    backgroundState = Array.prototype.slice.call(document.body.children).filter(function (child) {
      return child !== backdrop && child.tagName !== "SCRIPT";
    }).map(function (child) {
      var wasInert = child.inert;
      child.inert = true;
      return { element: child, wasInert: wasInert };
    });
    dialog.querySelector("[data-review-close]").focus();
    if (dialog === allDialog) refreshReviews(false);
    if (dialog === writeDialog) {
      setMessage(formMessage, "", "");
      setMessage(ratingError, "", "");
    }
  }

  function closeDialog(restoreFocus) {
    if (!activeDialog) return;
    activeDialog.hidden = true;
    backdrop.hidden = true;
    activeDialog = null;
    document.body.style.overflow = priorBodyOverflow;
    document.body.classList.remove("tm-modal-open");
    backgroundState.forEach(function (entry) { entry.element.inert = entry.wasInert; });
    backgroundState = [];
    if (restoreFocus && opener && typeof opener.focus === "function") opener.focus();
    opener = null;
    startAutoplay();
  }

  section.querySelectorAll("[data-review-open]").forEach(function (button) {
    button.addEventListener("click", function () {
      openDialog(button.getAttribute("data-review-open") === "write" ? writeDialog : allDialog, button);
    });
  });
  backdrop.querySelectorAll("[data-review-close]").forEach(function (button) {
    button.addEventListener("click", function () { closeDialog(true); });
  });
  backdrop.addEventListener("click", function (event) {
    if (event.target === backdrop) closeDialog(true);
  });
  document.addEventListener("keydown", function (event) {
    if (!activeDialog) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog(true);
      return;
    }
    if (event.key !== "Tab") return;
    var focusable = Array.prototype.slice.call(activeDialog.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [href], [tabindex]:not([tabindex="-1"])')).filter(function (item) {
      return !item.hidden && item.offsetParent !== null;
    });
    if (!focusable.length) {
      event.preventDefault();
      activeDialog.focus();
      return;
    }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === activeDialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  var ratingInputs = Array.prototype.slice.call(form.querySelectorAll('input[name="rating"]'));
  var ratingLabels = ratingInputs.map(function (input) { return input.parentElement; });

  function updateRating(hoverRating) {
    var selected = form.querySelector('input[name="rating"]:checked');
    var value = hoverRating || (selected ? Number(selected.value) : 0);
    ratingLabels.forEach(function (label, labelIndex) {
      label.classList.toggle("is-selected", labelIndex < value && !hoverRating);
      label.classList.toggle("is-hovered", labelIndex < value && Boolean(hoverRating));
    });
  }

  ratingInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      updateRating(0);
      setMessage(ratingError, "", "");
      input.setCustomValidity("");
    });
    input.parentElement.addEventListener("mouseenter", function () { updateRating(Number(input.value)); });
    input.parentElement.addEventListener("mouseleave", function () { updateRating(0); });
  });
  form.addEventListener("input", function (event) {
    event.target.setCustomValidity("");
    setMessage(formMessage, "", "");
  });

  function makeSubmissionId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return "review-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (form.dataset.submitting === "true") return;

    var nameInput = form.elements.name;
    var reviewInput = form.elements.review;
    var name = nameInput.value.trim();
    var reviewText = reviewInput.value.trim();
    nameInput.setCustomValidity(name ? "" : "Enter your name.");
    reviewInput.setCustomValidity(reviewText ? "" : "Enter your review.");
    var selectedRating = form.querySelector('input[name="rating"]:checked');
    if (!selectedRating) setMessage(ratingError, "Choose a rating from 1 to 5 stars.", "error");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (!GOOGLE_REVIEWS_ENDPOINT) {
      setMessage(formMessage, "Reviews are not connected yet. Please try again later.", "error");
      return;
    }

    var rating = Number(selectedRating.value);
    var submissionId = form.dataset.submissionId || makeSubmissionId();
    form.dataset.submissionId = submissionId;
    var params = new URLSearchParams({
      action: "submit",
      name: name,
      rating: String(rating),
      review: reviewText,
      submissionId: submissionId
    });
    var controller = new AbortController();
    var timeout = window.setTimeout(function () { controller.abort(); }, 15000);
    form.dataset.submitting = "true";
    submitButton.disabled = true;
    submitLabel.textContent = "Submitting…";
    setMessage(formMessage, "Sending your review securely…", "");

    try {
      var response = await fetch(GOOGLE_REVIEWS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
        signal: controller.signal
      });
      if (!response.ok) throw new Error("Your review could not be submitted. Please try again.");
      var result = await response.json();
      if (!result || (result.ok !== true && result.success !== true)) throw new Error(result && result.error ? result.error : "Your review could not be saved.");
      delete form.dataset.submissionId;
      form.reset();
      updateRating(0);
      setMessage(ratingError, "", "");
      setMessage(formMessage, "Thank you! Your review was received and is pending approval. It will appear after it is published.", "success");
      await refreshReviews(true);
    } catch (error) {
      var message = error.name === "AbortError"
        ? "The request timed out. Please try again; your review will not be duplicated."
        : "Unable to submit your review. Check your connection and Apps Script deployment, then try again.";
      setMessage(formMessage, error.message && error.name !== "TypeError" ? error.message : message, "error");
    } finally {
      window.clearTimeout(timeout);
      form.dataset.submitting = "false";
      submitButton.disabled = false;
      submitLabel.textContent = "Submit Review";
    }
  });

  prev.addEventListener("click", function () { go(index - 1, true, true); });
  next.addEventListener("click", function () { go(index + 1, true, true); });
  root.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1, true, true);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1, true, true);
    }
  });
  viewport.addEventListener("pointerdown", function (event) {
    if (event.isPrimary) startX = event.clientX;
  });
  viewport.addEventListener("pointerup", function (event) {
    if (startX === null) return;
    var distance = event.clientX - startX;
    startX = null;
    if (Math.abs(distance) > 45) go(index + (distance < 0 ? 1 : -1), true, true);
  });
  viewport.addEventListener("pointercancel", function () { startX = null; });
  root.addEventListener("mouseenter", function () {
    hovering = true;
    stopAutoplay();
  });
  root.addEventListener("mouseleave", function () {
    hovering = false;
    startAutoplay();
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopAutoplay();
      window.clearTimeout(refreshTimer);
      refreshTimer = 0;
    } else if (sectionNear) {
      refreshReviews(false);
      scheduleRefresh();
      startAutoplay();
    }
  });
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", function () {
      if (reducedMotion.matches) stopAutoplay();
      else startAutoplay();
    });
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(function () {
      if (reducedMotion.matches) stopAutoplay();
      else startAutoplay();
    });
  }
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(layout, 100);
  }, { passive: true });

  readCache();
  layout();

  function onSectionVisibility(entries) {
    entries.forEach(function (entry) {
      sectionNear = entry.isIntersecting;
      if (sectionNear) {
        refreshReviews(false);
        scheduleRefresh();
        startAutoplay();
      } else {
        stopAutoplay();
        window.clearTimeout(refreshTimer);
        refreshTimer = 0;
      }
    });
  }

  if ("IntersectionObserver" in window) {
    intersectionObserver = new IntersectionObserver(onSectionVisibility, { rootMargin: "400px 0px" });
    intersectionObserver.observe(section);
  } else {
    sectionNear = true;
    refreshReviews(false);
  }

  window.addEventListener("pagehide", function () {
    stopAutoplay();
    window.clearTimeout(refreshTimer);
    window.clearTimeout(resizeTimer);
    if (requestController) requestController.abort();
    if (intersectionObserver) intersectionObserver.disconnect();
  }, { once: true });
}());

/* What We Can Build: highlight the service row being pointed at / focused */
(function () {
  var rows = document.querySelectorAll(".services .service-row");
  if (!rows.length) return;
  function setActive(row) {
    rows.forEach(function (r) { r.classList.toggle("is-active", r === row); });
  }
  rows.forEach(function (row) {
    row.addEventListener("mouseenter", function () { setActive(row); });
    row.addEventListener("focusin", function () { setActive(row); });
  });
})();

/* Before & After: hide the drag hint after first interaction */
document.querySelectorAll("[data-ba]").forEach(function (ba) {
  function touched() { ba.classList.add("is-touched"); }
  ba.addEventListener("pointerdown", touched, { once: true });
  ba.addEventListener("keydown", touched, { once: true });
});

/* About section: copy Udyam number + "Our Story" modal */
(function () {
  var copyBtn = document.getElementById("ab2-copyUdyamBtn");
  var number = document.getElementById("ab2-udyamNumber");
  var feedback = document.getElementById("ab2-copyFeedback");
  var openBtn = document.getElementById("ab2-openStoryModalBtn");
  var closeBtn = document.getElementById("ab2-closeStoryModalBtn");
  var modal = document.getElementById("ab2-storyModal");
  var scrim = document.getElementById("ab2-modalScrim");
  var ctaBtn = document.getElementById("ab2-modalGetStartedBtn");
  var closeTimer;

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); document.body.removeChild(ta); resolve(); }
      catch (err) { document.body.removeChild(ta); reject(err); }
    });
  }

  if (copyBtn && number) {
    copyBtn.addEventListener("click", function () {
      var val = (number.textContent || "").trim();
      if (!val) return;
      copyText(val).then(function () {
        if (feedback) feedback.textContent = "✓ Registration number copied!";
        copyBtn.setAttribute("aria-label", "Registration number copied");
      }).catch(function () {
        if (feedback) feedback.textContent = "Unable to copy automatically";
      }).then(function () {
        setTimeout(function () {
          if (feedback) feedback.textContent = "";
          copyBtn.setAttribute("aria-label", "Copy Udyam registration number");
        }, 2400);
      });
    });
  }

  function openModal() {
    if (!modal) return;
    clearTimeout(closeTimer);
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add("ab2-is-open"); });
    document.body.style.overflow = "hidden";
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("ab2-is-open");
    document.body.style.overflow = "";
    if (openBtn) { openBtn.setAttribute("aria-expanded", "false"); openBtn.focus(); }
    closeTimer = setTimeout(function () { modal.hidden = true; }, 250);
  }
  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (scrim) scrim.addEventListener("click", closeModal);
  if (ctaBtn) ctaBtn.addEventListener("click", function () { modal.classList.remove("ab2-is-open"); document.body.style.overflow = ""; closeTimer = setTimeout(function () { modal.hidden = true; }, 250); });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });
})();