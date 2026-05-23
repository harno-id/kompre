const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

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

function setHTML(sel, html) {
  const el = $(sel);
  if (el) el.innerHTML = html;
}

function setText(sel, text) {
  const el = $(sel);
  if (el) el.textContent = clean(text);
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

function confidence(question, index) {
  if (question?.risk_level) return question.risk_level;
  if (index < 2) return "Tinggi";
  if (index < 4) return "Sedang";
  return "Aman";
}

function selectedIndex(total) {
  const params = new URLSearchParams(window.location.search);
  const raw = Number(params.get("q") ?? params.get("index") ?? 0);
  if (Number.isNaN(raw)) return 0;
  return Math.max(0, Math.min(total - 1, raw));
}

function renderInfo(data) {
  const n = data.project?.n || 405;
  setHTML("#detailInfo", [
    ["N", `${n} responden Generasi Z`],
    ["DS", "Within-subject"],
    ["IQ", "CUQ 16 item"],
    ["UJ", "Paired t-test, Wilcoxon, Cohen's dz"],
  ].map(([icon, text]) => `<div class="info-line"><span class="nav-ico">${icon}</span><b>${esc(text)}</b></div>`).join(""));
}

function visualSteps(question, data) {
  const stats = data.statistics || {};
  const group = questionGroup(question);
  if (group === "Metodologi") {
    return [
      ["Desain", "Within-subject", "Setiap responden menilai dua kondisi chatbot.", "i-users", "blue"],
      ["Kontrol", "Counterbalancing", "Urutan F->G dan G->F dipakai untuk menekan order effect.", "i-reset", "green"],
      ["Instrumen", "CUQ 16 item", `Reliabilitas tinggi: alpha ${fmt(stats.formal_alpha, 3)} dan ${fmt(stats.genz_alpha, 3)}.`, "i-clipboard", "purple"],
      ["Uji", "Berpasangan", `t-test p ${pval(stats.paired_p)}; Wilcoxon p ${pval(stats.wilcoxon_p)}.`, "i-chart", "gold"],
      ["Klaim", "Aman", `Efek sangat kecil, dz ${fmt(stats.cohens_dz, 3)}.`, "i-shield", "cyan"],
    ];
  }
  if (group === "Data" || group === "Hasil") {
    return [
      ["Data", "CSV final", `${data.project?.n || 405} responden berpasangan lengkap.`, "i-doc", "blue"],
      ["Skor", "Formal", `Mean ${fmt(stats.formal_mean)}; SD ${fmt(stats.formal_sd)}.`, "i-chart", "green"],
      ["Skor", "Gen-Z", `Mean ${fmt(stats.genz_mean)}; SD ${fmt(stats.genz_sd)}.`, "i-trend", "purple"],
      ["Selisih", `${fmt(stats.mean_diff)} poin`, "Kecil secara deskriptif dan perlu dibatasi.", "i-target", "gold"],
      ["Efek", `dz ${fmt(stats.cohens_dz, 3)}`, "Tidak cukup untuk klaim superioritas praktis besar.", "i-shield", "cyan"],
    ];
  }
  return [
    ["Kebutuhan", "Informasi PMB", "Calon mahasiswa membutuhkan informasi jelas, cepat, dan konsisten.", "i-help", "blue"],
    ["Media", "Chatbot", "Chatbot menjadi kanal komunikasi digital institusional.", "i-bot", "green"],
    ["Teori", "CMC/TAM/S-O-R", "Gaya bahasa dibaca sebagai isyarat sosial dan stimulus komunikasi.", "i-network", "purple"],
    ["Ukur", "CUQ", "Usabilitas dinilai dengan instrumen kuantitatif final.", "i-clipboard", "gold"],
    ["Kontribusi", "Aman", "Temuan dipakai untuk rekomendasi komunikasi, bukan klaim mutlak.", "i-shield", "cyan"],
  ];
}

function renderVisual(question, data) {
  const steps = visualSteps(question, data);
  setHTML("#detailVisual", steps.map((step, index) => `
    <article class="detail-flow-card ${step[4]}">
      <span class="detail-flow-num">${index + 1}</span>
      <svg><use href="#${step[3]}"></use></svg>
      <b>${esc(step[0])}</b>
      <strong>${esc(step[1])}</strong>
      <p>${esc(step[2])}</p>
    </article>
  `).join('<span class="detail-arrow" aria-hidden="true">></span>'));
}

function renderEvidence(question, data) {
  const stats = data.statistics || {};
  const theory = data.theory_mapping || {};
  const basis = question.basis || "Berbasis data final audited dan file skill metodologi kuantitatif.";
  setHTML("#answerTabs", [
    ["answer", "Jawaban Aman", "i-shield"],
    ["data", "Dasar Data", "i-chart"],
    ["theory", "Dasar Teori", "i-book"],
    ["notes", "Catatan Presentasi", "i-doc"],
  ].map(([key, label, icon], index) => `
    <button class="detail-tab ${index === 0 ? "active" : ""}" type="button" data-panel="${key}">
      <svg><use href="#${icon}"></use></svg>${label}
    </button>
  `).join(""));
  setHTML("#answerPanels", `
    <section class="detail-answer-panel active" data-panel="answer">
      <h3>Jawaban Disarankan <span>(aman, netral, berbasis data)</span></h3>
      <p>${esc(question.safe_answer || "Jawaban aman belum tersedia.")}</p>
      <div class="answer-qualities">
        <span><svg><use href="#i-shield"></use></svg>Aman & Netral</span>
        <span><svg><use href="#i-chart"></use></svg>Berbasis Data</span>
        <span><svg><use href="#i-target"></use></svg>Fokus Penelitian</span>
        <span><svg><use href="#i-book"></use></svg>Relevan Akademik</span>
      </div>
    </section>
    <section class="detail-answer-panel" data-panel="data">
      <h3>Dasar Data Final</h3>
      <div class="detail-data-grid">
        <span><b>${esc(data.project?.n || 405)}</b><small>Responden</small></span>
        <span><b>${fmt(stats.formal_mean)}</b><small>Mean Formal</small></span>
        <span><b>${fmt(stats.genz_mean)}</b><small>Mean Gen-Z</small></span>
        <span><b>${fmt(stats.mean_diff)}</b><small>Selisih</small></span>
        <span><b>${pval(stats.paired_p)}</b><small>p t-test</small></span>
        <span><b>${fmt(stats.cohens_dz, 3)}</b><small>Cohen's dz</small></span>
      </div>
    </section>
    <section class="detail-answer-panel" data-panel="theory">
      <h3>Dasar Teori dan Dokumen</h3>
      <p>${esc(basis)}</p>
      <ul class="detail-theory-list">
        <li><b>CMC</b><span>${esc(theory.CMC || "Chatbot sebagai media komunikasi institusional.")}</span></li>
        <li><b>TAM</b><span>${esc(theory.TAM || "Penerimaan teknologi dibaca melalui kemudahan dan kebermanfaatan.")}</span></li>
        <li><b>S-O-R</b><span>${esc(theory["S-O-R"] || "Gaya bahasa sebagai stimulus dan skor CUQ sebagai respons.")}</span></li>
      </ul>
    </section>
    <section class="detail-answer-panel" data-panel="notes">
      <h3>Catatan Presentasi</h3>
      <ul class="detail-note-list">
        <li>Jawab langsung inti pertanyaan terlebih dahulu.</li>
        <li>Sebutkan angka final seperlunya, terutama N, mean, p-value, dan effect size.</li>
        <li>Gunakan frasa pembatas: "dalam data penelitian ini", "secara deskriptif", dan "klaim praktis perlu dibatasi".</li>
      </ul>
    </section>
  `);
  $$(".detail-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".detail-tab").forEach((item) => item.classList.remove("active"));
      $$(".detail-answer-panel").forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`.detail-answer-panel[data-panel="${tab.dataset.panel}"]`)?.classList.add("active");
    });
  });
}

