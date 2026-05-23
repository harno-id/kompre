from pathlib import Path
from docx import Document
import json, datetime
ROOT=Path(r'D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE')
work=sorted((ROOT/'02-data/thesis').glob('TESIS_HARNO_CSV_MASTER_UPDATE_WORKING_*.docx'), key=lambda p:p.stat().st_mtime, reverse=True)[0]
doc=Document(work)
t=doc.tables[20]
row=t.rows[2]
before=[c.text for c in row.cells]
row.cells[0].text='Pemeriksaan rentang skala CUQ'
row.cells[1].text='Tidak ditemukan nilai di luar rentang pada CSV raw master; seluruh nilai CUQ valid 1–5'
after=[c.text for c in row.cells]
doc.save(work)
out=ROOT/'00-engine/analyzer/output/final_lock_minor_fix_log.json'
out.write_text(json.dumps({'file':str(work),'timestamp':datetime.datetime.now().isoformat(),'change':{'location':'T21R3','before':before,'after':after}},ensure_ascii=False,indent=2),encoding='utf-8')
print(out)
