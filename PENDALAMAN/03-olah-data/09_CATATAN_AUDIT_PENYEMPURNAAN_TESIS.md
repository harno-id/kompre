# CATATAN AUDIT & PENYEMPURNAAN DOKUMEN TESIS

**Auditor:** File Skill Ilmu Komunikasi — Metode Penelitian Kuantitatif  
**Dokumen:** TESIS_HARNO_CSV_MASTER_UPDATE_WORKING_20260521-092331.docx  
**Pembanding:** Folder `03-olah-data` (hasil pengolahan data terverifikasi)  
**Tanggal Audit:** 22 Mei 2026

---

## RINGKASAN STATUS AUDIT

| Kategori | Jumlah Temuan |
|----------|--------------|
| 🔴 Inkonsistensi Data (angka tidak cocok) | 4 |
| 🟡 Narasi Kurang/Terlewat | 7 |
| 🟠 Inkonsistensi Narasi vs Data Aktual | 5 |
| 🔵 Saran Penyempurnaan Struktur | 4 |
| **Total** | **20** |

---

## 🔴 INKONSISTENSI DATA (Angka Tidak Cocok dengan Dataset)

### 1. Tabel 4.2 — Profil Responden TIDAK COCOK dengan Dataset

| Variabel | Tesis (Tabel 4.2) | Dataset Aktual | Status |
|----------|-------------------|---------------|--------|
| Perempuan | 209 (51,7%) | **275 (67,9%)** | ❌ SALAH |
| Laki-laki | 195 (48,3%) | **130 (32,1%)** | ❌ SALAH |
| Usia 17 | 102 (25,2%) | **266 (65,7%)** | ❌ SALAH |
| Usia 18 | 302 (74,8%) | **126 (31,1%)** | ❌ SALAH |
| Formal→Gen-Z | 205 (50,7%) | **283 (69,9%)** | ❌ SALAH |
| Gen-Z→Formal | 199 (49,3%) | **122 (30,1%)** | ❌ SALAH |

**Dampak:** Deskripsi responden tidak merepresentasikan data sebenarnya. Perlu dikoreksi total.

**Rekomendasi:** Ganti seluruh Tabel 4.2 dengan data aktual dari dataset CSV.

---

### 2. Tabel 4.1 — Jumlah Anomali Data Cleaning

| Aspek | Tesis (Tabel 4.1) | Dataset Aktual | Status |
|-------|-------------------|---------------|--------|
| Nilai di luar rentang | "2 nilai G5" | **1 nilai G5=0** | ⚠️ Minor |

**Catatan:** Tesis menyebut "2 sel", dataset hanya menunjukkan 1 kasus. Perlu klarifikasi apakah ada koreksi lain yang tidak tercatat.

---

### 3. Tabel L.5 — Nilai Statistik Uji Normalitas

| Parameter | Tesis | Hitung Ulang (Python) | Status |
|-----------|-------|----------------------|--------|
| Shapiro-Wilk stat | 0,337 | 0,836 | ⚠️ Berbeda |
| KS stat | 0,446 | 0,193 | ⚠️ Berbeda |

**Penjelasan:** Kemungkinan perbedaan software (SPSS vs Python). Keputusan sama (tidak normal). Namun angka 0,337 untuk Shapiro-Wilk sangat rendah dan tidak lazim — perlu dicek ulang apakah ini typo atau memang output SPSS.

**Rekomendasi:** Verifikasi ulang di SPSS dan pastikan angka yang dilaporkan benar.

---

### 4. Tabel L.6 — N Nonzero Wilcoxon

| Parameter | Tesis | Hitung Ulang | Status |
|-----------|-------|-------------|--------|
| N nonzero | 331 | 287 | ⚠️ Berbeda |

**Penjelasan:** Perbedaan 44 responden. Kemungkinan tesis menghitung "nonzero" sebelum normalisasi (pada level skor mentah). W-statistik dan p-value tetap identik (16453,5 dan 0,003).

**Rekomendasi:** Jelaskan di narasi bagaimana N nonzero dihitung, atau koreksi ke 287.

---

## 🟡 NARASI KURANG / TERLEWAT

### 5. Tidak Ada Narasi Proses Reverse Scoring di Bab IV

**Lokasi:** Bab IV, antara 4.2.1 dan 4.2.3  
**Masalah:** Tesis langsung melompat dari data cleaning ke statistik deskriptif tanpa menjelaskan proses reverse scoring dan normalisasi.  
**Standar:** Proses transformasi data harus dinarasikan agar pembaca memahami bagaimana skor mentah (1–5) menjadi skor CUQ (0–100).

**Rekomendasi:** Tambahkan sub-bab atau paragraf yang menjelaskan:
- Identifikasi 8 item positif dan 8 item negatif
- Rumus konversi (positif: skor−1; negatif: 5−skor)
- Normalisasi: (total × 100) / 64
- Contoh perhitungan 1 responden

---

### 6. Tidak Ada Narasi Penjelasan Mengapa t-test dan Wilcoxon Berbeda

