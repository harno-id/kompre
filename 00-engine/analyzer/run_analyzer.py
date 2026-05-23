from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def main() -> None:
    scripts = [
        "00-engine/analyzer/analyze_cuq_master_csv.py",
        "00-engine/analyzer/build_integration_map.py",
        "00-engine/analyzer/build_pipeline_final_report.py",
    ]
    for script in scripts:
        print(f"Running {script}", flush=True)
        subprocess.run([sys.executable, str(ROOT / script)], cwd=ROOT, check=True)


if __name__ == "__main__":
    main()
