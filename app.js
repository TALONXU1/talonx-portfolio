(function () {
  "use strict";

  var shaderController = null;

  function initReveal() {
    var elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || document.documentElement.classList.contains("force-reduce")) {
      elements.forEach(function (element) { element.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    elements.forEach(function (element) { observer.observe(element); });
  }

  function initMobileNavigation() {
    var toggle = document.getElementById("menu-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    function closeMenu() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    }

    toggle.addEventListener("click", function () {
      var willOpen = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
      toggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
    });

    nav.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeMenu); });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) closeMenu();
    }, { passive: true });
  }

  function initMotion() {
    var canvas = document.getElementById("hero-shader");
    var toggle = document.getElementById("motion-toggle");
    var label = document.getElementById("motion-label");
    var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof window.initHeroShader === "function") shaderController = window.initHeroShader(canvas);

    function setReduced(reduced) {
      document.documentElement.classList.toggle("force-reduce", reduced);
      if (toggle) toggle.setAttribute("aria-pressed", String(reduced));
      if (label) label.textContent = reduced ? "Motion off" : "Motion on";
      if (shaderController) {
        if (reduced) {
          shaderController.stop();
          shaderController.static();
        } else {
          shaderController.start();
        }
      }
      if (reduced) {
        document.querySelectorAll(".reveal").forEach(function (element) { element.classList.add("is-visible"); });
      }
    }

    setReduced(prefersReduced);
    if (toggle) {
      toggle.addEventListener("click", function () {
        setReduced(!document.documentElement.classList.contains("force-reduce"));
      });
    }
  }

  initMotion();
  initReveal();
  initMobileNavigation();
})();
