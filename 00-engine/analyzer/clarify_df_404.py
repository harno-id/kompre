from pathlib import Path
from docx import Document
import json, datetime
ROOT=Path(r'D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE')
work=sorted((ROOT/'02-data/thesis').glob('TESIS_HARNO_CSV_MASTER_UPDATE_WORKING_*.docx'), key=lambda p:p.stat().st_mtime, reverse=True)[0]
doc=Document(work)
log=[]
t=doc.tables[25]
cell=t.rows[1].cells[2]
before=cell.text
if before.strip()=='404':
    cell.text='df = 404'
    log.append({'location':'T26R2C3','before':before,'after':'df = 404','reason':'Clarify remaining 404 is degrees of freedom, not respondent count.'})
doc.save(work)
out=ROOT/'00-engine/analyzer/output/clarify_df_404_log.json'
out.write_text(json.dumps({'file':str(work),'timestamp':datetime.datetime.now().isoformat(),'changes':log},ensure_ascii=False,indent=2),encoding='utf-8')
print(out)
