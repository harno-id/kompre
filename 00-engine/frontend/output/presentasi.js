const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

let deck = [];
let current = 0;
let presenterNotesVisible = true;

const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function setText(sel, text) {
  const el = $(sel);
  if (el) el.textContent = text;
}

function setHTML(sel, html) {
  const el = $(sel);
  if (el) el.innerHTML = html;
}

function shortTitle(title) {
  return String(title || "").replace(/^Pengaruh Gaya Bahasa Chatbot terhadap /, "").trim();
}

function sectionClass(section) {
  const key = String(section || "").toLowerCase();
  if (key.includes("pendahuluan")) return "blue";
  if (key.includes("konsep")) return "green";
  if (key.includes("metode")) return "purple";
  if (key.includes("hasil")) return "gold";
  if (key.includes("simpulan")) return "cyan";
  return "blue";
}

function notesBullets(notes) {
  const text = String(notes || "");
  const chunks = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return chunks.slice(0, 4);
}

function renderInfo(data) {
  const presentation = data.presentation || {};
  setHTML("#presentationInfo", [
    ["JD", shortTitle(data.project?.title || "Kompre Harno")],
    ["PY", "Harno"],
    ["DR", presentation.duration_label || "10-15 menit"],
    ["SL", `${presentation.total_slides || deck.length} slide`],
  ].map(([icon, text]) => `<div class="info-line"><span class="nav-ico">${icon}</span><b>${esc(text)}</b></div>`).join(""));
}

function renderStats(data) {
  const presentation = data.presentation || {};
  const stats = data.statistics || {};
  setText("#slideTotal", presentation.total_slides || deck.length);
  setText("#durationLabel", presentation.duration_label || "10-15");
  setText("#topicCount", presentation.topic_count || new Set(deck.map((slide) => slide.section_bucket)).size);
  setText("#focusLabel", presentation.focus || "Gaya Bahasa Chatbot");
  setText("#methodLabel", presentation.method || "Kuantitatif");
  setText("#resultLabel", Math.abs(Number(stats.cohens_dz || 0)) < 0.2 ? "Efek sangat kecil" : "Perlu kehati-hatian");
  setText("#safeAdvice", `Saran Aman: fokus pada tujuan, metode, hasil utama, dan implikasi. Pegang angka final: N ${data.project?.n}, paired p ${Number(stats.paired_p).toFixed(3)}, Wilcoxon p ${Number(stats.wilcoxon_p).toFixed(3)}, dz ${Number(stats.cohens_dz).toFixed(3)}.`);
}

function renderSlideList() {
  setHTML("#slideList", deck.map((slide, index) => `
    <button class="slide-list-item ${index === current ? "active" : ""}" data-index="${index}">
      <span>${index + 1}</span>
      <img src="${esc(slide.asset)}" alt="Thumbnail slide ${index + 1}">
      <b>${esc(slide.section_bucket || "Slide")}</b>
      <small>${esc(shortTitle(slide.slide_title || slide.display_title))}</small>
    </button>
  `).join(""));
  $$(".slide-list-item").forEach((button) => {
    button.addEventListener("click", () => {
      current = Number(button.dataset.index);
      renderCurrentSlide();
    });
  });
}

function renderSectionJump() {
  const sections = [...new Set(deck.map((slide) => slide.section_bucket || "Slide"))];
  setHTML("#sectionJump", sections.map((section) => {
    const index = deck.findIndex((slide) => (slide.section_bucket || "Slide") === section);
    return `<button class="section-chip ${sectionClass(section)}" data-index="${index}" type="button">${esc(section.replace("/", " / "))}</button>`;
  }).join(""));
  $$(".section-chip").forEach((button) => {
    button.addEventListener("click", () => {
      current = Number(button.dataset.index);
      renderCurrentSlide();
    });
  });
}

function renderCurrentSlide() {
  const slide = deck[current];
  if (!slide) return;
  const total = deck.length;
  setText("#slideBadge", slide.section_bucket || "Slide");
  setText("#slideCounter", `${current + 1} / ${total}`);
  setText("#slideCenterCounter", `Slide ${current + 1} dari ${total}`);
  setText("#slideTitle", slide.slide_title || slide.display_title || `Slide ${current + 1}`);
  setHTML("#slideStage", `
    <img src="${esc(slide.asset)}" alt="Slide ${current + 1}: ${esc(slide.slide_title || "")}">
  `);
  const points = (slide.points && slide.points.length ? slide.points : slide.thesis_refs || []).slice(0, 6);
  setHTML("#talkingPoints", points.map((point) => `<li><span>✓</span>${esc(point)}</li>`).join("") || "<li><span>✓</span>Fokus pada narasi utama slide.</li>");
  setHTML("#speakerNotes", notesBullets(slide.notes).map((note) => `<li>${esc(note)}</li>`).join("") || "<li>Jelaskan slide dengan mengacu pada data final audited.</li>");
  $("#prevSlide").disabled = current === 0;
  $("#nextSlide").disabled = current === total - 1;
  const progress = total > 1 ? (current / (total - 1)) * 100 : 100;
  const progressEl = $("#slideProgress");
  if (progressEl) progressEl.style.width = `${progress}%`;
  renderSlideList();
}

function bindControls() {
  $("#prevSlide")?.addEventListener("click", () => {
    current = Math.max(0, current - 1);
    renderCurrentSlide();
  });
  $("#nextSlide")?.addEventListener("click", () => {
    current = Math.min(deck.length - 1, current + 1);
    renderCurrentSlide();
  });
  $("#toggleNotes")?.addEventListener("click", () => {
    presenterNotesVisible = !presenterNotesVisible;
    document.body.classList.toggle("notes-hidden", !presenterNotesVisible);
    $("#toggleNotes").innerHTML = `<svg><use href="#i-note"></use></svg>${presenterNotesVisible ? "Sembunyikan Presenter Notes" : "Tampilkan Presenter Notes"}`;
  });
  $("#fullscreenBtn")?.addEventListener("click", () => {
    document.documentElement.requestFullscreen?.();
  });
  $("#downloadPresentation")?.addEventListener("click", () => window.print());
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") $("#nextSlide")?.click();
    if (event.key === "ArrowLeft") $("#prevSlide")?.click();
  });
}

async function init() {
  const response = await fetch("data/dashboard_data.json", { cache: "no-store" });
  const data = await response.json();
  deck = data.presentation?.slides || data.slides || [];
  renderInfo(data);
  renderStats(data);
  renderSectionJump();
  renderCurrentSlide();
  bindControls();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<pre style="position:fixed;z-index:99;inset:20px;background:#210;color:#fff;padding:20px;border:1px solid #f66">Presentation load error: ${esc(error.message)}</pre>`);
});
