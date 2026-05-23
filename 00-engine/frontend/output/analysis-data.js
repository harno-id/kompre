/* eslint-disable no-undef */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const COLOR_FORMAL = "#2ea8ff";
const COLOR_GENZ = "#35e2a8";
const COLOR_TEXT = "#cfdcec";
const COLOR_AXIS = "#7d92aa";
const COLOR_GRID = "rgba(138,164,195,0.18)";
const COLOR_BG = "transparent";

let analysisState = null;
const charts = { spark: null, distribution: null, radar: null, paired: null };

const fmt = (value, digits = 2) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return Number(value).toFixed(digits).replace(/\.00$/, "");
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

function mean(values) {
  return values.reduce((sum, v) => sum + v, 0) / Math.max(1, values.length);
}

function sd(values) {
  const m = mean(values);
  return Math.sqrt(values.reduce((s, v) => s + ((v - m) ** 2), 0) / Math.max(1, values.length - 1));
}

function setText(sel, value) { const el = $(sel); if (el) el.textContent = value; }
function setHTML(sel, html) { const el = $(sel); if (el) el.innerHTML = html; }

function buildBins(values, min = 10, max = 100, step = 5) {
  const bins = [];
  for (let start = min; start < max; start += step) {
    bins.push({ label: `${start}-${start + step}`, mid: start + step / 2, count: 0 });
  }
  values.forEach((v) => {
    const idx = Math.max(0, Math.min(bins.length - 1, Math.floor((v - min) / step)));
    bins[idx].count += 1;
  });
  // smoothing 3-window untuk distribusi terlihat sebagai kurva
  return bins.map((bin, i) => ({
    ...bin,
    smooth: ((bins[Math.max(0, i - 1)].count + bin.count + bins[Math.min(bins.length - 1, i + 1)].count) / 3),
  }));
}

function darkBaseGrid() {
  return {
    backgroundColor: COLOR_BG,
    textStyle: { color: COLOR_TEXT, fontFamily: "Inter, system-ui, sans-serif" },
    tooltip: {
      backgroundColor: "rgba(8,28,53,0.95)",
      borderColor: "#1684ee",
      borderWidth: 1,
      textStyle: { color: "#f3f9ff", fontSize: 12 },
      extraCssText: "border-radius:8px;box-shadow:0 12px 30px rgba(0,0,0,0.45);",
    },
    legend: {
      textStyle: { color: COLOR_TEXT },
      itemWidth: 16,
      itemHeight: 8,
    },
  };
}

function renderInfo(data) {
  setHTML("#analysisInfo", [
    ["N", `${data.project?.n || "-"} responden Generasi Z`],
    ["DS", "Within-subject"],
    ["IQ", "CUQ 16 item"],
    ["UJ", "Paired t-test, Wilcoxon, Cohen's dz"],
  ].map(([icon, text]) => `<div class="info-line"><span class="nav-ico">${icon}</span><b>${esc(text)}</b></div>`).join(""));
}

function renderMetricCards(data) {
  const stats = data.statistics || {};
  const alpha = Number($("#alphaFilter")?.value || 0.05);
  const method = $("#methodFilter")?.value || "paired";
  const p = method === "wilcoxon" ? stats.wilcoxon_p : stats.paired_p;
  const significant = Number(p) < alpha;
  setText("#formalMean", fmt(stats.formal_mean, 2));
  setText("#genzMean", fmt(stats.genz_mean, 2));
  setText("#meanDiff", `+${fmt(stats.mean_diff, 2)} poin`);
  setText("#formalAlpha", fmt(stats.formal_alpha, 3));
  setText("#genzAlpha", fmt(stats.genz_alpha, 3));
  setText("#pairedP", pval(stats.paired_p));
  setText("#wilcoxonP", pval(stats.wilcoxon_p));
  setText("#effectSize", fmt(stats.cohens_dz, 3));
  setText("#significanceLabel", significant ? "Signifikan secara statistik" : "Tidak signifikan");
  setText("#effectLabel", Math.abs(Number(stats.cohens_dz || 0)) < 0.2 ? "Efek sangat kecil / trivial" : "Efek perlu ditafsirkan hati-hati");
  const dz = Math.max(-0.5, Math.min(0.5, Number(stats.cohens_dz || 0)));
  const pos = ((dz + 0.5) / 1.0) * 100;
  const marker = $("#effectMarker");
  if (marker) marker.style.left = `${pos}%`;
  renderSparkline(data.analysis_data?.pairs || []);
}

