from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[2]
files=[
 ROOT/'00-engine/parser/output/parse_summary.json',
 ROOT/'00-engine/analyzer/output/cuq_statistics_report.md',
 ROOT/'00-engine/skill-checker/output/skill_check_report.md',
 ROOT/'00-engine/ai-interpretation/output/ai_interpretation_report.md',
 ROOT/'00-engine/database/output/harno_kompre_analysis.sqlite',
 ROOT/'00-engine/frontend/output/index.html'
]
missing=[str(f) for f in files if not f.exists()]
st=json.loads((ROOT/'00-engine/analyzer/output/cuq_statistics_report.json').read_text(encoding='utf-8'))
md=f'''# Pipeline Final Report

## Status
- Missing outputs: `{len(missing)}`
- CSV raw master: `02-data/cuq/cuq_responses_rows.csv`
- Thesis update policy: copy master first, then update statistics.

## Key CSV Master Statistics
- N: `{st['n']}`
- Formal CUQ mean: `{st['descriptive']['formal_cuq_0_100']['mean']:.4f}`
- Gen-Z CUQ mean: `{st['descriptive']['genz_cuq_0_100']['mean']:.4f}`
- Difference mean (G-F): `{st['descriptive']['diff_genz_minus_formal']['mean']:.4f}`
- Paired t-test p: `{st['paired_t_test']['p']:.6f}`
- Wilcoxon p: `{st['wilcoxon']['p']:.6f}`
- Cohen dz: `{st['effect_size']['cohens_dz']:.4f}`
- Formal alpha: `{st['reliability']['formal_cronbach_alpha']:.4f}`
- Gen-Z alpha: `{st['reliability']['genz_cronbach_alpha']:.4f}`

## Outputs
''' + '\n'.join(f'- `{f.relative_to(ROOT)}`' for f in files) + ('\n\n## Missing\n'+'\n'.join(missing) if missing else '\n')
out=ROOT/'00-engine/analyzer/output/pipeline_final_report.md'
out.write_text(md,encoding='utf-8')
print(out)
