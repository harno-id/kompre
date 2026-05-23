/* eslint-disable no-undef */
(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  const COLOR_FORMAL = "#2ea8ff";
  const COLOR_GENZ = "#35e2a8";
  const COLOR_DIFF_POS = "#35e2a8";
  const COLOR_DIFF_NEG = "#ff8c8c";
  const COLOR_TEXT = "#cfdcec";
  const COLOR_AXIS = "#7d92aa";
  const COLOR_GRID = "rgba(138,164,195,0.18)";

  const STATE = {
    raw: null,
    filtered: [],
    sortKey: "id",
    sortDir: 1,
    showName: false,
    namesByIndex: {},
    selected: null,
  };

  const charts = { gender: null, order: null, freq: null, heatmap: null, detail: null };

  const fmt = (value, digits = 2) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
    return Number(value).toFixed(digits).replace(/\.00$/, "");
  };

  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const baseTooltip = {
    backgroundColor: "rgba(8,28,53,0.95)",
    borderColor: "#1684ee",
    borderWidth: 1,
    textStyle: { color: "#f3f9ff", fontSize: 12 },
    extraCssText: "border-radius:8px;box-shadow:0 12px 30px rgba(0,0,0,0.45);",
  };

  function uniqueValues(list, getter) {
    return Array.from(new Set(list.map(getter).filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), "id"));
  }

  function fillSelect(selector, values, prefix) {
    const select = $(selector);
    if (!select) return;
    const current = select.value;
    select.innerHTML = `<option value="">${prefix}</option>` + values.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
    if (values.includes(current)) select.value = current;
  }

  function seedFilters() {
    const all = STATE.raw?.responses || [];
    fillSelect("#rawGender", uniqueValues(all, (r) => r.profile.gender), "Semua Gender");
    fillSelect("#rawUsia", uniqueValues(all, (r) => r.profile.usia ? String(r.profile.usia) : ""), "Semua Usia");
    fillSelect("#rawKab", uniqueValues(all, (r) => r.profile.kabkota), "Semua Kab/Kota");
    fillSelect("#rawOrder", uniqueValues(all, (r) => r.context.order), "Semua Urutan");
    fillSelect("#rawDurasi", uniqueValues(all, (r) => r.context.durasi), "Semua Durasi");
    fillSelect("#rawFreq", uniqueValues(all, (r) => r.context.frekuensi), "Semua Frekuensi");
    $("#rawN").textContent = String(STATE.raw?.n || 0);
  }

  function applyFilters() {
    const search = ($("#rawSearch")?.value || "").toLowerCase();
    const gender = $("#rawGender")?.value || "";
    const usia = $("#rawUsia")?.value || "";
    const kab = $("#rawKab")?.value || "";
    const order = $("#rawOrder")?.value || "";
    const durasi = $("#rawDurasi")?.value || "";
    const freq = $("#rawFreq")?.value || "";
    const list = (STATE.raw?.responses || []).filter((r) => {
      if (gender && r.profile.gender !== gender) return false;
      if (usia && String(r.profile.usia) !== usia) return false;
      if (kab && r.profile.kabkota !== kab) return false;
      if (order && r.context.order !== order) return false;
      if (durasi && r.context.durasi !== durasi) return false;
      if (freq && r.context.frekuensi !== freq) return false;
      if (search) {
        const hay = `${r.profile.sekolah} ${r.profile.kabkota} ${r.profile.initials} ${r.id}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });
    STATE.filtered = sortList(list);
    renderSummary();
    renderTable();
    renderDistribution();
    renderHeatmap();
  }

  function sortList(list) {
    const key = STATE.sortKey;
    const dir = STATE.sortDir;
    const getter = {
      id: (r) => r.id,
      initials: (r) => r.profile.initials,
      usia: (r) => r.profile.usia ?? -1,
      gender: (r) => r.profile.gender,
      kabkota: (r) => r.profile.kabkota,
      order: (r) => r.context.order,
      formal: (r) => r.formal.total ?? -1,
      genz: (r) => r.genz.total ?? -1,
      diff: (r) => r.diff ?? -1,
    }[key] || ((r) => r.id);
    return [...list].sort((a, b) => {
      const va = getter(a);
      const vb = getter(b);
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb), "id") * dir;
    });
  }

  function renderSummary() {
    const list = STATE.filtered;
    const validF = list.map((r) => r.formal.total).filter((v) => typeof v === "number");
    const validG = list.map((r) => r.genz.total).filter((v) => typeof v === "number");
    const validD = list.map((r) => r.diff).filter((v) => typeof v === "number");
    const meanF = validF.length ? validF.reduce((s, v) => s + v, 0) / validF.length : null;
    const meanG = validG.length ? validG.reduce((s, v) => s + v, 0) / validG.length : null;
    const meanD = validD.length ? validD.reduce((s, v) => s + v, 0) / validD.length : null;
    $("#rawCount").textContent = String(list.length);
    $("#rawFormalMean").textContent = meanF !== null ? fmt(meanF, 2) : "-";
    $("#rawGenzMean").textContent = meanG !== null ? fmt(meanG, 2) : "-";
    $("#rawDiffMean").textContent = meanD !== null ? `${meanD >= 0 ? "+" : ""}${fmt(meanD, 2)}` : "-";
  }

  function donutOption(title, items) {
    const palette = ["#2ea8ff", "#35e2a8", "#b18cff", "#f4b52d", "#ff8c8c", "#29d7f5"];
    return {
      backgroundColor: "transparent",
      textStyle: { color: COLOR_TEXT, fontFamily: "Inter, system-ui, sans-serif" },
      title: { text: title, left: 12, top: 6, textStyle: { color: "#f3f9ff", fontSize: 13, fontWeight: 700 } },
      tooltip: { ...baseTooltip, trigger: "item", formatter: (p) => `${p.name}<br><b>${p.value}</b> responden (${p.percent}%)` },
      legend: { bottom: 0, left: "center", textStyle: { color: COLOR_TEXT, fontSize: 11 }, itemWidth: 12, itemHeight: 8 },
      series: [{
        type: "pie",
        radius: ["48%", "72%"],
        center: ["50%", "52%"],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: "#08213d", borderWidth: 2, borderRadius: 4 },
        label: { show: false },
        labelLine: { show: false },
        data: items.map((it, i) => ({ name: it.name, value: it.value, itemStyle: { color: palette[i % palette.length] } })),
      }],
    };
  }

  function countBy(list, getter) {
    const counter = new Map();
    list.forEach((row) => {
      const key = getter(row) || "(kosong)";
      counter.set(key, (counter.get(key) || 0) + 1);
    });
    return [...counter.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }

  function renderDistribution() {
    const list = STATE.filtered;
    const elGender = $("#rawDonutGender");
    const elOrder = $("#rawDonutOrder");
    const elFreq = $("#rawDonutFreq");
    if (!elGender || !elOrder || !elFreq) return;
    if (charts.gender) charts.gender.dispose();
    if (charts.order) charts.order.dispose();
    if (charts.freq) charts.freq.dispose();
    charts.gender = echarts.init(elGender, null, { renderer: "canvas" });
    charts.order = echarts.init(elOrder, null, { renderer: "canvas" });
    charts.freq = echarts.init(elFreq, null, { renderer: "canvas" });
    charts.gender.setOption(donutOption("Gender", countBy(list, (r) => r.profile.gender)));
    charts.order.setOption(donutOption("Urutan Pengujian", countBy(list, (r) => r.context.order)));
    charts.freq.setOption(donutOption("Frekuensi Chatbot", countBy(list, (r) => r.context.frekuensi)));
  }

  function renderHeatmap() {
    const list = STATE.filtered;
    const items = STATE.raw?.items_order || [];
    const conditions = ["formal", "genz"];
    const data = [];
    items.forEach((qkey, qi) => {
      conditions.forEach((cond, ci) => {
        const scores = list.map((r) => r[cond].items[qkey]).filter((v) => typeof v === "number" && v >= 1 && v <= 5);
        const mean = scores.length ? (scores.reduce((s, v) => s + v, 0) / scores.length) : null;
        data.push([qi, ci, mean === null ? "-" : Number(mean.toFixed(2))]);
      });
    });
    const el = $("#rawHeatmap");
    if (!el) return;
    if (charts.heatmap) charts.heatmap.dispose();
    charts.heatmap = echarts.init(el, null, { renderer: "canvas" });
    charts.heatmap.setOption({
      backgroundColor: "transparent",
      textStyle: { color: COLOR_TEXT, fontFamily: "Inter, system-ui, sans-serif" },
      tooltip: {
        ...baseTooltip,
        position: "top",
        formatter: (p) => {
          const qkey = items[p.value[0]];
          const cond = conditions[p.value[1]] === "formal" ? "Formal" : "Gen-Z";
          return `<b>${qkey.toUpperCase()}</b> &middot; ${cond}<br>Mean skor: <b>${p.value[2]}</b> dari 5`;
        },
      },
      grid: { left: 70, right: 24, top: 12, bottom: 38 },
      xAxis: {
        type: "category",
        data: items.map((q) => q.toUpperCase()),
        splitArea: { show: true, areaStyle: { color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0)"] } },
        axisLine: { lineStyle: { color: COLOR_AXIS } },
        axisLabel: { color: COLOR_AXIS, fontSize: 11, fontWeight: 600 },
        axisTick: { show: false },
      },
      yAxis: {
        type: "category",
        data: ["Formal", "Gen-Z"],
        axisLine: { lineStyle: { color: COLOR_AXIS } },
        axisLabel: { color: COLOR_TEXT, fontSize: 12, fontWeight: 700 },
        axisTick: { show: false },
      },
      visualMap: {
        min: 1,
        max: 5,
        calculable: false,
        orient: "horizontal",
        left: "center",
        bottom: 0,
        inRange: { color: ["#0a2b5b", "#1684ee", "#35e2a8", "#f4b52d"] },
        textStyle: { color: COLOR_AXIS, fontSize: 11 },
      },
      series: [{
        name: "Mean Skor",
        type: "heatmap",
        data,
        label: { show: true, color: "#02101f", fontWeight: 700, fontSize: 11 },
        itemStyle: { borderColor: "#031020", borderWidth: 1 },
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: "rgba(255,255,255,0.45)" } },
      }],
    });
  }

  function buildRowHTML(list) {
    const limit = Math.min(list.length, 405);
    let html = "";
    for (let i = 0; i < limit; i += 1) {
      const r = list[i];
      const idCell = STATE.showName && STATE.namesByIndex[r.id]
        ? `<b>${esc(STATE.namesByIndex[r.id])}</b><small>#${r.id}</small>`
        : `<b>${esc(r.profile.initials)}</b><small>#${r.id}</small>`;
      const diffCls = r.diff > 0 ? "diff-pos" : r.diff < 0 ? "diff-neg" : "diff-zero";
      html += `<tr data-id="${r.id}">`
        + `<td class="num">${r.id}</td>`
        + `<td class="raw-id-cell">${idCell}</td>`
        + `<td class="num">${r.profile.usia ?? "-"}</td>`
        + `<td>${esc(r.profile.gender || "-")}</td>`
        + `<td>${esc(r.profile.kabkota || "-")}</td>`
        + `<td>${esc(r.context.order || "-")}</td>`
        + `<td class="num">${fmt(r.formal.total, 2)}</td>`
        + `<td class="num">${fmt(r.genz.total, 2)}</td>`
        + `<td class="num ${diffCls}">${r.diff !== null ? `${r.diff >= 0 ? "+" : ""}${fmt(r.diff, 2)}` : "-"}</td>`
        + `</tr>`;
    }
    return html;
  }

  function bindRowClicks(tbody) {
    if (!tbody) return;
    tbody.querySelectorAll("tr[data-id]").forEach((tr) => {
      tr.addEventListener("click", () => openDetail(Number(tr.dataset.id)));
    });
  }

  function renderTable() {
    const tbody = $("#rawTableBody");
    const modalBody = $("#rawTableModalBody");
    const list = STATE.filtered;
    if (!list.length) {
      if (tbody) tbody.innerHTML = "";
      if (modalBody) modalBody.innerHTML = "";
      const empty = $("#rawEmpty");
      const modalEmpty = $("#rawTableModalEmpty");
      if (empty) empty.hidden = false;
      if (modalEmpty) modalEmpty.hidden = false;
      updateModalMeta();
      return;
    }
    const empty = $("#rawEmpty");
    const modalEmpty = $("#rawTableModalEmpty");
    if (empty) empty.hidden = true;
    if (modalEmpty) modalEmpty.hidden = true;
    const html = buildRowHTML(list);
    if (tbody) {
      tbody.innerHTML = html;
      bindRowClicks(tbody);
    }
    if (modalBody) {
      modalBody.innerHTML = html;
      bindRowClicks(modalBody);
    }
    updateModalMeta();
  }

  function updateModalMeta() {
    const meta = $("#rawTableModalMeta");
    if (!meta) return;
    const total = STATE.raw?.n || 0;
    const shown = STATE.filtered.length;
    meta.textContent = shown === total ? `${total} responden` : `${shown} dari ${total} responden ditampilkan`;
  }

  function bindSort() {
    $$(".raw-table th.sortable").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.dataset.sort;
        if (STATE.sortKey === key) {
          STATE.sortDir *= -1;
        } else {
          STATE.sortKey = key;
          STATE.sortDir = 1;
        }
        // Reset indikator di kedua tabel, lalu set di header dengan key yang sama
        $$(".raw-table th.sortable").forEach((cell) => cell.classList.remove("asc", "desc"));
        const dirClass = STATE.sortDir === 1 ? "asc" : "desc";
        $$(`.raw-table th.sortable[data-sort="${STATE.sortKey}"]`).forEach((cell) => cell.classList.add(dirClass));
        STATE.filtered = sortList(STATE.filtered);
        renderTable();
      });
    });
  }

  function openDetail(id) {
    const row = (STATE.raw?.responses || []).find((r) => r.id === id);
    if (!row) return;
    STATE.selected = row;
    $("#rawDetailBackdrop").hidden = false;
    $("#rawDetailTitle").textContent = STATE.showName && STATE.namesByIndex[row.id]
      ? `${STATE.namesByIndex[row.id]} (Responden #${row.id})`
      : `Responden #${row.id} (${row.profile.initials})`;
    $("#rawDetailAvatar").textContent = row.profile.initials;
    $("#rawDetailMeta").textContent = `${row.profile.gender || "-"}, ${row.profile.usia ?? "?"} thn, ${row.profile.kabkota || "-"}, ${row.profile.sekolah || "-"}`;
    setHTML("#rawDetailContext", `
      <div><b>Urutan</b><span>${esc(row.context.order || "-")}</span></div>
      <div><b>Durasi</b><span>${esc(row.context.durasi || "-")}</span></div>
      <div><b>Frekuensi</b><span>${esc(row.context.frekuensi || "-")}</span></div>
      <div><b>Pernah Pakai</b><span>${esc(row.context.pernah_chatbot || "-")}</span></div>
      <div><b>Membantu</b><span>${esc(row.context.membantu || "-")}</span></div>
      <div><b>Media Info</b><span>${esc((row.context.media || []).join(", ") || "-")}</span></div>
      <div><b>Rating Membantu</b><span>${esc(row.context.rating_membantu || "-")}/5</span></div>
      <div><b>Rating Kepuasan</b><span>${esc(row.context.rating_kepuasan || "-")}/5</span></div>
    `);
    setHTML("#rawDetailTotals", `
      <span class="raw-total-cell formal"><small>Formal</small><strong>${fmt(row.formal.total, 2)}</strong></span>
      <span class="raw-total-cell genz"><small>Gen-Z</small><strong>${fmt(row.genz.total, 2)}</strong></span>
      <span class="raw-total-cell diff ${row.diff > 0 ? "pos" : row.diff < 0 ? "neg" : "zero"}"><small>Selisih</small><strong>${row.diff !== null ? `${row.diff >= 0 ? "+" : ""}${fmt(row.diff, 2)}` : "-"}</strong></span>
    `);
    renderItemBars(row);
  }

  function setHTML(sel, html) { const el = $(sel); if (el) el.innerHTML = html; }

  function renderItemBars(row) {
    const items = STATE.raw?.items_order || [];
    const positives = new Set(STATE.raw?.positive_items || []);
    const formalScores = items.map((q) => row.formal.items[q] ?? null);
    const genzScores = items.map((q) => row.genz.items[q] ?? null);
    const el = $("#rawDetailItems");
    if (!el) return;
    if (charts.detail) charts.detail.dispose();
    charts.detail = echarts.init(el, null, { renderer: "canvas" });
    charts.detail.setOption({
      backgroundColor: "transparent",
      textStyle: { color: COLOR_TEXT, fontFamily: "Inter, system-ui, sans-serif" },
      tooltip: {
        ...baseTooltip,
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params) => {
          const qkey = items[params[0].dataIndex];
          const tag = positives.has(qkey) ? "(positif)" : "(negatif)";
          return `<b>${qkey.toUpperCase()}</b> ${tag}<br>` + params.map((p) => `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:6px"></span>${p.seriesName}: <b>${p.value ?? "-"}</b>`).join("<br>");
        },
      },
      legend: { textStyle: { color: COLOR_TEXT }, top: 0, right: 8, data: ["Formal", "Gen-Z"], itemWidth: 14, itemHeight: 8 },
      grid: { left: 40, right: 16, top: 30, bottom: 30 },
      xAxis: {
        type: "category",
        data: items.map((q) => q.toUpperCase()),
        axisLine: { lineStyle: { color: COLOR_AXIS } },
        axisLabel: { color: COLOR_AXIS, fontSize: 11, fontWeight: 600 },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 5,
        interval: 1,
        axisLine: { show: false },
        splitLine: { lineStyle: { color: COLOR_GRID } },
        axisLabel: { color: COLOR_AXIS, fontSize: 11 },
      },
      series: [
        { name: "Formal", type: "bar", data: formalScores, itemStyle: { color: COLOR_FORMAL, borderRadius: [3, 3, 0, 0] }, emphasis: { focus: "series" } },
        { name: "Gen-Z", type: "bar", data: genzScores, itemStyle: { color: COLOR_GENZ, borderRadius: [3, 3, 0, 0] }, emphasis: { focus: "series" } },
      ],
    });
  }

  function closeDetail() {
    $("#rawDetailBackdrop").hidden = true;
    if (charts.detail) { charts.detail.dispose(); charts.detail = null; }
    STATE.selected = null;
  }

  function exportCsv() {
    const list = STATE.filtered;
    if (!list.length) return;
    const cols = ["id", "initials", "usia", "gender", "status", "kabkota", "sekolah", "order", "durasi", "frekuensi", "media", "formal_total", "genz_total", "diff"];
    const rows = list.map((r) => [
      r.id,
      STATE.showName && STATE.namesByIndex[r.id] ? STATE.namesByIndex[r.id] : r.profile.initials,
      r.profile.usia ?? "",
      r.profile.gender,
      r.profile.status,
      r.profile.kabkota,
      r.profile.sekolah,
      r.context.order,
      r.context.durasi,
      r.context.frekuensi,
      (r.context.media || []).join("; "),
      r.formal.total ?? "",
      r.genz.total ?? "",
      r.diff ?? "",
    ].map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","));
    const csv = [cols.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "harno-cuq-raw-filtered.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function bindControls() {
    ["#rawSearch", "#rawGender", "#rawUsia", "#rawKab", "#rawOrder", "#rawDurasi", "#rawFreq"].forEach((sel) => {
      $(sel)?.addEventListener("input", applyFilters);
      $(sel)?.addEventListener("change", applyFilters);
    });
    $("#rawReset")?.addEventListener("click", () => {
      ["#rawSearch", "#rawGender", "#rawUsia", "#rawKab", "#rawOrder", "#rawDurasi", "#rawFreq"].forEach((sel) => {
        const el = $(sel);
        if (el) el.value = "";
      });
      applyFilters();
    });
    $("#rawShowName")?.addEventListener("change", (event) => {
      STATE.showName = event.target.checked;
      renderTable();
    });
    $("#rawExportCsv")?.addEventListener("click", exportCsv);
    $("#rawDetailClose")?.addEventListener("click", closeDetail);
    $("#rawDetailBackdrop")?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) closeDetail();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeTableModal();
        closeDetail();
      }
    });
    // Delegasi click untuk tombol expand & close modal: lebih tahan terhadap
    // perubahan DOM dan urutan render.
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest("#rawExpandBtn")) {
        event.preventDefault();
        openTableModal();
        return;
      }
      if (target.closest("#rawTableModalClose")) {
        event.preventDefault();
        closeTableModal();
        return;
      }
      if (target.matches('[data-close="1"]')) {
        closeTableModal();
      }
    });
    bindSort();
  }

  function openTableModal() {
    const modal = $("#rawTableModal");
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    renderTable();
  }

  function closeTableModal() {
    const modal = $("#rawTableModal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function bindResize() {
    let raf = null;
    window.addEventListener("resize", () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        Object.values(charts).forEach((chart) => chart && chart.resize());
      });
    });
  }

  // Optionally fetch nama asli (raw CSV) saat user toggle "Tampilkan nama asli"
  // Untuk privacy, nama tidak ada di JSON; debug toggle hanya tampilkan inisial.
  // Bisa diperluas nanti dengan endpoint khusus jika diperlukan.

  async function loadRaw() {
    if (STATE.raw) return STATE.raw;
    const response = await fetch("data/raw_responses.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    STATE.raw = await response.json();
    return STATE.raw;
  }

  async function activate() {
    if (typeof echarts === "undefined") {
      console.warn("ECharts belum siap untuk Raw Explorer");
      return;
    }
    if (!STATE.raw) {
      try {
        await loadRaw();
      } catch (error) {
        console.error("Gagal memuat raw_responses.json", error);
        const empty = $("#rawEmpty");
        if (empty) {
          empty.hidden = false;
          empty.textContent = `Gagal memuat data raw: ${error.message}`;
        }
        return;
      }
      seedFilters();
      bindControls();
      bindResize();
    }
    applyFilters();
  }

  function deactivate() {
    Object.entries(charts).forEach(([key, chart]) => {
      if (chart) {
        chart.dispose();
        charts[key] = null;
      }
    });
    closeDetail();
  }

  window.RawExplorer = { activate, deactivate };
})();