function renderSparkline(pairs) {
  const slice = pairs.slice(0, 60);
  const ctx = $("#meanSparkline");
  if (!ctx) return;
  if (charts.spark) charts.spark.dispose();
  charts.spark = echarts.init(ctx, null, { renderer: "canvas" });
  charts.spark.setOption({
    ...darkBaseGrid(),
    grid: { left: 0, right: 0, top: 4, bottom: 4 },
    xAxis: { type: "category", show: false, data: slice.map((_, i) => i + 1) },
    yAxis: { type: "value", show: false, scale: true },
    tooltip: {
      ...darkBaseGrid().tooltip,
      trigger: "axis",
      axisPointer: { type: "line", lineStyle: { color: "rgba(255,255,255,0.18)" } },
      formatter: (params) => {
        const idx = params[0]?.dataIndex ?? 0;
        const f = slice[idx]?.formal;
        const g = slice[idx]?.genz;
        return `Responden ke-${idx + 1}<br>Formal: <b>${fmt(f, 2)}</b><br>Gen-Z: <b>${fmt(g, 2)}</b>`;
      },
    },
    series: [
      { type: "line", data: slice.map((p) => p.formal), smooth: true, symbol: "none", lineStyle: { color: COLOR_FORMAL, width: 2 } },
      { type: "line", data: slice.map((p) => p.genz), smooth: true, symbol: "none", lineStyle: { color: COLOR_GENZ, width: 2 } },
    ],
  });
}

function renderDistribution(data) {
  const pairs = data.analysis_data?.pairs || [];
  const formal = pairs.map((r) => Number(r.formal));
  const genz = pairs.map((r) => Number(r.genz));
  const fb = buildBins(formal);
  const gb = buildBins(genz);
  const ctx = $("#distributionChart");
  if (!ctx) return;
  if (charts.distribution) charts.distribution.dispose();
  charts.distribution = echarts.init(ctx, null, { renderer: "canvas" });
  charts.distribution.setOption({
    ...darkBaseGrid(),
    legend: { ...darkBaseGrid().legend, top: 0, right: 8, data: ["Formal", "Gen-Z"] },
    grid: { left: 50, right: 16, top: 24, bottom: 36 },
    tooltip: {
      ...darkBaseGrid().tooltip,
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => {
        const label = fb[params[0].dataIndex]?.label || "";
        return `Skor ${label}<br>` + params.map((p) => `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:6px"></span>${p.seriesName}: <b>${fmt(p.value, 1)}</b> responden`).join("<br>");
      },
    },
    xAxis: {
      type: "category",
      data: fb.map((b) => b.label),
      axisLine: { lineStyle: { color: COLOR_AXIS } },
      axisLabel: { color: COLOR_AXIS, fontSize: 11 },
      name: "Skor Total CUQ",
      nameLocation: "middle",
      nameGap: 26,
      nameTextStyle: { color: COLOR_AXIS, fontSize: 11 },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: COLOR_GRID } },
      axisLabel: { color: COLOR_AXIS, fontSize: 11 },
      name: "Frekuensi",
      nameLocation: "middle",
      nameGap: 36,
      nameTextStyle: { color: COLOR_AXIS, fontSize: 11 },
    },
    series: [
      {
        name: "Formal",
        type: "line",
        smooth: 0.4,
        symbol: "circle",
        symbolSize: 5,
        data: fb.map((b) => b.smooth),
        itemStyle: { color: COLOR_FORMAL },
        lineStyle: { color: COLOR_FORMAL, width: 2 },
        areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(46,168,255,0.32)" }, { offset: 1, color: "rgba(46,168,255,0.02)" }] } },
        emphasis: { focus: "series" },
      },
      {
        name: "Gen-Z",
        type: "line",
        smooth: 0.4,
        symbol: "circle",
        symbolSize: 5,
        data: gb.map((b) => b.smooth),
        itemStyle: { color: COLOR_GENZ },
        lineStyle: { color: COLOR_GENZ, width: 2 },
        areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(53,226,168,0.28)" }, { offset: 1, color: "rgba(53,226,168,0.02)" }] } },
        emphasis: { focus: "series" },
      },
    ],
  });
  const stats = data.statistics || {};
  setHTML("#distributionTable", `
    <div><b>Formal</b><span>Mean ${fmt(stats.formal_mean, 2)}</span><span>SD ${fmt(stats.formal_sd, 2)}</span><span>Min ${fmt(Math.min(...formal), 0)}</span><span>Max ${fmt(Math.max(...formal), 0)}</span></div>
    <div><b>Gen-Z</b><span>Mean ${fmt(stats.genz_mean, 2)}</span><span>SD ${fmt(stats.genz_sd, 2)}</span><span>Min ${fmt(Math.min(...genz), 0)}</span><span>Max ${fmt(Math.max(...genz), 0)}</span></div>
  `);
}

