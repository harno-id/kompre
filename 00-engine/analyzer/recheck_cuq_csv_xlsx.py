import pandas as pd, json, ast
from pathlib import Path
root=Path(r'D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE')
csv=root/'02-data/cuq/cuq_responses_rows.csv'
xlsx=root/'02-data/cuq/CUQ Data mentah.xlsx'
raw=pd.read_csv(csv)
xl=pd.read_excel(xlsx)

def parse_cell(x):
    if not isinstance(x,str): return {}
    for fn in (json.loads, ast.literal_eval):
        try:
            v=fn(x)
            return v if isinstance(v,dict) else {}
        except Exception: pass
    return {}

def get_num(d, names, pos=None):
    for n in names:
        if n in d: return pd.to_numeric(d[n], errors='coerce')
    vals=list(d.values())
    if pos is not None and len(vals)>pos: return pd.to_numeric(vals[pos], errors='coerce')
    return None

rows=[]
for i,r in raw.iterrows():
    profil=parse_cell(r.get('profil'))
    bagian=parse_cell(r.get('bagian_b'))
    f=parse_cell(r.get('cuq_formal'))
    g=parse_cell(r.get('cuq_genz'))
    rec={'csv_row':i+2,'id':r.get('id'),'respondent_id_text':r.get('respondent_id_text')}
    # metadata best effort
    rec['JK']=get_num(profil,['JK','jk','jenis_kelamin']) or profil.get('JK') or profil.get('jk')
    rec['Usia']=get_num(profil,['Usia','usia']) or profil.get('Usia') or profil.get('usia')
    rec['Urutan']=bagian.get('Urutan') or bagian.get('urutan') or bagian.get('order') or profil.get('Urutan') or profil.get('urutan')
    for n in range(1,17):
        rec[f'F{n}']=get_num(f,[f'F{n}',f'f{n}',f'Q{n}',f'q{n}',str(n)], n-1)
        rec[f'G{n}']=get_num(g,[f'G{n}',f'g{n}',f'Q{n}',f'q{n}',str(n)], n-1)
    rows.append(rec)
flat=pd.DataFrame(rows)
out_csv=root/'00-engine/analyzer/cuq_csv_flattened_recheck.csv'
flat.to_csv(out_csv,index=False,encoding='utf-8-sig')
# compare only CUQ values by row order after dropping likely extra blank/header issues
cols=[f'F{i}' for i in range(1,17)]+[f'G{i}' for i in range(1,17)]
comp=[]
for c in cols:
    a=pd.to_numeric(flat[c], errors='coerce').reset_index(drop=True)
    b=pd.to_numeric(xl[c], errors='coerce').reset_index(drop=True)
    n=min(len(a),len(b))
    diff=(a.iloc[:n] != b.iloc[:n]) & ~(a.iloc[:n].isna() & b.iloc[:n].isna())
    if diff.any():
        for idx in diff[diff].index.tolist()[:20]:
            comp.append({'row_1based_data':int(idx+1),'column':c,'csv_value':None if pd.isna(a.iloc[idx]) else float(a.iloc[idx]),'xlsx_value':None if pd.isna(b.iloc[idx]) else float(b.iloc[idx]),'xlsx_No':xl.loc[idx,'No'] if 'No' in xl else None,'xlsx_Kode':xl.loc[idx,'Kode'] if 'Kode' in xl else None})
invalid_csv={c:int(((pd.to_numeric(flat[c],errors='coerce')<1)|(pd.to_numeric(flat[c],errors='coerce')>5)|pd.to_numeric(flat[c],errors='coerce').isna()).sum()) for c in cols}
invalid_xlsx={c:int(((pd.to_numeric(xl[c],errors='coerce')<1)|(pd.to_numeric(xl[c],errors='coerce')>5)|pd.to_numeric(xl[c],errors='coerce').isna()).sum()) for c in cols}
report={'csv_rows':len(raw),'xlsx_rows':len(xl),'flat_rows':len(flat),'flattened_csv':str(out_csv),'invalid_csv':{k:v for k,v in invalid_csv.items() if v},'invalid_xlsx':{k:v for k,v in invalid_xlsx.items() if v},'mismatch_count_first20_each_col':len(comp),'mismatches':comp[:200]}
out=root/'00-engine/analyzer/cuq_xlsx_csv_recheck_report.json'
out.write_text(json.dumps(report,ensure_ascii=False,indent=2,default=str),encoding='utf-8')
print(out)
print(json.dumps(report,ensure_ascii=True,indent=2,default=str)[:5000])
