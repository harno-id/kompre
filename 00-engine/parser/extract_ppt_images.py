from pathlib import Path
import fitz, json
pdf=Path(r'D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE\00-engine\parser\ppt_render\PPT KOMPRE-HARNO.pdf')
outdir=pdf.parent/'slides_png'
outdir.mkdir(exist_ok=True)
doc=fitz.open(pdf)
slides=[]
for i,page in enumerate(doc,1):
    pix=page.get_pixmap(matrix=fitz.Matrix(2,2), alpha=False)
    img=outdir/f'slide_{i:02d}.png'
    pix.save(img)
    text=page.get_text('text').strip()
    slides.append({'slide':i,'image':str(img),'pdf_text_chars':len(text),'pdf_text':text[:1000]})
report={'pdf':str(pdf),'slides':len(doc),'slides_dir':str(outdir),'slides_info':slides}
path=pdf.parent/'ppt_image_extraction_report.json'
path.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(path)
for s in slides: print(s['slide'], s['image'], s['pdf_text_chars'])
