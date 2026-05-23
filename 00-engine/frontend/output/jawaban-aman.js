const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const STEP_KEYS = [
  { key: "core", label: "Inti Jawaban" },
  { key: "data", label: "Dasar Data" },
  { key: "theory", label: "Dasar Teori" },
  { key: "safe", label: "Kalimat Aman" },
  { key: "avoid", label: "Hindari Klaim" },
];

const AVOID_LIST = [
  "Klaim bahwa gaya bahasa Gen-Z lebih unggul secara mutlak.",
  "Generalisasi ke seluruh Generasi Z di luar konteks penelitian.",
  "Membaca Wilcoxon signifikan sebagai bukti efek praktis besar.",
  "Mencampur signifikansi statistik dengan signifikansi praktis.",
  "Menyatakan gaya formal sebagai hambatan komunikasi.",
];

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

const fmt = (value, digits = 2) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return Number(value).toFixed(digits).replace(/\.00$/, "");
};

const pval = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  const n = Number(value);
  return n < 0.001 ? "< .001" : n.toFixed(3);
};

const setHTML = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };
const setText = (sel, text) => { const el = $(sel); if (el) el.textContent = clean(text); };

const STATE = {
  data: null,
  questions: [],
  index: 0,
  filledByUser: { core: false, data: false, theory: false, safe: false, avoid: false },
};

function questionGroup(question) {
  const category = question?.category || "Kompre";
  if (["Latar Belakang", "Rumusan Masalah", "Teori", "Operasionalisasi"].includes(category)) return "Latar Belakang";
  if (["Metodologi", "Sampel", "Prosedur", "Instrumen", "Validitas"].includes(category)) return "Metodologi";
  if (["Data", "Statistik"].includes(category)) return "Data";
  if (["Hasil", "Interpretasi", "Pembahasan", "Kesimpulan"].includes(category)) return "Hasil";
  if (["Implikasi", "Etika", "Keterbatasan", "Lanjutan", "Profesor"].includes(category)) return "Implikasi";
  return "Kompre";
}

function pickTheory(question) {
  const category = question?.category || "";
  const text = `${question?.question || ""} ${question?.safe_answer || ""}`.toLowerCase();
  if (text.includes("cmc") || category === "Teori") return "CMC";
  if (text.includes("tam")) return "TAM";
  if (text.includes("s-o-r") || text.includes("stimulus")) return "S-O-R";
  if (["Hasil", "Implikasi", "Pembahasan", "Kesimpulan"].includes(category)) return "S-O-R";
  if (["Metodologi", "Instrumen", "Sampel", "Prosedur"].includes(category)) return "TAM";
  return "CMC";
}

function statSentence(stats, project) {
  const n = project?.n || 405;
  return `Pada N ${n}, mean Formal ${fmt(stats.formal_mean)} dan Gen-Z ${fmt(stats.genz_mean)} dengan selisih ${fmt(stats.mean_diff)} poin; paired t-test p ${pval(stats.paired_p)}, Wilcoxon p ${pval(stats.wilcoxon_p)}, dan Cohen's dz ${fmt(stats.cohens_dz, 3)}.`;
}

function suggestionFor(stepIndex, question, data) {
  const stats = data.statistics || {};
  const theory = data.theory_mapping || {};
  const safeCore = data.safe_core_claims || [];
  const theoryKey = pickTheory(question);
  const theoryText = theory[theoryKey] || "Chatbot diposisikan sebagai media komunikasi institusional dan gaya bahasa dibaca sebagai isyarat sosial.";
  if (stepIndex === 0) {
    const baseAnswer = clean(question.safe_answer || "");
    const headline = baseAnswer.split(/(?<=\.)\s+/)[0] || "Jawaban inti perlu langsung menjawab pertanyaan tanpa melampaui data.";
    return [
      headline,
      `Inti jawabannya, ${clean(question.question || "pertanyaan ini").toLowerCase().replace(/\?$/, "")} dijawab dengan posisi yang berbasis data final dan tetap netral.`,
    ];
  }
  if (stepIndex === 1) {
    return [
      statSentence(stats, data.project),
      `Reliabilitas instrumen tinggi dengan alpha Formal ${fmt(stats.formal_alpha, 3)} dan Gen-Z ${fmt(stats.genz_alpha, 3)}; order effect p ${pval(stats.order_effect_p)} sehingga urutan tidak bias.`,
    ];
  }
  if (stepIndex === 2) {
    return [
      `Secara teoretis, ${theoryKey} relevan: ${theoryText}`,
      `Kerangka ${theoryKey} dipakai untuk membaca temuan, bukan untuk mengubah klaim empiris menjadi lebih besar dari datanya.`,
    ];
  }
  if (stepIndex === 3) {
    return [
      "Dalam data penelitian ini, perbedaan ada secara nonparametrik tetapi sangat kecil secara praktis, sehingga klaim yang aman adalah kecenderungan minor, bukan keunggulan mutlak.",
      safeCore[4] || "Implikasi paling aman adalah segmentasi gaya bahasa chatbot, bukan penggantian total gaya formal.",
    ];
  }
  return AVOID_LIST.slice(0, 3);
}

