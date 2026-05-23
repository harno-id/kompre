const $ = (sel) => document.querySelector(sel);

const fmt = (value, digits = 2) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return Number(value).toFixed(digits).replace(/\.00$/, "");
};

const pct = (value, total, digits = 1) => {
  if (!total) return "0%";
  return `${((Number(value || 0) / total) * 100).toFixed(digits)}%`;
};

const pval = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  const n = Number(value);
  return n < 0.001 ? "< .001" : n.toFixed(3);
};

const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function setHTML(sel, html) {
  const el = $(sel);
  if (el) el.innerHTML = html;
}

function setText(sel, text) {
  const el = $(sel);
  if (el) el.textContent = text;
}

const steps = [
  { title: "Desain", label: "Within-subject design", detail: "Setiap responden mengevaluasi dua gaya bahasa chatbot.", color: "blue", icon: "i-users", group: "Alur Utama" },
  { title: "Responden", label: "Generasi Z", detail: "Sampel final berbasis respon berpasangan lengkap.", color: "green", icon: "i-users", group: "Alur Utama" },
  { title: "Counterbalancing", label: "F->G / G->F", detail: "Urutan penyajian dikontrol untuk menekan order effect.", color: "purple", icon: "i-reset", group: "Kontrol Bias" },
  { title: "Instrumen", label: "CUQ 16 item", detail: "Chatbot Usability Questionnaire dengan skala Likert 1-5.", color: "purple", icon: "i-clipboard", group: "Alur Utama" },
  { title: "Skoring", label: "Reverse scoring", detail: "Item negatif dibalik agar skor tinggi berarti usabilitas lebih baik.", color: "gold", icon: "i-list", group: "Analisis Statistik" },
  { title: "Uji Normalitas", label: "Shapiro-Wilk", detail: "Asumsi normalitas diuji pada selisih skor berpasangan.", color: "green", icon: "i-curve", group: "Analisis Statistik" },
  { title: "Uji Hipotesis", label: "t-test / Wilcoxon", detail: "Paired t-test dan Wilcoxon dibaca berdampingan.", color: "blue", icon: "i-chart", group: "Analisis Statistik" },
  { title: "Ukuran Efek", label: "Cohen's dz", detail: "Besaran efek dipakai untuk membatasi klaim praktis.", color: "purple", icon: "i-target", group: "Evaluasi" },
  { title: "Order Effect", label: "Uji efek urutan", detail: "Urutan F->G dan G->F diuji sebagai potensi bias.", color: "gold", icon: "i-balance", group: "Kontrol Bias" },
  { title: "Interpretasi", label: "Kesimpulan aman", detail: "Temuan ditafsirkan berdasar data, konteks, dan batas klaim.", color: "blue", icon: "i-shield", group: "Evaluasi" },
];

function ageSummary(usiaCounts) {
  const ages = [];
  Object.entries(usiaCounts || {}).forEach(([age, count]) => {
    for (let i = 0; i < Number(count || 0); i += 1) ages.push(Number(age));
  });
  if (!ages.length) return { mean: "-", sd: "-", range: "-" };
  const avg = ages.reduce((sum, value) => sum + value, 0) / ages.length;
  const variance = ages.reduce((sum, value) => sum + ((value - avg) ** 2), 0) / Math.max(1, ages.length - 1);
  return {
    mean: fmt(avg, 1),
    sd: fmt(Math.sqrt(variance), 1),
    range: `${Math.min(...ages)}-${Math.max(...ages)} tahun`,
  };
}

function renderInfo(data) {
  const n = data.project?.n || 405;
  setHTML("#methodInfo", [
    ["N", `${n} responden Generasi Z`],
    ["DS", "Within-subject"],
    ["IQ", "CUQ 16 item"],
    ["UJ", "Paired t-test, Wilcoxon, Cohen's dz"],
  ].map(([icon, text]) => `<div class="info-line"><span class="nav-ico">${icon}</span><b>${esc(text)}</b></div>`).join(""));
}

function renderFlow(data) {
  const n = data.project?.n || 405;
  setHTML("#methodFlowCards", steps.map((step, index) => {
    const label = step.title === "Responden" ? `${n}` : step.label;
    const detail = step.title === "Responden" ? `Responden Generasi Z dari data final audited.` : step.detail;
    return `
      <article class="method-step ${step.color}" data-index="${index + 1}">
        <span class="step-number">${index + 1}</span>
        <b>${esc(step.title)}</b>
        <span class="method-icon"><svg><use href="#${step.icon}"></use></svg></span>
        <strong>${esc(label)}</strong>
        <p>${esc(detail)}</p>
      </article>
    `;
  }).join(""));
}

