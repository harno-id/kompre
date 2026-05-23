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

function setText(sel, text) {
  const el = $(sel);
  if (el) el.textContent = text;
}

function setHTML(sel, html) {
  const el = $(sel);
  if (el) el.innerHTML = html;
}

function download(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function readiness(data) {
  const skillPass = 100;
  const hasQuestions = (data.questions || []).length > 0 ? 100 : 0;
  const statsReady = data.statistics?.paired_p !== undefined ? 100 : 0;
  return Math.round((skillPass + hasQuestions + statsReady) / 3);
}

function reportDate() {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
    timeZoneName: "short",
  }).format(new Date());
}

function buildSummary(data) {
  const stats = data.statistics || {};
  return `Penelitian ini menunjukkan bahwa skor CUQ chatbot Gen-Z (${fmt(stats.genz_mean, 2)}) sedikit lebih tinggi secara deskriptif dibandingkan chatbot formal (${fmt(stats.formal_mean, 2)}). Selisih mean hanya ${fmt(stats.mean_diff, 2)} poin; paired t-test p = ${pval(stats.paired_p)}, Wilcoxon p = ${pval(stats.wilcoxon_p)}, dan Cohen's dz = ${fmt(stats.cohens_dz, 3)}. Klaim aman: terdapat kecenderungan deskriptif kecil, tetapi tidak ada bukti dampak praktis yang kuat.`;
}

function renderInfo(data) {
  setHTML("#reportInfo", [
    ["N", `${data.project?.n || 405} responden Generasi Z`],
    ["DS", "Within-subject"],
    ["IQ", "CUQ 16 item"],
    ["UJ", "Paired t-test, Wilcoxon, Cohen's dz"],
  ].map(([icon, text]) => `<div class="info-line"><span class="nav-ico">${icon}</span><b>${esc(text)}</b></div>`).join(""));
}

function renderMetrics(data) {
  const questions = data.questions || [];
  const stats = data.statistics || {};
  const theories = Object.keys(data.theory_mapping || {});
  const safeAnswers = questions.filter((q) => q.safe_answer).length;
  const ready = readiness(data);

  setText("#metricQuestions", questions.length);
  setText("#metricSafe", safeAnswers);
  setText("#metricReady", `${ready}%`);
  setText("#metricCuq", `${fmt(stats.genz_mean, 2)} / 100`);
  setText("#metricTheory", theories.length);
  setText("#metricPages", Math.max(12, Math.ceil((questions.length * 0.55) + 6)));
  setText("#reportPeriod", reportDate());
  setText("#executiveSummary", buildSummary(data));
}

function renderContents() {
  const items = [
    "Ringkasan eksekutif",
    "Daftar pertanyaan potensial dan jawaban aman",
    "Pemetaan teori dan konsep",
    "Analisis CUQ dan skor usability",
    "Rekomendasi strategi komunikasi",
    "Lampiran instrumen dan data ringkas",
  ];
  setHTML("#reportContents", items.map((item) => `<li><span>✓</span>${esc(item)}</li>`).join(""));
}