function buildPicker() {
  const select = $("#safeQuestionSelect");
  const filter = $("#safeCategoryFilter");
  if (!select || !filter) return;
  const categories = ["Semua kategori", ...Array.from(new Set(STATE.questions.map((q) => q.category || "Kompre"))).sort()];
  filter.innerHTML = categories.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
  applyPickerFilter();
  filter.addEventListener("change", applyPickerFilter);
  select.addEventListener("change", () => {
    const value = Number(select.value);
    if (!Number.isNaN(value)) selectQuestion(value);
  });
  $("#safeSearch")?.addEventListener("input", applyPickerFilter);
}

function applyPickerFilter() {
  const select = $("#safeQuestionSelect");
  if (!select) return;
  const term = clean($("#safeSearch")?.value || "").toLowerCase();
  const cat = $("#safeCategoryFilter")?.value || "Semua kategori";
  const items = STATE.questions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => cat === "Semua kategori" || question.category === cat)
    .filter(({ question }) => !term || clean(question.question).toLowerCase().includes(term));
  if (!items.length) {
    select.innerHTML = `<option value="${STATE.index}">Tidak ada hasil cocok</option>`;
    return;
  }
  select.innerHTML = items.map(({ question, index }) => `
    <option value="${index}" ${index === STATE.index ? "selected" : ""}>
      ${index + 1}. ${esc(question.question).slice(0, 90)}
    </option>
  `).join("");
  if (!items.find((item) => item.index === STATE.index)) selectQuestion(items[0].index, false);
}

function selectQuestion(index, refreshPicker = true) {
  STATE.index = index;
  STATE.filledByUser = { core: false, data: false, theory: false, safe: false, avoid: false };
  renderQuestion();
  renderSuggestions();
  renderTheoryRow();
  renderRelated();
  $$(".safe-step-input").forEach((input) => { input.value = ""; });
  renderPreview();
  if (refreshPicker) applyPickerFilter();
}

function renderQuestion() {
  const question = STATE.questions[STATE.index] || {};
  const total = STATE.questions.length;
  setText("#safeCounter", `${STATE.index + 1} / ${total}`);
  setText("#safeCategory", question.category || "Kompre");
  setText("#safeQuestionMain", question.question || "Pertanyaan tidak tersedia.");
  setText("#safeQuestionBasis", question.basis || "Berbasis data final audited.");
  const risk = question.risk_level || "Sedang";
  setText("#safeRiskLevel", risk);
  const chip = $("#safeRiskChip");
  if (chip) {
    chip.classList.remove("risk-tinggi", "risk-sedang", "risk-aman");
    if (/tinggi/i.test(risk)) chip.classList.add("risk-tinggi");
    else if (/sedang/i.test(risk)) chip.classList.add("risk-sedang");
    else chip.classList.add("risk-aman");
  }
}

function renderSuggestions() {
  const question = STATE.questions[STATE.index] || {};
  STEP_KEYS.forEach((_, stepIndex) => {
    const list = suggestionFor(stepIndex, question, STATE.data);
    const wrap = document.querySelector(`[data-suggest="${stepIndex}"]`);
    if (!wrap) return;
    if (stepIndex === 4) { wrap.innerHTML = ""; return; }
    wrap.innerHTML = list.map((text, idx) => `
      <button class="safe-suggest-chip" type="button" data-step="${stepIndex}" data-idx="${idx}">
        <svg><use href="#i-pen"></use></svg>${esc(text)}
      </button>
    `).join("");
  });
  setHTML("#safeWarnList", AVOID_LIST.map((text) => `<li><svg><use href="#i-warn"></use></svg>${esc(text)}</li>`).join(""));
  $$(".safe-suggest-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const step = Number(chip.dataset.step);
      const idx = Number(chip.dataset.idx);
      const question = STATE.questions[STATE.index] || {};
      const list = suggestionFor(step, question, STATE.data);
      const target = document.querySelector(`.safe-step-input[data-step="${step}"]`);
      if (target) {
        target.value = String(list[idx] || "");
        STATE.filledByUser[STEP_KEYS[step].key] = true;
        renderPreview();
      }
    });
  });
}

