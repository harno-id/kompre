from pathlib import Path
from docx import Document
import json, datetime
ROOT=Path(r'D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE')
work=sorted((ROOT/'02-data/thesis').glob('TESIS_HARNO_CSV_MASTER_UPDATE_WORKING_*.docx'), key=lambda p:p.stat().st_mtime, reverse=True)[0]
doc=Document(work)
fixes={
86:'The results show that the average CUQ score for the formal chatbot was 72.92, while the Generation Z chatbot obtained 73.50. The mean difference of 0.57 indicates a very small difference. The paired sample t-test showed a significance value of 0.157, while the Wilcoxon test showed a significance value of 0.003. Therefore, the nonparametric test indicates a statistically significant difference, but the effect size is very small; consequently, the practical interpretation must remain cautious.',
713:'Sebelum memasuki tahap analisis inti, dilakukan proses pembersihan data (data cleaning) dan validasi terhadap respons yang masuk. Data mentah CSV mencatat 405 entri responden. Seluruh responden menyelesaikan interaksi dengan dua kondisi chatbot (Formal dan Gen-Z) dan mengisi kuesioner CUQ secara lengkap. Pemeriksaan rentang skala menunjukkan seluruh nilai CUQ berada dalam rentang valid 1–5, sehingga CSV digunakan sebagai raw master analisis.',
834:'Rumusan masalah kedua menanyakan apakah terdapat perbedaan tingkat usabilitas (skor CUQ) antara chatbot formal dan chatbot Generasi Z. Hasil paired sample t-test menunjukkan Sig. = 0,157, sedangkan uji Wilcoxon signed-rank sebagai uji utama karena distribusi selisih tidak normal menunjukkan Sig. = 0,003. Dengan demikian, paired sample t-test tidak menunjukkan perbedaan rata-rata yang signifikan, tetapi Wilcoxon menunjukkan perbedaan secara nonparametrik. Karena ukuran efek sangat kecil, hasil tersebut harus ditafsirkan hati-hati dan tidak cukup untuk menyatakan keunggulan praktis yang kuat.',
883:'Analisis data terhadap 405 responden menunjukkan bahwa skor CUQ chatbot formal dan chatbot Generasi Z relatif setara secara praktis. Rata-rata skor formal sebesar 72,92 dan Gen-Z sebesar 73,50, dengan selisih 0,57 poin. Paired sample t-test tidak signifikan, sedangkan Wilcoxon signifikan; namun ukuran efek sangat kecil. Temuan ini menjadi dasar bagi perumusan simpulan dan rekomendasi strategis yang lebih hati-hati pada bab selanjutnya.'
}
log=[]
for idx,new in fixes.items():
    p=doc.paragraphs[idx-1]
    before=p.text
    for r in p.runs: r.text=''
    if p.runs: p.runs[0].text=new
    else: p.add_run(new)
    log.append({'paragraph':idx,'before':before,'after':new})
doc.save(work)
out=ROOT/'00-engine/analyzer/output/thesis_patch_consistency_fix_log.json'
out.write_text(json.dumps({'file':str(work),'timestamp':datetime.datetime.now().isoformat(),'changes':log},ensure_ascii=False,indent=2),encoding='utf-8')
md=['# Thesis Patch Consistency Fix Log','',f'File: `{work}`','']
for x in log:
    md += [f"## P{x['paragraph']}",'**Before:**',x['before'],'','**After:**',x['after'],'']
mdout=ROOT/'00-engine/analyzer/output/thesis_patch_consistency_fix_log.md'
mdout.write_text('\n'.join(md),encoding='utf-8')
print(mdout)
