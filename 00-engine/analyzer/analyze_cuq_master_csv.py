import pandas as pd, numpy as np, json, ast, math
from pathlib import Path
from scipy import stats
ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'02-data/cuq/cuq_responses_rows.csv'
OUT=ROOT/'00-engine/analyzer/output'; OUT.mkdir(parents=True, exist_ok=True)

def parse(x):
    if not isinstance(x,str): return {}
    try: return json.loads(x)
    except Exception:
        try: return ast.literal_eval(x)
        except Exception: return {}

def cronbach_alpha(df):
    arr=df.to_numpy(dtype=float)
    k=arr.shape[1]
    item_var=arr.var(axis=0, ddof=1).sum()
    total_var=arr.sum(axis=1).var(ddof=1)
    return float((k/(k-1))*(1-item_var/total_var)) if total_var else None

def valid_corrs(df):
    total=df.sum(axis=1)
    out={}
    for c in df.columns:
        rest=total-df[c]
        r,p=stats.pearsonr(df[c],rest)
        out[c]={'corrected_item_total_r':float(r),'p':float(p)}
    return out

raw=pd.read_csv(RAW)
rows=[]
for _,r in raw.iterrows():
    profil=parse(r['profil']); b=parse(r['bagian_b']); f=parse(r['cuq_formal']); g=parse(r['cuq_genz'])
    rec={'source_id':r['id'],'respondent_id_text':r['respondent_id_text'],'usia':int(profil.get('usia')) if str(profil.get('usia','')).isdigit() else None,'gender':profil.get('gender'),'jk':{'Perempuan':'P','Laki-laki':'L'}.get(profil.get('gender'),profil.get('gender')),'urutan_raw':b.get('b4'),'urutan':{'Formal → Gen-Z':'F→G','Gen-Z → Formal':'G→F'}.get(b.get('b4'),b.get('b4'))}
    for i in range(1,17): rec[f'F{i}']=int(f.get(f'q{i}')); rec[f'G{i}']=int(g.get(f'q{i}'))
    rows.append(rec)
df=pd.DataFrame(rows)
F=[f'F{i}' for i in range(1,17)]; G=[f'G{i}' for i in range(1,17)]
# CUQ score: reverse even negative items, transform 0-100
sc=df.copy()
for prefix in ['F','G']:
    for i in [2,4,6,8,10,12,14,16]: sc[f'{prefix}{i}']=6-sc[f'{prefix}{i}']
sc['formal_cuq_0_100']=(sc[F].sum(axis=1)-16)/64*100
sc['genz_cuq_0_100']=(sc[G].sum(axis=1)-16)/64*100
sc['diff_genz_minus_formal']=sc['genz_cuq_0_100']-sc['formal_cuq_0_100']

def desc(s): return {'n':int(s.count()),'mean':float(s.mean()),'sd':float(s.std(ddof=1)),'median':float(s.median()),'min':float(s.min()),'max':float(s.max())}

t=stats.ttest_rel(sc['genz_cuq_0_100'],sc['formal_cuq_0_100'])
w=stats.wilcoxon(sc['diff_genz_minus_formal'])
sh=stats.shapiro(sc['diff_genz_minus_formal'])
# order effect: compare diff by order
orders={}
for order,sub in sc.groupby('urutan'):
    orders[order]=desc(sub['diff_genz_minus_formal'])
order_vals=[v['diff_genz_minus_formal'].values for _,v in sc.groupby('urutan')]
order_test=stats.ttest_ind(order_vals[0], order_vals[1], equal_var=False) if len(order_vals)==2 else None
report={
 'source':str(RAW),'n':len(sc),'validity':{'missing_cuq_cells':int(df[F+G].isna().sum().sum()),'out_of_range_cells':int(((df[F+G]<1)|(df[F+G]>5)).sum().sum())},
 'profile':{'jk_counts':df['jk'].value_counts(dropna=False).to_dict(),'usia_counts':df['usia'].value_counts(dropna=False).sort_index().to_dict(),'urutan_counts':df['urutan'].value_counts(dropna=False).to_dict()},
 'descriptive':{'formal_cuq_0_100':desc(sc['formal_cuq_0_100']),'genz_cuq_0_100':desc(sc['genz_cuq_0_100']),'diff_genz_minus_formal':desc(sc['diff_genz_minus_formal'])},
 'reliability':{'formal_cronbach_alpha':cronbach_alpha(sc[F]),'genz_cronbach_alpha':cronbach_alpha(sc[G])},
 'validity_item_total':{'formal':valid_corrs(sc[F]),'genz':valid_corrs(sc[G])},
 'normality_diff_shapiro':{'W':float(sh.statistic),'p':float(sh.pvalue)},
 'paired_t_test':{'t':float(t.statistic),'df':len(sc)-1,'p':float(t.pvalue),'mean_diff_g_minus_f':float(sc['diff_genz_minus_formal'].mean())},
 'wilcoxon':{'statistic':float(w.statistic),'p':float(w.pvalue),'nonzero_n':int((sc['diff_genz_minus_formal']!=0).sum())},
 'effect_size':{'cohens_dz':float(sc['diff_genz_minus_formal'].mean()/sc['diff_genz_minus_formal'].std(ddof=1))},
 'order_effect':{'groups':orders,'welch_t':None if order_test is None else {'t':float(order_test.statistic),'p':float(order_test.pvalue)}},
}
sc.to_csv(OUT/'cuq_master_scored.csv',index=False,encoding='utf-8-sig')
(OUT/'cuq_statistics_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
# md summary
md=['# CUQ Statistics Report - CSV Raw Master','',f'Source: `{RAW}`',f'N: `{len(sc)}`','', '## Descriptive 0-100']
for k,v in report['descriptive'].items(): md.append(f'- {k}: mean `{v["mean"]:.4f}`, sd `{v["sd"]:.4f}`, median `{v["median"]:.4f}`, min `{v["min"]:.4f}`, max `{v["max"]:.4f}`')
md += ['', '## Tests', f'- Shapiro diff: W `{report["normality_diff_shapiro"]["W"]:.4f}`, p `{report["normality_diff_shapiro"]["p"]:.6f}`', f'- Paired t-test: t `{report["paired_t_test"]["t"]:.4f}`, df `{report["paired_t_test"]["df"]}`, p `{report["paired_t_test"]["p"]:.6f}`', f'- Wilcoxon: W `{report["wilcoxon"]["statistic"]:.4f}`, p `{report["wilcoxon"]["p"]:.6f}`', f'- Cohen dz `{report["effect_size"]["cohens_dz"]:.4f}`', '', '## Reliability', f'- Formal alpha `{report["reliability"]["formal_cronbach_alpha"]:.4f}`', f'- Gen-Z alpha `{report["reliability"]["genz_cronbach_alpha"]:.4f}`']
(OUT/'cuq_statistics_report.md').write_text('\n'.join(md),encoding='utf-8')
print(OUT/'cuq_statistics_report.md')
