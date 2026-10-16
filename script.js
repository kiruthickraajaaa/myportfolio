/**
 * Portfolio Interactive Controller (script.js)
 * Respects image paths set directly in index.html while supporting optional JSON updates.
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initSqlDrawer();
  initLinkedInSwitch();
  initSkillFilter();
  initCopyAndContact();
  initProfileImages();
  initScrollReveal();
});

/**
 * 1. Smart Profile Image Handler
 * Respects the src attribute already written in index.html (e.g. assets/icons/gemini-svg.svg)
 * and automatically detects SVG vs Photo for proper alignment.
 */
function initProfileImages() {
  const heroImg = document.getElementById("heroProfileImg");
  const fallbackBox = document.getElementById("portraitFallback");
  const liImg = document.getElementById("liEmbedImg");
  const liInitials = document.getElementById("liEmbedInitials");
  const fileInput = document.getElementById("localPhotoInput");

  function applyImageMode(imgEl) {
    if (!imgEl) return;
    const src = (imgEl.getAttribute("src") || "").toLowerCase();
    if (src.endsWith(".svg")) {
      imgEl.classList.add("is-svg-icon");
    } else {
      imgEl.classList.remove("is-svg-icon");
    }
  }

  if (heroImg) {
    applyImageMode(heroImg);

    // Sync LinkedIn showcase avatar with the Hero image path
    const htmlSrc = heroImg.getAttribute("src");
    if (liImg && htmlSrc) {
      liImg.setAttribute("src", htmlSrc);
      applyImageMode(liImg);
    }

    heroImg.addEventListener("load", () => {
      heroImg.hidden = false;
      if (fallbackBox) fallbackBox.hidden = true;
    });

    heroImg.addEventListener("error", () => {
      heroImg.hidden = true;
      if (fallbackBox) fallbackBox.hidden = false;
    });

    // Trigger check if image already finished loading/failing before script ran
    if (heroImg.complete) {
      if (heroImg.naturalWidth > 0) {
        heroImg.hidden = false;
        if (fallbackBox) fallbackBox.hidden = true;
      } else {
        heroImg.hidden = true;
        if (fallbackBox) fallbackBox.hidden = false;
      }
    }
  }

  if (liImg) {
    liImg.addEventListener("load", () => {
      liImg.hidden = false;
      if (liInitials) liInitials.hidden = true;
    });
    liImg.addEventListener("error", () => {
      liImg.hidden = true;
      if (liInitials) liInitials.hidden = false;
    });
    if (liImg.complete && liImg.naturalWidth === 0) {
      liImg.hidden = true;
      if (liInitials) liInitials.hidden = false;
    }
  }

  // Allow instant local photo preview via "Change Photo" / "Upload / Preview Photo"
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (heroImg) {
          heroImg.src = ev.target.result;
          heroImg.classList.remove("is-svg-icon");
          heroImg.hidden = false;
        }
        if (fallbackBox) fallbackBox.hidden = true;
        if (liImg) {
          liImg.src = ev.target.result;
          liImg.classList.remove("is-svg-icon");
          liImg.hidden = false;
        }
        if (liInitials) liInitials.hidden = true;
        showToast("Portrait photo updated!");
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * 2. Skill Category Filter
 */
function initSkillFilter() {
  const filterBar = document.getElementById("skillFilterBar");
  const grid = document.getElementById("skillsGrid");
  if (!filterBar || !grid) return;

  const buttons = filterBar.querySelectorAll(".filter-chip");
  const cards = grid.querySelectorAll(".skill-domain-card");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.getAttribute("data-filter");
      cards.forEach((card) => {
        card.style.display =
          target === "all" || card.getAttribute("data-domain") === target ? "block" : "none";
      });
    });
  });
}

/**
 * 3. Copy to Clipboard & Contact Form
 */
function initCopyAndContact() {
  document.querySelectorAll(".copy-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => showToast(`Copied: ${text}`));
    });
  });

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const sender = document.getElementById("inputName").value.trim();
      const subject = encodeURIComponent(document.getElementById("inputSubject").value.trim());
      const body = encodeURIComponent(
        `From: ${sender}\n\n${document.getElementById("inputMessage").value.trim()}`
      );
      window.location.href = `mailto:kiruthickraajaa@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/**
 * 4. Theme Switcher (Obsidian Charcoal <-> Warm Alabaster)
 */
function initTheme() {
  const btn = document.getElementById("themeToggleBtn");
  const root = document.documentElement;
  const saved = localStorage.getItem("kr_editorial_theme") || "dark";
  root.setAttribute("data-theme", saved);

  if (btn) {
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("kr_editorial_theme", next);
    });
  }
}

/**
 * 5. Navigation & Scroll-Spy
 */
function initNavigation() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const navList = document.getElementById("navList");

  if (menuBtn && navList) {
    menuBtn.addEventListener("click", () => navList.classList.toggle("open"));
    navList.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => navList.classList.remove("open"))
    );
  }

  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-link");
  window.addEventListener("scroll", () => {
    let activeId = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 160) {
        activeId = sec.getAttribute("id");
      }
    });
    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
    });
  });
}

/**
 * 6. SQL Sample Drawer Toggle
 */
function initSqlDrawer() {
  const btn = document.getElementById("toggleSqlModalBtn");
  const drawer = document.getElementById("sqlDrawer");
  if (btn && drawer) {
    btn.addEventListener("click", () => {
      drawer.hidden = !drawer.hidden;
    });
  }
}

/**
 * 7. LinkedIn Showcase Mode Switcher
 */
function initLinkedInSwitch() {
  const btnInteractive = document.getElementById("tabInteractiveLi");
  const btnBadge = document.getElementById("tabOfficialBadge");
  const panelInteractive = document.getElementById("liInteractivePanel");
  const panelBadge = document.getElementById("liOfficialBadgePanel");

  if (btnInteractive && btnBadge && panelInteractive && panelBadge) {
    btnInteractive.addEventListener("click", () => {
      btnInteractive.classList.add("active");
      btnBadge.classList.remove("active");
      panelInteractive.hidden = false;
      panelBadge.hidden = true;
    });
    btnBadge.addEventListener("click", () => {
      btnBadge.classList.add("active");
      btnInteractive.classList.remove("active");
      panelBadge.hidden = false;
      panelInteractive.hidden = true;
    });
  }
}

/**
 * 8. IntersectionObserver Scroll Reveal
 */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function showToast(msg) {
  const toast = document.getElementById("toastBanner");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2600);
}