function renderRadar(data) {
  const dims = data.cuq_dimensions?.items || [];
  const ctx = $("#radarChart");
  if (!ctx) return;
  if (charts.radar) charts.radar.dispose();
  charts.radar = echarts.init(ctx, null, { renderer: "canvas" });
  charts.radar.setOption({
    ...darkBaseGrid(),
    legend: { ...darkBaseGrid().legend, top: 0, right: 8, data: ["Formal", "Gen-Z"] },
    tooltip: {
      ...darkBaseGrid().tooltip,
      formatter: (param) => {
        const v = param.value || [];
        return `<b>${param.seriesName}</b><br>` + dims.map((d, i) => `${esc(d.dimension)}: <b>${fmt(v[i], 2)}</b>`).join("<br>");
      },
    },
    radar: {
      shape: "polygon",
      radius: "68%",
      splitNumber: 4,
      axisLine: { lineStyle: { color: COLOR_GRID } },
      splitLine: { lineStyle: { color: COLOR_GRID } },
      splitArea: { areaStyle: { color: ["rgba(22,132,238,0.04)", "rgba(22,132,238,0.02)"] } },
      indicator: dims.map((d) => ({ name: d.dimension, max: 100 })),
      axisName: { color: COLOR_TEXT, fontSize: 11, fontWeight: 600 },
    },
    series: [{
      type: "radar",
      symbolSize: 6,
      emphasis: { focus: "series", lineStyle: { width: 3 } },
      data: [
        {
          value: dims.map((d) => Number(d.formal_mean)),
          name: "Formal",
          itemStyle: { color: COLOR_FORMAL },
          lineStyle: { color: COLOR_FORMAL, width: 2 },
          areaStyle: { color: "rgba(46,168,255,0.18)" },
        },
        {
          value: dims.map((d) => Number(d.genz_mean)),
          name: "Gen-Z",
          itemStyle: { color: COLOR_GENZ },
          lineStyle: { color: COLOR_GENZ, width: 2 },
          areaStyle: { color: "rgba(53,226,168,0.18)" },
        },
      ],
    }],
  });
}

