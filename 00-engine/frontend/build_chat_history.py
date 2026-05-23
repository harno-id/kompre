"""Build chat history JSON dari 2 CSV chatbot real (formal & gen-z).

Sumber:
  - 02-data/cuq/chat_formal_rows (1).csv
  - 02-data/cuq/chat_genz_rows (1).csv

Struktur CSV: id, session_id, message
  message = JSON string: {"type": "human"/"ai", "content": "...", ...}

Output: 00-engine/frontend/output/data/chat_history.json
  {
    "meta": {"generated_at": "...", "total_formal_sessions": int, "total_genz_sessions": int},
    "formal": [
      {
        "session_id": "anonim_xxxxxx",
        "message_count": int,
        "first_user_text": str,
        "started_label": str,
        "messages": [{"role": "human"|"ai", "content": str, "snippet": str}]
      }, ...
    ],
    "genz": [...]
  }

Privasi:
  session_id WhatsApp (xxx@lid) -> hash sha1 6 char hex prefix
"""

from __future__ import annotations

import csv
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "02-data" / "cuq"
OUTPUT_PATH = ROOT / "00-engine" / "frontend" / "output" / "data" / "chat_history.json"

FORMAL_CSV = DATA_DIR / "chat_formal_rows (1).csv"
GENZ_CSV = DATA_DIR / "chat_genz_rows (1).csv"

# Pastikan field besar tetap bisa dibaca csv.reader
csv.field_size_limit(min(sys.maxsize, 2**31 - 1))


def hash_session(session_id: str) -> str:
    """Anonimkan session id WhatsApp (xxx@lid) -> 6 char hex stable."""
    digest = hashlib.sha1(session_id.encode("utf-8")).hexdigest()
    return digest[:6].upper()


def safe_json(raw: str) -> Dict[str, Any] | None:
    if not raw:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None


def shorten(text: str, limit: int = 140) -> str:
    text = (text or "").strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "\u2026"


def load_csv_grouped(path: Path) -> Dict[str, List[Dict[str, Any]]]:
    """Baca CSV -> dict[session_id] = list[message dict {role, content}]."""
    grouped: Dict[str, List[Dict[str, Any]]] = {}
    if not path.exists():
        print(f"[warn] file tidak ditemukan: {path}", file=sys.stderr)
        return grouped
    with path.open("r", encoding="utf-8", newline="") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            session_id = (row.get("session_id") or "").strip()
            payload = safe_json(row.get("message") or "")
            if not session_id or payload is None:
                continue
            role = payload.get("type") or "unknown"
            if role not in {"human", "ai"}:
                continue
            content = (payload.get("content") or "").strip()
            if not content:
                continue
            grouped.setdefault(session_id, []).append({
                "role": role,
                "content": content,
                "snippet": shorten(content, 200),
            })
    return grouped


def build_sessions(grouped: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    """Konversi dict session -> list session terurut by jumlah pesan terbanyak."""
    sessions: List[Dict[str, Any]] = []
    for raw_id, messages in grouped.items():
        if not messages:
            continue
        first_user = next((m["content"] for m in messages if m["role"] == "human"), "")
        sessions.append({
            "session_id": f"S-{hash_session(raw_id)}",
            "raw_session_hash": hash_session(raw_id),
            "message_count": len(messages),
            "human_count": sum(1 for m in messages if m["role"] == "human"),
            "ai_count": sum(1 for m in messages if m["role"] == "ai"),
            "first_user_text": shorten(first_user, 110) or "(tidak ada pertanyaan teks)",
            "messages": messages,
        })
    sessions.sort(key=lambda s: (-s["message_count"], s["session_id"]))
    return sessions


def main() -> int:
    formal_grouped = load_csv_grouped(FORMAL_CSV)
    genz_grouped = load_csv_grouped(GENZ_CSV)

    formal_sessions = build_sessions(formal_grouped)
    genz_sessions = build_sessions(genz_grouped)

    output = {
        "meta": {
            "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "source": {
                "formal": str(FORMAL_CSV.relative_to(ROOT)),
                "genz": str(GENZ_CSV.relative_to(ROOT)),
            },
            "total_formal_sessions": len(formal_sessions),
            "total_genz_sessions": len(genz_sessions),
            "total_formal_messages": sum(s["message_count"] for s in formal_sessions),
            "total_genz_messages": sum(s["message_count"] for s in genz_sessions),
            "anonymization": "session_id di-hash sha1 6 char (S-XXXXXX)",
        },
        "formal": formal_sessions,
        "genz": genz_sessions,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")

    print("[ok] chat history dibuat:")
    print(f"     {OUTPUT_PATH}")
    print(f"     formal: {len(formal_sessions)} sesi / {output['meta']['total_formal_messages']} pesan")
    print(f"     gen-z : {len(genz_sessions)} sesi / {output['meta']['total_genz_messages']} pesan")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
