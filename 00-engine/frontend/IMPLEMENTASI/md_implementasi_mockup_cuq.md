# Implementasi 10 Mockup Dashboard dengan Dataset CUQ

Dokumen ini memberikan panduan implementasi dashboard interaktif berbasis 10 mockup UI/UX menggunakan **dataset CUQ mentah** untuk analisis dokumen akademik Ilmu Komunikasi.

## 1. Tujuan
- Menyediakan arahan untuk frontend developer agar bisa mengintegrasikan data CUQ ke dashboard interaktif.
- Menampilkan informasi secara real-time dengan infografis dan panel narasi singkat.
- Memfasilitasi prediksi pertanyaan kompre berbasis dataset dan mapping file skill.

## 2. Sumber Data
- CSV CUQ FINAL: 
D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE\02-data\cuq\cuq_responses_rows.csv
- Tesis Harno, file presentasi PPT, dan naskah paparan final.
D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE\02-data\paparan\NASKAH_PAPARAN_KOMPRE_HARNO_CSV_MASTER_UPDATE_WORKING_20260521-095618.docx
D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE\02-data\thesis\TESIS_HARNO_CSV_MASTER_LOCKED_20260521-095322.docx

- File Skill profesi Ilmu Komunikasi – Metode Penelitian Kuantitatif.

## 3. Struktur Implementasi
### Frontend Folder
```
frontend/
├── public/             # index.html, favicon, static assets
├── src/
│   ├── components/     # reusable: Sidebar, Header, Panel, Chart
│   ├── pages/          # 10 halaman dashboard mockup
│   ├── styles/         # CSS/SCSS, dark theme, typography, responsive
│   ├── utils/          # API fetch, parsing dataset CUQ, helper functions
│   └── App.jsx         # entry point
```

### Dashboard Pages
1. **Dashboard Main**: ringkasan penelitian, metadata, skor CUQ keseluruhan.
2. **Questions List**: daftar pertanyaan kompre, filter kategori, level confidence.
3. **Question Detail**: infografis jalur pertanyaan → jawaban aman, referensi bab.
4. **CUQ Analysis**: visualisasi dimensi CUQ, paired score, radar chart.
5. **PPT Viewer**: navigasi slide kompre, highlight poin penting.
6. **Thesis Viewer**: bab, subbab, tabel, lampiran.
7. **Concept Map**: mapping teori CMC, TAM, S-O-R.
8. **Methodology**: step-by-step desain kuantitatif, counterbalancing, reverse scoring.
9. **QA Simulation**: latihan menjawab pertanyaan, indikator keyakinan.
10. **Report & Export**: ringkasan hasil analisis, ekspor PDF/HTML.

## 4. Integrasi Dataset CUQ
- Parsing skor F1–F16 (Formal) dan G1–G16 (Gen-Z) dari CSV CUQ FINAL: `02-data/cuq/cuq_responses_rows.csv`.
- Perhitungan statistik: mean, SD, median, min, max, Cronbach Alpha, validitas, paired t-test, Wilcoxon, Cohen's dz, order effect.
- Perhitungan dimensi CUQ dashboard: Persona (q1–q4), Navigasi (q5–q8), Kualitas (q9–q12), Efektivitas (q13–q16).
- Data ditampilkan secara interaktif di dashboard dengan tooltip, hover, dan highlight per dimensi.

## 5. Infografis & Panel Narasi
- Infografis: jalur `Gaya Bahasa → Persepsi → Skor CUQ` dan radar chart per dimensi.
- Panel narasi singkat: aman, netral, menjelaskan insight dari dataset, tanpa klaim berlebihan.
- Klik atau hover pada grafik menampilkan nilai per item dan dimensi CUQ.

## 6. Style / CSS
- Tema: dark professional (navy, white, gold accents)
- Typography: sans-serif, heading bold, body regular
- Panels: shadow, padding 12–16px, rounded corners
- Buttons: rounded, hover effect, consistent color
- Layout: Flexbox/Grid responsive, adaptasi 16:9 dan 4:3 screens

## 7. Interaktivitas & Realtime
- Menggunakan React/Vue state management atau plain JS dengan fetch API.
- JSON dataset CUQ dimuat ke frontend dan di-render secara dinamis.
- Semua panel, chart, dan slide saling terhubung, menampilkan insight real-time.

## 8. Workflow
1. Parser backend mengekstrak JSON dari tesis, naskah paparan, PPT, dan dataset CUQ.
2. Frontend memuat JSON → render dashboard, infografis, panel narasi.
3. User memilih slide atau bab → filter pertanyaan kompre relevan.
4. Klik pertanyaan → tampil jawaban singkat aman + referensi data.
5. Update data CUQ → update grafik dan insight secara otomatis.

## 9. Catatan untuk Programmer Pemula
- Mulai dengan halaman Dashboard Main dan integrasi chart untuk CUQ.
- Gunakan dummy JSON sebelum integrasi backend.
- Buat komponen reusable: ChartCard, Panel, QuestionCard.
- Pastikan responsive layout dan hover/tooltip berfungsi.
- Selalu render narasi aman dari data, jangan buat klaim melebihi hasil CUQ.

## 10. Output yang Diharapkan
- 10 halaman dashboard interaktif siap digunakan.
- Infografis jalur dan radar chart per dimensi CUQ.
- Panel narasi aman menjelaskan insight dan prediksi pertanyaan.
- Simulasi pertanyaan kompre interaktif.
- Laporan dan export PDF/HTML siap diunduh dan dibagikan.

