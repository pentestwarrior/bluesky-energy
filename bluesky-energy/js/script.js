/* ==========================================================================
   BLUESKY ENERGY — script.js
   Vanilla JavaScript. No libraries required.
   ========================================================================== */

(function () {
  "use strict";

  var WHATSAPP_NUMBER = "2348149327252";

  /* ---------------------------------------------------------------
     1. Mobile navigation (hamburger menu)
  ---------------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  function closeMenu() {
    mainNav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close menu when a nav link is clicked
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Close menu when clicking outside of it
  document.addEventListener("click", function (e) {
    if (
      mainNav.classList.contains("open") &&
      !mainNav.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------------------------------------------------------------
     2. Sticky header shadow on scroll
  ---------------------------------------------------------------- */
  var header = document.getElementById("siteHeader");

  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     3. Active nav link highlighting
  ---------------------------------------------------------------- */
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href");
    if (id && id.charAt(0) === "#") {
      var section = document.querySelector(id);
      if (section) sections.push({ link: link, section: section });
    }
  });

  function highlightNav() {
    var scrollPos = window.scrollY + 120;
    var current = null;
    sections.forEach(function (item) {
      if (item.section.offsetTop <= scrollPos) current = item.link;
    });
    navLinks.forEach(function (link) { link.classList.remove("active"); });
    if (current) current.classList.add("active");
  }
  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();

  /* ---------------------------------------------------------------
     4. FAQ accordion
  ---------------------------------------------------------------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");

    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");

      // Close all items
      document.querySelectorAll(".faq-item.open").forEach(function (openItem) {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        openItem.querySelector(".faq-answer").style.maxHeight = null;
      });

      // Open clicked item (if it was closed)
      if (!isOpen) {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------------------------------------------------------------
     5. Gallery lightbox
  ---------------------------------------------------------------- */
  var galleryItems = Array.prototype.slice.call(
    document.querySelectorAll(".gallery-item")
  );
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    var img = galleryItems[currentIndex].querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent =
      galleryItems[currentIndex].getAttribute("data-caption") || img.alt;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener("click", function () { openLightbox(index); });
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", function (e) {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });
  document.getElementById("lightboxNext").addEventListener("click", function (e) {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });

  /* ---------------------------------------------------------------
     6. Quote form — frontend validation + WhatsApp handoff
  ---------------------------------------------------------------- */
  var form = document.getElementById("quoteForm");

  function setError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var group = field.closest(".form-group");
    var errorEl = document.getElementById(fieldId + "Error");
    if (message) {
      group.classList.add("invalid");
      errorEl.textContent = message;
    } else {
      group.classList.remove("invalid");
      errorEl.textContent = "";
    }
  }

  function validateForm() {
    var valid = true;

    var fullName = document.getElementById("fullName").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var email = document.getElementById("email").value.trim();
    var service = document.getElementById("service").value;
    var message = document.getElementById("message").value.trim();

    if (fullName.length < 2) { setError("fullName", "Please enter your full name."); valid = false; }
    else setError("fullName", "");

    if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) { setError("phone", "Please enter a valid phone number."); valid = false; }
    else setError("phone", "");

    if (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", "Please enter a valid email address or leave it blank.");
      valid = false;
    } else setError("email", "");

    if (service === "") { setError("service", "Please select a service."); valid = false; }
    else setError("service", "");

    if (message.length < 5) { setError("message", "Please tell us a little about what you need."); valid = false; }
    else setError("message", "");

    return valid;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    var fullName = document.getElementById("fullName").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var email = document.getElementById("email").value.trim();
    var service = document.getElementById("service").value;
    var message = document.getElementById("message").value.trim();

    var text =
      "Hello BlueSky Energy, I would like to request a quote.\n\n" +
      "Name: " + fullName + "\n" +
      "Phone: " + phone + "\n" +
      (email ? "Email: " + email + "\n" : "") +
      "Service Required: " + service + "\n" +
      "Message: " + message;

    window.open(
      "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text),
      "_blank",
      "noopener"
    );
  });

  /* ---------------------------------------------------------------
     7. Scroll reveal animations (IntersectionObserver)
  ---------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------------------------------------------------------------
     8. Image placeholder fallback
     If a local image file is missing, swap in a branded SVG
     placeholder so the site never shows a broken image.
  ---------------------------------------------------------------- */
  function placeholderDataUri(label) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">' +
      '<rect width="800" height="600" fill="#003E85"/>' +
      '<rect width="800" height="600" fill="url(#g)"/>' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#0057B7"/><stop offset="1" stop-color="#111111"/>' +
      "</linearGradient></defs>" +
      '<text x="400" y="290" fill="#ffffff" font-family="Arial, sans-serif" font-size="34" font-weight="bold" text-anchor="middle">BLUESKY ENERGY</text>' +
      '<text x="400" y="330" fill="#9fc4ef" font-family="Arial, sans-serif" font-size="18" text-anchor="middle">' +
      label + "</text></svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function handler() {
      img.removeEventListener("error", handler);
      var label = (img.alt || "BlueSky Energy Image").replace(/"/g, "");
      img.src = placeholderDataUri(label + " — replace with your photo");
    });
  });

  /* ---------------------------------------------------------------
     9. Footer year
  ---------------------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();