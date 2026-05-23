/* eslint-disable no-undef */
(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  const COLOR_TEXT = "#cfdcec";
  const COLOR_AXIS = "#7d92aa";
  const COLOR_GRID = "rgba(138,164,195,0.18)";

  const STATE = {
    manifest: null,
    activeKey: null,
    docs: {}, // cache markdown content
    charts: {},
  };

  const baseTooltip = {
    backgroundColor: "rgba(8,28,53,0.95)",
    borderColor: "#1684ee",
    borderWidth: 1,
    textStyle: { color: "#f3f9ff", fontSize: 12 },
    extraCssText: "border-radius:8px;box-shadow:0 12px 30px rgba(0,0,0,0.45);",
  };

  function setText(sel, text) { const el = $(sel); if (el) el.textContent = text; }
  function setHTML(sel, html) { const el = $(sel); if (el) el.innerHTML = html; }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function fmtValue(value, format) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
    const n = Number(value);
    if (format === "decimal3") return n.toFixed(3).replace(/\.?0+$/, (m) => m.length === 4 ? ".000" : m);
    if (format === "decimal2") return n.toFixed(2);
    if (format === "integer") return Math.round(n).toString();
    return n.toString();
  }

  async function loadManifest() {
    const response = await fetch("data/lampiran/manifest.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Manifest HTTP ${response.status}`);
    STATE.manifest = await response.json();
  }

  async function loadDoc(file) {
    if (STATE.docs[file]) return STATE.docs[file];
    const response = await fetch(`data/lampiran/${file}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Doc HTTP ${response.status}`);
    const text = await response.text();
    STATE.docs[file] = text;
    return text;
  }

  function renderStageList() {
    const stages = STATE.manifest?.stages || [];
    setHTML("#lampiranStageList", stages.map((stage) => `
      <li>
        <button type="button" class="lampiran-stage-btn ${stage.key === STATE.activeKey ? "active" : ""}" data-key="${esc(stage.key)}">
          <span class="lampiran-stage-icon"><svg><use href="#${esc(stage.icon || "i-doc")}"></use></svg></span>
          <div>
            <b>${esc(stage.label)}</b>
            <small>${esc(stage.kicker)}</small>
          </div>
        </button>
      </li>
    `).join(""));
    $$(".lampiran-stage-btn").forEach((btn) => {
      btn.addEventListener("click", () => activateStage(btn.dataset.key));
    });
  }

  function renderHighlights(stage) {
    const items = stage.highlights || [];
    setHTML("#lampiranHighlights", items.map(([label, value]) => `
      <div class="lampiran-highlight">
        <span>${esc(label)}</span>
        <strong>${esc(value)}</strong>
      </div>
    `).join(""));
  }

  function disposeCharts() {
    Object.values(STATE.charts).forEach((chart) => { try { chart && chart.dispose(); } catch (_e) { /* noop */ } });
    STATE.charts = {};
  }

  function chartCommon(title) {
    return {
      backgroundColor: "transparent",
      textStyle: { color: COLOR_TEXT, fontFamily: "Inter, system-ui, sans-serif" },
      title: { text: title, left: 12, top: 8, textStyle: { color: "#f3f9ff", fontSize: 13, fontWeight: 700 } },
      tooltip: { ...baseTooltip },
      legend: { textStyle: { color: COLOR_TEXT, fontSize: 11 }, top: 8, right: 12, itemWidth: 14, itemHeight: 8 },
    };
  }

  function buildDonut(spec) {
    const items = spec.items || [];
    const opt = chartCommon(spec.title);
    opt.tooltip.trigger = "item";
    opt.tooltip.formatter = (p) => `${p.name}<br><b>${p.value}</b> (${p.percent}%)`;
    opt.legend.bottom = 0;
    opt.legend.top = "auto";
    opt.legend.left = "center";
    opt.series = [{
      type: "pie",
      radius: ["46%", "70%"],
      center: ["50%", "55%"],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: "#08213d", borderWidth: 2, borderRadius: 4 },
      label: spec.centerLabel ? {
        show: true,
        position: "center",
        formatter: spec.centerLabel,
        color: "#f6fbff",
        fontSize: 18,
        fontWeight: 800,
      } : { show: false },
      labelLine: { show: false },
      data: items.map((it) => ({ name: it.name, value: it.value, itemStyle: { color: it.color } })),
    }];
    return opt;
  }

  function buildBarH(spec) {
    const opt = chartCommon(spec.title);
    opt.tooltip.trigger = "axis";
    opt.tooltip.axisPointer = { type: "shadow" };
    opt.tooltip.formatter = (params) => {
      const p = params[0];
      const formatted = fmtValue(p.value, spec.valueFormat);
      return `${p.name}<br><b>${formatted}</b>`;
    };
    opt.grid = { left: 140, right: 60, top: 36, bottom: 28 };
    opt.xAxis = {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: COLOR_GRID } },
      axisLabel: { color: COLOR_AXIS, fontSize: 11 },
    };
    opt.yAxis = {
      type: "category",
      data: spec.categories,
      axisLine: { lineStyle: { color: COLOR_AXIS } },
      axisLabel: { color: COLOR_TEXT, fontSize: 11.5, fontWeight: 600 },
      axisTick: { show: false },
    };
    opt.series = [{
      type: "bar",
      data: spec.values,
      itemStyle: { color: spec.color || "#2ea8ff", borderRadius: [0, 6, 6, 0] },
      barMaxWidth: 22,
      label: { show: true, position: "right", color: "#f3f9ff", fontWeight: 700, formatter: (p) => fmtValue(p.value, spec.valueFormat) },
      markLine: spec.thresholdLine ? {
        symbol: "none",
        silent: true,
        lineStyle: { color: "#f4b52d", type: "dashed", width: 1.5 },
        label: { color: "#f4b52d", fontWeight: 700, formatter: spec.thresholdLine.label, position: "end" },
        data: [{ xAxis: spec.thresholdLine.value }],
      } : undefined,
    }];
    return opt;
  }

  function buildBarGroup(spec) {
    const opt = chartCommon(spec.title);
    opt.tooltip.trigger = "axis";
    opt.tooltip.axisPointer = { type: "shadow" };
    opt.tooltip.formatter = (params) => {
      const lines = params.map((p) => `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:6px"></span>${p.seriesName}: <b>${fmtValue(p.value, spec.valueFormat)}</b>`).join("<br>");
      return `${params[0].axisValueLabel || ""}<br>${lines}`;
    };
    opt.grid = { left: 56, right: 18, top: 42, bottom: 60 };
    opt.xAxis = {
      type: "category",
      data: spec.categories,
      axisLine: { lineStyle: { color: COLOR_AXIS } },
      axisLabel: { color: COLOR_AXIS, fontSize: 10.5, interval: 0, rotate: spec.categories.length > 6 ? 30 : 0 },
      axisTick: { show: false },
    };
    opt.yAxis = {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: COLOR_GRID } },
      axisLabel: { color: COLOR_AXIS, fontSize: 11 },
    };
    opt.series = (spec.series || []).map((s) => ({
      name: s.name,
      type: "bar",
      data: s.values,
      itemStyle: { color: s.color, borderRadius: [4, 4, 0, 0] },
      barMaxWidth: 26,
      emphasis: { focus: "series" },
    }));
    if (spec.thresholdLine) {
      opt.series[0].markLine = {
        symbol: "none",
        silent: true,
        lineStyle: { color: "#f4b52d", type: "dashed", width: 1.5 },
        label: { color: "#f4b52d", fontWeight: 700, formatter: spec.thresholdLine.label, position: "end" },
        data: [{ yAxis: spec.thresholdLine.value }],
      };
    }
    return opt;
  }

  function renderCharts(stage) {
    disposeCharts();
    if (typeof echarts === "undefined") return;
    const charts = stage.charts || [];
    setHTML("#lampiranCharts", charts.map((spec) => `
      <article class="panel lampiran-chart-panel">
        <div id="${esc(spec.id)}" class="lampiran-chart-canvas" data-id="${esc(spec.id)}"></div>
        ${spec.note ? `<small class="lampiran-chart-note">${esc(spec.note)}</small>` : ""}
      </article>
    `).join(""));
    charts.forEach((spec) => {
      const el = document.getElementById(spec.id);
      if (!el) return;
      const chart = echarts.init(el, null, { renderer: "canvas" });
      let option;
      if (spec.type === "donut") option = buildDonut(spec);
      else if (spec.type === "barH") option = buildBarH(spec);
      else if (spec.type === "barGroup") option = buildBarGroup(spec);
      else return;
      chart.setOption(option);
      STATE.charts[spec.id] = chart;
    });
  }

  function configureMarked() {
    if (typeof marked === "undefined") return;
    if (marked.setOptions) {
      marked.setOptions({ gfm: true, breaks: false, headerIds: true, mangle: false });
    }
  }

  async function renderArticle(stage) {
    const md = await loadDoc(stage.file);
    let html;
    if (typeof marked !== "undefined" && marked.parse) {
      html = marked.parse(md);
    } else {
      html = `<pre>${esc(md)}</pre>`;
    }
    setHTML("#lampiranArticle", html);
  }

  async function activateStage(key) {
    const stage = (STATE.manifest?.stages || []).find((s) => s.key === key);
    if (!stage) return;
    STATE.activeKey = key;
    $$(".lampiran-stage-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.key === key));
    setText("#lampiranStageLabel", stage.label);
    setText("#lampiranStageKicker", stage.kicker);
    setText("#lampiranContentKicker", stage.kicker);
    setText("#lampiranContentSummary", stage.summary);
    const openLink = $("#lampiranOpenMd");
    if (openLink) openLink.href = `data/lampiran/${stage.file}`;
    renderHighlights(stage);
    renderCharts(stage);
    try {
      await renderArticle(stage);
    } catch (error) {
      setHTML("#lampiranArticle", `<p class="lampiran-error">Gagal memuat konten: ${esc(error.message)}</p>`);
    }
    // scroll content area to top kalau ada perpindahan tahap
    const content = $("#lampiranArticle");
    if (content && content.parentElement) content.parentElement.scrollTop = 0;
  }

  function bindResize() {
    let raf = null;
    window.addEventListener("resize", () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        Object.values(STATE.charts).forEach((chart) => chart && chart.resize());
      });
    });
  }

  function bindPrint() {
    $("#lampiranPrint")?.addEventListener("click", () => window.print());
  }

  async function activate() {
    if (typeof echarts === "undefined") {
      console.warn("ECharts belum siap untuk Lampiran Reader");
    }
    if (!STATE.manifest) {
      try {
        await loadManifest();
      } catch (error) {
        console.error("Gagal memuat manifest lampiran", error);
        setHTML("#lampiranArticle", `<p class="lampiran-error">Gagal memuat manifest: ${esc(error.message)}</p>`);
        return;
      }
      configureMarked();
      renderStageList();
      bindResize();
      bindPrint();
    }
    if (!STATE.activeKey) {
      const first = STATE.manifest?.stages?.[0];
      if (first) await activateStage(first.key);
    } else {
      // refresh charts (resize) saat user kembali ke mode lampiran
      requestAnimationFrame(() => {
        Object.values(STATE.charts).forEach((chart) => chart && chart.resize());
      });
    }
  }

  function deactivate() {
    disposeCharts();
  }

  window.LampiranReader = { activate, deactivate };
})();
