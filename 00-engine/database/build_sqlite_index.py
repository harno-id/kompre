import json
import sqlite3
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
out = ROOT / "00-engine/database/output"
out.mkdir(parents=True, exist_ok=True)
db = out / f"harno_kompre_analysis_{datetime.now().strftime('%Y%m%d-%H%M%S')}.sqlite"

conn = sqlite3.connect(db)
cur = conn.cursor()
cur.execute("pragma journal_mode=off")
cur.execute("pragma temp_store=memory")
cur.execute("create table artifacts (id integer primary key, kind text, path text, summary text)")
cur.execute("create table slide_map (slide integer primary key, title text, bucket text, thesis_refs text, image_path text)")
cur.execute("create table cuq_summary (metric text primary key, value real)")

files = [
    ("parser", ROOT / "00-engine/parser/output/parse_summary.json", "Parsed DOCX/PPT manifest"),
    ("stats", ROOT / "00-engine/analyzer/output/cuq_statistics_report.json", "CSV master CUQ statistics"),
    ("skill_check", ROOT / "00-engine/skill-checker/output/skill_check_report.json", "Alignment and update-required checks"),
    ("interpretation", ROOT / "00-engine/ai-interpretation/output/ai_interpretation_report.json", "Safe claims and question bank"),
]
for kind, path, summary in files:
    cur.execute("insert into artifacts(kind,path,summary) values (?,?,?)", (kind, str(path), summary))

integ = json.loads((ROOT / "00-engine/analyzer/integration_map_report.json").read_text(encoding="utf-8"))
for item in integ["integration_map"]:
    cur.execute(
        "insert into slide_map values (?,?,?,?,?)",
        (
            item["slide"],
            item["slide_title"],
            item["section_bucket"],
            json.dumps(item["thesis_refs"], ensure_ascii=False),
            item["ppt_image"],
        ),
    )

st = json.loads((ROOT / "00-engine/analyzer/output/cuq_statistics_report.json").read_text(encoding="utf-8"))
metrics = {
    "n": st["n"],
    "formal_mean": st["descriptive"]["formal_cuq_0_100"]["mean"],
    "genz_mean": st["descriptive"]["genz_cuq_0_100"]["mean"],
    "diff_mean": st["descriptive"]["diff_genz_minus_formal"]["mean"],
    "paired_t_p": st["paired_t_test"]["p"],
    "wilcoxon_p": st["wilcoxon"]["p"],
    "cohens_dz": st["effect_size"]["cohens_dz"],
    "formal_alpha": st["reliability"]["formal_cronbach_alpha"],
    "genz_alpha": st["reliability"]["genz_cronbach_alpha"],
}
for key, value in metrics.items():
    cur.execute("insert into cuq_summary values (?,?)", (key, float(value)))

conn.commit()
conn.close()
print(db)