**Lokasi:** Bab IV, sub-bab 4.6.2  
**Masalah:** Tesis menyebutkan bahwa t-test tidak signifikan dan Wilcoxon signifikan, tetapi tidak menjelaskan MENGAPA keduanya berbeda.  
**Standar:** Perbedaan hasil dua uji harus dijelaskan secara metodologis.

**Rekomendasi:** Tambahkan penjelasan:
- 118 responden (29,1%) memiliki selisih = 0 → dikeluarkan dari Wilcoxon
- Wilcoxon hanya menggunakan 287 responden yang benar-benar berbeda
- Rasio ranking: 174 positif vs 113 negatif
- T-test "terdilusi" oleh tied scores

---

### 7. Tidak Ada Narasi Statistik Deskriptif Selisih

**Lokasi:** Bab IV, sebelum 4.4.1  
**Masalah:** Tesis tidak melaporkan statistik deskriptif dari distribusi selisih (mean, SD, median, skewness, kurtosis selisih).  
**Standar:** Sebelum uji normalitas, deskriptif selisih harus dilaporkan.

**Rekomendasi:** Tambahkan tabel/paragraf:
- Mean selisih = 0,57; SD = 8,10; Median = 0,00
- Skewness = −1,04; Kurtosis = 8,13
- N positif = 174; N nol = 118; N negatif = 113

---

### 8. Tidak Ada Narasi Confidence Interval pada t-test

**Lokasi:** Bab IV, sub-bab 4.5.1  
**Masalah:** Tesis hanya melaporkan t dan p-value, tanpa 95% CI.  
**Standar:** CI memberikan informasi tambahan tentang rentang estimasi perbedaan.

**Rekomendasi:** Tambahkan: "95% CI selisih: [−0,22 ; 1,36] — interval mencakup nol."

---

### 9. Tidak Ada Narasi Alpha If Item Deleted

**Lokasi:** Bab IV, sub-bab 4.3.1  
**Masalah:** Reliabilitas dilaporkan hanya sebagai angka Cronbach Alpha tanpa analisis per item.  
**Standar:** Alpha if item deleted menunjukkan kontribusi setiap item.

**Rekomendasi:** Minimal sebutkan bahwa "tidak ada item yang jika dihapus akan meningkatkan alpha secara substansial, kecuali Q16 yang sedikit meningkatkan alpha (+0,014)."

---

### 10. Tidak Ada Narasi Distribusi Kategori Skor CUQ

**Lokasi:** Bab IV, sub-bab 4.2.3 dan 4.2.4  
**Masalah:** Hanya mean/SD/median yang dilaporkan, tanpa distribusi kategori (berapa % Baik, Sangat Baik, dll).  

**Rekomendasi:** Tambahkan:
- 96,3% responden menilai Formal pada kategori Baik–Sangat Baik
- 95,0% responden menilai Gen-Z pada kategori Baik–Sangat Baik

---

### 11. Tidak Ada Narasi Straight-Lining

**Lokasi:** Bab IV, sub-bab 4.2.1  
**Masalah:** Tesis tidak menyebutkan adanya 60–69 responden straight-liner dan keputusan untuk mempertahankannya.  
**Standar:** Pola respons mencurigakan harus dilaporkan dan dijustifikasi.

**Rekomendasi:** Tambahkan paragraf tentang identifikasi straight-liner dan alasan mempertahankannya.

---

## 🟠 INKONSISTENSI NARASI vs DATA AKTUAL

### 12. Tabel L.7 Klaster — Selisih Tidak Cocok dengan Perhitungan

| Klaster | Tesis (Selisih) | Hitung Ulang (Selisih, skala 0-4) | Status |
|---------|----------------|----------------------------------|--------|
| Persona & Afeksi | 0 | +0,091 | ⚠️ |
| Navigasi & Kemudahan | 0,01 | +0,020 | ≈ OK |
| Kualitas Informasi | 0 | −0,050 | ⚠️ |
| Efektivitas Interaksi | 0,01 | +0,030 | ≈ OK |

**Masalah:** Tesis melaporkan selisih 0 untuk Persona dan Kualitas Informasi, padahal ada selisih kecil. Kemungkinan pembulatan terlalu agresif.

**Rekomendasi:** Gunakan 2 desimal (0,09 dan −0,05) agar lebih akurat.

---

### 13. Narasi Bab IV Menyebut "Tidak Ada Perbedaan" Tanpa Nuansa

**Lokasi:** 4.6.3  
**Masalah:** Narasi menyatakan "tidak ada aspek yang menjadi pembeda dominan" tanpa menyebutkan bahwa Persona & Afeksi memiliki selisih terbesar (+2,27 pada skala 0–100) dan signifikan secara Wilcoxon (p < 0,001).

**Rekomendasi:** Tambahkan nuansa: "Meskipun Persona & Afeksi menunjukkan selisih terbesar dan signifikan secara nonparametrik, effect size-nya tetap di bawah threshold 'small' (dz = 0,185)."

---

### 14. Tabel 3.5 Menyebut Kriteria Validitas r ≥ 0,30

