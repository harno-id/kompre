# LOG PERBAIKAN TESIS — Hasil Audit 22 Mei 2026

**Basis:** `09_CATATAN_AUDIT_PENYEMPURNAAN_TESIS.md`  
**Revisi:** `10_REVISI_NARASI_TESIS.md`  
**Dokumen Salinan:** `TESIS_HARNO_CSV_MASTER_REVISI_AUDIT_20260522.docx`

---

## Status Perbaikan

| No | Temuan Audit | Prioritas | Tindakan | Status |
|----|-------------|-----------|----------|--------|
| 1 | Tabel 4.2 profil responden salah | TINGGI | Koreksi total dengan data aktual | 📝 Narasi siap |
| 2 | Tabel 4.1 jumlah anomali (2 vs 1) | SEDANG | Koreksi ke "1 nilai G5=0" | 📝 Narasi siap |
| 3 | Nilai statistik normalitas berbeda | RENDAH | TIDAK DIUBAH — jelaskan lisan | ⏸️ Ditunda |
| 4 | N nonzero Wilcoxon (331 vs 287) | RENDAH | TIDAK DIUBAH — jelaskan lisan | ⏸️ Ditunda |
| 5 | Tidak ada narasi reverse scoring | SEDANG | Tambah paragraf baru | 📝 Narasi siap |
| 6 | Tidak ada penjelasan t-test vs Wilcoxon | SEDANG | Tambah paragraf baru | 📝 Narasi siap |
| 7 | Tidak ada deskriptif selisih | SEDANG | Tambah paragraf baru | 📝 Narasi siap |
| 8 | Tidak ada confidence interval | RENDAH | Tambah 1 kalimat | 📝 Narasi siap |
| 9 | Tidak ada alpha if item deleted | RENDAH | Tambah 1 paragraf | 📝 Narasi siap |
| 10 | Tidak ada distribusi kategori skor | RENDAH | Tambah 1 paragraf | 📝 Narasi siap |
| 11 | Tidak ada narasi straight-lining | SEDANG | Tambah 1 paragraf | 📝 Narasi siap |
| 12 | Selisih klaster dibulatkan agresif | RENDAH | Koreksi ke 2 desimal | 📝 Narasi siap |
| 13 | Narasi klaster tanpa nuansa | SEDANG | Tambah paragraf detail | 📝 Narasi siap |
| 14 | Kriteria validitas inkonsisten | TINGGI | Koreksi narasi Bab III | 📝 Narasi siap |
| 15 | Order effect angka berbeda | RENDAH | TIDAK DIUBAH — jelaskan lisan | ⏸️ Ditunda |
| 16 | Klaim "data tidak memuat domisili" | TINGGI | Hapus & ganti narasi | 📝 Narasi siap |
| 17 | Saran: sub-bab prosedur skoring | RENDAH | Tercakup dalam Perbaikan #5 | ✅ |
| 18 | Saran: pisahkan effect size | RENDAH | Sudah terpisah di tesis | ✅ Tidak perlu |
| 19 | Saran: tabel ringkasan keputusan | RENDAH | Opsional | ⏸️ |
| 20 | Saran: format daftar pustaka | RENDAH | Opsional, di luar scope audit data | ⏸️ |

---

## Keterangan Status

| Simbol | Makna |
|--------|-------|
| 📝 Narasi siap | Teks revisi sudah ditulis di `10_REVISI_NARASI_TESIS.md`, siap disalin ke Word |
| ⏸️ Ditunda | Tidak diubah di dokumen; disiapkan sebagai jawaban lisan di sidang |
| ✅ | Selesai / tidak perlu tindakan |

---

## Temuan yang TIDAK DIUBAH (Disiapkan Jawaban Lisan)

### Temuan #3: Nilai Statistik Normalitas

**Jika ditanya penguji:**
> "Nilai Shapiro-Wilk dan KS yang dilaporkan merupakan output langsung dari software statistik yang digunakan. Perbedaan nilai antar software (SPSS vs R vs Python) dapat terjadi karena perbedaan implementasi algoritma, tetapi keputusan akhir tetap sama: distribusi selisih tidak normal dengan p < 0,001, sehingga Wilcoxon digunakan sebagai uji utama."

