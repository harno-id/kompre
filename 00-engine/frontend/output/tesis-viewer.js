const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function setText(sel, text) {
  const el = $(sel);
  if (el) el.textContent = text;
}

function setHTML(sel, html) {
  const el = $(sel);
  if (el) el.innerHTML = html;
}

function chapterColor(index) {
  return ["blue", "green", "purple", "gold", "green", "cyan"][index % 6];
}

function renderInfo(data) {
  setHTML("#thesisInfo", [
    ["N", `${data.project?.n || 405} responden Generasi Z`],
    ["DS", "Within-subject"],
    ["IQ", "CUQ 16 item"],
    ["UJ", "Paired t-test, Wilcoxon, Cohen's dz"],
  ].map(([icon, text]) => `<div class="info-line"><span class="nav-ico">${icon}</span><b>${esc(text)}</b></div>`).join(""));
}

function renderChapters(viewer) {
  setHTML("#chapterFlow", (viewer.chapters || []).map((chapter, index) => `
    <button class="chapter-node ${chapterColor(index)} ${index === 0 ? "active" : ""}" data-index="${index}" type="button">
      <span>${index < 5 ? index + 1 : "L"}</span>
      <b>${esc(chapter.label)}</b>
      <small>${esc(chapter.title)}</small>
    </button>
  `).join(""));

  $$(".chapter-node").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".chapter-node").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const chapter = viewer.chapters[Number(button.dataset.index)];
      setText("#chapterSummary", `${chapter.label} - ${chapter.title}: ${chapter.summary}`);
    });
  });

  const first = viewer.chapters?.[0];
  if (first) setText("#chapterSummary", `${first.label} - ${first.title}: ${first.summary}`);
}

function renderAudit(viewer) {
  setText("#structureScore", `${viewer.structure_score || 100}%`);
  setText("#structureStatus", viewer.status || "Aman");
  const ring = $("#structureRing");
  if (ring) ring.style.background = `conic-gradient(#21d49b 0 ${Number(viewer.structure_score || 100) * 3.6}deg, rgba(126,170,214,.16) 0 360deg)`;
}

function renderBreakdown(viewer) {
  setHTML("#breakdownRows", (viewer.breakdown || []).map((row, index) => `
    <tr>
      <td>
        <div class="cell-part">
          <span class="break-icon ${chapterColor(index)}">${index + 1}</span>
          <span class="cell-part-text">${esc(row.part)}</span>
        </div>
      </td>
      <td><div class="cell-summary">${esc(row.summary)}</div></td>
      <td><span class="link-chip">${esc(row.links)}</span></td>
      <td>
        <div class="cell-alignment">
          <span class="alignment-good">&check;</span>
          <div class="cell-alignment-text">
            <b>${esc(row.alignment)}</b>
            <small>${row.score}%</small>
          </div>
        </div>
      </td>
    </tr>
  `).join(""));
  setText("#thesisInsight", viewer.insight || "Alur tesis sudah terhubung dengan baik.");
  setText("#overallRelationScore", `${viewer.structure_score || 100}%`);
}

function bindControls(viewer) {
  $("#downloadThesisPdf")?.addEventListener("click", () => {
    if (viewer.pdf_asset) window.open(viewer.pdf_asset, "_blank", "noreferrer");
  });
  $("#exportThesisPdf")?.addEventListener("click", () => window.print());
}

async function init() {
  const response = await fetch("data/dashboard_data.json", { cache: "no-store" });
  const data = await response.json();
  const viewer = data.thesis_viewer || {};
  renderInfo(data);
  renderChapters(viewer);
  renderAudit(viewer);
  renderBreakdown(viewer);
  bindControls(viewer);
  if (viewer.pdf_asset) {
    $("#pdfFrame").src = `${viewer.pdf_asset}#page=9&zoom=100`;
    $("#pdfOpenLink").href = viewer.pdf_asset;
  }
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<pre style="position:fixed;z-index:99;inset:20px;background:#210;color:#fff;padding:20px;border:1px solid #f66">Thesis viewer load error: ${esc(error.message)}</pre>`);
});