function renderPairedPlot(data) {
  const pairs = data.analysis_data?.pairs || [];
  const diffs = pairs.map((r) => Number(r.diff));
  const avg = mean(diffs);
  const diffSd = sd(diffs);
  const upper = avg + (1.96 * diffSd);
  const lower = avg - (1.96 * diffSd);
  const absMax = Math.max(20, Math.ceil(Math.max(...diffs.map(Math.abs), Math.abs(upper), Math.abs(lower)) / 10) * 10);
  const ctx = $("#pairedChart");
  if (!ctx) return;
  if (charts.paired) charts.paired.dispose();
  charts.paired = echarts.init(ctx, null, { renderer: "canvas" });
  charts.paired.setOption({
    ...darkBaseGrid(),
    grid: { left: 56, right: 110, top: 18, bottom: 38 },
    tooltip: {
      ...darkBaseGrid().tooltip,
      trigger: "item",
      formatter: (p) => {
        const i = p.dataIndex;
        const row = pairs[i] || {};
        return `Responden ke-${row.index || i + 1}<br>Formal: <b>${fmt(row.formal, 2)}</b><br>Gen-Z: <b>${fmt(row.genz, 2)}</b><br>Selisih: <b>${fmt(row.diff, 2)}</b>`;
      },
    },
    xAxis: {
      type: "value",
      min: 1,
      max: pairs.length,
      name: "Responden diurutkan",
      nameLocation: "middle",
      nameGap: 26,
      nameTextStyle: { color: COLOR_AXIS, fontSize: 11 },
      axisLine: { lineStyle: { color: COLOR_AXIS } },
      axisLabel: { color: COLOR_AXIS, fontSize: 11 },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      min: -absMax,
      max: absMax,
      name: "Selisih Skor (Gen-Z - Formal)",
      nameLocation: "middle",
      nameGap: 42,
      nameTextStyle: { color: COLOR_AXIS, fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: COLOR_GRID } },
      axisLabel: { color: COLOR_AXIS, fontSize: 11 },
    },
    series: [
      {
        type: "scatter",
        symbolSize: 5,
        data: pairs.map((r) => [r.index || 0, r.diff]),
        itemStyle: { color: "rgba(53,226,168,0.65)", borderColor: "rgba(53,226,168,1)", borderWidth: 0.5 },
        markLine: {
          symbol: "none",
          silent: true,
          lineStyle: { type: "solid", width: 1.6 },
          data: [
            { yAxis: avg, label: { formatter: `Mean ${avg >= 0 ? "+" : ""}${fmt(avg, 2)}`, color: "#ffd080", fontWeight: 700, position: "end" }, lineStyle: { color: "#ffd080", width: 2 } },
            { yAxis: upper, label: { formatter: "+1.96 SD", color: "#f4a62d", position: "end" }, lineStyle: { color: "#f4a62d", type: "dashed" } },
            { yAxis: lower, label: { formatter: "-1.96 SD", color: "#f4a62d", position: "end" }, lineStyle: { color: "#f4a62d", type: "dashed" } },
            { yAxis: 0, lineStyle: { color: "rgba(255,255,255,0.18)", width: 1 } },
          ],
        },
      },
    ],
  });
  setHTML("#pairedStats", `
    <span><b>Mean Diff</b><strong>+${fmt(avg, 2)}</strong></span>
    <span><b>SD Diff</b><strong>${fmt(diffSd, 2)}</strong></span>
    <span><b>95% CI</b><strong>[${fmt(avg - 1.96 * diffSd / Math.sqrt(diffs.length), 2)}, ${fmt(avg + 1.96 * diffSd / Math.sqrt(diffs.length), 2)}]</strong></span>
    <span><b>p-value</b><strong>${pval(data.statistics?.paired_p)}</strong></span>
  `);
}