function renderTheoryRow() {
  const question = STATE.questions[STATE.index] || {};
  const theory = STATE.data.theory_mapping || {};
  const picked = pickTheory(question);
  const items = Object.entries(theory).slice(0, 3);
  const fallback = [["CMC", "Chatbot sebagai media komunikasi institusional."], ["TAM", "Penerimaan teknologi dibaca melalui kemudahan dan kebermanfaatan."], ["S-O-R", "Gaya bahasa sebagai stimulus dan skor CUQ sebagai respons."]];
  const list = items.length ? items : fallback;
  setHTML("#safeTheoryRow", list.map(([name, desc]) => `
    <button class="safe-theory-chip ${name === picked ? "active" : ""}" type="button" data-theory="${esc(name)}">
      <svg><use href="#i-network"></use></svg>
      <b>${esc(name)}</b>
      <span>${esc(desc)}</span>
    </button>
  `).join(""));
  $$(".safe-theory-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".safe-theory-chip").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      const target = document.querySelector('.safe-step-input[data-step="2"]');
      const name = btn.dataset.theory;
      const desc = btn.querySelector("span")?.textContent || "";
      if (target) {
        target.value = `Secara teoretis, ${name} relevan: ${desc}`;
        STATE.filledByUser.theory = true;
        renderPreview();
      }
    });
  });
}

function renderDataGrid() {
  const stats = STATE.data.statistics || {};
  const n = STATE.data.project?.n || 405;
  const grid = [
    ["Responden", n, "Generasi Z paired"],
    ["Mean Formal", fmt(stats.formal_mean), "skala 0-100"],
    ["Mean Gen-Z", fmt(stats.genz_mean), "skala 0-100"],
    ["Selisih", fmt(stats.mean_diff), "Gen-Z - Formal"],
    ["t-test p", pval(stats.paired_p), "tidak signifikan"],
    ["Wilcoxon p", pval(stats.wilcoxon_p), "nonparametrik"],
    ["Cohen's dz", fmt(stats.cohens_dz, 3), "trivial"],
    ["Alpha Formal", fmt(stats.formal_alpha, 3), "reliabilitas"],
    ["Alpha Gen-Z", fmt(stats.genz_alpha, 3), "reliabilitas"],
  ];
  setHTML("#safeDataGrid", grid.map(([label, value, hint]) => `
    <div class="safe-data-cell">
      <span>${esc(label)}</span>
      <strong>${esc(value)}</strong>
      <small>${esc(hint)}</small>
    </div>
  `).join(""));
}

function renderRelated() {
  const current = STATE.questions[STATE.index] || {};
  const group = questionGroup(current);
  const related = STATE.questions
    .map((question, index) => ({ question, index }))
    .filter(({ question, index }) => index !== STATE.index && questionGroup(question) === group)
    .slice(0, 5);
  setHTML("#safeRelated", related.map(({ question, index }) => `
    <button class="related-question" type="button" data-target="${index}">
      <span>${index + 1}</span>
      <p>${esc(question.question)}</p>
    </button>
  `).join("") || `<p class="safe-empty">Tidak ada pertanyaan terkait pada grup ini.</p>`);
  $$("#safeRelated [data-target]").forEach((btn) => {
    btn.addEventListener("click", () => selectQuestion(Number(btn.dataset.target)));
  });
}

function renderPreview() {
  const values = STEP_KEYS.map((step, idx) => {
    const input = document.querySelector(`.safe-step-input[data-step="${idx}"]`);
    return clean(input?.value || "").trim();
  });
  const filledCount = values.filter((v) => v.length > 0).length;
  setText("#safePreviewMeta", `${filledCount} / 5 langkah terisi`);
  const bar = $("#safeProgressBar");
  if (bar) bar.style.width = `${(filledCount / 5) * 100}%`;
  const preview = $("#safePreview");
  if (!preview) return;
  if (!filledCount) {
    preview.innerHTML = `<p class="safe-preview-empty">Mulai isi 5 langkah di sebelah kiri. Naskah akan tersusun otomatis di sini.</p>`;
  } else {
    preview.innerHTML = STEP_KEYS.map((step, idx) => values[idx] ? `
      <section class="safe-preview-step step-${idx}">
        <span class="safe-preview-num">${idx + 1}</span>
        <div>
          <b>${esc(step.label)}</b>
          <p>${esc(values[idx])}</p>
        </div>
      </section>
    ` : "").join("");
  }
  renderConfidence(values, filledCount);
}

