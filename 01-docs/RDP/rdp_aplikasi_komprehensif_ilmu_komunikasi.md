# RDP Aplikasi Analisis Dokumen Akademik Komprehensif - Ilmu Komunikasi (Integrasi Tesis, PPT, Naskah Paparan, dan Dataset CUQ Mentah)

## 1. Judul Proyek
Aplikasi Analisis Dokumen Akademik Ilmu Komunikasi Berbasis Metode Penelitian Kuantitatif untuk Mendukung Ujian Komprehensif (Kompre) Mahasiswa Magister Ilmu Komunikasi – Integrasi Tesis, Presentasi, Naskah Paparan, dan Dataset CUQ Mentah, Universitas Lampung 2026

## 2. Tujuan Proyek
- Membreakdown dokumen tesis, presentasi PPT kompre, naskah paparan, serta dataset CUQ mentah menjadi modul analisis terstruktur.
- Menjawab semua potensi pertanyaan ujian kompre berdasarkan rumusan masalah, tujuan penelitian, metodologi, analisis data, hasil, pembahasan, simpulan, dan rekomendasi.
- Melakukan analisis statistik real-time menggunakan dataset CUQ mentah 404 responden untuk validitas, reliabilitas, uji beda, Wilcoxon, effect size, dan order effect.
- Memetakan isi dokumen dengan teori komunikasi (CMC, TAM, S-O-R) dan standar file skill profesi Ilmu Komunikasi – Metode Penelitian Kuantitatif.
- Menyediakan dashboard interaktif untuk visualisasi slide, tabel CUQ, analisis statistik, dan prediksi pertanyaan kompre.

## 3. Lingkup Aplikasi
### Input
- Dokumen akademik: PDF, DOCX, TXT (tesis, naskah paparan, slide PPT)
- Dataset mentah CUQ: skor item F1–F16 (Formal) dan G1–G16 (Generasi Z) dari 404 responden

### Output
- Breakdown per bab, subbab, tabel, lampiran, dan slide PPT
- Analisis kuantitatif langsung dari dataset mentah
- Evaluasi kesesuaian dokumen dengan file skill profesi
- Mapping slide ke bagian tesis dan naskah paparan
- Prediksi pertanyaan kompre dan rekomendasi jawaban singkat

### Fungsi Tambahan
- Highlight inkonsistensi metodologi atau data dari dataset mentah
- Link interaktif antara teks tesis, tabel CUQ, slide presentasi, dan naskah paparan
- Modul AI opsional untuk interpretasi teori komunikasi dan prediksi pertanyaan ujian kompre

## 4. Arsitektur Aplikasi (Docker - AntyGrafiti)
### Container Modular
1. **Parser Container**
   - Ekstraksi teks, tabel, gambar dari tesis, naskah paparan, dan slide PPT
   - Library: python-docx, pdfplumber, python-pptx
2. **Analyzer Container**
   - Analisis dataset CUQ mentah 404 responden
   - Validitas & reliabilitas per item, paired t-test, Wilcoxon, Cohen’s dz, order effect
   - Mapping dimensi CUQ ke aspek persona, navigasi, kualitas informasi, efektivitas interaksi
3. **File Skill Checker Container**
   - Evaluasi kesesuaian tesis, naskah paparan, dan slide terhadap standar profesi
   - Linear mapping: Rumusan Masalah → Tujuan → Metode → Hasil → Simpulan → Rekomendasi
4. **AI Interpretation Container (opsional)**
   - Analisis penerapan teori komunikasi (CMC, TAM, S-O-R)
   - Prediksi pertanyaan kompre berbasis dataset CUQ dan konten dokumen【36†source】 
5. **Frontend Container**
   - Dashboard interaktif menampilkan breakdown dokumen, slide PPT interaktif, dataset CUQ, dan prediksi pertanyaan kompre
   - Highlight tabel, diagram, dan poin penting dari naskah paparan
6. **Database Container (opsional)**
   - Menyimpan hasil analisis dokumen, skor CUQ mentah, slide metadata
   - SQLite / PostgreSQL

### Orkestrasi
- Docker Compose untuk mengatur container, network, dan volume
- Volume untuk dokumen input/output, dataset CUQ, dan slide interaktif

## 5. Workflow Analisis Dokumen & CUQ
1. Unggah dokumen tesis, naskah paparan, slide PPT, dan dataset CUQ mentah ke Parser Container
2. Parser mengekstrak teks, tabel, lampiran, metadata, dan slide content
3. Analyzer melakukan analisis kuantitatif **langsung dari dataset CUQ mentah**
4. File Skill Checker memverifikasi kesesuaian dokumen dan mapping ke standar profesi
5. AI Interpretation Container memberikan insight teori komunikasi dan prediksi pertanyaan kompre
6. Frontend menampilkan:
   - Slide interaktif dengan anotasi dan highlight
   - Breakdown tesis dan naskah paparan
   - Tabel CUQ dan visualisasi statistik dari dataset mentah
   - Rekomendasi jawaban singkat untuk pertanyaan kritis

## 6. Kriteria Keberhasilan
- Semua dokumen dan dataset CUQ mentah terbaca dan dianalisis secara lengkap
- Analisis kuantitatif akurat, termasuk validitas, reliabilitas, uji normalitas, paired t-test, Wilcoxon, dan Cohen’s dz
- Hubungan logis antara rumusan masalah, tujuan, metode, hasil, dan simpulan divisualisasikan
- Prediksi pertanyaan kompre relevan dan mendukung persiapan ujian
- Dashboard responsif dan intuitif, menampilkan dokumen, slide, dan hasil analisis CUQ mentah

## 7. Pertimbangan Teknis & Risiko
- Parsing slide PPT dan dokumen Word/PDF memerlukan validasi manual
- Dataset CUQ harus lengkap, terstruktur, dan bersih
- Resource tinggi jika AI LLM lokal digunakan
- Konsistensi versi Python dan library antar container

## 8. Ekstensi & Pengembangan Masa Depan
- Modul jawaban komprehensif berbasis AI dengan data CUQ mentah
- Analisis longitudinal dari beberapa dokumen tesis/paparan untuk prediksi kompre lebih akurat
- Adaptasi untuk bidang keilmuan lain dengan mengganti file skill dan teori komunikasi
- Visualisasi interaktif setiap dimensi CUQ, poin penting slide PPT, dan naskah paparan
- Dashboard prediksi pertanyaan kompre dengan tingkat confidence

## 9. Referensi
- Tesis Harno (2026), Universitas Lampung – Pengaruh Gaya Bahasa Chatbot terhadap Usabilitas Informasi PMB Generasi Z【36†source】
- File Skill Profesi Ilmu Komunikasi – Metode Penelitian Kuantitatif【36†source】
- PPT Kompre Harno (15 slide)【45†source】
- Naskah Paparan Kompre Harno (Final)【52†source】
- Dataset CUQ mentah 404 responden (file Excel) 
- Teori CMC, TAM, S-O-R

