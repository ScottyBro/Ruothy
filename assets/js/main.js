/* Ruothy International — site interactions
   Progressive enhancement only. The site is fully usable without JS. */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
    // close menu when a link is tapped
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Reveal on scroll (fail-safe: content is never left hidden) ----
     Base .reveal is visible in CSS. We only ARM the animation when JS +
     IntersectionObserver are available, and a timeout guarantees everything
     shows even if the observer never fires. */
  var reveals = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reveals.length && "IntersectionObserver" in window && !reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("reveal--armed"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    // Failsafe — reveal anything still hidden shortly after load.
    window.setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }, 1400);
  }

  /* ---- Accordions (FAQ) ---- */
  document.querySelectorAll(".acc__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var expanded = q.getAttribute("aria-expanded") === "true";
      q.setAttribute("aria-expanded", String(!expanded));
    });
  });

  /* ---- Journey questionnaire (Explore Opportunities) ---- */
  var quiz = document.querySelector("[data-quiz]");
  if (quiz) {
    var goal = "", stage = "", firstRender = true;
    var result = quiz.querySelector("[data-quiz-result]");
    function pick(group, value, scroll) {
      quiz.querySelectorAll('[data-group="' + group + '"]').forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-value") === value));
      });
      if (group === "goal") goal = value; else stage = value;
      render(scroll);
    }
    quiz.querySelectorAll("[data-group]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        pick(btn.getAttribute("data-group"), btn.getAttribute("data-value"), true);
      });
    });
    var MAP = {
      study:   { title: "International Education Access", href: "services.html#education", blurb: "Programme and destination guidance, applications, scholarships and transition support — with final decisions always resting with institutions and authorities." },
      work:    { title: "Global Mobility & Talent", href: "services.html#mobility", blurb: "Realistic routes, readiness and verified opportunities, with responsible hand-offs to licensed recruitment and mobility partners." },
      skills:  { title: "GAP — Global Access Program", href: "gap.html", blurb: "Language, employability, vocational, digital-assessment and pre-departure preparation delivered through Ruothy cohorts." },
      test:    { title: "Assessment & Testing", href: "services.html#assessment", blurb: "Authorised testing, preparation boundaries, scheduling and centre requirements — explained clearly and honestly." },
      partner: { title: "Partner With Ruothy", href: "partners.html", blurb: "Ethical representation, cohort delivery, assessment capacity and workforce pipelines for institutions and employers." }
    };
    function shareUrl() {
      var base = location.origin + location.pathname;
      return base + "?goal=" + encodeURIComponent(goal) + (stage ? "&stage=" + encodeURIComponent(stage) : "");
    }
    function render(scroll) {
      if (!goal) { result.innerHTML = ""; result.hidden = true; return; }
      var r = MAP[goal];
      var stageNote = stage ? '<p class="muted" style="font-size:.85rem;margin:.4rem 0 0">Matched to your stage: <b>' + stage + '</b>. This is guidance, not an eligibility decision.</p>' : "";
      result.hidden = false;
      result.innerHTML =
        '<div class="card reveal in" style="border-color:var(--blue)">' +
          '<span class="chip chip--lime">Recommended for you</span>' +
          '<h3 style="margin-top:.8rem">' + r.title + '</h3>' +
          '<p>' + r.blurb + '</p>' + stageNote +
          '<div style="display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1rem">' +
            '<a class="btn" href="' + r.href + '">See this pathway</a>' +
            '<a class="btn btn--ghost" href="contact.html">Register interest</a>' +
          '</div>' +
          '<div class="quiz-actions">' +
            '<button type="button" data-save><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>Save this</button>' +
            '<button type="button" data-share><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>Share</button>' +
          '</div>' +
          '<p class="quiz-saved-note" role="status"></p>' +
        '</div>';
      var note = result.querySelector(".quiz-saved-note");
      function flash(msg) { note.textContent = msg; note.classList.add("show"); }
      result.querySelector("[data-save]").addEventListener("click", function () {
        try { localStorage.setItem("ruothy_journey", JSON.stringify({ goal: goal, stage: stage, at: Date.now() })); flash("Saved to this device. It’ll be here when you come back."); }
        catch (e) { flash("Couldn’t save on this device, but you can bookmark the page."); }
      });
      result.querySelector("[data-share]").addEventListener("click", function () {
        var url = shareUrl();
        if (navigator.share) { navigator.share({ title: "My Ruothy pathway", text: "My recommended Ruothy pathway: " + r.title, url: url }).catch(function () {}); }
        else if (navigator.clipboard) { navigator.clipboard.writeText(url).then(function () { flash("Link copied — share it anywhere."); }, function () { flash(url); }); }
        else { flash(url); }
      });
      if (scroll && !firstRender) result.scrollIntoView({ behavior: "smooth", block: "nearest" });
      firstRender = false;
    }
    // Restore from a shared/saved link (?goal=&stage=) or from a previous save
    var params = new URLSearchParams(location.search);
    var savedGoal = params.get("goal"), savedStage = params.get("stage");
    if (!savedGoal) {
      try { var s = JSON.parse(localStorage.getItem("ruothy_journey") || "null"); if (s && s.goal) { savedGoal = s.goal; savedStage = s.stage; } } catch (e) {}
    }
    if (savedGoal && MAP[savedGoal]) { pick("goal", savedGoal, false); if (savedStage) pick("stage", savedStage, false); }
  }

  /* ---- Forms ----
     Forms POST (see method="post" in the markup) so field values are sent in
     the request body, never the URL — personal details cannot leak into the
     address bar even if this script fails to run. Native HTML validation
     enforces required fields without JS. Wire a real endpoint (form `action`
     to your CRM / Formspree / backend) before launch to collect submissions. */

  /* ---- Cookie consent banner ---- */
  (function () {
    var KEY = "ruothy_consent";
    function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
    function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} window.ruothyConsent = v; }
    function build() {
      if (document.querySelector(".cookie-banner")) return;
      var b = document.createElement("div");
      b.className = "cookie-banner";
      b.setAttribute("role", "dialog");
      b.setAttribute("aria-label", "Cookie notice");
      b.innerHTML =
        '<div class="wrap"><div class="cookie-banner__inner">' +
          '<p>We use essential cookies to make this site work, and — only with your consent — privacy-respecting analytics to improve it. We never sell your data. See our <a href="legal.html#cookies">cookie notice</a>.</p>' +
          '<div class="cookie-banner__actions">' +
            '<button class="btn btn--ghost-light" type="button" data-decline>Decline non-essential</button>' +
            '<button class="btn btn--lime" type="button" data-accept>Accept all</button>' +
          '</div>' +
        '</div></div>';
      document.body.appendChild(b);
      requestAnimationFrame(function () { b.classList.add("show"); });
      function close() { b.classList.remove("show"); setTimeout(function () { b.remove(); }, 400); }
      b.querySelector("[data-accept]").addEventListener("click", function () { save("all"); close(); });
      b.querySelector("[data-decline]").addEventListener("click", function () { save("essential"); close(); });
    }
    window.ruothyConsent = stored();
    if (!stored()) build();
    // Any element with [data-cookie-prefs] re-opens the banner (e.g. on the legal page)
    document.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest("[data-cookie-prefs]");
      if (t) { e.preventDefault(); build(); }
    });
  })();

  /* ---- Site-wide search overlay ---- */
  (function () {
    if (!nav) return;
    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "nav__search";
    trigger.setAttribute("aria-label", "Search the site");
    trigger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';
    var toggleBtn = nav.querySelector(".nav__toggle");
    nav.insertBefore(trigger, toggleBtn);

    var modal = document.createElement("div");
    modal.className = "search-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-label", "Search Ruothy International");
    modal.innerHTML =
      '<div class="search-box">' +
        '<div class="search-box__head">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
          '<input type="search" placeholder="Search Ruothy — study, GAP, assessment, partner…" aria-label="Search" autocomplete="off">' +
          '<button class="search-box__close" type="button" aria-label="Close search">Esc</button>' +
        '</div>' +
        '<div class="search-results" role="listbox"></div>' +
      '</div>';
    document.body.appendChild(modal);

    var input = modal.querySelector("input");
    var results = modal.querySelector(".search-results");
    var index = null;
    function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
    function hl(t, q) { if (!q) return t; try { return t.replace(new RegExp("(" + esc(q) + ")", "ig"), "<mark>$1</mark>"); } catch (e) { return t; } }
    function row(p, q) { return '<a href="' + p.url + '"><b>' + hl(p.title, q) + '</b><span>' + hl(p.desc || p.keywords || "", q) + '</span></a>'; }
    function render() {
      var q = input.value.trim();
      if (!index) { results.innerHTML = '<div class="search-empty">Loading…</div>'; return; }
      if (!q) { results.innerHTML = index.map(function (p) { return row(p, ""); }).join(""); return; }
      var re = new RegExp(esc(q), "i");
      var hits = index.filter(function (p) { return re.test(p.title) || re.test(p.desc || "") || re.test(p.keywords || ""); });
      results.innerHTML = hits.length
        ? hits.map(function (p) { return row(p, q); }).join("")
        : '<div class="search-empty">No results for “' + q.replace(/</g, "&lt;") + '”. Try “study”, “GAP”, “assessment” or “partner”.</div>';
    }
    function load() {
      if (index) return;
      fetch("assets/search-index.json").then(function (r) { return r.json(); }).then(function (d) { index = d; render(); }).catch(function () { results.innerHTML = '<div class="search-empty">Search is unavailable right now.</div>'; });
    }
    function open() { modal.classList.add("show"); render(); load(); setTimeout(function () { input.focus(); }, 60); }
    function close() { modal.classList.remove("show"); }
    trigger.addEventListener("click", open);
    modal.querySelector(".search-box__close").addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    input.addEventListener("input", render);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("show")) close();
      var typing = /^(input|textarea|select)$/i.test((document.activeElement || {}).tagName || "");
      if (!typing && (e.key === "/" || ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)))) { e.preventDefault(); open(); }
    });
  })();

  /* ---- Footer year ---- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