function renderConfidence(values, filledCount) {
  const checks = [
    { label: "Inti jawaban langsung & ringkas", ok: values[0].length >= 25 && values[0].length <= 320 },
    { label: "Ada angka final (mean/p/effect)", ok: /\d/.test(values[1]) && values[1].length >= 30 },
    { label: "Ada teori CMC/TAM/S-O-R", ok: /(CMC|TAM|S-O-R|stimulus|chatbot)/i.test(values[2]) },
    { label: "Ada frasa pembatas akademik", ok: /(dalam data|secara deskriptif|klaim praktis|hati-hati|tidak otomatis)/i.test(values[3]) },
    { label: "Daftar klaim yang dihindari terisi", ok: values[4].length >= 20 },
  ];
  const passed = checks.filter((c) => c.ok).length;
  const score = Math.round((passed / checks.length) * 100);
  setText("#safeConfidencePct", `${score}%`);
  const fill = $("#safeConfidenceFill");
  if (fill) fill.style.width = `${score}%`;
  fill?.classList.toggle("low", score < 40);
  fill?.classList.toggle("mid", score >= 40 && score < 80);
  fill?.classList.toggle("high", score >= 80);
  setHTML("#safeChecks", checks.map((c) => `
    <div class="safe-check ${c.ok ? "ok" : ""}">
      <svg><use href="#${c.ok ? "i-check" : "i-warn"}"></use></svg>
      <span>${esc(c.label)}</span>
    </div>
  `).join(""));
}

function bindSteps() {
  $$(".safe-step-input").forEach((input) => {
    input.addEventListener("input", renderPreview);
  });
  $$(".safe-step-fill[data-fill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const step = Number(btn.dataset.fill);
      const question = STATE.questions[STATE.index] || {};
      const list = suggestionFor(step, question, STATE.data);
      const target = document.querySelector(`.safe-step-input[data-step="${step}"]`);
      if (!target) return;
      if (step === 4) {
        target.value = list.map((line, idx) => `${idx + 1}. ${line}`).join("\n");
      } else {
        target.value = String(list[0] || "");
      }
      renderPreview();
    });
  });
  $("#safeFillAll")?.addEventListener("click", () => {
    const question = STATE.questions[STATE.index] || {};
    STEP_KEYS.forEach((_, idx) => {
      const list = suggestionFor(idx, question, STATE.data);
      const target = document.querySelector(`.safe-step-input[data-step="${idx}"]`);
      if (!target) return;
      target.value = idx === 4
        ? list.map((line, i) => `${i + 1}. ${line}`).join("\n")
        : String(list[0] || "");
    });
    renderPreview();
  });
  $("#safeResetBtn")?.addEventListener("click", () => {
    $$(".safe-step-input").forEach((input) => { input.value = ""; });
    renderPreview();
  });
  $("#safeCopyBtn")?.addEventListener("click", () => {
    const values = STEP_KEYS.map((step, idx) => {
      const input = document.querySelector(`.safe-step-input[data-step="${idx}"]`);
      const text = clean(input?.value || "").trim();
      return text ? `${idx + 1}. ${step.label}\n${text}` : null;
    }).filter(Boolean);
    if (!values.length) return;
    const naskah = values.join("\n\n");
    navigator.clipboard?.writeText(naskah).then(() => {
      const btn = $("#safeCopyBtn");
      const original = btn.innerHTML;
      btn.innerHTML = '<svg><use href="#i-check"></use></svg>Tersalin';
      setTimeout(() => { btn.innerHTML = original; }, 1600);
    });
  });
  $("#exportSafePdf")?.addEventListener("click", () => window.print());
  $("#themeToggle")?.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });
}

function renderInfo() {
  const n = STATE.data.project?.n || 405;
  const stats = STATE.data.statistics || {};
  setHTML("#safeInfo", [
    ["N", `${n} responden`],
    ["F", `Mean Formal ${fmt(stats.formal_mean)}`],
    ["G", `Mean Gen-Z ${fmt(stats.genz_mean)}`],
    ["dz", `Cohen's dz ${fmt(stats.cohens_dz, 3)}`],
  ].map(([icon, text]) => `<div class="info-line"><span class="nav-ico">${icon}</span><b>${esc(text)}</b></div>`).join(""));
}