function renderRelated(questions, currentIndex) {
  const current = questions[currentIndex];
  const group = questionGroup(current);
  const related = questions
    .map((question, index) => ({ question, index }))
    .filter((item) => item.index !== currentIndex && questionGroup(item.question) === group)
    .slice(0, 6);
  setHTML("#relatedQuestions", related.map((item) => `
    <a class="related-question" href="detail-pertanyaan.html?q=${item.index}">
      <span>${item.index + 1}</span>
      <p>${esc(item.question.question)}</p>
    </a>
  `).join(""));
}

function renderNavigation(total, index) {
  const prev = Math.max(0, index - 1);
  const next = Math.min(total - 1, index + 1);
  setHTML("#detailNav", `
    <a class="detail-nav-btn ${index === 0 ? "disabled" : ""}" href="detail-pertanyaan.html?q=${prev}"><span>&lt;</span>Pertanyaan Sebelumnya</a>
    <a class="detail-nav-btn" href="index.html#questions">Kembali ke Daftar</a>
    <a class="detail-nav-btn primary ${index === total - 1 ? "disabled" : ""}" href="detail-pertanyaan.html?q=${next}">Pertanyaan Berikutnya<span>&gt;</span></a>
  `);
}

function bindHeader() {
  $("#exportDetailPdf")?.addEventListener("click", () => window.print());
  $("#markDoneBtn")?.addEventListener("click", () => {
    $("#markDoneBtn").classList.toggle("active");
    $("#markDoneBtn").innerHTML = $("#markDoneBtn").classList.contains("active")
      ? '<svg><use href="#i-shield"></use></svg>Sudah Ditandai'
      : '<svg><use href="#i-shield"></use></svg>Tandai Selesai';
  });
}

async function init() {
  const response = await fetch("data/dashboard_data.json", { cache: "no-store" });
  const data = await response.json();
  const questions = data.questions || [];
  const index = selectedIndex(questions.length);
  const question = questions[index] || {};
  const level = confidence(question, index);
  document.title = `Detail Pertanyaan ${index + 1} - Kompre Harno`;
  setText("#detailKicker", "Potensi Pertanyaan Ujian Kompre");
  setText("#detailTitle", "DETAIL PERTANYAAN KOMPRE");
  setText("#detailSubtitle", "Pengaruh gaya bahasa chatbot terhadap usabilitas informasi PMB pada Generasi Z di Universitas Lampung.");
  setText("#questionNumber", index + 1);
  setText("#questionCategory", question.category || "Kompre");
  setText("#questionMain", question.question || "Pertanyaan belum tersedia.");
  setText("#questionLevel", level);
  $("#questionLevel")?.classList.toggle("medium", level === "Sedang");
  setText("#questionCount", `${index + 1} / ${questions.length}`);
  renderInfo(data);
  renderVisual(question, data);
  renderEvidence(question, data);
  renderRelated(questions, index);
  renderNavigation(questions.length, index);
  bindHeader();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<pre style="position:fixed;z-index:99;inset:20px;background:#210;color:#fff;padding:20px;border:1px solid #f66">Question detail load error: ${esc(error.message)}</pre>`);
});
