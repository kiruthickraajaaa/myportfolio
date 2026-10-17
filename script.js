/**
 * Portfolio Interactive Controller (script.js)
 * Loads all content from portfolio-data.json and renders it into the page.
 * Image paths set directly in index.html are respected (see SYNC_PROFILE_IMAGE_FROM_JSON).
 */

/* ------------------------------------------------------------------
 * DATA LAYER — loads portfolio-data.json and renders into existing markup
 * ------------------------------------------------------------------ */
const DATA_URL = "portfolio-data.json";
const SYNC_PROFILE_IMAGE_FROM_JSON = false; // true = use profile.profileImage from JSON instead of the <img src> in index.html
let CONTACT_EMAIL = "kiruthickraajaa@gmail.com"; // overwritten from JSON

const $ = (id) => document.getElementById(id);
const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const setText = (id, v) => {
  const el = $(id);
  if (el && v != null) el.textContent = v;
};
const setHtml = (id, html) => {
  const el = $(id);
  if (el) el.innerHTML = html;
};

async function loadPortfolioData() {
  const res = await fetch(DATA_URL, { cache: "no-cache" });
  if (!res.ok) throw new Error(`HTTP ${res.status} while loading ${DATA_URL}`);
  return res.json();
}

function renderAll(d) {
  if (d.socialLinks && d.socialLinks.email) CONTACT_EMAIL = d.socialLinks.email;
  if (d.profile) renderProfile(d.profile, d.socialLinks || {});
  if (d.profile) renderAbout(d.profile);
  if (d.skills) renderSkills(d.skills);
  if (d.experience) renderExperience(d.experience);
  if (d.projects) renderProjects(d.projects);
  if (d.certifications) renderCertifications(d.certifications);
  if (d.achievements) renderAchievements(d.achievements);
  if (d.education) renderEducation(d.education);
  if (d.socialLinks) renderContactAndLinks(d.socialLinks, (d.profile || {}).location, (d.profile || {}).name);
}

function renderProfile(p, s) {
  setText("heroStatus", p.statusText);
  setText("heroName", p.name);
  setText("heroRole", p.role);
  setText("heroTagline", p.tagline);
  setText("heroIntro", p.heroIntro);
  setText("navMonogram", p.monogram);
  setText("fallbackInitials", p.monogram);
  setText("liEmbedInitials", p.monogram);
  setText("liEmbedName", p.name);
  setText("liEmbedLocation", p.location);
  setText("footerName", p.name);

  const heroImg = $("heroProfileImg");
  const liImg = $("liEmbedImg");
  if (heroImg && p.profileImageAlt) heroImg.alt = p.profileImageAlt;
  if (liImg && p.name) liImg.alt = p.name;
  if (SYNC_PROFILE_IMAGE_FROM_JSON && heroImg && p.profileImage) {
    heroImg.setAttribute("src", p.profileImage);
  }

  if (p.sqlSample) {
    setText("sqlFilename", p.sqlSample.filename);
    setText("sqlExecNote", p.sqlSample.executionNote);
    setText("sqlCodeContent", p.sqlSample.code); // textContent => no escaping issues
  }

  if (Array.isArray(p.stats)) {
    setHtml(
      "heroStatsBar",
      p.stats
        .map(
          (st) => `
        <div class="stat-cell">
          <div class="stat-cell-val">${esc(st.value)}</div>
          <div class="stat-cell-lbl mono">${esc(st.label)}</div>
        </div>`
        )
        .join("")
    );
  }
}

function renderAbout(p) {
  if (Array.isArray(p.aboutParagraphs)) {
    setHtml("aboutNarrative", p.aboutParagraphs.map((t) => `<p>${esc(t)}</p>`).join(""));
  }
  if (Array.isArray(p.pillars)) {
    setHtml(
      "aboutPillars",
      p.pillars
        .map(
          (x) => `
        <article class="pillar-item">
          <span class="pillar-num">${esc(x.number)}</span>
          <div>
            <h3>${esc(x.title)}</h3>
            <p>${esc(x.description)}</p>
          </div>
        </article>`
        )
        .join("")
    );
  }
}

function renderSkills(skills) {
  setHtml(
    "skillsGrid",
    skills
      .map(
        (g) => `
      <article class="skill-domain-card" data-domain="${esc(g.id)}">
        <div class="domain-header">
          <h3 class="domain-title">${esc(g.category)}</h3>
          <span class="domain-badge">${esc(g.badge)}</span>
        </div>
        <div class="skill-pill-cluster">
          ${g.items.map((i) => `<span class="skill-tag${i.featured ? " featured" : ""}">${esc(i.name)}</span>`).join("")}
        </div>
      </article>`
      )
      .join("")
  );
}

function renderExperience(list) {
  setHtml(
    "experienceLedger",
    list
      .map(
        (e) => `
      <article class="ledger-row reveal">
        <div class="ledger-meta">
          <div class="ledger-idx">${esc(e.index)}</div>
          <span class="ledger-period mono">${esc(e.period)}</span>
          <p class="ledger-org">${esc(e.organization)}</p>
          <p class="ledger-org mono" style="font-size:0.75rem;">${esc(e.location)}</p>
        </div>
        <div class="ledger-content">
          <h3 class="ledger-role-title">${esc(e.role)}</h3>
          <p class="ledger-summary">${esc(e.summary)}</p>
          <ul class="ledger-Points">
            ${(e.highlights || []).map((h) => `<li>${esc(h)}</li>`).join("")}
          </ul>
          <div class="tech-stack-strip">
            ${(e.technologies || []).map((t) => `<span class="tech-mini-pill">${esc(t)}</span>`).join("")}
          </div>
        </div>
      </article>`
      )
      .join("")
  );
}