function renderPreview(data) {
  const stats = data.statistics || {};
  const theories = Object.keys(data.theory_mapping || {});
  const questions = data.questions || [];
  const topQuestions = questions.slice(0, 6);
  const html = `
    <article class="report-paper">
      <header>
        <div class="report-logo">UL</div>
        <div>
          <h1>LAPORAN POTENSI PERTANYAAN UJIAN KOMPRE</h1>
          <h2>Pengaruh Gaya Bahasa Chatbot terhadap Usabilitas Informasi PMB pada Generasi Z di Universitas Lampung</h2>
        </div>
      </header>
      <dl>
        <dt>Peneliti</dt><dd>Harno</dd>
        <dt>Program Studi</dt><dd>Magister Ilmu Komunikasi</dd>
        <dt>Universitas</dt><dd>Universitas Lampung</dd>
        <dt>Tanggal Laporan</dt><dd>${esc(reportDate())}</dd>
        <dt>Jumlah Responden</dt><dd>${esc(data.project?.n || 405)} Generasi Z</dd>
        <dt>Instrumen</dt><dd>CUQ (Chatbot Usability Questionnaire)</dd>
      </dl>
      <section>
        <h3>RINGKASAN EKSEKUTIF</h3>
        <p>${esc(buildSummary(data))}</p>
      </section>
      <section>
        <h3>RINGKASAN METRIK FINAL</h3>
        <div class="paper-metrics">
          <span><b>${questions.length}</b>Pertanyaan</span>
          <span><b>${fmt(stats.formal_mean, 2)}</b>Mean Formal</span>
          <span><b>${fmt(stats.genz_mean, 2)}</b>Mean Gen-Z</span>
          <span><b>${pval(stats.paired_p)}</b>Paired p</span>
          <span><b>${fmt(stats.cohens_dz, 3)}</b>Cohen's dz</span>
        </div>
      </section>
      <section>
        <h3>PEMETAAN TEORI</h3>
        <p>${esc(theories.join(", "))}</p>
      </section>
      <section>
        <h3>CONTOH PERTANYAAN KRITIS</h3>
        <ol>${topQuestions.map((q) => `<li>${esc(q.question)}</li>`).join("")}</ol>
      </section>
    </article>
  `;
  setHTML("#reportPreview", html);
  return html;
}

function bindExports(data) {
  $("#exportReportPdf")?.addEventListener("click", () => window.print());
  $("#exportPdfCard")?.addEventListener("click", () => window.print());
  $("#exportHtmlCard")?.addEventListener("click", () => {
    const html = `<!doctype html><html lang="id"><meta charset="utf-8"><title>Laporan Kompre Harno</title><body>${$("#reportPreview").innerHTML}</body></html>`;
    download("laporan-kompre-harno.html", html, "text/html;charset=utf-8");
  });
  $("#exportPptCard")?.addEventListener("click", () => {
    const lines = [
      "Ringkasan PPT Kompre Harno",
      `N: ${data.project?.n}`,
      `Pertanyaan potensial: ${(data.questions || []).length}`,
      `Mean Formal: ${fmt(data.statistics?.formal_mean, 2)}`,
      `Mean Gen-Z: ${fmt(data.statistics?.genz_mean, 2)}`,
      `Paired p: ${pval(data.statistics?.paired_p)}`,
      `Wilcoxon p: ${pval(data.statistics?.wilcoxon_p)}`,
      `Cohen dz: ${fmt(data.statistics?.cohens_dz, 3)}`,
      "",
      buildSummary(data),
    ];
    download("ringkasan-ppt-kompre-harno.txt", lines.join("\n"));
  });
}

