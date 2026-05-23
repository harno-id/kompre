const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

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

function setHTML(sel, html) { const el = $(sel); if (el) el.innerHTML = html; }

function buildConcepts(data) {
  const stats = data.statistics || {};
  const theory = data.theory_mapping || {};
  return [
    {
      id: "cmc",
      title: "CMC",
      subtitle: "Computer-Mediated Communication",
      text: theory.CMC || "Chatbot diposisikan sebagai media komunikasi institusional; gaya bahasa menjadi isyarat sosial dalam interaksi bermedia.",
      color: "blue",
      icon: "i-network",
    },
    {
      id: "tam",
      title: "TAM",
      subtitle: "Technology Acceptance Model",
      text: theory.TAM || "Usabilitas dan penerimaan dipahami melalui kemudahan, kejelasan, dan kebermanfaatan informasi PMB.",
      color: "green",
      icon: "i-target",
    },
    {
      id: "sor",
      title: "S-O-R",
      subtitle: "Stimulus - Organism - Response",
      text: theory["S-O-R"] || "Gaya bahasa sebagai stimulus, persepsi usabilitas sebagai organism response, skor CUQ sebagai respons terukur.",
      color: "purple",
      icon: "i-curve",
    },
    {
      id: "cuq",
      title: "CUQ",
      subtitle: "Instrumen Usabilitas",
      text: `16 item, alpha Formal ${fmt(stats.formal_alpha, 3)} dan Gen-Z ${fmt(stats.genz_alpha, 3)}; skor dinormalisasi 0-100.`,
      color: "gold",
      icon: "i-clipboard",
    },
    {
      id: "chatbot",
      title: "Chatbot",
      subtitle: "Objek Komunikasi PMB",
      text: "Dua gaya bahasa chatbot dibandingkan pada responden yang sama untuk menekan variasi antarindividu.",
      color: "cyan",
      icon: "i-bot",
    },
  ];
}

function buildSupport(data) {
  const concepts = buildConcepts(data);
  // Hanya 3 entry teori utama untuk kolom kiri (sesuai mockup)
  const actions = {
    cmc: "Menguatkan posisi chatbot sebagai media komunikasi institusional.",
    tam: "Membantu membaca usabilitas sebagai penerimaan terhadap chatbot.",
    sor: "Memetakan gaya bahasa ke respons terukur melalui skor CUQ.",
  };
  return concepts.filter((c) => actions[c.id]).map((c) => ({
    id: c.id,
    title: c.title,
    body: c.text,
    action: actions[c.id],
  }));
}

function renderInfo(data) {
  const n = data.project?.n || 405;
  setHTML("#theoryInfo", [
    ["N", `${n} responden Generasi Z`],
    ["DS", "Within-subject"],
    ["TK", "CMC, TAM, S-O-R"],
    ["IQ", "CUQ 16 item"],
  ].map(([icon, text]) => `<div class="info-line"><span class="nav-ico">${icon}</span><b>${esc(text)}</b></div>`).join(""));
}

function renderConceptMap(data) {
  const concepts = buildConcepts(data);
  const stats = data.statistics || {};
  const n = data.project?.n || 405;
  setHTML("#conceptMap", `
    <div class="concept-track">
      ${concepts.map((concept, index) => `
        <button class="concept-node ${concept.color}" type="button" data-concept="${esc(concept.id)}">
          <span class="concept-order">${index + 1}</span>
          <svg><use href="#${concept.icon}"></use></svg>
          <b>${esc(concept.title)}</b>
          <small>${esc(concept.subtitle)}</small>
          <p>${esc(concept.text)}</p>
        </button>
      `).join('<span class="concept-link" aria-hidden="true"></span>')}
    </div>
    <div class="concept-outcomes">
      <article class="outcome-card blue">
        <span>Subjek</span>
        <strong>${esc(n)}</strong>
        <p>Responden Generasi Z dari data final audited.</p>
      </article>
      <article class="outcome-card green">
        <span>Outcome</span>
        <strong>Usabilitas</strong>
        <p>Formal ${fmt(stats.formal_mean)} vs Gen-Z ${fmt(stats.genz_mean)}; selisih ${fmt(stats.mean_diff)} poin.</p>
      </article>
      <article class="outcome-card gold">
        <span>Batas Klaim</span>
        <strong>dz ${fmt(stats.cohens_dz, 3)}</strong>
        <p>Efek sangat kecil; paired t-test p ${pval(stats.paired_p)}.</p>
      </article>
    </div>
  `);
}

function renderSupport(data) {
  const items = buildSupport(data);
  setHTML("#theorySupport", items.map((item, index) => `
    <button class="support-item" type="button" data-concept="${esc(item.id)}">
      <span class="support-num">${index + 1}</span>
      <div>
        <h4>${esc(item.title)}</h4>
        <p>${esc(item.body)}</p>
        <small>${esc(item.action)}</small>
      </div>
    </button>
  `).join(""));
}

