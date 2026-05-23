const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => [...document.querySelectorAll(sel)];
const setHTML = (sel, html) => {
  const el = qs(sel);
  if (el) el.innerHTML = html;
};
const setText = (sel, text) => {
  const el = qs(sel);
  if (el) el.textContent = text;
};

let questionState = [];
let activeCategory = "all";
let activeLevel = "all";

const fmt = (value, digits = 2) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return Number(value).toFixed(digits).replace(/\.00$/, "");
};

const pval = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  const n = Number(value);
  return n < 0.001 ? "< .001" : n.toFixed(3);
};

const clean = (value) => String(value ?? "")
  .replaceAll("\u00e2\u20ac\u201d", "-")
  .replaceAll("\u00e2\u20ac\u201c", "-")
  .replaceAll("\u00e2\u2020\u2019", "->")
  .replaceAll("\u00e2\u20ac\u00a2", "-")
  .replaceAll("\u00e2\u20ac\u2122", "'")
  .replaceAll("\u00ef\u00bb\u00bf", "");

const esc = (value) => clean(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

async function loadDashboard() {
  const response = await fetch("data/dashboard_data.json", { cache: "no-store" });
  const data = await response.json();

  hydrateText(data);
  renderStats(data.statistics || {});
  renderInfoPanel(data);
  renderQuestions(data.questions || []);
  renderDimensions(data.cuq_dimensions?.items || []);
  renderClaims(data.safe_core_claims || []);
  renderTheory(data.theory_mapping || {});
  renderSlides(data.slides || []);
  renderDocuments(data.project || {}, data.documents || {});
  renderMethod(data.method_flow || []);
  renderExports(data.exports || []);
  bindUiHooks();
}

function hydrateText(data) {
  qsa("[data-field]").forEach((el) => {
    let value = data;
    el.dataset.field.split(".").forEach((key) => {
      value = value?.[key];
    });
    if (value !== undefined && value !== null) el.textContent = clean(value);
  });
}

function renderStats(stats) {
  const statMap = {
    formal_mean: fmt(stats.formal_mean, 2),
    formal_sd: fmt(stats.formal_sd, 2),
    genz_mean: fmt(stats.genz_mean, 2),
    genz_sd: fmt(stats.genz_sd, 2),
    mean_diff: fmt(stats.mean_diff, 3),
    paired_p: pval(stats.paired_p),
    wilcoxon_p: pval(stats.wilcoxon_p),
    cohens_dz: fmt(stats.cohens_dz, 3),
    shapiro_p: pval(stats.shapiro_p),
    order_effect_p: pval(stats.order_effect_p),
    formal_alpha: fmt(stats.formal_alpha, 3),
    genz_alpha: fmt(stats.genz_alpha, 3),
  };

  qsa("[data-stat]").forEach((el) => {
    el.textContent = statMap[el.dataset.stat] ?? "-";
  });

  const formalWidth = Math.min(100, Number(stats.formal_mean || 0));
  const genzWidth = Math.min(100, Number(stats.genz_mean || 0));
  if (qs("#formalBar")) qs("#formalBar").style.width = `${formalWidth}%`;
  if (qs("#genzBar")) qs("#genzBar").style.width = `${genzWidth}%`;
}

function renderInfoPanel(data) {
  setHTML("#researchInfo", [
    ["N", `${data.project?.n || "-"} responden Generasi Z`],
    ["DS", "Within-subject"],
    ["IQ", "Chatbot Usability Questionnaire"],
    ["UJ", "Paired t-test, Wilcoxon, Cohen's dz"],
  ].map(([icon, text]) => `<div class="info-line"><span class="nav-ico">${icon}</span><b>${esc(text)}</b></div>`).join(""));
}

function renderQuestions(questions) {
  questionState = questions;
  const categories = ["all", "Latar Belakang", "Metodologi", "Data", "Hasil", "Implikasi"];
  setHTML("#questionTabs", categories.map((category) => {
    const count = category === "all" ? questions.length : questions.filter((q) => questionGroup(q) === category).length;
    const label = category === "all" ? "Semua" : category;
    return `<button class="tab-pill ${category === activeCategory ? "active" : ""}" data-category="${esc(category)}">${esc(label)} (${count})</button>`;
  }).join(""));

  qsa(".tab-pill").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderQuestions(questionState);
    });
  });

  setHTML("#levelFilter", [
    ["all", "Semua Tingkat"],
    ["Tinggi", "Tinggi"],
    ["Sedang", "Sedang"],
    ["Aman", "Aman"],
  ].map(([value, label]) => `<option value="${value}" ${value === activeLevel ? "selected" : ""}>${label}</option>`).join(""));

  qs("#questionSearch")?.addEventListener("input", updateQuestionList);
  qs("#levelFilter")?.addEventListener("change", (event) => {
    activeLevel = event.target.value;
    updateQuestionList();
  });
  updateQuestionList();
}

