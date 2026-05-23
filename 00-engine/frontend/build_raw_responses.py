"""Build raw_responses.json untuk Raw Data Explorer halaman analisis-data.

Sumber: 02-data/cuq/cuq_responses_rows.csv (CSV master final, 405 responden)

- Anonim default: nama tidak diserialkan, hanya inisial dan ID urut.
- Skor CUQ per item Q1-Q16 untuk Formal & Gen-Z.
- Total skor 0-100 per kondisi (reverse scoring item negatif + normalisasi).
- Konteks bagian B (urutan, durasi, frekuensi, media).
- Profil minimal (usia, gender, kab/kota, status, sekolah-anonim).
- Output minified ke 00-engine/frontend/output/data/raw_responses.json.
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CSV_PATH = ROOT / "02-data" / "cuq" / "cuq_responses_rows.csv"
PEND_CSV_PATH = ROOT / "PENDALAMAN" / "02-data" / "cuq" / "cuq_responses_rows.csv"
OUT_PATH = ROOT / "00-engine" / "frontend" / "output" / "data" / "raw_responses.json"

# CUQ item kelas: positif vs negatif
POSITIVE = {"q1", "q3", "q5", "q7", "q9", "q11", "q13", "q15"}
NEGATIVE = {"q2", "q4", "q6", "q8", "q10", "q12", "q14", "q16"}

# 4 klaster CUQ
CLUSTERS = {
    "Persona & Afeksi": ["q1", "q2", "q3", "q4"],
    "Kualitas Informasi": ["q5", "q6", "q11", "q12"],
    "Navigasi & Kemudahan": ["q7", "q8", "q15", "q16"],
    "Efektivitas Interaksi": ["q9", "q10", "q13", "q14"],
}


def initials(name: str) -> str:
    parts = [p for p in (name or "").split() if p]
    if not parts:
        return "??"
    if len(parts) == 1:
        return (parts[0][:2] or "??").upper()
    return "".join(p[0] for p in parts[:3]).upper()


def safe_int(value, default=None):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def parse_score(value):
    n = safe_int(value)
    if n is None:
        return None
    if n < 1 or n > 5:
        # G5=0 outlier sudah ditangani di pipeline analyzer (median 4),
        # tapi di raw kita pertahankan apa adanya untuk transparansi
        return n
    return n


def normalized_total(items_dict):
    """Hitung total skor 0-100 dari Q1..Q16 dengan reverse scoring."""
    total = 0
    count = 0
    for key, raw in items_dict.items():
        score = parse_score(raw)
        if score is None:
            continue
        if 1 <= score <= 5:
            converted = (score - 1) if key in POSITIVE else (5 - score)
        elif key == "q5" and score == 0:
            converted = 5 - 4  # imputasi median 4 untuk outlier
        else:
            continue
        total += converted
        count += 1
    if count == 0:
        return None
    # Maksimum 4 poin per item, 16 item -> 64. Skor 0-100.
    return round((total * 100) / 64, 4)


def cluster_means(items_dict):
    out = {}
    for cluster, keys in CLUSTERS.items():
        scores = []
        for key in keys:
            raw = items_dict.get(key)
            score = parse_score(raw)
            if score is None or not (1 <= score <= 5):
                continue
            converted = (score - 1) if key in POSITIVE else (5 - score)
            scores.append(converted)
        out[cluster] = round(sum(scores) / len(scores), 4) if scores else None
    return out


def parse_json_field(raw):
    if not raw:
        return {}
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {}


def build():
    csv_path = CSV_PATH if CSV_PATH.exists() else PEND_CSV_PATH
    if not csv_path.exists():
        raise SystemExit(f"CSV master tidak ditemukan: {CSV_PATH} atau {PEND_CSV_PATH}")
    print(f"Reading: {csv_path}")

    with csv_path.open(encoding="utf-8") as fh:
        rows = list(csv.DictReader(fh))

    responses = []
    for index, row in enumerate(rows, start=1):
        profil = parse_json_field(row.get("profil"))
        bagian_b = parse_json_field(row.get("bagian_b"))
        formal_items = parse_json_field(row.get("cuq_formal"))
        genz_items = parse_json_field(row.get("cuq_genz"))

        formal_total = normalized_total(formal_items)
        genz_total = normalized_total(genz_items)
        diff = None
        if formal_total is not None and genz_total is not None:
            diff = round(genz_total - formal_total, 4)

        media = bagian_b.get("b3")
        if not isinstance(media, list):
            media = [media] if media else []

        responses.append({
            "id": index,
            "rid": row.get("respondent_id_text", ""),
            "ts": row.get("created_at", ""),
            "profile": {
                "initials": initials(profil.get("nama", "")),
                "usia": safe_int(profil.get("usia")),
                "gender": profil.get("gender", ""),
                "status": profil.get("status") or "Lainnya",
                "kabkota": profil.get("kabkota", ""),
                "sekolah": profil.get("sekolah", ""),
            },
            "context": {
                "kenal_chatbot": bagian_b.get("b1", ""),
                "pernah_chatbot": bagian_b.get("b2", ""),
                "media": media,
                "order": bagian_b.get("b4", ""),
                "membantu": bagian_b.get("b5", ""),
                "durasi": bagian_b.get("b6", ""),
                "rating_membantu": bagian_b.get("b7", ""),
                "frekuensi": bagian_b.get("b8", ""),
                "rating_kepuasan": bagian_b.get("b9", ""),
            },
            "formal": {
                "items": {k: parse_score(v) for k, v in formal_items.items()},
                "total": formal_total,
                "clusters": cluster_means(formal_items),
            },
            "genz": {
                "items": {k: parse_score(v) for k, v in genz_items.items()},
                "total": genz_total,
                "clusters": cluster_means(genz_items),
            },
            "diff": diff,
        })

    # Statistik agregat untuk header explorer
    valid_formal = [r["formal"]["total"] for r in responses if r["formal"]["total"] is not None]
    valid_genz = [r["genz"]["total"] for r in responses if r["genz"]["total"] is not None]
    valid_diff = [r["diff"] for r in responses if r["diff"] is not None]

    summary = {
        "n": len(responses),
        "formal_mean": round(sum(valid_formal) / len(valid_formal), 4) if valid_formal else None,
        "genz_mean": round(sum(valid_genz) / len(valid_genz), 4) if valid_genz else None,
        "diff_mean": round(sum(valid_diff) / len(valid_diff), 4) if valid_diff else None,
    }

    payload = {
        "source": str(csv_path).replace("\\", "/"),
        "anonymized": True,
        "n": len(responses),
        "items_order": [f"q{i}" for i in range(1, 17)],
        "positive_items": sorted(POSITIVE),
        "negative_items": sorted(NEGATIVE),
        "clusters": {name: keys for name, keys in CLUSTERS.items()},
        "summary": summary,
        "responses": responses,
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    size_kb = OUT_PATH.stat().st_size / 1024
    print(f"Wrote: {OUT_PATH} ({size_kb:.1f} KB)")
    print(f"N={summary['n']}, Formal mean={summary['formal_mean']}, Gen-Z mean={summary['genz_mean']}, Diff mean={summary['diff_mean']}")


if __name__ == "__main__":
    build()