**Lokasi:** Bab III, sub-bab 3.9.1  
**Masalah:** Bab III menyebut kriteria validitas "r ≥ 0,30", tetapi Lampiran menggunakan r tabel = 0,098.  
**Dampak:** Inkonsistensi kriteria antara Bab III dan Lampiran.

**Rekomendasi:** Selaraskan — gunakan satu kriteria yang konsisten. Jika menggunakan r tabel (0,098), ubah narasi Bab III. Jika menggunakan r ≥ 0,30, maka banyak item tidak valid dan perlu penjelasan tambahan.

---

### 15. Order Effect — Angka Tesis vs Hitung Ulang

| Parameter | Tesis | Hitung Ulang | Status |
|-----------|-------|-------------|--------|
| t order | −0,015 | 0,569 | ⚠️ Berbeda |
| p order | 0,988 | 0,570 | ⚠️ Berbeda |

**Penjelasan:** Keputusan sama (tidak signifikan), tetapi angka sangat berbeda. Kemungkinan tesis menggunakan variabel/metode berbeda (mungkin dummy coding atau ANCOVA).

**Rekomendasi:** Jelaskan metode yang digunakan untuk uji order effect, atau koreksi angka.

---

### 16. Narasi Menyebut Dataset "Tidak Memuat Variabel Domisili"

**Lokasi:** Bab IV, sub-bab 4.2.2  
**Masalah:** Tesis menyatakan "Dataset mentah yang dilampirkan tidak memuat variabel domisili, status pendidikan, atau preferensi media komunikasi."  
**Fakta:** Dataset CSV **MEMUAT** kabupaten/kota, status, sekolah, dan media yang digunakan (dalam kolom `profil` dan `bagian_b`).

**Rekomendasi:** Koreksi narasi ini dan tambahkan deskripsi lokasi responden (Bandar Lampung 201, Lampung Selatan 81, dll).

---

## 🔵 SARAN PENYEMPURNAAN STRUKTUR

### 17. Tambahkan Sub-bab Khusus "Prosedur Skoring CUQ"

**Lokasi:** Antara 4.2.1 dan 4.2.3  
**Alasan:** Proses transformasi data (reverse scoring + normalisasi) adalah langkah krusial yang perlu sub-bab tersendiri agar alur metodologis jelas.

---

### 18. Pisahkan Effect Size dan Order Effect dari Sub-bab Uji Beda

**Lokasi:** 4.5.2 dan 4.5.3  
**Status:** Sudah terpisah di tesis — ✓ OK. Namun narasi effect size perlu diperkuat dengan penjelasan mengapa effect size penting (signifikansi statistik ≠ signifikansi praktis).

---

### 19. Tambahkan Tabel Ringkasan Keputusan Statistik

**Lokasi:** Akhir sub-bab 4.5 atau awal 4.6  
**Alasan:** Pembaca perlu satu tabel yang merangkum seluruh keputusan statistik sebelum masuk pembahasan.

**Contoh:**
| Uji | Hasil | Keputusan |
|-----|-------|-----------|
| Normalitas | p < 0,001 | Tidak normal → Wilcoxon utama |
| Paired t-test | p = 0,157 | Tidak signifikan |
| Wilcoxon | p = 0,003 | Signifikan |
| Cohen's dz | 0,070 | Trivial |
| Order effect | p > 0,05 | Tidak signifikan |

---

### 20. Daftar Pustaka — Format Tidak Konsisten

**Masalah:** Beberapa referensi menggunakan format lengkap (APA), beberapa hanya URL tanpa penulis/tahun yang jelas (misalnya "Edu. n.d.", "UMU. n.d.").

**Rekomendasi:** Standarisasi seluruh daftar pustaka ke format APA 7th edition. Referensi online harus memiliki penulis, tahun, judul, dan URL lengkap.

---

## PRIORITAS PERBAIKAN

| Prioritas | No Temuan | Alasan |
|-----------|-----------|--------|
| **TINGGI** | 1 | Data profil responden salah total — bisa ditanyakan penguji |
| **TINGGI** | 14 | Inkonsistensi kriteria validitas Bab III vs Lampiran |
| **TINGGI** | 16 | Narasi menyebut data tidak ada padahal ada |
| **SEDANG** | 5, 6, 7 | Narasi proses analisis kurang lengkap |
| **SEDANG** | 12, 13, 15 | Angka/narasi perlu koreksi minor |
| **RENDAH** | 8, 9, 10, 11 | Penambahan informasi untuk memperkuat |
| **RENDAH** | 17, 18, 19, 20 | Penyempurnaan struktur dan format |

---

## LANGKAH SELANJUTNYA

Setelah catatan audit ini disetujui, perbaikan akan dilakukan secara bertahap:
1. **Tahap 1:** Koreksi data yang salah (Temuan 1, 2, 3, 4, 16)
2. **Tahap 2:** Tambah narasi yang terlewat (Temuan 5, 6, 7, 8, 9, 10, 11)
3. **Tahap 3:** Selaraskan inkonsistensi (Temuan 12, 13, 14, 15)
4. **Tahap 4:** Penyempurnaan struktur (Temuan 17, 18, 19, 20)
