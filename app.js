/* Yarda website: download links, the Live Show demo, card spotlight and reveal-on-scroll. No dependencies. */
(() => {
  "use strict";

  /* ───────────── Downloads (latest GitHub release) ───────────── */

  const REPO = "yarda-studio/desktop";
  const API = `https://api.github.com/repos/${REPO}/releases/latest`;
  const CACHE_KEY = "yarda.site.release.v1";

  function platform() {
    const ua = navigator.userAgent || "";
    const hint = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    if (/Android|iPhone|iPad|iPod/i.test(ua)) return "mobile";
    if (/Mac/i.test(hint) || /Mac OS X/i.test(ua)) return "mac";
    if (/Win/i.test(hint) || /Windows/i.test(ua)) return "win";
    return "other";
  }

  const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;

  async function loadRelease() {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      if (cached && Date.now() - cached.at < 3600_000) return cached.data;
    } catch { /* storage unavailable */ }
    const res = await fetch(API, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const data = await res.json();
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })); } catch { /* ignore */ }
    return data;
  }

  const pick = (assets, re) => assets.find((a) => re.test(a.name));

  function applyDownloads(release) {
    const assets = release.assets || [];
    const version = (release.tag_name || "").replace(/^v/, "");
    const mac = pick(assets, /_aarch64\.dmg$/);
    const exe = pick(assets, /_x64-setup\.exe$/);
    const msi = pick(assets, /_x64_en-US\.msi$/);
    const here = platform();

    const setCell = (id, asset, detail) => {
      const el = document.getElementById(id);
      if (!el || !asset) return;
      el.href = asset.browser_download_url;
      const d = el.querySelector("[data-detail]");
      if (d) d.textContent = `${detail} · version ${version} · ${mb(asset.size)}`;
    };
    setCell("dl-mac", mac, "Apple silicon (M1 and later)");
    setCell("dl-win", exe, "64-bit installer");

    if (msi) {
      document.getElementById("dl-msi").href = msi.browser_download_url;
      document.getElementById("dl-msi-wrap").hidden = false;
    }
    const meta = document.getElementById("get-meta");
    if (meta && version) {
      const when = release.published_at ? new Date(release.published_at).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" }) : "";
      meta.textContent = `Version ${version}${when ? `, released ${when}` : ""}.`;
    }

    const primary = document.querySelector("[data-primary-download]");
    const label = document.querySelector("[data-primary-label]");
    const note = document.querySelector("[data-version-note]");
    const chosen = here === "mac" ? mac : here === "win" ? exe : null;
    if (primary && label && chosen) {
      primary.href = chosen.browser_download_url;
      label.textContent = here === "mac" ? "Download for macOS" : "Download for Windows";
      if (note) note.textContent = `Version ${version}${here === "mac" ? " for Apple silicon Macs (M1 and later)" : " for 64-bit Windows"}. Free and open source.`;
    } else if (note && version) {
      note.textContent = `Version ${version}. Free and open source, MIT licensed.`;
    }
  }

  (function markPlatform() {
    const here = platform();
    if (here === "mac") document.getElementById("dl-mac")?.classList.add("is-match");
    if (here === "win") document.getElementById("dl-win")?.classList.add("is-match");
    if (here === "mobile") {
      const note = document.querySelector("[data-version-note]");
      if (note) note.textContent = "Yarda runs on Mac and Windows computers. Open this page on your computer to download it.";
      const sub = document.getElementById("get-sub");
      if (sub) sub.textContent = "Yarda is a desktop app for Mac and Windows. Open this page on your computer to download it.";
    }
  })();
  loadRelease().then(applyDownloads).catch(() => { /* links already point at the releases page */ });

  /* ───────────── Live Show demo ───────────── */

  const V = (book, ch, v, text) => ({ book, ch, v, text, ref: `${book} ${ch}:${v}` });
  const VERSES = [
    V("John", 3, 16, "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."),
    V("Psalm", 23, 1, "The LORD is my shepherd; I shall not want."),
    V("Psalm", 23, 4, "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me."),
    V("Romans", 8, 28, "And we know that all things work together for good to them that love God, to them who are the called according to his purpose."),
    V("Romans", 15, 13, "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost."),
    V("Philippians", 4, 13, "I can do all things through Christ which strengtheneth me."),
    V("Jeremiah", 29, 11, "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end."),
    V("Isaiah", 41, 10, "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness."),
    V("Genesis", 1, 1, "In the beginning God created the heaven and the earth."),
    V("Proverbs", 3, 5, "Trust in the LORD with all thine heart; and lean not unto thine own understanding."),
    V("Matthew", 11, 28, "Come unto me, all ye that labour and are heavy laden, and I will give you rest."),
    V("John", 1, 1, "In the beginning was the Word, and the Word was with God, and the Word was God."),
    V("Hebrews", 11, 1, "Now faith is the substance of things hoped for, the evidence of things not seen."),
    V("Hebrews", 6, 19, "Which hope we have as an anchor of the soul, both sure and stedfast, and which entereth into that within the veil;"),
    V("Psalm", 46, 1, "God is our refuge and strength, a very present help in trouble."),
    V("1 Corinthians", 13, 13, "And now abideth faith, hope, charity, these three; but the greatest of these is charity."),
    V("Joshua", 1, 9, "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest."),
    V("Matthew", 5, 9, "Blessed are the peacemakers: for they shall be called the children of God."),
    V("Psalm", 119, 105, "Thy word is a lamp unto my feet, and a light unto my path."),
    V("Romans", 5, 8, "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us."),
    V("John", 10, 11, "I am the good shepherd: the good shepherd giveth his life for the sheep."),
    V("Ephesians", 2, 8, "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:"),
    V("Psalm", 27, 1, "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?"),
    V("Titus", 2, 11, "For the grace of God that bringeth salvation hath appeared to all men,"),
  ];

  const ALIASES = {
    genesis: ["gen", "ge"], psalm: ["psalms", "ps", "psa"], proverbs: ["prov", "pr"], isaiah: ["isa"], jeremiah: ["jer"],
    matthew: ["matt", "mt"], john: ["jn", "joh"], romans: ["rom", "ro"], "1 corinthians": ["1co", "1cor"],
    ephesians: ["eph"], philippians: ["phil", "php"], hebrews: ["heb"], joshua: ["josh"], titus: ["tit"],
  };
  // The app knows every book; the demo only needs to recognise a typed reference to say it isn't one of its 24.
  const KNOWN_BOOKS = ["exodus", "leviticus", "numbers", "deuteronomy", "judges", "ruth", "samuel", "kings", "chronicles", "ezra", "nehemiah", "esther", "job", "ecclesiastes", "daniel", "hosea", "joel", "amos", "micah", "luke", "mark", "acts", "galatians", "colossians", "thessalonians", "timothy", "james", "peter", "jude", "revelation"];

  const aliasToBook = new Map();
  Object.entries(ALIASES).forEach(([book, list]) => {
    aliasToBook.set(book.replace(/\s+/g, ""), book);
    list.forEach((a) => aliasToBook.set(a.replace(/\s+/g, ""), book));
  });

  const TOPICS = [
    { re: /hope|future|anchor/, title: "hope", refs: ["Romans 15:13", "Hebrews 6:19", "Jeremiah 29:11", "Hebrews 11:1"] },
    { re: /fear|afraid|anxi|worr|courage/, title: "fear", refs: ["Isaiah 41:10", "Joshua 1:9", "Psalm 27:1", "Psalm 23:4"] },
    { re: /love|loved/, title: "love", refs: ["John 3:16", "Romans 5:8", "1 Corinthians 13:13"] },
    { re: /rest|peace|tired|weary/, title: "rest", refs: ["Matthew 11:28", "Matthew 5:9", "Psalm 46:1"] },
    { re: /strength|strong|help/, title: "strength", refs: ["Philippians 4:13", "Psalm 46:1", "Isaiah 41:10"] },
    { re: /guid|light|direct|trust/, title: "guidance", refs: ["Psalm 119:105", "Proverbs 3:5", "Psalm 23:1"] },
  ];

  const $ = (id) => document.getElementById(id);
  const input = $("demo-input");
  const results = $("demo-results");
  const form = $("demo-form");
  const goBtn = $("go-live");
  const queueBtn = $("queue-btn");
  const sched = $("sched-list");
  const slide = $("slide");
  const chip = $("live-chip");

  const byRef = (ref) => VERSES.find((x) => x.ref === ref);
  const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  let preview = byRef("Psalm 23:1");
  let live = preview;

  function syncSchedule() {
    sched.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.ref === preview.ref));
  }
  function syncGo() {
    const differs = preview.ref !== live.ref;
    goBtn.disabled = !differs;
    goBtn.classList.toggle("ready", differs);
  }
  function setPreview(verse) {
    preview = verse;
    $("prev-title").textContent = verse.ref;
    $("prev-ref").textContent = `${verse.ref} · KJV`;
    $("prev-text").textContent = verse.text;
    restart($("prev-verse"), "swap");
    syncSchedule();
    syncGo();
  }
  function goLive() {
    if (preview.ref === live.ref && chip.classList.contains("on")) return;
    live = preview;
    $("slide-text").textContent = live.text;
    $("slide-text").classList.toggle("long", live.text.length > 70);
    $("slide-ref").textContent = `${live.ref} · KJV`;
    restart(slide, "swap");
    chip.classList.add("on");
    syncGo();
  }

  goBtn.addEventListener("click", goLive);
  queueBtn.addEventListener("click", () => {
    if ([...sched.querySelectorAll("button")].some((b) => b.dataset.ref === preview.ref)) return;
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.ref = preview.ref;
    b.innerHTML = `${escapeHtml(preview.ref)} <small>KJV</small>`;
    li.appendChild(b);
    sched.appendChild(li);
    syncSchedule();
  });
  sched.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    const v = b && byRef(b.dataset.ref);
    if (v) setPreview(v);
  });
  sched.addEventListener("dblclick", (e) => {
    const b = e.target.closest("button");
    const v = b && byRef(b.dataset.ref);
    if (v) { setPreview(v); goLive(); }
  });

  function parseReference(raw) {
    const m = raw.trim().toLowerCase().match(/^((?:[123]\s?)?[a-z]+)\s*(\d+)\s*[:.]\s*(\d+)$/);
    if (!m) return null;
    const key = m[1].replace(/\s+/g, "");
    const book = aliasToBook.get(key);
    const known = book || KNOWN_BOOKS.some((b) => b.startsWith(key) && key.length >= 3);
    return { book, ch: +m[2], v: +m[3], known: !!known };
  }

  let rows = [];
  let active = -1;

  function setActive(i) {
    results.querySelectorAll("button").forEach((b, n) => b.classList.toggle("active", n === i));
    active = i;
  }
  function render(items, noteHtml) {
    rows = items;
    active = -1;
    results.innerHTML = "";
    if (noteHtml) {
      const li = document.createElement("li");
      li.className = "note";
      li.innerHTML = noteHtml;
      results.appendChild(li);
    }
    items.forEach((it, i) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.innerHTML = it.html;
      b.addEventListener("click", () => setPreview(it.verse));
      b.addEventListener("mouseenter", () => setActive(i));
      li.appendChild(b);
      results.appendChild(li);
    });
    results.hidden = !(items.length || noteHtml);
  }
  const clip = (t, n) => escapeHtml(t.length > n ? t.slice(0, n) + "…" : t);
  function highlight(text, words) {
    let out = escapeHtml(text);
    words.forEach((w) => {
      out = out.replace(new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"), "<mark>$1</mark>");
    });
    return out;
  }

  function search(value) {
    const raw = value.trim();
    if (!raw) { render([], ""); return; }

    if (raw.startsWith("?")) {
      const q = raw.slice(1).trim().toLowerCase();
      if (!q) { render([], "Describe what you're looking for, for example <b>? verses about hope</b>"); return; }
      const topic = TOPICS.find((t) => t.re.test(q)) || TOPICS[0];
      const items = topic.refs.map(byRef).filter(Boolean).map((verse) => ({ verse, html: `<b>${verse.ref}</b>${clip(verse.text, 90)}` }));
      render(items, `Ask Scripture, sample answer for “${escapeHtml(topic.title)}”. In the app it searches the whole Bible for any question.`);
      return;
    }

    const ref = parseReference(raw);
    if (ref) {
      const verse = VERSES.find((x) => ref.book && x.book.toLowerCase() === ref.book && x.ch === ref.ch && x.v === ref.v);
      if (verse) render([{ verse, html: `<b>${verse.ref}</b>${clip(verse.text, 90)}` }], "Press Enter to preview it, then Go Live.");
      else if (ref.known) render([], "That verse isn't in this demo's 24. The app has the whole Bible.");
      else render([], "Keep typing a book name, like <b>jn 3:16</b> or <b>rom 8:28</b>.");
      return;
    }

    const words = raw.replace(/"/g, "").split(/\s+/).filter((w) => w.length >= 3);
    if (!words.length) { render([], "Keep typing…"); return; }
    const phrase = raw.includes('"') ? raw.replace(/"/g, "").trim().toLowerCase() : null;
    const hits = VERSES.filter((x) => {
      const t = x.text.toLowerCase();
      return phrase ? t.includes(phrase) : words.every((w) => t.includes(w.toLowerCase()));
    }).slice(0, 6);
    if (!hits.length) { render([], `No matches for “${escapeHtml(raw)}” in this demo's 24 verses.`); return; }
    render(hits.map((verse) => ({ verse, html: `<b>${verse.ref}</b>${highlight(verse.text.length > 110 ? verse.text.slice(0, 110) + "…" : verse.text, phrase ? [phrase] : words)}` })), "");
  }

  input.addEventListener("input", () => search(input.value));
  input.addEventListener("keydown", (e) => {
    const n = rows.length;
    if (e.key === "ArrowDown" && n) { e.preventDefault(); setActive((active + 1) % n); }
    else if (e.key === "ArrowUp" && n) { e.preventDefault(); setActive((active - 1 + n) % n); }
    else if (e.key === "Escape") { input.value = ""; render([], ""); }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (rows.length) { setPreview(rows[Math.max(active, 0)].verse); input.value = ""; render([], ""); return; }
    // Enter on an empty bar sends the previewed verse live, like the console's own Enter.
    if (!input.value.trim()) goLive();
  });
  document.querySelectorAll("[data-try]").forEach((btn) => {
    btn.addEventListener("click", () => {
      input.value = btn.dataset.try;
      search(input.value);
      input.focus();
      if (parseReference(input.value) && rows[0]) setPreview(rows[0].verse);
    });
  });
  syncSchedule();

  /* ───────────── Card spotlight ───────────── */

  document.querySelectorAll(".card, .get-cell").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ───────────── Reveal on scroll ───────────── */

  const items = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-in"));
  }
})();
