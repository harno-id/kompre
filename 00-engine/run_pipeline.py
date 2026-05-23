from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def run(label: str, script: str) -> None:
    path = ROOT / script
    print(f"\n=== {label}: {script} ===", flush=True)
    if not path.exists():
        raise FileNotFoundError(path)
    subprocess.run([sys.executable, str(path)], cwd=ROOT, check=True)


def main() -> None:
    run("Parser", "00-engine/parser/run_parser.py")
    run("Analyzer", "00-engine/analyzer/run_analyzer.py")
    run("Skill checker", "00-engine/skill-checker/run_skill_checker.py")
    run("AI interpretation", "00-engine/ai-interpretation/run_ai_interpretation.py")
    run("Database", "00-engine/database/run_database.py")
    run("Frontend static build", "00-engine/frontend/build_static_dashboard.py")
    run("Lampiran reader", "00-engine/frontend/build_lampiran.py")
    run("Q&A modal data", "00-engine/frontend/build_qa.py")
    run("Chat history (real CSV)", "00-engine/frontend/build_chat_history.py")
    print("\nPIPELINE OK", flush=True)


if __name__ == "__main__":
    main()
