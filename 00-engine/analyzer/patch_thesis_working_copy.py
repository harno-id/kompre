from pathlib import Path
from docx import Document
import json, re, datetime
ROOT=Path(r'D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE')
work=sorted((ROOT/'02-data/thesis').glob('TESIS_HARNO_CSV_MASTER_UPDATE_WORKING_*.docx'), key=lambda p:p.stat().st_mtime, reverse=True)[0]
doc=Document(work)
log=[]

def replace_text_in_paragraph(p, replacements, loc):
    original=p.text
    new=original
    for old, rep in replacements:
        new=new.replace(old, rep)
    if new!=original:
        # preserve simple paragraph style by replacing runs with one run
        for r in p.runs:
            r.text=''
        if p.runs:
            p.runs[0].text=new
        else:
            p.add_run(new)
        log.append({'location':loc,'type':'paragraph','before':original,'after':new})

repls=[
('404 orang Generasi Z','405 orang Generasi Z'),
('404 Generation Z individuals','405 Generation Z individuals'),
('404 responden','405 responden'),
('404 entri responden','405 entri responden'),
('Jumlah sampel akhir yang dianalisis adalah 404','Jumlah sampel akhir yang dianalisis adalah 405'),
('dataset mentah CUQ 404 responden','dataset mentah CUQ 405 responden'),
('dataset mentah 404 responden','dataset mentah 405 responden'),
('N=404','N=405'),
('N = 404','N = 405'),
('df = 403','df = 404'),
('t(403) = 1,010','t(404) = 1,418'),
('t(403) = 1.010','t(404) = 1.418'),
('t = 1,010','t = 1,418'),
('1,010','1,418'),
('0,313','0,157'),
('0.313','0.157'),
('0,091','0,003'),
('0.091','0.003'),
('0,050','0,070'),
('0.050','0.070'),
('0,866','0,905'),
('0.866','0.905'),
('0,890','0,922'),
('0.890','0.922'),
('54,59','72,92'),
('54.59','72.92'),
('54,70','73,50'),
('54.70','73.50'),
('0,11','0,57'),
('0.11','0.57'),
('0.108','0.571'),
('6,59','16,95'),
('6.59','16.95'),
('7,21','18,50'),
('7.21','18.50'),
('W = 0,337','W = 0,836'),
('W = 0.337','W = 0.836'),
('tidak terdapat perbedaan signifikan antara usabilitas chatbot bergaya bahasa formal dan chatbot bergaya bahasa Generasi Z','terdapat perbedaan signifikan berdasarkan uji Wilcoxon, tetapi besaran efeknya sangat kecil sehingga interpretasi praktis tetap harus hati-hati antara chatbot bergaya bahasa formal dan chatbot bergaya bahasa Generasi Z'),
('tidak terdapat perbedaan rata-rata yang signifikan antara skor CUQ chatbot formal dan chatbot Generasi Z. Karena asumsi normalitas tidak terpenuhi, hasil Wilcoxon signed-rank test digunakan sebagai acuan utama. Uji Wilcoxon juga menunjukkan Sig. = 0,003, sehingga H0 tidak ditolak.','tidak terdapat perbedaan rata-rata yang signifikan berdasarkan paired sample t-test antara skor CUQ chatbot formal dan chatbot Generasi Z. Karena asumsi normalitas tidak terpenuhi, hasil Wilcoxon signed-rank test digunakan sebagai acuan utama. Uji Wilcoxon menunjukkan Sig. = 0,003, sehingga terdapat perbedaan secara nonparametrik. Namun, besaran efek yang sangat kecil membuat interpretasi praktis tetap hati-hati.'),
('Kedua uji menunjukkan hasil tidak signifikan.','Paired sample t-test tidak signifikan, sedangkan Wilcoxon signed-rank test signifikan. Perbedaan ini ditafsirkan hati-hati karena ukuran efek sangat kecil.'),
('H0 tidak ditolak dan H1 tidak didukung oleh data.','H0 tidak ditolak berdasarkan paired sample t-test, tetapi ditolak berdasarkan Wilcoxon signed-rank test. Karena ukuran efek sangat kecil, H1 didukung secara statistik nonparametrik namun lemah secara praktis.'),
('tidak terdapat perbedaan\rata-rata yang signifikan','tidak terdapat perbedaan rata-rata yang signifikan')
]

for i,p in enumerate(doc.paragraphs,1):
    replace_text_in_paragraph(p,repls,f'P{i}')

