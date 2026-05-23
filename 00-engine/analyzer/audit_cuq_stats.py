import pandas as pd, numpy as np, json
from pathlib import Path
from scipy import stats
path=Path(r'd:\DATA\TESIS\KOMPRE\HARNO-KOMPRE\02-data\cuq\CUQ Data mentah.xlsx')
df=pd.read_excel(path)
F=[f'F{i}' for i in range(1,17)]; G=[f'G{i}' for i in range(1,17)]
# reverse negative CUQ even items? produce raw mean and 0-100 transformed with evens reversed
neg=[f'{p}{i}' for p in ['F','G'] for i in [2,4,6,8,10,12,14,16]]
dfr=df.copy()
for c in neg: dfr[c]=6-dfr[c]
df['F_raw_mean']=df[F].mean(axis=1); df['G_raw_mean']=df[G].mean(axis=1)
dfr['F_cuq_0_100']=(dfr[F].sum(axis=1)-16)/64*100
dfr['G_cuq_0_100']=(dfr[G].sum(axis=1)-16)/64*100
diff=dfr['G_cuq_0_100']-dfr['F_cuq_0_100']
res={
 'n_rows':len(df), 'columns':list(df.columns[:37]),
 'missing_total':int(df[F+G].isna().sum().sum()),
 'out_of_range_cells': int(((df[F+G] < 1) | (df[F+G] > 5)).sum().sum()),
 'out_of_range_by_col': {c:int(((df[c]<1)|(df[c]>5)).sum()) for c in F+G if int(((df[c]<1)|(df[c]>5)).sum())},
 'jk_counts': df['JK'].value_counts(dropna=False).to_dict(),
 'usia_counts': df['Usia'].value_counts(dropna=False).sort_index().to_dict(),
 'urutan_counts': df['Urutan'].value_counts(dropna=False).to_dict(),
 'formal_cuq': {'mean':float(dfr['F_cuq_0_100'].mean()), 'sd':float(dfr['F_cuq_0_100'].std(ddof=1)), 'median':float(dfr['F_cuq_0_100'].median()), 'min':float(dfr['F_cuq_0_100'].min()), 'max':float(dfr['F_cuq_0_100'].max())},
 'genz_cuq': {'mean':float(dfr['G_cuq_0_100'].mean()), 'sd':float(dfr['G_cuq_0_100'].std(ddof=1)), 'median':float(dfr['G_cuq_0_100'].median()), 'min':float(dfr['G_cuq_0_100'].min()), 'max':float(dfr['G_cuq_0_100'].max())},
 'difference_g_minus_f': {'mean':float(diff.mean()), 'sd':float(diff.std(ddof=1)), 'median':float(diff.median()), 'min':float(diff.min()), 'max':float(diff.max())},
}
t=stats.ttest_rel(dfr['G_cuq_0_100'], dfr['F_cuq_0_100'])
w=stats.wilcoxon(diff)
res['paired_t']={'t':float(t.statistic),'p':float(t.pvalue),'df':len(df)-1}
res['wilcoxon']={'statistic':float(w.statistic),'p':float(w.pvalue),'nonzero_n':int((diff!=0).sum())}
res['cohens_dz']=float(diff.mean()/diff.std(ddof=1))
out=Path(r'd:\DATA\TESIS\KOMPRE\HARNO-KOMPRE\00-engine\analyzer\cuq_quick_audit.json')
out.write_text(json.dumps(res,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(res,ensure_ascii=False,indent=2))
