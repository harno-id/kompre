/* Riwayat Percakapan Chatbot - 2 kolom (Gen-Z & Formal)
   - List sesi compact (click -> modal thread)
   - Tombol fullscreen di header -> modal panel besar (master/detail)
   Sumber data: data/chat_history.json */
(function () {
  "use strict";

  const ESC_MAP = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ESC_MAP[c]);

  const LABEL = {
    formal: { name: "Chatbot Formal", bot: "Kak Sima", initial: "S", avatarClass: "formal" },
    genz:   { name: "Chatbot Gen-Z",  bot: "Kak Nila", initial: "N", avatarClass: "genz" },
  };

  const STATE = {
    formal: { sessions: [], filtered: [], query: "" },
    genz:   { sessions: [], filtered: [], query: "" },
    fullActive: null,             // variant aktif di fullscreen modal
    fullActiveSession: null,      // session_id aktif di fullscreen
    fullQuery: "",
  };

  function applyFilter(variant, query) {
    const list = STATE[variant].sessions;
    const q = (query ?? STATE[variant].query).trim().toLowerCase();
    if (!q) {
      STATE[variant].filtered = list.slice();
      return STATE[variant].filtered;
    }
    return list.filter((sess) => {
      if (sess.session_id.toLowerCase().includes(q)) return true;
      if ((sess.first_user_text || "").toLowerCase().includes(q)) return true;
      return sess.messages.some((m) => (m.content || "").toLowerCase().includes(q));
    });
  }

  /* ============ Render compact session card (panel utama) ============ */
  function sessionCardHtml(sess) {
    return `
      <button type="button" class="chat-session" data-session="${esc(sess.session_id)}">
        <span class="chat-session-icon"><svg><use href="#i-message"></use></svg></span>
        <span class="chat-session-info">
          <span class="chat-session-top">
            <b>${esc(sess.session_id)}</b>
            <span class="chat-session-pill">${sess.message_count} pesan</span>
          </span>
          <span class="chat-session-preview">${esc(sess.first_user_text || "(tidak ada teks)")}</span>
        </span>
        <span class="chat-session-caret" aria-hidden="true">&rsaquo;</span>
      </button>
    `;
  }

  function renderList(variant) {
    const s = STATE[variant];
    const list = document.querySelector(`[data-list="${variant}"]`);
    const empty = document.querySelector(`[data-empty="${variant}"]`);
    if (!list) return;
    s.filtered = applyFilter(variant);
    if (!s.filtered.length) {
      list.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    list.innerHTML = s.filtered.map(sessionCardHtml).join("");
  }

  /* ============ Modal generic ============ */
  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.hidden = false;
    m.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }
  function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.hidden = true;
    m.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".chat-modal:not([hidden])")) {
      document.body.classList.remove("modal-open");
    }
  }

  /* ============ Modal: Thread Percakapan ============ */
  function bubbleHtml(message, variant) {
    const role = message.role === "human" ? "User" : (LABEL[variant]?.bot || "AI");
    return `
      <div class="chat-bubble chat-bubble-${esc(message.role)}">
        <span class="chat-bubble-role">${esc(role)}</span>
        <p>${esc(message.content)}</p>
      </div>
    `;
  }

  function openThread(variant, sessionId) {
    const sess = STATE[variant].sessions.find((s) => s.session_id === sessionId);
    if (!sess) return;
    const meta = LABEL[variant];
    const avatar = document.getElementById("chatThreadAvatar");
    const title = document.getElementById("chatThreadTitle");
    const metaEl = document.getElementById("chatThreadMeta");
    const body = document.getElementById("chatThreadBody");
    const card = document.querySelector("#chatThreadModal .chat-modal-card");
    if (avatar) {
      avatar.textContent = meta.initial;
      avatar.className = `chat-bot-avatar ${meta.avatarClass}`;
    }
    if (title) title.textContent = `${meta.name} - Sesi ${sess.session_id}`;
    if (metaEl) metaEl.textContent = `${sess.message_count} pesan (${sess.human_count} user / ${sess.ai_count} AI) - ${meta.bot}`;
    if (card) card.dataset.variant = variant;
    if (body) {
      body.innerHTML = sess.messages.map((m) => bubbleHtml(m, variant)).join("");
      body.scrollTop = 0;
    }
    openModal("chatThreadModal");
  }

  /* ============ Modal: Fullscreen Panel ============ */
  function fullSessionItemHtml(sess, isActive) {
    return `
      <button type="button" class="chat-fullscreen-item ${isActive ? "is-active" : ""}" data-session="${esc(sess.session_id)}">
        <span class="chat-session-icon"><svg><use href="#i-message"></use></svg></span>
        <span class="chat-session-info">
          <span class="chat-session-top">
            <b>${esc(sess.session_id)}</b>
            <span class="chat-session-pill">${sess.message_count}</span>
          </span>
          <span class="chat-session-preview">${esc(sess.first_user_text || "(tidak ada teks)")}</span>
        </span>
      </button>
    `;
  }

  function renderFullList() {
    const variant = STATE.fullActive;
    if (!variant) return;
    const list = document.getElementById("chatFullList");
    if (!list) return;
    const filtered = applyFilter(variant, STATE.fullQuery);
    if (!filtered.length) {
      list.innerHTML = `<p class="chat-fullscreen-hint">Tidak ada sesi cocok.</p>`;
      return;
    }
    list.innerHTML = filtered.map((sess) => fullSessionItemHtml(sess, sess.session_id === STATE.fullActiveSession)).join("");
  }

  function renderFullThread() {
    const variant = STATE.fullActive;
    const thread = document.getElementById("chatFullThread");
    if (!thread || !variant) return;
    const sid = STATE.fullActiveSession;
    if (!sid) {
      thread.innerHTML = `<p class="chat-fullscreen-hint">Pilih sesi di sebelah kiri untuk melihat percakapan.</p>`;
      return;
    }
    const sess = STATE[variant].sessions.find((s) => s.session_id === sid);
    if (!sess) {
      thread.innerHTML = `<p class="chat-fullscreen-hint">Sesi tidak ditemukan.</p>`;
      return;
    }
    const meta = LABEL[variant];
    thread.innerHTML = `
      <header class="chat-fullscreen-thread-head">
        <div>
          <h3>${esc(sess.session_id)}</h3>
          <p>${sess.message_count} pesan &middot; ${sess.human_count} user / ${sess.ai_count} ${esc(meta.bot)}</p>
        </div>
      </header>
      <div class="chat-fullscreen-thread-body" data-variant="${esc(variant)}">
        ${sess.messages.map((m) => bubbleHtml(m, variant)).join("")}
      </div>
    `;
    const body = thread.querySelector(".chat-fullscreen-thread-body");
    if (body) body.scrollTop = 0;
  }

  function openFullscreen(variant) {
    STATE.fullActive = variant;
    STATE.fullActiveSession = STATE[variant].sessions[0]?.session_id || null;
    STATE.fullQuery = "";
    const meta = LABEL[variant];
    const avatar = document.getElementById("chatFullAvatar");
    const title = document.getElementById("chatFullTitle");
    const metaEl = document.getElementById("chatFullMeta");
    const card = document.querySelector("#chatFullscreenModal .chat-modal-card");
    if (avatar) {
      avatar.textContent = meta.initial;
      avatar.className = `chat-bot-avatar ${meta.avatarClass}`;
    }
    if (title) title.textContent = meta.name;
    if (metaEl) metaEl.textContent = `${STATE[variant].sessions.length} sesi - ${meta.bot}`;
    if (card) card.dataset.variant = variant;
    const search = document.getElementById("chatFullSearch");
    if (search) search.value = "";
    renderFullList();
    renderFullThread();
    openModal("chatFullscreenModal");
  }

  /* ============ Bind events ============ */
  function bindList(variant) {
    const list = document.querySelector(`[data-list="${variant}"]`);
    if (!list) return;
    list.addEventListener("click", (event) => {
      const btn = event.target.closest(".chat-session");
      if (!btn) return;
      const sid = btn.dataset.session;
      if (sid) openThread(variant, sid);
    });
  }

  function bindSearch(variant) {
    const input = document.querySelector(`[data-search="${variant}"]`);
    if (!input) return;
    let timer = null;
    input.addEventListener("input", () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        STATE[variant].query = input.value || "";
        renderList(variant);
      }, 120);
    });
  }

  function bindFullscreenBtn(variant) {
    const btn = document.querySelector(`[data-fullscreen="${variant}"]`);
    if (!btn) return;
    btn.addEventListener("click", () => openFullscreen(variant));
  }

  function bindFullscreenInteractions() {
    const list = document.getElementById("chatFullList");
    if (list) {
      list.addEventListener("click", (event) => {
        const item = event.target.closest(".chat-fullscreen-item");
        if (!item) return;
        STATE.fullActiveSession = item.dataset.session;
        renderFullList();
        renderFullThread();
      });
    }
    const search = document.getElementById("chatFullSearch");
    if (search) {
      let timer = null;
      search.addEventListener("input", () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          STATE.fullQuery = search.value || "";
          renderFullList();
        }, 120);
      });
    }
  }

  function bindCommonClose() {
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const closer = target.closest('[data-close="1"]');
      if (!closer) return;
      const modal = closer.closest(".chat-modal");
      if (modal) closeModal(modal.id);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      ["chatThreadModal", "chatFullscreenModal"].forEach((id) => {
        const m = document.getElementById(id);
        if (m && !m.hidden) closeModal(id);
      });
    });
  }

  function fillStats(meta) {
    const m = meta || {};
    const set = (key, value) => {
      const el = document.querySelector(`[data-field="${key}"]`);
      if (el) el.textContent = value;
    };
    set("formalSessions", `${m.total_formal_sessions ?? 0} SESI`);
    set("formalMessages", `${m.total_formal_messages ?? 0} PESAN`);
    set("genzSessions", `${m.total_genz_sessions ?? 0} SESI`);
    set("genzMessages", `${m.total_genz_messages ?? 0} PESAN`);
  }

  async function init() {
    try {
      const response = await fetch("data/chat_history.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      STATE.formal.sessions = data.formal || [];
      STATE.genz.sessions = data.genz || [];
      fillStats(data.meta);
      renderList("formal");
      renderList("genz");
      bindList("formal");
      bindList("genz");
      bindSearch("formal");
      bindSearch("genz");
      bindFullscreenBtn("formal");
      bindFullscreenBtn("genz");
      bindFullscreenInteractions();
      bindCommonClose();
    } catch (err) {
      const msg = `Gagal memuat riwayat chatbot: ${err && err.message ? err.message : err}`;
      ["formal", "genz"].forEach((variant) => {
        const list = document.querySelector(`[data-list="${variant}"]`);
        if (list) list.innerHTML = `<p class="chat-history-error">${esc(msg)}</p>`;
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
