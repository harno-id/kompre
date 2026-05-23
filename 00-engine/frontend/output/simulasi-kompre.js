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

function levelOf(question, index) {
  if (question?.risk_level) return question.risk_level;
  if (index < 3) return "Tinggi";
  if (index < 6) return "Sedang";
  return "Aman";
}

function sessionQuestions(questions) {
  const priority = questions.filter((question) => ["Tinggi", "Sedang"].includes(question.risk_level));
  const rest = questions.filter((question) => !priority.includes(question));
  return [...priority, ...rest].slice(0, 10);
}

function selectedIndex(total) {
  const params = new URLSearchParams(window.location.search);
  const raw = Number(params.get("q") ?? 2);
  return Math.max(0, Math.min(total - 1, Number.isNaN(raw) ? 2 : raw));
}

function renderInfo(data) {
  const n = data.project?.n || 405;
  setHTML("#simulationInfo", [
    ["S", "Sesi berjalan"],
    ["N", `${n} responden Generasi Z`],
    ["DS", "Within-subject"],
    ["UJ", "t-test, Wilcoxon, Cohen's dz"],
  ].map(([icon, text]) => `<div class="info-line"><span class="nav-ico">${icon}</span><b>${esc(text)}</b></div>`).join(""));
}

function supportCards(question, data) {
  const stats = data.statistics || {};
  const group = questionGroup(question);
  if (group === "Metodologi") {
    return [
      ["Desain Within-Subject", "Setiap responden menjadi kontrol bagi dirinya sendiri.", "i-users", "blue"],
      ["Counterbalancing", "Urutan F->G dan G->F mengontrol potensi efek urutan.", "i-reset", "green"],
      ["Instrumen CUQ", `Alpha Formal ${fmt(stats.formal_alpha, 3)}; Gen-Z ${fmt(stats.genz_alpha, 3)}.`, "i-clipboard", "purple"],
      ["Perbandingan Berpasangan", `t p ${pval(stats.paired_p)}; W p ${pval(stats.wilcoxon_p)}; dz ${fmt(stats.cohens_dz, 3)}.`, "i-chart", "gold"],
    ];
  }
  if (group === "Data" || group === "Hasil") {
    return [
      ["Mean Formal", `${fmt(stats.formal_mean)} dari data final.`, "i-chart", "blue"],
      ["Mean Gen-Z", `${fmt(stats.genz_mean)} dari data final.`, "i-trend", "green"],
      ["Selisih Kecil", `${fmt(stats.mean_diff)} poin, klaim perlu dibatasi.`, "i-target", "purple"],
      ["Effect Size", `Cohen's dz ${fmt(stats.cohens_dz, 3)}, sangat kecil.`, "i-shield", "gold"],
    ];
  }
  return [
    ["Konteks PMB", "Komunikasi digital institusional perlu jelas dan konsisten.", "i-help", "blue"],
    ["Chatbot", "Kanal interaksi calon mahasiswa dengan informasi kampus.", "i-bot", "green"],
    ["Teori", "CMC, TAM, dan S-O-R menjadi kerangka interpretif.", "i-network", "purple"],
    ["Jawaban Aman", "Tetap netral, berbasis data, dan tidak absolut.", "i-shield", "gold"],
  ];
}

