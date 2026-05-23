from pathlib import Path
import json
ROOT=Path(r'D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE')
st=json.loads((ROOT/'00-engine/analyzer/output/cuq_statistics_report.json').read_text(encoding='utf-8'))
patch={
 'working_copy': str(sorted((ROOT/'02-data/thesis').glob('TESIS_HARNO_CSV_MASTER_UPDATE_WORKING_*.docx'), key=lambda p:p.stat().st_mtime, reverse=True)[0]),
 'policy':'Patch only working copy. Master remains unchanged.',
 'global_replacements':[
  {'old':'404 responden','new':'405 responden','scope':'abstract, method, result, appendix where referring CSV raw master'},
  {'old':'rata-rata skor CUQ chatbot formal sebesar 54,59 dan chatbot Generasi Z sebesar 54,70','new':'rata-rata skor CUQ chatbot formal sebesar 72,92 dan chatbot Generasi Z sebesar 73,50','scope':'abstract/result/conclusion'},
  {'old':'Selisih rata-rata 0,11','new':'Selisih rata-rata 0,57','scope':'abstract/result/conclusion'},
  {'old':'signifikansi 0,313','new':'signifikansi 0,157','scope':'paired t-test'},
  {'old':'Wilcoxon sebesar 0,091','new':'Wilcoxon sebesar 0,003','scope':'Wilcoxon'},
  {'old':'Cronbach’s Alpha ... 0,866 ... 0,890','new':'Cronbach’s Alpha ... 0,905 ... 0,922','scope':'reliability'},
  {'old':'Cohen’s dz sebesar 0,050','new':'Cohen’s dz sebesar 0,071','scope':'effect size'},
  {'old':'tidak signifikan Wilcoxon / H0 tidak ditolak berdasarkan Wilcoxon','new':'Wilcoxon signifikan, tetapi efek praktis sangat kecil; interpretasi tetap hati-hati','scope':'hypothesis interpretation'}
 ],
 'table_targets':[11,13,15,16,17,21,22,23,24,26],
 'paragraph_targets':[64,65,85,86,628,713,716,738,757,766,780,794,804,819,834,836,883,913,915,1125,1130,1145],
 'new_statistics':{
  'N':st['n'],
  'formal_mean':round(st['descriptive']['formal_cuq_0_100']['mean'],2),
  'formal_sd':round(st['descriptive']['formal_cuq_0_100']['sd'],2),
  'formal_median':round(st['descriptive']['formal_cuq_0_100']['median'],2),
  'formal_min':round(st['descriptive']['formal_cuq_0_100']['min'],2),
  'formal_max':round(st['descriptive']['formal_cuq_0_100']['max'],2),
  'genz_mean':round(st['descriptive']['genz_cuq_0_100']['mean'],2),
  'genz_sd':round(st['descriptive']['genz_cuq_0_100']['sd'],2),
  'genz_median':round(st['descriptive']['genz_cuq_0_100']['median'],2),
  'genz_min':round(st['descriptive']['genz_cuq_0_100']['min'],2),
  'genz_max':round(st['descriptive']['genz_cuq_0_100']['max'],2),
  'diff_mean':round(st['descriptive']['diff_genz_minus_formal']['mean'],2),
  'paired_t':round(st['paired_t_test']['t'],3),
  'paired_df':st['paired_t_test']['df'],
  'paired_p':round(st['paired_t_test']['p'],3),
  'wilcoxon_w':round(st['wilcoxon']['statistic'],3),
  'wilcoxon_p':round(st['wilcoxon']['p'],3),
  'cohens_dz':round(st['effect_size']['cohens_dz'],3),
  'formal_alpha':round(st['reliability']['formal_cronbach_alpha'],3),
  'genz_alpha':round(st['reliability']['genz_cronbach_alpha'],3),
  'shapiro_w':round(st['normality_diff_shapiro']['W'],3),
  'shapiro_p':'<0,001'
 }
}
out=ROOT/'00-engine/analyzer/output/thesis_patch_plan.json'
out.write_text(json.dumps(patch,ensure_ascii=False,indent=2),encoding='utf-8')
md=['# Thesis Patch Plan','',f"Working copy: `{patch['working_copy']}`",'', '## New Statistics']
for k,v in patch['new_statistics'].items(): md.append(f'- {k}: `{v}`')
md += ['', '## Paragraph Targets'] + [f'- P{x}' for x in patch['paragraph_targets']]
md += ['', '## Table Targets'] + [f'- Table {x}' for x in patch['table_targets']]
md += ['', '## Replacement Rules'] + [f"- `{r['old']}` → `{r['new']}` ({r['scope']})" for r in patch['global_replacements']]
mdout=ROOT/'00-engine/analyzer/output/thesis_patch_plan.md'
mdout.write_text('\n'.join(md),encoding='utf-8')
print(mdout)