function renderMatrix() {
  const columns = ["Landasan", "Analisis", "Instrumen", "Konteks", "Outcome"];
  const rows = [
    { id: "cmc", name: "CMC", checks: [1, 1, 0, 1, 0] },
    { id: "tam", name: "TAM", checks: [1, 1, 0, 0, 1] },
    { id: "sor", name: "S-O-R", checks: [1, 1, 0, 1, 1] },
    { id: "cuq", name: "CUQ", checks: [0, 1, 1, 0, 1] },
  ];
  setHTML("#theoryMatrix", `
    <table>
      <thead>
        <tr>
          <th>Teori/Konsep</th>
          ${columns.map((col) => `<th>${esc(col)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row) => `
          <tr data-concept="${esc(row.id)}">
            <th>${esc(row.name)}</th>
            ${row.checks.map((checked) => `<td>${checked ? '<span class="check">&#10003;</span>' : '<span class="dash">-</span>'}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `);
}

function renderInsight(data, conceptId = "cmc") {
  const concepts = buildConcepts(data);
  const selected = concepts.find((c) => c.id === conceptId) || concepts[0];
  const stats = data.statistics || {};
  const n = data.project?.n || 405;
  setHTML("#conceptInsight", `
    <b>${esc(selected.title)} dalam pembacaan tesis</b>
    <p>${esc(selected.text)}</p>
    <small>Interpretasi tetap dibatasi data final: N ${esc(n)}, selisih mean ${fmt(stats.mean_diff)} poin, Cohen's dz ${fmt(stats.cohens_dz, 3)}.</small>
  `);
}

function setActive(conceptId) {
  $$(".concept-node").forEach((node) => node.classList.toggle("active", node.dataset.concept === conceptId));
  $$(".support-item").forEach((item) => item.classList.toggle("active", item.dataset.concept === conceptId));
  $$("#theoryMatrix tbody tr").forEach((row) => row.classList.toggle("active", row.dataset.concept === conceptId));
}

function bindInteractions(data) {
  $$(".concept-node").forEach((node) => {
    node.addEventListener("click", () => {
      const id = node.dataset.concept;
      setActive(id);
      renderInsight(data, id);
    });
  });
  $$(".support-item").forEach((node) => {
    node.addEventListener("click", () => {
      const id = node.dataset.concept;
      setActive(id);
      renderInsight(data, id);
    });
  });
  $$("#theoryMatrix tbody tr").forEach((row) => {
    row.addEventListener("click", () => {
      const id = row.dataset.concept;
      if (!id) return;
      setActive(id);
      renderInsight(data, id);
    });
  });
  $("#resetTheoryMap")?.addEventListener("click", () => {
    setActive("cmc");
    renderInsight(data, "cmc");
  });
  $("#exportTheoryPdf")?.addEventListener("click", () => window.print());
  bindExpandModal(data);
}

function bindExpandModal(data) {
  const modal = $("#theoryModal");
  const body = $("#theoryModalBody");
  const titleEl = $("#theoryModalTitle");
  if (!modal || !body || !titleEl) return;

  function openModal(kind) {
    let title = "";
    let html = "";
    if (kind === "support") {
      title = "Bagaimana Teori Mendukung Penelitian Ini";
      const items = buildSupport(data);
      html = `<div class="theory-modal-support">${items.map((item, index) => `
        <article class="support-item" data-concept="${esc(item.id)}">
          <span class="support-num">${index + 1}</span>
          <div>
            <h4>${esc(item.title)}</h4>
            <p>${esc(item.body)}</p>
            <small>${esc(item.action)}</small>
          </div>
        </article>
      `).join("")}</div>`;
    } else if (kind === "position") {
      title = "Posisi Teori dalam Penelitian";
      const matrix = $("#theoryMatrix")?.innerHTML || "";
      const insight = $("#conceptInsight")?.innerHTML || "";
      html = `<div class="theory-modal-position">
        <div class="theory-modal-matrix">${matrix}</div>
        <div class="theory-modal-insight concept-insight">${insight}</div>
      </div>`;
    }
    titleEl.textContent = title;
    body.innerHTML = html;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    body.innerHTML = "";
  }

  $$(".theory-expand-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      openModal(btn.dataset.expand);
    });
  });
  $("#theoryModalClose")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target.dataset.close === "1") closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
}

async function init() {
  const response = await fetch("data/dashboard_data.json", { cache: "no-store" });
  const data = await response.json();
  renderInfo(data);
  renderConceptMap(data);
  renderSupport(data);
  renderMatrix();
  renderInsight(data, "cmc");
  setActive("cmc");
  bindInteractions(data);
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<pre style="position:fixed;z-index:99;inset:20px;background:#210;color:#fff;padding:20px;border:1px solid #f66">Theory page load error: ${esc(error.message)}</pre>`);
});
