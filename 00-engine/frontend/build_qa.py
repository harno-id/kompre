"""Parse PENDALAMAN/02-data/Q&A/Q&A.md -> output/data/qa.json untuk popup
Q&A interaktif di halaman jawaban-aman.html.

Struktur sumber:
  # DAFTAR PERTANYAAN KRITIS SIDANG TESIS
  ## Group H2 (4 group)
  ### Kategori H3 (A-J, 10 kategori)
  Daftar pertanyaan numbered dengan format:
    1. **Bab/Subbab terkait:** ...
       **Pertanyaan kritis:** ...
       **Maksud penguji:** ...
       **Jawaban aman:** ...
       **Contoh jawaban lisan saat sidang:** ...
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "PENDALAMAN" / "02-data" / "Q&A" / "Q&A.md"
OUT = ROOT / "00-engine" / "frontend" / "output" / "data" / "qa.json"

# Pola: "1. **Bab/Subbab terkait:** ..." sampai sebelum "n. **Bab" berikutnya
# atau "###" / "##" / akhir teks.
# Field "Contoh jawaban lisan saat sidang" optional (15 pertanyaan tanpa).
QUESTION_RE = re.compile(
    r"^(?P<num>\d+)\.\s*\*\*Bab/Subbab terkait:\*\*\s*(?P<ref>.+?)$\s+"
    r"^\s+\*\*Pertanyaan kritis:\*\*\s*(?P<question>.+?)$\s+"
    r"^\s+\*\*Maksud penguji:\*\*\s*(?P<intent>.+?)$\s+"
    r"^\s+\*\*Jawaban aman:\*\*\s*(?P<answer>.+?)"
    r"(?:\s+^\s+\*\*Contoh jawaban lisan saat sidang:\*\*\s*(?P<example>.+?))?"
    r"(?=\n\s*\d+\.\s*\*\*Bab|\n\s*###\s|\n\s*##\s|\Z)",
    re.MULTILINE | re.DOTALL,
)

# Pola alternatif untuk section J (pertanyaan paling berbahaya):
# field name berbeda - "Kemungkinan maksud penguji", "Jawaban paling aman",
# "Contoh kalimat pendek yang bisa saya ucapkan saat sidang", plus
# field tambahan "Risiko jika dijawab keliru".
QUESTION_J_RE = re.compile(
    r"^(?P<num>\d+)\.\s*\*\*Bab/Subbab terkait:\*\*\s*(?P<ref>.+?)$\s+"
    r"^\s+\*\*Pertanyaan kritis:\*\*\s*(?P<question>.+?)$\s+"
    r"^\s+\*\*Kemungkinan maksud penguji:\*\*\s*(?P<intent>.+?)$\s+"
    r"^\s+\*\*Risiko jika dijawab keliru:\*\*\s*(?P<risk>.+?)$\s+"
    r"^\s+\*\*Jawaban paling aman:\*\*\s*(?P<answer>.+?)"
    r"(?:\s+^\s+\*\*Contoh kalimat pendek yang bisa saya ucapkan saat sidang:\*\*\s*(?P<example>.+?))?"
    r"(?=\n\s*\d+\.\s*\*\*Bab|\n\s*###\s|\n\s*##\s|\Z)",
    re.MULTILINE | re.DOTALL,
)


def clean(text: str) -> str:
    """Bersihkan multi-line trailing whitespace dan markdown-yang-perlu."""
    if not text:
        return ""
    text = text.strip()
    # Compress multi-spaces & newline jadi single space
    text = re.sub(r"\s+", " ", text)
    return text


def strip_md_basic(text: str) -> str:
    """Strip bold marker tetapi pertahankan untuk dirender HTML pakai <strong>."""
    return text


def parse() -> dict:
    if not SRC.exists():
        raise SystemExit(f"Q&A.md tidak ditemukan: {SRC}")
    md = SRC.read_text(encoding="utf-8")

    # Pisah berdasarkan group H2 dan kategori H3
    groups: list[dict] = []
    categories: list[dict] = []
    questions: list[dict] = []

    # Iterate H2
    h2_pattern = re.compile(r"^## (.+?)$", re.MULTILINE)
    h3_pattern = re.compile(r"^### ([A-Z])\.\s*(.+?)$", re.MULTILINE)

    h2_matches = list(h2_pattern.finditer(md))
    for h2_idx, h2 in enumerate(h2_matches):
        group_name = h2.group(1).strip()
        group_start = h2.end()
        group_end = h2_matches[h2_idx + 1].start() if h2_idx + 1 < len(h2_matches) else len(md)
        group_md = md[group_start:group_end]

        category_keys: list[str] = []

        # Iterate H3 dalam group ini
        h3_matches = list(h3_pattern.finditer(group_md))
        for h3_idx, h3 in enumerate(h3_matches):
            cat_key = h3.group(1)  # A, B, ...
            cat_label = h3.group(2).strip()
            cat_start = h3.end()
            cat_end = h3_matches[h3_idx + 1].start() if h3_idx + 1 < len(h3_matches) else len(group_md)
            cat_md = group_md[cat_start:cat_end]

            categories.append({
                "key": cat_key,
                "label": cat_label,
                "group": group_name,
            })
            category_keys.append(cat_key)

            # Parse pertanyaan dalam kategori ini
            # Section J pakai field nama berbeda
            pattern = QUESTION_J_RE if cat_key == "J" else QUESTION_RE
            for q in pattern.finditer(cat_md):
                gd = q.groupdict()
                question_obj = {
                    "id": len(questions) + 1,
                    "num_in_category": int(gd["num"]),
                    "category": cat_key,
                    "category_label": cat_label,
                    "group": group_name,
                    "ref": clean(gd.get("ref", "")),
                    "question": clean(gd.get("question", "")),
                    "intent": clean(gd.get("intent", "")),
                    "answer": clean(gd.get("answer", "")),
                    "example": clean(gd.get("example", "")) if gd.get("example") else "",
                }
                if cat_key == "J" and gd.get("risk"):
                    question_obj["risk"] = clean(gd["risk"])
                questions.append(question_obj)

        groups.append({
            "name": group_name,
            "categories": category_keys,
        })

    payload = {
        "source": str(SRC).replace("\\", "/"),
        "total": len(questions),
        "groups": groups,
        "categories": categories,
        "questions": questions,
    }
    return payload


def main() -> None:
    payload = parse()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    size_kb = OUT.stat().st_size / 1024
    print(f"Wrote: {OUT} ({size_kb:.1f} KB)")
    print(f"Groups: {len(payload['groups'])}")
    print(f"Categories: {len(payload['categories'])}")
    print(f"Questions: {payload['total']}")
    if payload["total"] > 0:
        first = payload["questions"][0]
        print(f"First Q: [{first['category']}] {first['question'][:60]}...")


if __name__ == "__main__":
    main()