function renderQuestion(data, questions, index) {
  const question = questions[index] || {};
  const group = questionGroup(question);
  const level = levelOf(question, index);
  setText("#simulationPosition", `Pertanyaan ke-${index + 1} dari ${questions.length}`);
  setText("#simulationQuestion", question.question || "Pertanyaan belum tersedia.");
  setHTML("#simulationTags", [
    ["Jenis", "Ahli Kuantitatif"],
    ["Fokus", group === "Data" ? "Metodologi & Analisis Data" : group],
    ["Tingkat", level],
    ["Aspek", question.category || "Kompre"],
  ].map(([label, value]) => `<span>${esc(label)} <b>${esc(value)}</b></span>`).join(""));
  setHTML("#simulationSupport", supportCards(question, data).map((card, cardIndex) => `
    <article class="simulation-support-card ${card[3]}">
      <svg><use href="#${card[2]}"></use></svg>
      <b>${esc(card[0])}</b>
      <p>${esc(card[1])}</p>
      ${cardIndex < 3 ? '<i aria-hidden="true">&gt;</i>' : ""}
    </article>
  `).join(""));
  setText("#simulationAnswer", question.safe_answer || "Jawaban aman belum tersedia.");
  $("#openDetailQuestion")?.setAttribute("href", `detail-pertanyaan.html?q=${index}`);
}

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function bindTimer() {
  let elapsed = Number(sessionStorage.getItem("kompreSimulationElapsed") || 768);
  let running = true;
  const tick = () => {
    setText("#sessionTimer", formatTime(elapsed));
    if (running) {
      elapsed += 1;
      sessionStorage.setItem("kompreSimulationElapsed", String(elapsed));
    }
  };
  tick();
  const timer = window.setInterval(tick, 1000);
  $("#endSessionBtn")?.addEventListener("click", () => {
    running = !running;
    $("#endSessionBtn").textContent = running ? "Akhiri Sesi" : "Lanjutkan Sesi";
  });
  window.addEventListener("beforeunload", () => window.clearInterval(timer));
}

function bindConfidence() {
  const update = () => {
    const value = Number($("#confidenceRange")?.value || 76);
    setText("#confidenceValue", `${value}%`);
    setText("#confidenceLabel", value >= 80 ? "Sangat Siap" : value >= 65 ? "Cukup Baik" : "Perlu Latihan");
    const gauge = $(".confidence-gauge");
    if (gauge) gauge.style.setProperty("--confidence", `${value * 1.8}deg`);
  };
  $("#confidenceRange")?.addEventListener("input", update);
  update();
}

function bindNotes() {
  const textarea = $("#simulationNote");
  const counter = $("#noteCounter");
  const update = () => {
    const length = textarea?.value.length || 0;
    if (counter) counter.textContent = `${length} / 500 karakter`;
  };
  textarea?.addEventListener("input", update);
  $("#saveNoteBtn")?.addEventListener("click", () => {
    sessionStorage.setItem("kompreSimulationNote", textarea?.value || "");
    $("#saveNoteBtn").textContent = "Tersimpan";
    window.setTimeout(() => { $("#saveNoteBtn").textContent = "Simpan Catatan"; }, 1200);
  });
  if (textarea) textarea.value = sessionStorage.getItem("kompreSimulationNote") || "";
  update();
}

function bindExaminer() {
  $$(".examiner-card").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".examiner-card").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      setText("#activeExaminer", button.dataset.examiner || "Ahli Kuantitatif");
    });
  });
}

function bindNavigation(data, questions, index) {
  $("#prevSimulation")?.addEventListener("click", () => {
    window.location.href = `simulasi-kompre.html?q=${Math.max(0, index - 1)}`;
  });
  $("#skipSimulation")?.addEventListener("click", () => {
    window.location.href = `simulasi-kompre.html?q=${Math.min(questions.length - 1, index + 1)}`;
  });
  $("#nextSimulation")?.addEventListener("click", () => {
    window.location.href = `simulasi-kompre.html?q=${Math.min(questions.length - 1, index + 1)}`;
  });
  $("#guideSimulation")?.addEventListener("click", () => {
    window.location.href = "detail-pertanyaan.html?q=" + index;
  });
}

async function init() {
  const response = await fetch("data/dashboard_data.json", { cache: "no-store" });
  const data = await response.json();
  const questions = sessionQuestions(data.questions || []);
  const index = selectedIndex(questions.length);
  renderInfo(data);
  renderQuestion(data, questions, index);
  bindTimer();
  bindConfidence();
  bindNotes();
  bindExaminer();
  bindNavigation(data, questions, index);
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<pre style="position:fixed;z-index:99;inset:20px;background:#210;color:#fff;padding:20px;border:1px solid #f66">Simulation load error: ${esc(error.message)}</pre>`);
});
