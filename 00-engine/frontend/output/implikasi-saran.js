/* eslint-disable no-undef */
const $ = (sel) => document.querySelector(sel);

const esc = (value) => String(value ?? "")
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

function setText(sel, text) { const el = $(sel); if (el) el.textContent = text; }
function setHTML(sel, html) { const el = $(sel); if (el) el.innerHTML = html; }

// Konten kurasi diturunkan dari PENDALAMAN/03-olah-data/07_interpretasi_simpulan.md
const CONTENT = {
  teoretis: [
    {
      label: "CMC (Computer-Mediated Communication)",
      body: "Isyarat tekstual gaya bahasa Gen-Z berhasil menurunkan kesan robotik, tetapi tidak otomatis meningkatkan usabilitas keseluruhan. CMC perlu dibaca bersama kualitas konten dan desain interaksi, bukan sekadar isyarat sosial tekstual.",
      tag: "Q1, Q2",
    },
    {
      label: "TAM (Technology Acceptance Model)",
      body: "Gaya bahasa bukan faktor tunggal penentu PEOU dan PU. Penerimaan chatbot adalah hasil gabungan kejelasan bahasa, relevansi informasi, kemudahan navigasi, dan kualitas respons.",
      tag: "PEOU & PU",
    },
    {
      label: "S-O-R (Stimulus-Organism-Response)",
      body: "Jalur S-O-R tidak linier dalam konteks ini. Stimulus gaya bahasa saja tidak cukup menghasilkan respons usabilitas yang berbeda. Organism dipengaruhi banyak faktor: kualitas isi, pengalaman sebelumnya, dan ekspektasi terhadap layanan resmi.",
      tag: "Stimulus -> Response",
    },
  ],
  praktis: [
    {
      title: "Kembangkan gaya bahasa hibrida (formal + ramah)",
      body: "Karena keduanya setara, tidak perlu memilih satu gaya saja. Hybrid menjaga kredibilitas institusi sekaligus memberi sentuhan dekat untuk Generasi Z.",
      basis: "Selisih mean hanya 0.57 poin; dz=0.070 trivial.",
    },
    {
      title: "Prioritaskan kualitas informasi dan akurasi jawaban",
      body: "Kualitas Informasi adalah dimensi tertinggi pada kedua kondisi (Formal 78.19; Gen-Z 76.94). Investasi pada akurasi konten lebih penting daripada modifikasi gaya bahasa.",
      basis: "Klaster Kualitas Informasi unggul di kedua kondisi.",
    },
    {
      title: "Perbaiki navigasi dan alur interaksi",
      body: "Klaster Navigasi & Kemudahan paling rendah pada kedua kondisi (Formal 67.42; Gen-Z 67.93). Ini area improvement utama untuk pengembang chatbot PMB.",
      basis: "Klaster Navigasi rendah di kedua kondisi.",
    },
    {
      title: "Gaya Gen-Z untuk sapaan dan pembuka",
      body: "Gen-Z dinilai lebih realistis dan kurang robotik (Q1, Q2). Pakai untuk greeting, onboarding, dan engagement, bukan untuk seluruh isi pesan.",
      basis: "Persona & Afeksi: Gen-Z +2.27 poin.",
    },
    {
      title: "Pertahankan gaya formal untuk informasi resmi",
      body: "Formal lebih jelas dan langsung untuk pesan informatif (Q5, Q6, Q11, Q12). Tetap pakai untuk pengumuman pendaftaran, jadwal, dan informasi prosedural.",
      basis: "Kualitas Informasi: Formal +1.25 poin.",
    },
  ],
  keterbatasan: [
    "Persepsi sesaat dari satu kali interaksi; hasil mungkin berbeda jika interaksi berulang.",
    "Konteks lokal Lampung; faktor budaya lokal mungkin memengaruhi persepsi.",
    "CUQ tidak mengukur trust dan empati; aspek psikologis lebih dalam belum terukur.",
    "29.1% responden memberikan selisih nol; banyak yang tidak merasakan perbedaan apapun.",
  ],
  saran: [
    "Tambahkan variabel emosional seperti trust dan empati untuk melihat aspek psikologis.",
    "Studi longitudinal selama satu periode PMB untuk melihat perubahan persepsi seiring waktu.",
    "Content analysis transkrip percakapan untuk memetakan pola bahasa pengguna.",
    "Eksperimen dengan avatar visual untuk menguji efek sinergis visual + bahasa.",
    "Desain eksperimen lebih sensitif dengan instrumen yang lebih tajam membedakan gaya bahasa.",
  ],
};