async function init() {
  const response = await fetch("data/dashboard_data.json", { cache: "no-store" });
  STATE.data = await response.json();
  STATE.questions = STATE.data.questions || [];
  if (!STATE.questions.length) {
    document.body.insertAdjacentHTML("afterbegin", '<pre style="position:fixed;inset:20px;z-index:99;background:#210;color:#fff;padding:20px">Tidak ada pertanyaan di dashboard_data.json</pre>');
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const raw = Number(params.get("q") ?? 0);
  STATE.index = Number.isNaN(raw) ? 0 : Math.max(0, Math.min(STATE.questions.length - 1, raw));
  renderInfo();
  renderDataGrid();
  buildPicker();
  selectQuestion(STATE.index, true);
  bindSteps();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<pre style="position:fixed;z-index:99;inset:20px;background:#210;color:#fff;padding:20px">Safe builder load error: ${esc(error.message)}</pre>`);
});


/* ================================================================
   Q&A Modal Penguji Tesis
   Sumber: PENDALAMAN/02-data/Q&A/Q&A.md -> output/data/qa.json
   ================================================================ */
(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  const QA = {
    data: null,
    selectedGroup: "Semua",
    selectedCategory: "all",
    searchTerm: "",
    expandedId: null,
  };

  function escHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function inlineMd(text) {
    // Hanya support **bold** dan *italic* sederhana, untuk konten Q&A
    return escHtml(text)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  }

  async function loadQa() {
    if (QA.data) return QA.data;
    const response = await fetch("data/qa.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    QA.data = await response.json();
    return QA.data;
  }

  function renderGroupChips() {
    const target = document.getElementById("qaGroupChips");
    if (!target || !QA.data) return;
    const groups = ["Semua", ...QA.data.groups.map((g) => g.name)];
    target.innerHTML = groups.map((name) => {
      const active = name === QA.selectedGroup ? "active" : "";
      const label = name === "Semua" ? "Semua" : name;
      return `<button type="button" class="qa-chip ${active}" data-group="${escHtml(name)}">${escHtml(label)}</button>`;
    }).join("");
    target.querySelectorAll(".qa-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        QA.selectedGroup = btn.dataset.group;
        QA.selectedCategory = "all";
        renderGroupChips();
        renderCategoryChips();
        renderList();
      });
    });
  }

  function renderCategoryChips() {
    const target = document.getElementById("qaCategoryChips");
    if (!target || !QA.data) return;
    let cats = QA.data.categories;
    if (QA.selectedGroup !== "Semua") {
      cats = cats.filter((c) => c.group === QA.selectedGroup);
    }
    const items = [{ key: "all", label: "Semua kategori" }].concat(
      cats.map((c) => ({ key: c.key, label: `${c.key}. ${c.label}` }))
    );
    target.innerHTML = items.map((it) => {
      const active = it.key === QA.selectedCategory ? "active" : "";
      return `<button type="button" class="qa-chip qa-chip-cat ${active}" data-cat="${escHtml(it.key)}">${escHtml(it.label)}</button>`;
    }).join("");
    target.querySelectorAll(".qa-chip-cat").forEach((btn) => {
      btn.addEventListener("click", () => {
        QA.selectedCategory = btn.dataset.cat;
        renderCategoryChips();
        renderList();
      });
    });
  }

  function applyFilters() {
    if (!QA.data) return [];
    const term = QA.searchTerm.toLowerCase();
    return QA.data.questions.filter((q) => {
      if (QA.selectedGroup !== "Semua" && q.group !== QA.selectedGroup) return false;
      if (QA.selectedCategory !== "all" && q.category !== QA.selectedCategory) return false;
      if (term) {
        const haystack = `${q.question} ${q.answer} ${q.intent} ${q.ref} ${q.example || ""}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }

  function renderList() {
    const list = applyFilters();
    const target = document.getElementById("qaList");
    const empty = document.getElementById("qaEmpty");
    const meta = document.getElementById("qaModalMeta");
    if (!target) return;
    if (meta) {
      const total = QA.data?.total || 0;
      meta.textContent = list.length === total
        ? `${total} pertanyaan kritis dari penguji`
        : `Menampilkan ${list.length} dari ${total} pertanyaan`;
    }
    if (!list.length) {
      target.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    target.innerHTML = list.map((q) => buildItem(q)).join("");
    target.querySelectorAll(".qa-item-head").forEach((head) => {
      head.addEventListener("click", () => {
        const id = Number(head.dataset.id);
        QA.expandedId = QA.expandedId === id ? null : id;
        renderList();
        // Scroll item terbuka ke view
        if (QA.expandedId === id) {
          requestAnimationFrame(() => {
            const opened = target.querySelector(`.qa-item[data-id="${id}"]`);
            opened?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          });
        }
      });
    });
  }

  function buildItem(q) {
    const expanded = QA.expandedId === q.id;
    const hasExample = q.example && q.example.length > 0;
    const hasRisk = q.risk && q.risk.length > 0;
    const dangerClass = q.category === "J" ? "danger" : "";
    return `
      <article class="qa-item ${expanded ? "open" : ""} ${dangerClass}" data-id="${q.id}">
        <button class="qa-item-head" data-id="${q.id}" aria-expanded="${expanded}">
          <span class="qa-item-num">${q.id}</span>
          <div class="qa-item-titles">
            <div class="qa-item-tags">
              <span class="qa-tag qa-tag-cat">${escHtml(q.category)}. ${escHtml(q.category_label)}</span>
              <span class="qa-tag qa-tag-group">${escHtml(q.group)}</span>
            </div>
            <p class="qa-item-question">${inlineMd(q.question)}</p>
          </div>
          <span class="qa-item-toggle"><svg><use href="#i-chevron-down"></use></svg></span>
        </button>
        ${expanded ? `
        <div class="qa-item-body">
          <div class="qa-item-row">
            <span class="qa-item-key">Bab/Subbab Terkait</span>
            <p class="qa-item-val">${inlineMd(q.ref)}</p>
          </div>
          <div class="qa-item-row">
            <span class="qa-item-key">Maksud Penguji</span>
            <p class="qa-item-val">${inlineMd(q.intent)}</p>
          </div>
          ${hasRisk ? `
          <div class="qa-item-row qa-item-risk">
            <span class="qa-item-key">Risiko Jika Dijawab Keliru</span>
            <p class="qa-item-val">${inlineMd(q.risk)}</p>
          </div>` : ""}
          <div class="qa-item-row qa-item-answer">
            <span class="qa-item-key">${q.category === "J" ? "Jawaban Paling Aman" : "Jawaban Aman"}</span>
            <p class="qa-item-val">${inlineMd(q.answer)}</p>
          </div>
          ${hasExample ? `
          <div class="qa-item-row qa-item-example">
            <span class="qa-item-key">${q.category === "J" ? "Kalimat Pendek Saat Sidang" : "Contoh Jawaban Lisan"}</span>
            <p class="qa-item-val">${inlineMd(q.example)}</p>
          </div>` : ""}
        </div>` : ""}
      </article>
    `;
  }

  function openModal() {
    const modal = document.getElementById("qaModal");
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    // First-time load
    if (!QA.data) {
      loadQa()
        .then(() => {
          renderGroupChips();
          renderCategoryChips();
          renderList();
          const search = document.getElementById("qaSearch");
          if (search) search.focus();
        })
        .catch((error) => {
          document.getElementById("qaList").innerHTML = `<p class="qa-error">Gagal memuat data: ${escHtml(error.message)}</p>`;
        });
    } else {
      renderList();
      const search = document.getElementById("qaSearch");
      if (search) search.focus();
    }
  }

  function closeModal() {
    const modal = document.getElementById("qaModal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function bindEvents() {
    const trigger = document.getElementById("qaOpenBtn");
    if (trigger) {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        openModal();
      });
    }
    const closeBtn = document.getElementById("qaModalClose");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    const modal = document.getElementById("qaModal");
    if (modal) {
      modal.addEventListener("click", (event) => {
        const target = event.target;
        if (target instanceof Element && target.matches('[data-close="1"]')) {
          closeModal();
        }
      });
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal && !modal.hidden) closeModal();
    });
    const search = document.getElementById("qaSearch");
    if (search) {
      let timer = null;
      search.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          QA.searchTerm = search.value.trim();
          renderList();
        }, 120);
      });
    }
  }

  // Init setelah DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindEvents);
  } else {
    bindEvents();
  }

  window.QAModal = { open: openModal, close: closeModal };
})();