function renderProjects(list) {
  setHtml(
    "projectsGrid",
    list
      .map(
        (p) => `
      <article class="case-card reveal">
        <div>
          <div class="case-top-bar">
            <span class="case-number">${esc(p.number)}</span>
            <span class="case-cat-tag">${esc(p.category)}</span>
          </div>
          <h3 class="case-title">${esc(p.title)}</h3>
          <p class="case-summary">${esc(p.summary)}</p>
          <div class="case-challenge-box"><strong>Challenge:</strong> ${esc(p.challenge)}</div>
          <ul class="case-outcomes">
            ${(p.outcomes || []).map((o) => `<li>${esc(o)}</li>`).join("")}
          </ul>
        </div>
        <div class="tech-stack-strip">
          ${(p.technologies || []).map((t) => `<span class="tech-mini-pill">${esc(t)}</span>`).join("")}
        </div>
      </article>`
      )
      .join("")
  );
}

function renderCertifications(list) {
  setHtml(
    "certificationsList",
    list
      .map((c) => {
        const code = c.credentialUrl
          ? `<a class="cred-code" href="${esc(c.credentialUrl)}" target="_blank" rel="noopener noreferrer">${esc(c.code)}</a>`
          : `<span class="cred-code">${esc(c.code)}</span>`;
        return `
        <div class="cred-card">
          <div>
            <h4>${esc(c.name)}</h4>
            <p class="cred-issuer">${esc(c.issuer)}</p>
          </div>
          ${code}
        </div>`;
      })
      .join("")
  );
}

function renderAchievements(list) {
  setHtml(
    "achievementsList",
    list
      .map(
        (a) => `
      <div class="cred-card award-card">
        <span class="cred-code">${esc(a.tag)}</span>
        <h4>${esc(a.title)}</h4>
        <p>${esc(a.description)}</p>
      </div>`
      )
      .join("")
  );
}

function renderEducation(e) {
  setHtml(
    "educationCard",
    `
    <div class="cred-card edu-highlight-card">
      <div class="edu-top-row">
        <span class="cred-code">${esc(e.period)}</span>
        <span class="mono edu-cgpa">${esc(e.score)}</span>
      </div>
      <h4 style="font-size:1.08rem; margin-top:0.4rem;">${esc(e.degree)}</h4>
      <p class="edu-inst">${esc(e.institution)}</p>
      <p class="edu-desc">${esc(e.highlights)}</p>
    </div>`
  );
}

function renderContactAndLinks(s, location, name) {
  // Hero buttons + every LinkedIn anchor (except the official LinkedIn badge widget)
  if (s.linkedin) {
    document
      .querySelectorAll('a[href*="linkedin.com/in/"]:not(.badge-base__link)')
      .forEach((a) => a.setAttribute("href", s.linkedin));
    setText("liWindowUrl", s.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""));
  }
  if (s.hackerrank) {
    const hr = $("heroHackerrankBtn");
    if (hr) hr.setAttribute("href", s.hackerrank);
  }

  // Contact cards
  setHtml(
    "contactCardsList",
    `
    <div class="contact-row-card">
      <div>
        <span class="mono contact-lbl">EMAIL ADDRESS</span>
        <p class="contact-val"><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></p>
      </div>
      <button type="button" class="btn btn-outline btn-xs copy-trigger" data-copy="${esc(s.email)}">Copy</button>
    </div>
    <div class="contact-row-card">
      <div>
        <span class="mono contact-lbl">DIRECT PHONE</span>
        <p class="contact-val"><a href="tel:${esc(s.phone)}">${esc(s.phoneFormatted || s.phone)}</a></p>
      </div>
      <button type="button" class="btn btn-outline btn-xs copy-trigger" data-copy="${esc(s.phone)}">Copy</button>
    </div>
    <div class="contact-row-card">
      <div>
        <span class="mono contact-lbl">LOCATION</span>
        <p class="contact-val">${esc(location || "")}</p>
      </div>
      <span class="cred-code">IST (UTC+5:30)</span>
    </div>`
  );

  // Footer links
  const links = [];
  if (s.linkedin) links.push(["LinkedIn", s.linkedin, true]);
  if (s.hackerrank) links.push(["HackerRank", s.hackerrank, true]);
  if (s.email) links.push(["Email", `mailto:${s.email}`, false]);
  setHtml(
    "footerLinks",
    links
      .map(([label, href, ext]) => `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`)
      .join("")
  );
}

function showDataError(err) {
  const box = document.createElement("div");
  box.style.cssText =
    "position:fixed;left:0;right:0;bottom:0;z-index:9999;padding:14px 20px;background:#b3261e;color:#fff;font:14px/1.5 monospace;";
  const onFile = location.protocol === "file:";
  box.textContent =
    "Could not load " + DATA_URL + " (" + (err && err.message ? err.message : err) + "). " +
    (onFile
      ? "You opened the page via file:// - browsers block fetch() there. Run a local server (e.g. 'python -m http.server') and open http://localhost:8000."
      : "Check that portfolio-data.json sits next to index.html and is valid JSON.");
  document.body.appendChild(box);
}

/* ------------------------------------------------------------------
 * BOOTSTRAP
 * Theme + navigation don't depend on data, so they start immediately.
 * Everything else waits until the JSON has been rendered, so that the
 * filter, copy buttons, scroll-reveal etc. bind to the generated nodes.
 * If the JSON can't be loaded, a red error banner is shown.
 * ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  initNavigation();

  try {
    const data = await loadPortfolioData();
    renderAll(data);
  } catch (err) {
    console.error("[portfolio] Could not load " + DATA_URL, err);
    showDataError(err);
  }

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
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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