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

  var typedText = document.querySelector("#typed-text");
  if (typedText && !reducedMotion) {
    var phrases = [
      "Websites That Grow Your Business",
      "Digital Experiences That Convert",
      "Modern Websites. Made Simple.",
      "Your Ideas, Online."
    ];
    var phraseIndex = 0;
    var characterIndex = phrases[0].length;
    var deleting = false;
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
   HOW IT COMES TOGETHER — interactive project journey
   ========================================================================== */
(function () {
  "use strict";

  var section = document.querySelector("#process");
  if (!section) return;

  var experience = section.querySelector("#process-experience");
  var revealButton = section.querySelector("[data-process-reveal]");
  var replayButton = section.querySelector("[data-process-replay]");
  var stations = Array.prototype.slice.call(section.querySelectorAll("[data-process-stage]"));
  var details = Array.prototype.slice.call(section.querySelectorAll("[data-process-detail]"));
  var currentLabel = section.querySelector("[data-process-current]");
  var progress = section.querySelector("[data-process-progress]");
  var liveRegion = section.querySelector("[data-process-live]");
  var stationList = section.querySelector(".journey-stations");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!experience || !revealButton || !replayButton || stations.length !== details.length || !stations.length) return;

  section.classList.add("has-journey-js");
  details.forEach(function (detail, index) {
    detail.hidden = index !== 0;
  });

  var replayTimer = null;
  var replaying = false;

  function setActive(index, announce) {
    stations.forEach(function (station, stationIndex) {
      var isActive = stationIndex === index;
      station.classList.toggle("is-active", isActive);
      station.classList.toggle("is-complete", stationIndex < index);
      station.setAttribute("aria-pressed", String(isActive));
      if (isActive) {
        station.setAttribute("aria-current", "step");
      } else {
        station.removeAttribute("aria-current");
      }
    });

    details.forEach(function (detail, detailIndex) {
      var isActive = detailIndex === index;
      detail.hidden = !isActive;
      detail.classList.toggle("is-active", isActive);
    });

    if (currentLabel) currentLabel.textContent = String(index + 1).padStart(2, "0");
    if (progress) progress.style.setProperty("--journey-progress", String(index / (stations.length - 1)));
    experience.classList.toggle("is-complete", index === stations.length - 1);
    if (announce && liveRegion) {
      var title = stations[index].querySelector(".journey-stop-title");
      liveRegion.textContent = "Stage " + String(index + 1).padStart(2, "0") + " of " + String(stations.length).padStart(2, "0") + ": " + title.textContent;
    }
  }

  function stopReplay() {
    if (replayTimer !== null) {
      window.clearTimeout(replayTimer);
      replayTimer = null;
    }
    replaying = false;
    if (stationList) stationList.classList.remove("is-replaying");
  }

  function playReveal() {
    stopReplay();
    replaying = true;
    if (stationList) stationList.classList.add("is-replaying");
    stations.forEach(function (station) {
      station.classList.remove("is-shown", "is-complete");
    });
    setActive(0, false);

    if (reducedMotion.matches) {
      stations.forEach(function (station) { station.classList.add("is-shown"); });
      stopReplay();
      return;
    }

    var next = 0;
    function revealNext() {
      if (!replaying) return;
      if (next >= stations.length) {
        replayTimer = window.setTimeout(function () {
          replayTimer = null;
          stopReplay();
          setActive(0, false);
        }, 420);
        return;
      }

      stations[next].classList.add("is-shown");
      if (progress) progress.style.setProperty("--journey-progress", String(next / (stations.length - 1)));
      next += 1;
      replayTimer = window.setTimeout(revealNext, 220);
    }

    revealNext();
  }

  revealButton.addEventListener("click", function () {
    section.classList.add("journey-revealed");
    revealButton.setAttribute("aria-expanded", "true");
    playReveal();
  });

  replayButton.addEventListener("click", playReveal);

  stations.forEach(function (station, index) {
    station.addEventListener("click", function () {
      if (!section.classList.contains("journey-revealed")) return;
      stopReplay();
      stationList.classList.remove("is-replaying");
      stations.forEach(function (item) { item.classList.add("is-shown"); });
      setActive(index, true);
    });
  });
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
   CLIENT REVIEWS — featured carousel and inline all-reviews expansion
   Review content lives once in the HTML grid and is copied into the carousel.
   ========================================================================== */
(function () {
  "use strict";

  var FEATURED_MAX = 4;
  var section = document.querySelector("#testimonials");
  var root = section && section.querySelector("[data-tm]");
  if (!root) return;

  var track = root.querySelector(".tm-track");
  var viewport = root.querySelector(".tm-viewport");
  var controls = root.querySelector(".tm-controls");
  var dotsBox = root.querySelector(".tm-dots");
  var prev = root.querySelector(".tm-prev");
  var next = root.querySelector(".tm-next");
  var reviewGrid = section.querySelector(".tm-grid");
  var expanded = section.querySelector(".tm-expanded");
  var openBtn = section.querySelector(".tm-open");
  var closeBtn = section.querySelector(".tm-close");
  if (!track || !viewport || !controls || !dotsBox || !prev || !next || !reviewGrid) return;

  // Build the featured carousel from the reviews marked data-featured (first 4 only).
  var featured = Array.prototype.slice
    .call(reviewGrid.querySelectorAll(".tm-review[data-featured]"), 0, FEATURED_MAX);
  var slides = featured.map(function (card) {
    var slide = document.createElement("div");
    slide.className = "tm-slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    var copy = card.cloneNode(true);
    copy.removeAttribute("data-featured");
    slide.appendChild(copy);
    track.appendChild(slide);
    return slide;
  });

  var index = 0, perView = 1, dots = [];
  var autoplayTimer = 0, resumeTimer = 0, resizeTimer = 0;
  var hovering = false, startX = null;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function readPerView() {
    var v = parseInt(getComputedStyle(section).getPropertyValue("--tm-per-view"), 10);
    return v > 0 ? v : 1;
  }
  function maxIndex() { return Math.max(0, slides.length - perView); }
  function pageCount() { return maxIndex() + 1; }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = 0;
  }

  function startAutoplay() {
    stopAutoplay();
    if (resumeTimer || reducedMotion.matches || document.hidden || hovering || pageCount() < 2) return;
    autoplayTimer = window.setInterval(function () {
      go(index + 1, false, true);
    }, 4500);
  }

  function pauseAfterManualNavigation() {
    stopAutoplay();
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(function () {
      resumeTimer = 0;
      startAutoplay();
    }, 7000);
  }

  function buildDots() {
    dotsBox.innerHTML = "";
    dots = [];
    for (var i = 0; i < pageCount(); i++) {
      (function (n) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "tm-dot";
        d.setAttribute("aria-label", "Go to featured review group " + (n + 1));
        d.addEventListener("click", function () {
          go(n, true, false);
        });
        dotsBox.appendChild(d);
        dots.push(d);
      }(i));
    }
  }

  function go(n, manual, wrap) {
    var count = pageCount();
    if (wrap && count) index = ((n % count) + count) % count;
    else index = Math.min(maxIndex(), Math.max(0, n));
    var target = slides[index];
    var first = slides[0];
    var distance = target && first ? target.offsetLeft - first.offsetLeft : 0;
    track.style.transform = target ? "translate3d(" + (-distance) + "px, 0, 0)" : "none";
    dots.forEach(function (d, i) {
      if (i === index) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
    if (manual) pauseAfterManualNavigation();
  }

  function layout() {
    perView = readPerView();
    index = Math.min(index, maxIndex());
    controls.hidden = maxIndex() === 0;
    buildDots();
    go(index, false, false);
    startAutoplay();
  }

  prev.addEventListener("click", function () { go(index - 1, true, true); });
  next.addEventListener("click", function () { go(index + 1, true, true); });
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1, true, true);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1, true, true);
    }
  });

  // Pointer events provide touch swipe support without blocking vertical scrolling.
  viewport.addEventListener("pointerdown", function (e) {
    if (e.isPrimary) startX = e.clientX;
  });
  viewport.addEventListener("pointerup", function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1), true, true);
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
    if (document.hidden) stopAutoplay();
    else startAutoplay();
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

  section.querySelectorAll(".tm-avatar").forEach(function (avatar) {
    avatar.addEventListener("click", function () {
      section.querySelectorAll(".tm-avatar").forEach(function (item) {
        var active = item === avatar;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });

  if (expanded && openBtn && closeBtn) {
    function setExpanded(isExpanded) {
      expanded.classList.toggle("is-expanded", isExpanded);
      expanded.setAttribute("aria-hidden", String(!isExpanded));
      expanded.inert = !isExpanded;
      openBtn.setAttribute("aria-expanded", String(isExpanded));
    }

    openBtn.addEventListener("click", function () {
      setExpanded(true);
    });
    closeBtn.addEventListener("click", function () {
      setExpanded(false);
      openBtn.focus();
    });
  }

  layout();
}());