function renderInfo(data) {
  const n = data.project?.n || 405;
  setHTML("#implikasiInfo", [
    ["N", `${n} responden Generasi Z`],
    ["DS", "Within-subject"],
    ["IQ", "CUQ 16 item"],
    ["UJ", "Paired t-test, Wilcoxon, Cohen's dz"],
  ].map(([icon, text]) => `<div class="info-line"><span class="nav-ico">${icon}</span><b>${esc(text)}</b></div>`).join(""));
}

function renderBanner(data) {
  const claims = data.safe_core_claims || [];
  setText("#implikasiSafeClaim", claims[4] || "Implikasi paling aman adalah segmentasi gaya bahasa chatbot, bukan penggantian total gaya formal.");
  const stats = data.statistics || {};
  setHTML("#implikasiStats", [
    [`${data.project?.n || 405}`, "Responden"],
    [fmt(stats.formal_mean), "Mean Formal"],
    [fmt(stats.genz_mean), "Mean Gen-Z"],
    [`+${fmt(stats.mean_diff)}`, "Selisih"],
    [fmt(stats.cohens_dz, 3), "Cohen's dz"],
    [pval(stats.paired_p), "Paired p"],
  ].map(([value, label]) => `<span class="implikasi-stat-pill"><b>${esc(value)}</b><small>${esc(label)}</small></span>`).join(""));
}

function renderTeoretis() {
  setHTML("#implikasiTeoretis", CONTENT.teoretis.map((item) => `
    <li>
      <header>
        <b>${esc(item.label)}</b>
        <span class="implikasi-tag">${esc(item.tag)}</span>
      </header>
      <p>${esc(item.body)}</p>
    </li>
  `).join(""));
}

function renderPraktis() {
  setHTML("#implikasiPraktis", CONTENT.praktis.map((item, idx) => `
    <li>
      <span class="implikasi-num">${idx + 1}</span>
      <div>
        <b>${esc(item.title)}</b>
        <p>${esc(item.body)}</p>
        <small><svg><use href="#i-shield"></use></svg>${esc(item.basis)}</small>
      </div>
    </li>
  `).join(""));
}

function renderKeterbatasan() {
  setHTML("#implikasiKeterbatasan", CONTENT.keterbatasan.map((item) => `
    <li class="implikasi-warn-item">
      <span><svg><use href="#i-warn"></use></svg></span>
      <p>${esc(item)}</p>
    </li>
  `).join(""));
}

function renderSaran() {
  setHTML("#implikasiSaran", CONTENT.saran.map((item) => `
    <li class="implikasi-bulb-item">
      <span><svg><use href="#i-plus"></use></svg></span>
      <p>${esc(item)}</p>
    </li>
  `).join(""));
}

function bindControls() {
  $("#implikasiPrint")?.addEventListener("click", () => window.print());
}

async function init() {
  let data = {};
  try {
    const response = await fetch("data/dashboard_data.json", { cache: "no-store" });
    data = await response.json();
  } catch (error) {
    console.warn("Dashboard data tidak terbaca, gunakan default", error);
  }
  renderInfo(data);
  renderBanner(data);
  renderTeoretis();
  renderPraktis();
  renderKeterbatasan();
  renderSaran();
  bindControls();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<pre style="position:fixed;z-index:99;inset:20px;background:#210;color:#fff;padding:20px;border:1px solid #f66">Implikasi load error: ${esc(error.message)}</pre>`);
});