function questionGroup(question) {
  const category = question?.category || "Kompre";
  if (["Latar Belakang", "Rumusan Masalah", "Teori", "Operasionalisasi"].includes(category)) return "Latar Belakang";
  if (["Metodologi", "Sampel", "Prosedur", "Instrumen", "Validitas"].includes(category)) return "Metodologi";
  if (["Data", "Statistik"].includes(category)) return "Data";
  if (["Hasil", "Interpretasi", "Pembahasan", "Kesimpulan"].includes(category)) return "Hasil";
  if (["Implikasi", "Etika", "Keterbatasan", "Lanjutan", "Profesor"].includes(category)) return "Implikasi";
  return "Metodologi";
}

function questionConfidence(question, index) {
  if (question?.risk_level) return question.risk_level;
  if (index < 2) return "Tinggi";
  if (index < 4) return "Sedang";
  return "Aman";
}

function updateQuestionList() {
  const term = (qs("#questionSearch")?.value || "").toLowerCase();
  const filtered = questionState.filter((q, index) => {
    const text = `${q.category || ""} ${q.question || ""} ${q.safe_answer || ""} ${q.basis || ""}`.toLowerCase();
    const confidence = questionConfidence(q, index);
    return (activeCategory === "all" || questionGroup(q) === activeCategory)
      && (activeLevel === "all" || confidence === activeLevel)
      && text.includes(term);
  });

  setHTML("#questionList", filtered.map((q, index) => {
    const originalIndex = questionState.indexOf(q);
    const confidence = questionConfidence(q, originalIndex);
    const confidenceClass = confidence === "Sedang" ? "medium" : "";
    return `
      <button class="question-row" data-index="${originalIndex}">
        <span class="row-num">${originalIndex + 1}</span>
        <span class="question-title">${esc(q.question)}</span>
        <span class="tag-group"><span class="tag">${esc(q.category || "Kompre")}</span><span class="tag alt">Konsep Kunci</span></span>
        <span class="confidence">Tingkat Keyakinan <b class="${confidenceClass}">${confidence}</b></span>
        <span class="row-arrow">&gt;</span>
      </button>`;
  }).join("") || `<div class="answer-drawer">Tidak ada pertanyaan yang cocok dengan filter.</div>`);

  qsa(".question-row").forEach((row) => {
    row.addEventListener("click", () => {
      const q = questionState[Number(row.dataset.index)];
      showAnswer(q);
    });
  });
}

function showAnswer(question) {
  const index = Math.max(0, questionState.indexOf(question));
  setText("#answerCategory", question.category || "Kompre");
  setText("#answerQuestion", question.question || "Pertanyaan");
  setText("#answerText", question.safe_answer || "Jawaban belum tersedia.");
  setText("#answerBasis", question.basis || "Berbasis data final audited dan file skill metodologi kuantitatif.");
  const detailLink = qs("#answerDetailLink");
  if (detailLink) detailLink.href = `detail-pertanyaan.html?q=${index}`;
  const popover = qs("#answerPopover");
  if (popover) {
    popover.classList.add("open");
    popover.setAttribute("aria-hidden", "false");
  }
}

