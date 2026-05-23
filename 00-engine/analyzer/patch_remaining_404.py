from pathlib import Path
from docx import Document
import json, datetime
ROOT=Path(r'D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE')
work=sorted((ROOT/'02-data/thesis').glob('TESIS_HARNO_CSV_MASTER_UPDATE_WORKING_*.docx'), key=lambda p:p.stat().st_mtime, reverse=True)[0]
doc=Document(work)
log=[]
# fix paragraph 1130 legacy XLSX correction narrative
p=doc.paragraphs[1129]
before=p.text
after='Berdasarkan pemeriksaan data mentah CSV, seluruh nilai CUQ berada dalam rentang skala Likert 1–5 dan tidak ditemukan nilai di luar rentang pada item utama. Karena itu, CSV digunakan sebagai raw master analisis. Proses skoring dilakukan setelah item negatif dibalik, kemudian skor total dinormalisasi ke rentang 0–100.'
for r in p.runs: r.text=''
p.runs[0].text=after if p.runs else ''
if not p.runs: p.add_run(after)
log.append({'location':'P1130','before':before,'after':after})
# fix tables where 404 means respondent count, keep df only
for ti in [11,21]:
    t=doc.tables[ti-1]
    for ri,row in enumerate(t.rows,1):
        for ci,cell in enumerate(row.cells,1):
            if cell.text.strip()=='404':
                before=cell.text; cell.text='405'; log.append({'location':f'T{ti}R{ri}C{ci}','before':before,'after':'405'})
# Table 26: row 2 col 3 is df? keep if paired row; no patch
# But audit showed T26R2C3 404 likely df no prefix, keep.
# Table 11 three cells are data count, patch done above.
doc.save(work)
out=ROOT/'00-engine/analyzer/output/patch_404_followup_log.json'
out.write_text(json.dumps({'file':str(work),'timestamp':datetime.datetime.now().isoformat(),'changes':log},ensure_ascii=False,indent=2),encoding='utf-8')
md=['# Patch 404 Follow-up Log','',f'File: `{work}`','']
for x in log: md += [f"## {x['location']}",'**Before:**',str(x['before']),'','**After:**',str(x['after']),'']
mdout=ROOT/'00-engine/analyzer/output/patch_404_followup_log.md'
mdout.write_text('\n'.join(md),encoding='utf-8')
print(mdout)
