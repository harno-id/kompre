import pandas as pd, json, ast
from pathlib import Path
csv=Path(r'D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE\02-data\cuq\cuq_responses_rows.csv')
df=pd.read_csv(csv)
records=[]
for idx,row in df.iterrows():
    raw=row.get('cuq_genz')
    parsed=None
    try:
        parsed=json.loads(raw) if isinstance(raw,str) else raw
    except Exception:
        try: parsed=ast.literal_eval(raw)
        except Exception as e: parsed={'_parse_error':str(e),'_raw':raw}
    val=None
    if isinstance(parsed, dict):
        for key in ['G5','g5','5','Q5','q5']:
            if key in parsed: val=parsed[key]; break
        if val is None:
            # maybe list
            vals=list(parsed.values())
            if len(vals)>=5: val=vals[4]
    elif isinstance(parsed, list) and len(parsed)>=5:
        val=parsed[4]
    num=pd.to_numeric(pd.Series([val]), errors='coerce').iloc[0]
    if pd.isna(num) or num<1 or num>5:
        records.append({'csv_index':int(idx),'id':row.get('id'),'respondent_id_text':row.get('respondent_id_text'),'profil':row.get('profil'),'bagian_b':row.get('bagian_b'),'G5_extracted':None if pd.isna(num) else float(num),'cuq_genz':raw})
out={'source':str(csv),'rows':len(df),'invalid_G5_count':len(records),'invalid_G5_rows':records}
path=Path(r'D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE\00-engine\analyzer\cuq_invalid_g5_audit.json')
path.write_text(json.dumps(out,ensure_ascii=False,indent=2,default=str),encoding='utf-8')
print(path)
for r in records: print(json.dumps(r,ensure_ascii=True)[:1000])
