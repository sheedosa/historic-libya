/* ============================================================
   HistoricLibya — interactions (vanilla)
   ============================================================ */
(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Hero entrance ------------------------------------- */
  const hero = $(".hero");
  if (hero) requestAnimationFrame(() => hero.setAttribute("data-anim", "in"));

  /* ---- Navbar: frosted on scroll ------------------------- */
  const nav = $(".nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu --------------------------------------- */
  const burger = $(".nav__burger");
  const closeBtn = $(".nav__panel-close");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (burger) burger.setAttribute("aria-expanded", String(open));
  };
  if (burger) burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  if (closeBtn) closeBtn.addEventListener("click", () => setMenu(false));
  $$(".nav__panel-links a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---- EN / AR toggle (visual stub) ---------------------- */
  $$(".lang-toggle").forEach((tg) => {
    tg.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      $$("button", tg).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    });
  });

  /* ---- Scroll reveals ------------------------------------ */
  const reveals = $$("[data-reveal]");
  if (rm || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---- Scroll-spy active nav ----------------------------- */
  const sections = $$("section[id], header[id]");
  const linkFor = {};
  $$(".nav__link").forEach((l) => {
    const id = (l.getAttribute("href") || "").replace("#", "");
    if (id) linkFor[id] = l;
  });
  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        $$(".nav__link").forEach((l) => l.classList.remove("is-active"));
        if (linkFor[id]) linkFor[id].classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---- Era timeline: arrows, drag, progress -------------- */
  const track = $(".timeline__track");
  if (track) {
    const prev = $('[data-tl="prev"]');
    const next = $('[data-tl="next"]');
    const railFill = $(".timeline__rail span");
    const step = () => {
      const card = track.querySelector(".era-card");
      const gap = parseFloat(getComputedStyle(track).columnGap || "24") || 24;
      return card ? card.getBoundingClientRect().width + gap : 360;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? track.scrollLeft / max : 0;
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= max - 4;
      if (railFill) {
        const visible = Math.min(1, track.clientWidth / track.scrollWidth);
        railFill.style.width = (visible * 100) + "%";
        railFill.style.left = (p * (100 - visible * 100)) + "%";
      }
    };
    if (prev) prev.addEventListener("click", () => track.scrollBy({ left: -step() * 1.4, behavior: rm ? "auto" : "smooth" }));
    if (next) next.addEventListener("click", () => track.scrollBy({ left:  step() * 1.4, behavior: rm ? "auto" : "smooth" }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    // pointer drag-to-scroll
    let down = false, startX = 0, startL = 0, moved = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startL = track.scrollLeft;
      track.style.cursor = "grabbing";
    });
    track.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startL - dx;
    });
    const end = () => { down = false; track.style.cursor = ""; };
    track.addEventListener("pointerup", end);
    track.addEventListener("pointercancel", end);
    track.addEventListener("pointerleave", end);
    // prevent click navigation right after a drag
    track.addEventListener("click", (e) => { if (moved) { e.preventDefault(); } }, true);
  }

  /* ---- Forms (newsletter + any data-form) ---------------- */
  $$("form[data-form]").forEach((form) => {
    const msg = form.querySelector(".form-msg");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const val = (input && input.value || "").trim();
      const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
      if (!msg) return;
      if (!ok) { msg.textContent = "Please enter a valid email address."; msg.style.color = "#E0A899"; return; }
      msg.style.color = "var(--brass)";
      msg.textContent = "Thank you — you're on the list. We'll be in touch from Tripoli.";
      form.reset();
    });
  });

  /* ---- Smooth-scroll for in-page anchors ----------------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: rm ? "auto" : "smooth" });
    });
  });
})();