function hideAnswer() {
  const popover = qs("#answerPopover");
  if (popover) {
    popover.classList.remove("open");
    popover.setAttribute("aria-hidden", "true");
  }
}

function renderDimensions(items) {
  setHTML("#dimensionList", items.map((item) => `
    <article class="dimension-card">
      <b>${esc(item.dimension)}<span>${fmt(item.genz_mean, 1)}</span></b>
      <div class="track"><i style="width:${Math.min(100, Number(item.genz_mean || 0))}%"></i></div>
      <small>Formal ${fmt(item.formal_mean, 1)} / Gen-Z ${fmt(item.genz_mean, 1)} / Diff ${fmt(item.diff, 2)}</small>
    </article>
  `).join(""));
}

function renderClaims(claims) {
  setHTML("#safeClaims", claims.slice(0, 5).map((claim) => `<div class="doc-card"><p>${esc(claim)}</p></div>`).join(""));
}

function renderTheory(theories) {
  setHTML("#theoryGrid", Object.entries(theories).map(([name, text]) => `
    <article class="theory-card">
      <span class="eyebrow">Peta Teori</span>
      <h3>${esc(name)}</h3>
      <p>${esc(text)}</p>
    </article>
  `).join(""));
}

function renderSlides(slides) {
  setHTML("#slideGrid", slides.slice(0, 6).map((slide) => `
    <article class="slide-card">
      <img src="${esc(slide.asset || "")}" alt="Slide ${esc(slide.slide)}" loading="lazy" onerror="this.style.display='none'">
      <span class="tag">${esc(slide.section_bucket || "Slide")}</span>
      <h3>${String(slide.slide).padStart(2, "0")}. ${esc(slide.slide_title)}</h3>
      <p>${esc((slide.thesis_refs || []).slice(0, 3).join(" / "))}</p>
    </article>
  `).join(""));
}

function renderDocuments(project, docs) {
  const rows = [
    ["CSV Master", project.source_of_truth],
    ["Locked Thesis DOCX", project.locked_thesis_docx],
    ["Locked Thesis PDF", project.locked_thesis_pdf],
    ["Updated Paparan", project.updated_paparan],
  ];
  setHTML("#docTrace", rows.map(([label, value]) => `
    <article class="doc-card">
      <span class="eyebrow">${esc(label)}</span>
      <p>${esc(value || "-")}</p>
    </article>
  `).join(""));
  setText("#auditExcerpt", clean(docs.skill_report_excerpt || docs.lock_manifest_excerpt || "Audit belum tersedia."));
}

function renderMethod(items) {
  setHTML("#methodFlow", items.map((item, index) => `
    <div class="step ${["blue", "green", "purple", "gold", "cyan"][index % 5]}">
      <span class="step-badge">${index + 1}</span>
      <div><h3>Langkah ${index + 1}</h3><p>${esc(item)}</p></div>
    </div>
  `).join(""));
}

function renderExports(exports) {
  setHTML("#exportList", exports.map((item) => `
    <a class="export-card" href="${esc(item.path)}" target="_blank" rel="noreferrer">
      <b>${esc(item.label)}</b><br><span class="eyebrow">${esc(item.path)}</span>
    </a>
  `).join(""));
}

function bindUiHooks() {
  qs("#themeToggle")?.addEventListener("click", () => document.body.classList.toggle("soft-mode"));
  qs("#exportPdfBtn")?.addEventListener("click", () => window.print());
  qs("#answerClose")?.addEventListener("click", hideAnswer);
  qs("#answerPopover")?.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) hideAnswer();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideAnswer();
  });
}

loadDashboard().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML("afterbegin", `<pre style="position:fixed;z-index:99;inset:20px;background:#210;color:#fff;padding:20px;border:1px solid #f66">Dashboard load error: ${esc(error.message)}</pre>`);
});