function renderDetails(data) {
  const stats = data.statistics || {};
  const profile = data.profile || {};
  const n = data.project?.n || 405;
  const order = profile.urutan_counts || {};
  const fg = order["F->G"] || order["F\u2192G"] || 0;
  const gf = order["G->F"] || order["G\u2192F"] || 0;
  const detailCards = [
    ["Desain", "Within-subject", "Dua kondisi per responden."],
    ["Responden", `${n} Generasi Z`, "Data final audited."],
    ["Counterbalancing", `${fg} F->G / ${gf} G->F`, "Kontrol urutan penyajian."],
    ["Instrumen", "CUQ 16 item", `Alpha Formal ${fmt(stats.formal_alpha, 3)}; Gen-Z ${fmt(stats.genz_alpha, 3)}.`],
    ["Reverse Scoring", "Item genap dibalik", "Arah skor dibuat konsisten."],
    ["Uji Normalitas", `Shapiro p ${pval(stats.shapiro_p)}`, "Selisih skor tidak normal."],
    ["Uji Hipotesis", `t p ${pval(stats.paired_p)} / W p ${pval(stats.wilcoxon_p)}`, "Dibaca bersama ukuran efek."],
    ["Effect Size", `dz ${fmt(stats.cohens_dz, 3)}`, "Efek sangat kecil."],
    ["Order Effect", `p ${pval(stats.order_effect_p)}`, "Tidak ada bukti kuat efek urutan."],
    ["Interpretasi", "Klaim aman", "Segmentasi, bukan superioritas mutlak."],
  ];
  setHTML("#methodDetailCards", detailCards.map((card, index) => `
    <article class="method-detail ${steps[index].color}">
      <span>${index + 1}</span>
      <h3>${esc(card[0])}</h3>
      <b>${esc(card[1])}</b>
      <p>${esc(card[2])}</p>
    </article>
  `).join(""));
}

function renderProfile(data) {
  const profile = data.profile || {};
  const n = Number(data.project?.n || 405);
  const gender = profile.jk_counts || {};
  const ages = ageSummary(profile.usia_counts || {});
  const order = profile.urutan_counts || {};
  const perempuan = Number(gender.P || 0);
  const laki = Number(gender.L || 0);
  const fg = Number(order["F->G"] || order["F\u2192G"] || 0);
  const fgDeg = n ? (fg / n) * 360 : 180;
  const perempuanDeg = n ? (perempuan / n) * 360 : 240;
  const ring = $("#profileRing");
  if (ring) {
    ring.style.background = `conic-gradient(#2d8bea 0 ${fgDeg}deg, #9e72ff ${fgDeg}deg ${fgDeg + 58}deg, #f4b52d ${fgDeg + 58}deg ${Math.min(360, fgDeg + 98)}deg, #35e2a8 ${Math.min(360, fgDeg + 98)}deg 360deg)`;
  }
  const genderRing = $("#genderMiniRing");
  if (genderRing) {
    genderRing.style.background = `conic-gradient(#c95f9b 0 ${perempuanDeg}deg, #2d8bea ${perempuanDeg}deg 360deg)`;
  }
  setText("#profileN", n);
  setHTML("#profileFacts", `
    <li><b>Usia (Mean +/- SD)</b><span>${ages.mean} +/- ${ages.sd} tahun</span></li>
    <li><b>Rentang Usia</b><span>${ages.range}</span></li>
    <li><b>Domisili</b><span>Universitas Lampung</span></li>
    <li><b>Urutan</b><span>F->G ${pct(fg, n)}; G->F ${pct(n - fg, n)}</span></li>
    <li><b>Jenis Kelamin</b><span>Perempuan ${pct(perempuan, perempuan + laki)}; Laki-laki ${pct(laki, perempuan + laki)}</span></li>
  `);
}

function renderNarrative(data) {
  const stats = data.statistics || {};
  const n = data.project?.n || 405;
  setText("#methodSummary", `Penelitian ini menggunakan desain within-subject, sehingga setiap responden mengevaluasi dua gaya bahasa chatbot. Sampel final audited berjumlah ${n} responden Generasi Z. Instrumen CUQ 16 item digunakan dengan reverse scoring pada item negatif dan normalisasi skor 0-100. Normalitas selisih diuji dengan Shapiro-Wilk (p ${pval(stats.shapiro_p)}), uji beda dilaporkan melalui paired t-test (p ${pval(stats.paired_p)}) dan Wilcoxon (p ${pval(stats.wilcoxon_p)}), sedangkan besaran efek dibatasi melalui Cohen's dz ${fmt(stats.cohens_dz, 3)}.`);
  setText("#methodWarning", `Desain within-subject rentan terhadap efek urutan, pembelajaran, dan kelelahan responden. Karena itu counterbalancing dan uji order effect dilakukan; hasil order effect p ${pval(stats.order_effect_p)} tidak menunjukkan bukti kuat bahwa urutan mengubah selisih skor.`);
}

function bindControls() {
  $("#toggleFlowBtn")?.addEventListener("click", () => {
    document.body.classList.toggle("flow-hidden");
    const hidden = document.body.classList.contains("flow-hidden");
    $("#toggleFlowBtn").innerHTML = `<svg><use href="#i-eye"></use></svg>${hidden ? "Tampilkan Alur" : "Sembunyikan Alur"}`;
  });
  $("#exportMethodPdf")?.addEventListener("click", () => window.print());
}

async function init() {
  const response = await fetch("data/dashboard_data.json", { cache: "no-store" });
  const data = await response.json();
  renderInfo(data);
  renderFlow(data);
  renderDetails(data);
  renderProfile(data);
  renderNarrative(data);
  bindControls();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<pre style="position:fixed;z-index:99;inset:20px;background:#210;color:#fff;padding:20px;border:1px solid #f66">Methodology load error: ${esc(error.message)}</pre>`);
});
