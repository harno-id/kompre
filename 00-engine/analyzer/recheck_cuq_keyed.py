import pandas as pd,json,ast
from pathlib import Path
root=Path(r'D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE')
raw=pd.read_csv(root/'02-data/cuq/cuq_responses_rows.csv')
xl=pd.read_excel(root/'02-data/cuq/CUQ Data mentah.xlsx')

def parse(x):
    try: return json.loads(x)
    except Exception: return {}
rows=[]
for _,r in raw.iterrows():
    profil=parse(r['profil']); b=parse(r['bagian_b']); f=parse(r['cuq_formal']); g=parse(r['cuq_genz'])
    rec={'Kode':int(r['respondent_id_text']),'JK':{'Perempuan':'P','Laki-laki':'L'}.get(profil.get('gender'),profil.get('gender')),'Usia':int(profil.get('usia')),'Urutan':{'Formal → Gen-Z':'F→G','Gen-Z → Formal':'G→F'}.get(b.get('b4'),b.get('b4'))}
    for i in range(1,17):
        rec[f'F{i}']=int(f[f'q{i}']); rec[f'G{i}']=int(g[f'q{i}'])
    rows.append(rec)
flat=pd.DataFrame(rows)
# key compare by Kode
merged=xl.merge(flat,on='Kode',suffixes=('_xlsx','_csv'),how='outer',indicator=True)
cols=['JK','Usia','Urutan']+[f'F{i}' for i in range(1,17)]+[f'G{i}' for i in range(1,17)]
mis=[]
for _,r in merged.iterrows():
    if r['_merge']!='both':
        mis.append({'Kode':r.get('Kode'),'merge':r['_merge']}); continue
    for c in cols:
        xv=r.get(c+'_xlsx'); cv=r.get(c+'_csv')
        if str(xv)!=str(cv):
            mis.append({'Kode':int(r['Kode']),'column':c,'xlsx':None if pd.isna(xv) else xv,'csv':None if pd.isna(cv) else cv})
invalid_xlsx=[]
for c in [f'F{i}' for i in range(1,17)]+[f'G{i}' for i in range(1,17)]:
    bad=xl[(pd.to_numeric(xl[c],errors='coerce')<1)|(pd.to_numeric(xl[c],errors='coerce')>5)|pd.to_numeric(xl[c],errors='coerce').isna()]
    for _,r in bad.iterrows(): invalid_xlsx.append({'No':int(r['No']),'Kode':int(r['Kode']),'column':c,'value':r[c]})
report={'csv_rows':len(raw),'xlsx_rows':len(xl),'csv_unique_kode':flat['Kode'].nunique(),'xlsx_unique_kode':xl['Kode'].nunique(),'merge_counts':merged['_merge'].value_counts().to_dict(),'invalid_xlsx':invalid_xlsx,'mismatch_count':len(mis),'mismatches_first200':mis[:200]}
(root/'00-engine/analyzer/cuq_csv_flattened_keyed.csv').write_text(flat.to_csv(index=False),encoding='utf-8')
out=root/'00-engine/analyzer/cuq_xlsx_csv_keyed_recheck_report.json'
out.write_text(json.dumps(report,ensure_ascii=False,indent=2,default=str),encoding='utf-8')
print(out)
print(json.dumps(report,ensure_ascii=True,indent=2,default=str)[:8000])