for ti,t in enumerate(doc.tables,1):
    for ri,row in enumerate(t.rows,1):
        for ci,cell in enumerate(row.cells,1):
            for pi,p in enumerate(cell.paragraphs,1):
                replace_text_in_paragraph(p,repls,f'T{ti}R{ri}C{ci}P{pi}')

# targeted table row rewrites for clearer labels/decisions after basic replacement
for ti,t in enumerate(doc.tables,1):
    # table 13 / 22 descriptive stats recognizable
    headers=' | '.join(c.text.strip() for c in t.rows[0].cells) if t.rows else ''
    if 'Indikator Statistik' in headers or 'Indikator' in headers and 'Formal' in headers and 'Gen-Z' in headers:
        for row in t.rows[1:]:
            label=row.cells[0].text.strip().lower() if row.cells else ''
            vals=None
            if label in ['n']:
                vals=['N','405','405']
            elif 'mean' in label or 'rata' in label:
                vals=[row.cells[0].text.strip(),'72,92','73,50']
            elif label in ['sd','standar deviasi'] or 'deviasi' in label:
                vals=[row.cells[0].text.strip(),'16,95','18,50']
            elif 'median' in label:
                vals=[row.cells[0].text.strip(),'75,00','76,56']
            elif 'minimum' in label or label=='min':
                vals=[row.cells[0].text.strip(),'20,31','20,31']
            elif 'maksimum' in label or label=='max':
                vals=[row.cells[0].text.strip(),'100,00','100,00']
            if vals and len(row.cells)>=3:
                before=[c.text for c in row.cells[:3]]
                for c,v in zip(row.cells[:3],vals): c.text=v
                log.append({'location':f'Table {ti}','type':'table-row','before':before,'after':vals})
    # reliability table
    if 'Cronbach' in headers or any('Cronbach' in c.text for r in t.rows for c in r.cells):
        for row in t.rows[1:]:
            txt=' '.join(c.text for c in row.cells)
            before=[c.text for c in row.cells]
            if 'Formal' in txt and len(row.cells)>=3:
                row.cells[2].text='0,905'
            if ('Gen-Z' in txt or 'Generasi Z' in txt) and len(row.cells)>=3:
                row.cells[2].text='0,922'
            after=[c.text for c in row.cells]
            if before!=after: log.append({'location':f'Table {ti}','type':'reliability-row','before':before,'after':after})
    # test table
    if 'Paired sample t-test' in ' '.join(c.text for r in t.rows for c in r.cells) or 'Wilcoxon' in ' '.join(c.text for r in t.rows for c in r.cells):
        for row in t.rows[1:]:
            txt=' '.join(c.text for c in row.cells)
            before=[c.text for c in row.cells]
            if 'Paired' in txt and len(row.cells)>=6:
                row.cells[1].text='t = 1,418' if 't =' in before[1] else '1,418'
                row.cells[2].text='df = 404' if 'df' in before[2] else '404'
                row.cells[3].text='0,57'
                row.cells[4].text='0,157'
                row.cells[5].text='Tidak signifikan'
            if 'Wilcoxon' in txt and len(row.cells)>=6:
                row.cells[1].text='W = 16453,5' if 'W' in before[1] else '16453,5'
                row.cells[2].text='N nonzero = 331' if 'nonzero' in before[2].lower() else before[2]
                row.cells[3].text='0,00'
                row.cells[4].text='0,003'
                row.cells[5].text='Signifikan; efek sangat kecil'
            after=[c.text for c in row.cells]
            if before!=after: log.append({'location':f'Table {ti}','type':'test-row','before':before,'after':after})

# save and logs
doc.save(work)
outdir=ROOT/'00-engine/analyzer/output'
logfile=outdir/'thesis_patch_change_log.json'
logfile.write_text(json.dumps({'patched_file':str(work),'timestamp':datetime.datetime.now().isoformat(),'change_count':len(log),'changes':log},ensure_ascii=False,indent=2),encoding='utf-8')
md=['# Thesis Patch Change Log','',f'Patched file: `{work}`',f'Change count: `{len(log)}`','']
for n,ch in enumerate(log,1):
    md.append(f"## {n}. {ch['location']} ({ch['type']})")
    md.append('**Before:**')
    md.append(str(ch['before']))
    md.append('')
    md.append('**After:**')
    md.append(str(ch['after']))
    md.append('')
mdfile=outdir/'thesis_patch_change_log.md'
mdfile.write_text('\n'.join(md),encoding='utf-8')
print(work)
print(mdfile)
print(len(log))
