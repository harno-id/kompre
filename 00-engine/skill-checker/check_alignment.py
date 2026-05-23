import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
parser=ROOT/'00-engine/parser/output'
analyzer=ROOT/'00-engine/analyzer/output'
outdir=ROOT/'00-engine/skill-checker/output'; outdir.mkdir(parents=True,exist_ok=True)
th=json.loads((parser/'thesis_parsed.json').read_text(encoding='utf-8'))
pap=json.loads((parser/'paparan_parsed.json').read_text(encoding='utf-8'))
stats=json.loads((analyzer/'cuq_statistics_report.json').read_text(encoding='utf-8'))
heads=[b for b in th['blocks'] if b.get('style') and 'Heading' in b['style']]
required=['I. PENDAHULUAN','II. TINJAUAN PUSTAKA','III. METODE PENELITIAN','IV. HASIL DAN PEMBAHASAN','V. SIMPULAN DAN SARAN']
checks=[]
texts='\n'.join(b['text'] for b in th['blocks'])
for r in required: checks.append({'check':f'Heading {r}','status':'PASS' if r in texts else 'FAIL'})
for term in ['Rumusan Masalah','Tujuan Penelitian','Instrumen Penelitian','Uji Reliabilitas','Uji Validitas','Uji Normalitas','Effect Size','Order Effect','Simpulan']:
    checks.append({'check':f'Coverage {term}','status':'PASS' if term.lower() in texts.lower() else 'WARN'})
# compare thesis reported key numbers versus recalculated CSV master, by simple text search
expected=[('N 405 / CSV master', str(stats['n'])),('Formal mean 72.92', f"{stats['descriptive']['formal_cuq_0_100']['mean']:.2f}"),('GenZ mean 73.50', f"{stats['descriptive']['genz_cuq_0_100']['mean']:.2f}"),('paired p 0.157', f"{stats['paired_t_test']['p']:.3f}"),('wilcoxon p 0.003', f"{stats['wilcoxon']['p']:.3f}")]
for label,val in expected:
    checks.append({'check':f'Stat value present: {label}','status':'PASS' if val.replace('.',',') in texts or val in texts else 'UPDATE_REQUIRED','value':val})
slides=len([b for b in pap['blocks'] if re.match(r'^Slide\s+\d+', b['text'])])
checks.append({'check':'Paparan slide count 15','status':'PASS' if slides==15 else 'FAIL','value':slides})
summary={'checks':checks,'pass':sum(c['status']=='PASS' for c in checks),'warn':sum(c['status']=='WARN' for c in checks),'update_required':sum(c['status']=='UPDATE_REQUIRED' for c in checks),'fail':sum(c['status']=='FAIL' for c in checks)}
(outdir/'skill_check_report.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
md=['# Skill Check Report','',f"PASS: {summary['pass']}",f"WARN: {summary['warn']}",f"UPDATE_REQUIRED: {summary['update_required']}",f"FAIL: {summary['fail']}",'']
for c in checks: md.append(f"- **{c['status']}** — {c['check']}" + (f" (`{c.get('value')}`)" if 'value' in c else ''))
(outdir/'skill_check_report.md').write_text('\n'.join(md),encoding='utf-8')
print(outdir/'skill_check_report.md')
