"""Unify sidebar nav menu across all dashboard pages.

Canonical 12-item menu, ikon dan label seragam, hanya class `active`
yang berbeda per halaman. Run dari workspace root atau folder ini.
"""
from __future__ import annotations

import re
from pathlib import Path

OUT = Path(__file__).resolve().parent / "output"

# (label, icon, href, page_key, pill_html)
MENU_ITEMS = [
    ("Beranda",          "i-home",      "index.html",              "index",            ""),
    ("Ringkasan Tesis",  "i-doc",       "tesis-viewer.html",       "tesis",            ""),
    ("Presentasi",       "i-brief",     "presentasi.html",         "presentasi",       '<span class="pill">PPT</span>'),
    ("Teori & Konsep",   "i-book",      "teori-konsep.html",       "teori",            ""),
    ("Metodologi",       "i-flask",     "metodologi.html",         "metodologi",       ""),
    ("Analisis Data",    "i-chart",     "analisis-data.html",      "analisis",         ""),
    ("Implikasi & Saran","i-target",    "implikasi-saran.html",    "implikasi",        ""),
    ("Simulasi Kompre",  "i-brief",     "simulasi-kompre.html",    "simulasi",         ""),
    ("Penyusun Jawaban", "i-shield",    "jawaban-aman.html",       "jawaban",          '<span class="pill">Baru</span>'),
    ("Laporan & Ekspor", "i-doc",       "laporan-ekspor.html",     "laporan",          ""),
    ("Pengaturan",       "i-cog",       "index.html#overview",     "pengaturan",       ""),
]

PAGE_TO_KEY = {
    "index.html":             "index",
    "tesis-viewer.html":      "tesis",
    "presentasi.html":        "presentasi",
    "detail-pertanyaan.html": "",
    "teori-konsep.html":      "teori",
    "metodologi.html":        "metodologi",
    "analisis-data.html":     "analisis",
    "implikasi-saran.html":   "implikasi",
    "simulasi-kompre.html":   "simulasi",
    "jawaban-aman.html":      "jawaban",
    "laporan-ekspor.html":    "laporan",
}


def build_nav(active_key: str) -> str:
    lines = ['      <nav class="nav-list">']
    for label, icon, href, key, pill in MENU_ITEMS:
        cls = ' class="active"' if key == active_key else ""
        suffix = f" {pill}" if pill else ""
        lines.append(
            f'        <a{cls} href="{href}"><svg><use href="#{icon}"></use></svg>{label}{suffix}</a>'
        )
    lines.append("      </nav>")
    return "\n".join(lines)


NAV_RE = re.compile(r'      <nav class="nav-list">.*?</nav>', re.DOTALL)

# Inject symbol i-cog ke sprite jika belum ada (gear icon).
COG_SYMBOL = (
    '    <symbol id="i-cog" viewBox="0 0 24 24">'
    '<circle cx="12" cy="12" r="3"/>'
    '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'
    '</symbol>'
)


def ensure_cog_symbol(text: str) -> str:
    if 'id="i-cog"' in text:
        return text
    # sisipkan tepat sebelum </svg> sprite pertama
    return text.replace("</svg>\n", "  " + COG_SYMBOL + "\n  </svg>\n", 1)


def unify(file: Path) -> bool:
    text = file.read_text(encoding="utf-8")
    if not NAV_RE.search(text):
        print(f"  SKIP no nav-list: {file.name}")
        return False
    key = PAGE_TO_KEY.get(file.name, "")
    new_nav = build_nav(key)
    new_text = NAV_RE.sub(lambda _m: new_nav, text)
    new_text = ensure_cog_symbol(new_text)
    if new_text == text:
        print(f"  unchanged: {file.name}")
        return False
    file.write_text(new_text, encoding="utf-8")
    print(f"  updated:   {file.name} (active={key or 'none'})")
    return True


def main() -> None:
    print(f"Unify sidebar in: {OUT}")
    pages = [
        "index.html", "analisis-data.html", "metodologi.html",
        "presentasi.html", "tesis-viewer.html", "teori-konsep.html",
        "simulasi-kompre.html", "detail-pertanyaan.html",
        "laporan-ekspor.html", "jawaban-aman.html", "implikasi-saran.html",
    ]
    changed = 0
    for name in pages:
        path = OUT / name
        if not path.exists():
            print(f"  MISSING: {name}")
            continue
        if unify(path):
            changed += 1
    print(f"\nDone. {changed} files updated.")


if __name__ == "__main__":
    main()