async function init() {
  const response = await fetch("data/dashboard_data.json", { cache: "no-store" });
  const data = await response.json();
  renderInfo(data);
  renderMetrics(data);
  renderContents();
  renderPreview(data);
  bindExports(data);
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<pre style="position:fixed;z-index:99;inset:20px;background:#210;color:#fff;padding:20px;border:1px solid #f66">Report load error: ${esc(error.message)}</pre>`);
});


/* ================================================================
   Modal: Pengaturan Laporan, Periode Laporan, Riwayat Laporan
   State disimpan di localStorage prefix "harno.kompre.report.*"
   ================================================================ */
(function () {
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  const STORAGE = {
    settings: "harno.kompre.report.settings",
    period: "harno.kompre.report.period",
    history: "harno.kompre.report.history",
  };

  const DEFAULT_SETTINGS = {
    format: "pdf",
    paper: "A4",
    orientation: "portrait",
    margin: "normal",
    name: "Harno",
    npm: "2226031036",
    prodi: "Magister Ilmu Komunikasi",
    pembimbing: "",
    showName: true,
    showNpm: true,
    showProdi: true,
    showPembimbing: false,
    watermark: false,
    footer: true,
    dateStamp: true,
    lockHash: false,
    toc: true,
    lampProfile: true,
    lampDist: true,
    lampClusters: false,
    lampQA: false,
  };

  function getDefaultPeriod() {
    const today = new Date();
    return {
      dataStart: "2026-03-01",
      dataEnd: "2026-05-21",
      lockDate: "2026-05-21",
      printDate: today.toISOString().slice(0, 10),
      sidangDate: "",
      academicPeriod: "Genap 2025/2026",
    };
  }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return { ...fallback };
      const parsed = JSON.parse(raw);
      return { ...fallback, ...parsed };
    } catch (_e) {
      return { ...fallback };
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_e) { /* quota / private mode -- silently ignore */ }
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE.history);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (_e) {
      return [];
    }
  }

  function saveHistory(arr) {
    saveJSON(STORAGE.history, arr.slice(0, 20));
  }

  function recordHistory(entry) {
    const arr = loadHistory();
    arr.unshift({
      ts: Date.now(),
      ...entry,
    });
    saveHistory(arr);
  }

  function fmtDate(ts) {
    if (!ts) return "-";
    const d = new Date(ts);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  }

  function fmtDateOnly(iso) {
    if (!iso) return "-";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(iso));
    } catch (_e) {
      return iso;
    }
  }

  /* -------- Modal generic open/close -------- */
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  /* -------- Pengaturan Laporan -------- */
  function fillSettingsForm(values) {
    const form = document.getElementById("reportSettingsForm");
    if (!form) return;
    Object.entries(values).forEach(([key, val]) => {
      const fields = form.querySelectorAll(`[name="${key}"]`);
      if (!fields.length) return;
      fields.forEach((field) => {
        if (field.type === "radio") {
          field.checked = field.value === val;
        } else if (field.type === "checkbox") {
          field.checked = !!val;
        } else {
          field.value = val ?? "";
        }
      });
    });
  }

  function readSettingsForm() {
    const form = document.getElementById("reportSettingsForm");
    if (!form) return DEFAULT_SETTINGS;
    const data = new FormData(form);
    const out = { ...DEFAULT_SETTINGS };
    // Radio values
    out.format = data.get("format") || DEFAULT_SETTINGS.format;
    out.paper = data.get("paper") || DEFAULT_SETTINGS.paper;
    out.orientation = data.get("orientation") || DEFAULT_SETTINGS.orientation;
    out.margin = data.get("margin") || DEFAULT_SETTINGS.margin;
    // Texts
    ["name", "npm", "prodi", "pembimbing"].forEach((key) => {
      const v = data.get(key);
      if (v !== null) out[key] = String(v);
    });
    // Checkboxes
    ["showName", "showNpm", "showProdi", "showPembimbing",
      "watermark", "footer", "dateStamp", "lockHash", "toc",
      "lampProfile", "lampDist", "lampClusters", "lampQA"].forEach((key) => {
      out[key] = form.querySelector(`[name="${key}"]`)?.checked || false;
    });
    return out;
  }

  function bindSettingsModal() {
    document.getElementById("btnReportSettings")?.addEventListener("click", () => {
      const values = loadJSON(STORAGE.settings, DEFAULT_SETTINGS);
      fillSettingsForm(values);
      openModal("reportSettingsModal");
    });
    document.getElementById("reportSettingsSave")?.addEventListener("click", () => {
      const values = readSettingsForm();
      saveJSON(STORAGE.settings, values);
      closeModal("reportSettingsModal");
      flashToast("Pengaturan laporan tersimpan");
    });
    document.getElementById("reportSettingsReset")?.addEventListener("click", () => {
      fillSettingsForm(DEFAULT_SETTINGS);
      flashToast("Pengaturan dikembalikan ke default (belum disimpan)");
    });
  }

  /* -------- Periode Laporan -------- */
  function fillPeriodForm(values) {
    const form = document.getElementById("reportPeriodForm");
    if (!form) return;
    Object.entries(values).forEach(([key, val]) => {
      const field = form.querySelector(`[name="${key}"]`);
      if (field) field.value = val ?? "";
    });
    updatePeriodPreview(values);
  }

  function readPeriodForm() {
    const form = document.getElementById("reportPeriodForm");
    if (!form) return getDefaultPeriod();
    const data = new FormData(form);
    return {
      dataStart: data.get("dataStart") || "",
      dataEnd: data.get("dataEnd") || "",
      lockDate: data.get("lockDate") || "",
      printDate: data.get("printDate") || "",
      sidangDate: data.get("sidangDate") || "",
      academicPeriod: data.get("academicPeriod") || "",
    };
  }

  function updatePeriodPreview(values) {
    const el = document.getElementById("reportPeriodPreview");
    if (!el) return;
    const start = fmtDateOnly(values.dataStart);
    const end = fmtDateOnly(values.dataEnd);
    const print = fmtDateOnly(values.printDate);
    const sidang = values.sidangDate ? fmtDateOnly(values.sidangDate) : "(belum dijadwalkan)";
    const acad = values.academicPeriod || "-";
    el.innerHTML = `
      <h3>Preview Periode</h3>
      <p>Laporan ini mencakup analisis data yang dikumpulkan dari <b>${esc(start)}</b> hingga <b>${esc(end)}</b>
      pada periode akademik <b>${esc(acad)}</b>. Tanggal cetak laporan: <b>${esc(print)}</b>.
      Jadwal sidang komprehensif: <b>${esc(sidang)}</b>.</p>
    `;
  }

  function bindPeriodModal() {
    document.getElementById("btnReportPeriod")?.addEventListener("click", () => {
      const values = loadJSON(STORAGE.period, getDefaultPeriod());
      fillPeriodForm(values);
      openModal("reportPeriodModal");
    });
    const form = document.getElementById("reportPeriodForm");
    form?.addEventListener("input", () => {
      updatePeriodPreview(readPeriodForm());
    });
    document.getElementById("reportPeriodSave")?.addEventListener("click", () => {
      const values = readPeriodForm();
      saveJSON(STORAGE.period, values);
      // Update tampilan periode di panel utama
      const periodEl = document.getElementById("reportPeriod");
      if (periodEl) {
        periodEl.textContent = `${fmtDateOnly(values.dataStart)} - ${fmtDateOnly(values.dataEnd)}`;
      }
      closeModal("reportPeriodModal");
      flashToast("Periode laporan tersimpan");
    });
    document.getElementById("reportPeriodReset")?.addEventListener("click", () => {
      const def = getDefaultPeriod();
      fillPeriodForm(def);
      flashToast("Periode dikembalikan ke default (belum disimpan)");
    });
  }

  /* -------- Riwayat Laporan -------- */
  function renderHistory() {
    const arr = loadHistory();
    const meta = document.getElementById("reportHistoryMeta");
    const empty = document.getElementById("reportHistoryEmpty");
    const tbody = document.getElementById("reportHistoryBody");
    const tableWrap = document.querySelector(".report-history-table-wrap");
    if (meta) meta.textContent = arr.length ? `${arr.length} entri tersimpan` : "Belum ada riwayat";
    if (!arr.length) {
      if (tbody) tbody.innerHTML = "";
      if (empty) empty.hidden = false;
      if (tableWrap) tableWrap.style.display = "none";
      return;
    }
    if (empty) empty.hidden = true;
    if (tableWrap) tableWrap.style.display = "";
    if (tbody) {
      tbody.innerHTML = arr.map((entry, idx) => `
        <tr data-ts="${entry.ts}">
          <td>${idx + 1}</td>
          <td>${esc(fmtDate(entry.ts))}</td>
          <td><span class="report-format-tag report-format-${esc(entry.format || 'pdf')}">${esc((entry.format || "PDF").toUpperCase())}</span></td>
          <td>${esc(entry.filename || "-")}</td>
          <td>${esc(entry.period || "-")}</td>
          <td class="report-history-actions">
            <button class="report-row-btn" data-act="reprint" title="Cetak ulang"><svg><use href="#i-print"></use></svg></button>
            <button class="report-row-btn report-row-btn-danger" data-act="delete" title="Hapus"><svg><use href="#i-trash"></use></svg></button>
          </td>
        </tr>
      `).join("");
      tbody.querySelectorAll("button[data-act]").forEach((btn) => {
        btn.addEventListener("click", (event) => {
          event.stopPropagation();
          const ts = Number(btn.closest("tr")?.dataset.ts || 0);
          const action = btn.dataset.act;
          if (action === "reprint") {
            window.print();
          } else if (action === "delete") {
            const filtered = loadHistory().filter((e) => e.ts !== ts);
            saveHistory(filtered);
            renderHistory();
            flashToast("Entri riwayat dihapus");
          }
        });
      });
    }
  }

  function bindHistoryModal() {
    document.getElementById("btnReportHistory")?.addEventListener("click", () => {
      renderHistory();
      openModal("reportHistoryModal");
    });
    document.getElementById("reportHistoryClear")?.addEventListener("click", () => {
      if (loadHistory().length === 0) return;
      if (!confirm("Hapus semua riwayat laporan?")) return;
      saveHistory([]);
      renderHistory();
      flashToast("Semua riwayat dihapus");
    });
  }

  /* -------- Auto-record history saat ekspor -------- */
  function attachExportRecording() {
    const periodValues = loadJSON(STORAGE.period, getDefaultPeriod());
    const periodLabel = `${fmtDateOnly(periodValues.dataStart)} - ${fmtDateOnly(periodValues.dataEnd)}`;
    const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");

    const pdfBtn = document.getElementById("exportPdfCard");
    if (pdfBtn) {
      pdfBtn.addEventListener("click", () => {
        recordHistory({ format: "pdf", filename: `laporan-kompre-${stamp}.pdf`, period: periodLabel });
      }, true);
    }
    const htmlBtn = document.getElementById("exportHtmlCard");
    if (htmlBtn) {
      htmlBtn.addEventListener("click", () => {
        recordHistory({ format: "html", filename: "laporan-kompre-harno.html", period: periodLabel });
      }, true);
    }
    const pptBtn = document.getElementById("exportPptCard");
    if (pptBtn) {
      pptBtn.addEventListener("click", () => {
        recordHistory({ format: "ppt", filename: "ringkasan-ppt-kompre-harno.txt", period: periodLabel });
      }, true);
    }
    const printBtn = document.getElementById("exportReportPdf");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        recordHistory({ format: "pdf", filename: `laporan-cetak-${stamp}.pdf`, period: periodLabel });
      }, true);
    }
  }

  /* -------- Toast notification -------- */
  function flashToast(message) {
    let toast = document.getElementById("reportToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "reportToast";
      toast.className = "report-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(flashToast._t);
    flashToast._t = setTimeout(() => {
      toast.classList.remove("visible");
    }, 2200);
  }

  /* -------- Common: backdrop click + Escape close -------- */
  function bindCommonClose() {
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.matches('.report-modal[hidden] *')) return;
      const closeEl = target.closest('[data-close="1"]');
      if (closeEl) {
        const modal = closeEl.closest(".report-modal");
        if (modal) closeModal(modal.id);
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      ["reportSettingsModal", "reportPeriodModal", "reportHistoryModal"].forEach((id) => {
        const m = document.getElementById(id);
        if (m && !m.hidden) closeModal(id);
      });
    });
  }

  /* -------- Init -------- */
  function init() {
    bindSettingsModal();
    bindPeriodModal();
    bindHistoryModal();
    bindCommonClose();
    attachExportRecording();
    // Apply saved period to panel utama saat halaman load
    const period = loadJSON(STORAGE.period, getDefaultPeriod());
    const periodEl = document.getElementById("reportPeriod");
    if (periodEl && period.dataStart && period.dataEnd) {
      periodEl.textContent = `${fmtDateOnly(period.dataStart)} - ${fmtDateOnly(period.dataEnd)}`;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