function renderInterpretation(data) {
  const stats = data.statistics || {};
  const method = $("#methodFilter")?.value || "paired";
  const methodText = method === "wilcoxon"
    ? `Wilcoxon p = ${pval(stats.wilcoxon_p)} memberi sinyal statistik nonparametrik, tetapi effect size tetap sangat kecil.`
    : `Paired t-test p = ${pval(stats.paired_p)} tidak menunjukkan perbedaan mean yang signifikan.`;
  setText("#interpretationText", `Rata-rata skor CUQ Gen-Z (${fmt(stats.genz_mean, 2)}) sedikit lebih tinggi daripada Formal (${fmt(stats.formal_mean, 2)}), dengan selisih hanya +${fmt(stats.mean_diff, 2)} poin. ${methodText} Kesimpulan aman: tidak ada bukti dampak praktis kuat; rekomendasi difokuskan pada segmentasi gaya bahasa chatbot dan kehati-hatian klaim.`);
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function bindControls(data) {
  ["#datasetFilter", "#comparisonFilter", "#groupFilter", "#methodFilter", "#alphaFilter"].forEach((sel) => {
    $(sel)?.addEventListener("change", () => {
      renderMetricCards(data);
      renderInterpretation(data);
    });
  });
  $("#datasetFilter")?.addEventListener("change", () => {
    const mode = $("#datasetFilter").value || "cuq";
    toggleDatasetMode(mode);
  });
  $("#resetAnalysisFilters")?.addEventListener("click", () => {
    if ($("#datasetFilter")) $("#datasetFilter").value = "cuq";
    if ($("#comparisonFilter")) $("#comparisonFilter").value = "formal_genz";
    if ($("#groupFilter")) $("#groupFilter").value = "genz";
    if ($("#methodFilter")) $("#methodFilter").value = "paired";
    if ($("#alphaFilter")) $("#alphaFilter").value = "0.05";
    toggleDatasetMode("cuq");
    renderMetricCards(data);
    renderInterpretation(data);
  });
  $("#exportDataBtn")?.addEventListener("click", () => {
    const rows = ["index,formal,genz,diff"].concat((data.analysis_data?.pairs || []).map((row) => `${row.index},${row.formal},${row.genz},${row.diff}`));
    downloadText("harno-cuq-analysis-export.csv", rows.join("\n"));
  });
  $("#downloadReportBtn")?.addEventListener("click", () => {
    const stats = data.statistics || {};
    downloadText("harno-analisis-data-ringkas.txt", [
      "Analisis Data CUQ",
      `N: ${data.project?.n}`,
      `Formal mean: ${fmt(stats.formal_mean, 2)}`,
      `Gen-Z mean: ${fmt(stats.genz_mean, 2)}`,
      `Mean diff: +${fmt(stats.mean_diff, 2)}`,
      `Paired p: ${pval(stats.paired_p)}`,
      `Wilcoxon p: ${pval(stats.wilcoxon_p)}`,
      `Cohen dz: ${fmt(stats.cohens_dz, 3)}`,
    ].join("\n"));
  });
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

function toggleDatasetMode(mode) {
  const stat = document.getElementById("statSection");
  const raw = document.getElementById("rawSection");
  const lampiran = document.getElementById("lampiranSection");
  const isRaw = mode === "raw";
  const isLampiran = mode === "lampiran";
  const isStat = !isRaw && !isLampiran;
  if (stat) stat.hidden = !isStat;
  if (raw) raw.hidden = !isRaw;
  if (lampiran) lampiran.hidden = !isLampiran;
  if (isRaw) {
    window.RawExplorer?.activate?.();
  } else {
    window.RawExplorer?.deactivate?.();
  }
  if (isLampiran) {
    window.LampiranReader?.activate?.();
  } else {
    window.LampiranReader?.deactivate?.();
  }
  if (isStat) {
    requestAnimationFrame(() => {
      Object.values(charts).forEach((chart) => chart && chart.resize());
    });
  }
}

async function init() {
  if (typeof echarts === "undefined") {
    document.body.insertAdjacentHTML("afterbegin", '<pre style="position:fixed;z-index:99;inset:20px;background:#210;color:#fff;padding:20px">ECharts gagal dimuat dari assets/echarts/echarts.min.js</pre>');
    return;
  }
  const response = await fetch("data/dashboard_data.json", { cache: "no-store" });
  const data = await response.json();
  analysisState = data;
  renderInfo(data);
  renderMetricCards(data);
  renderDistribution(data);
  renderRadar(data);
  renderPairedPlot(data);
  renderInterpretation(data);
  bindControls(data);
  bindResize();
  toggleDatasetMode($("#datasetFilter")?.value || "cuq");
}

init().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML("afterbegin", `<pre style="position:fixed;z-index:99;inset:20px;background:#210;color:#fff;padding:20px;border:1px solid #f66">Analysis load error: ${esc(error.message)}</pre>`);
});