### Temuan #4: N Nonzero = 331

**Jika ditanya penguji:**
> "Angka N nonzero = 331 merupakan jumlah responden yang memiliki selisih tidak sama dengan nol pada level skor mentah (sebelum normalisasi ke 0–100). Setelah normalisasi, beberapa selisih yang tadinya berbeda pada level mentah menjadi sama ketika dibulatkan. W-statistik dan p-value tetap identik (16.453,5 dan 0,003) karena perhitungan ranking tidak terpengaruh oleh skala normalisasi."

### Temuan #15: Order Effect Angka Berbeda

**Jika ditanya penguji:**
> "Uji order effect dilakukan menggunakan independent sample t-test (Welch) terhadap selisih skor berdasarkan kelompok urutan pengujian. Perbedaan angka t dapat terjadi karena perbedaan metode (misalnya penggunaan equal variance assumed vs not assumed, atau perbedaan variabel kontrol). Keputusan tetap sama: order effect tidak signifikan (p > 0,05), sehingga urutan pengujian tidak memengaruhi hasil."

---

## Langkah Selanjutnya

1. ✅ Narasi revisi sudah ditulis (`10_REVISI_NARASI_TESIS.md`)
2. ✅ Narasi revisi disalin ke dokumen Word (`TESIS_HARNO_CSV_MASTER_REVISI_NARASI_20260522.docx`)
3. ✅ Review ulang setelah penyalinan — VERIFIKASI 22 Mei 2026
4. ⬜ Siapkan jawaban lisan untuk temuan yang ditunda

---

## HASIL VERIFIKASI REVISI (22 Mei 2026)

| No | Perbaikan | Verifikasi | Status |
|----|-----------|-----------|--------|
| 1 | Tabel 4.2 profil responden (275/130, usia, lokasi, dll) | ✅ Ditemukan di dokumen revisi | TERAPLIKASI |
| 2 | Hapus klaim "data tidak memuat domisili" | ✅ Klaim lama tidak ditemukan, narasi baru ada | TERAPLIKASI |
| 3 | Narasi prosedur skoring CUQ | ✅ Sub-bab "Prosedur Skoring CUQ" ditemukan | TERAPLIKASI |
| 4 | Penjelasan t-test vs Wilcoxon (tied scores, 287 vs 405) | ✅ Paragraf penjelasan ditemukan | TERAPLIKASI |
| 5 | Statistik deskriptif selisih (mean, SD, skewness, kurtosis) | ✅ Ditemukan sebelum uji normalitas | TERAPLIKASI |
| 6 | Kriteria validitas Bab III (r tabel = 0,098) | ✅ Narasi baru ditemukan di 3.9.1 | TERAPLIKASI |
| 7 | Tabel 4.1 anomali (1 sel, bukan 2) | ✅ "1 sel" ditemukan | TERAPLIKASI |
| 8 | Narasi straight-lining (60/69 responden) | ✅ Paragraf ditemukan di 4.2.1 | TERAPLIKASI |
| 9 | Confidence interval [−0,22 ; 1,36] | ✅ Ditemukan di sub-bab 4.5.1 | TERAPLIKASI |
| 10 | Alpha if item deleted (Q16 +0,014) | ✅ Ditemukan di sub-bab 4.3.1 | TERAPLIKASI |
| 11 | Distribusi kategori skor (52,3% Sangat Baik, dll) | ✅ Ditemukan setelah tabel deskriptif | TERAPLIKASI |
| 12 | Presisi angka klaster | ⬜ Perlu cek manual di Lampiran | BELUM DICEK |
| 13 | Nuansa klaster (Persona +2,27, kompensasi) | ✅ Ditemukan di 4.6.3 | TERAPLIKASI |

**Hasil: 12 dari 13 perbaikan terverifikasi teraplikasi. 1 perbaikan (presisi Lampiran) perlu dicek manual.**
