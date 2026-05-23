# REVISI NARASI TESIS — Hasil Audit 22 Mei 2026

**Dokumen Sumber:** TESIS_HARNO_CSV_MASTER_UPDATE_WORKING_20260521-092331.docx  
**Dokumen Salinan:** TESIS_HARNO_CSV_MASTER_REVISI_AUDIT_20260522.docx  
**Basis Perbaikan:** `09_CATATAN_AUDIT_PENYEMPURNAAN_TESIS.md`

---

## CARA MENGGUNAKAN DOKUMEN INI

Setiap perbaikan ditandai dengan:
- **[LOKASI]** = posisi di tesis (bab, sub-bab, tabel)
- **[HAPUS]** = teks yang harus dihapus
- **[GANTI DENGAN]** = teks pengganti
- **[SISIPKAN SETELAH]** = teks baru yang ditambahkan setelah lokasi tertentu

---

## PERBAIKAN 1: Tabel 4.2 — Profil Responden (Temuan #1)

**[LOKASI]** Bab IV, sub-bab 4.2.2, Tabel 4.2

**[HAPUS]** Seluruh isi Tabel 4.2 dan paragraf deskripsi di bawahnya.

**[GANTI DENGAN]**

> **Tabel 4.2 Profil Responden dan Urutan Pengujian**
>
> | Variabel Profil | Kategori | Frekuensi | Persentase (%) |
> |-----------------|----------|-----------|----------------|
> | Jenis Kelamin | Perempuan | 275 | 67,9% |
> | | Laki-laki | 130 | 32,1% |
> | Usia | 16 tahun | 8 | 2,0% |
> | | 17 tahun | 266 | 65,7% |
> | | 18 tahun | 126 | 31,1% |
> | | 19 tahun | 4 | 1,0% |
> | | Lainnya | 1 | 0,2% |
> | Status | Siswa SMA/SMK | 404 | 99,8% |
> | | Lainnya | 1 | 0,2% |
> | Urutan Pengujian | Formal → Gen-Z | 283 | 69,9% |
> | | Gen-Z → Formal | 122 | 30,1% |
> | Kabupaten/Kota (5 terbesar) | Kota Bandar Lampung | 201 | 49,6% |
> | | Kab. Lampung Selatan | 81 | 20,0% |
> | | Kab. Lampung Tengah | 41 | 10,1% |
> | | Kab. Pesawaran | 23 | 5,7% |
> | | Lainnya | 59 | 14,6% |
> | Durasi Pengujian | < 5 menit | 237 | 58,5% |
> | | 5–10 menit | 133 | 32,8% |
> | | > 10 menit | 35 | 8,6% |
> | Frekuensi Chatbot Sebelumnya | Tidak pernah | 106 | 26,2% |
> | | Jarang | 229 | 56,5% |
> | | Sering | 70 | 17,3% |
>
> Data menunjukkan bahwa responden didominasi oleh perempuan (67,9%) dengan usia mayoritas 17 tahun (65,7%) dan 18 tahun (31,1%). Seluruh responden berstatus siswa SMA/SMK kelas XII. Berdasarkan lokasi, hampir separuh responden (49,6%) berasal dari Kota Bandar Lampung, diikuti Kabupaten Lampung Selatan (20,0%) dan Kabupaten Lampung Tengah (10,1%).
>
> Urutan pengujian menunjukkan bahwa 283 responden (69,9%) memulai dari chatbot formal kemudian Gen-Z, sedangkan 122 responden (30,1%) memulai dari chatbot Gen-Z kemudian formal. Meskipun proporsi tidak seimbang sempurna (50:50), uji order effect pada sub-bab 4.5.3 membuktikan bahwa urutan pengujian tidak memengaruhi hasil secara signifikan.
>
> Mayoritas responden (58,5%) menyelesaikan pengujian dalam waktu kurang dari 5 menit per chatbot, dan 56,5% menyatakan jarang menggunakan chatbot sebelumnya. Kondisi ini menunjukkan bahwa sebagian besar responden merupakan pengguna chatbot pemula yang memberikan penilaian berdasarkan pengalaman pertama (first impression).

---

## PERBAIKAN 2: Hapus Klaim "Dataset Tidak Memuat Domisili" (Temuan #16)

**[LOKASI]** Bab IV, sub-bab 4.2.2, paragraf terakhir sebelum sub-bab 4.2.3

**[HAPUS]** Paragraf:
"Dataset mentah yang dilampirkan tidak memuat variabel domisili, status pendidikan, atau preferensi media komunikasi. Oleh karena itu, bagian deskripsi responden pada naskah revisi ini dibatasi pada variabel yang benar-benar tersedia dalam dataset, agar pelaporan hasil tidak melebihi bukti empiris yang ada."

**[GANTI DENGAN]**

> Dataset mentah CSV memuat profil lengkap responden meliputi nama, usia, jenis kelamin, status, kabupaten/kota asal sekolah, nama sekolah, serta data kontekstual berupa pengalaman sebelumnya dengan chatbot, media yang biasa digunakan untuk mencari informasi PMB, durasi pengujian, dan urutan pengujian. Seluruh variabel tersebut telah dideskripsikan pada Tabel 4.2.

---

## PERBAIKAN 3: Tambah Narasi Proses Reverse Scoring (Temuan #5)

**[LOKASI]** Bab IV, SISIPKAN sub-bab baru **4.2.2a** antara 4.2.2 (Karakteristik Responden) dan 4.2.3 (Deskripsi Skor CUQ Formal). Atau sisipkan sebagai paragraf pembuka di 4.2.3.

**[SISIPKAN SETELAH]** Paragraf terakhir sub-bab 4.2.2

> **Prosedur Skoring CUQ**
>
> Sebelum analisis statistik dilakukan, jawaban mentah responden (skala Likert 1–5) dikonversi menjadi skor CUQ yang dinormalisasi ke rentang 0–100. Prosedur ini mengikuti panduan resmi CUQ Usage Guide (Ulster University) dengan langkah sebagai berikut:
>
> Pertama, item CUQ diklasifikasikan menjadi dua kelompok: item positif (Q1, Q3, Q5, Q7, Q9, Q11, Q13, Q15) dan item negatif (Q2, Q4, Q6, Q8, Q10, Q12, Q14, Q16). Item positif mengukur aspek baik usabilitas, sedangkan item negatif mengukur aspek buruk.
>
> Kedua, dilakukan reverse scoring agar seluruh item memiliki arah interpretasi yang sama (skor tinggi = usabilitas baik):
> - Item positif: skor konversi = skor mentah − 1 (rentang hasil: 0–4)
> - Item negatif: skor konversi = 5 − skor mentah (rentang hasil: 0–4)
>
> Ketiga, seluruh 16 skor konversi dijumlahkan, kemudian dinormalisasi dengan rumus:
>
> Skor CUQ = (Total skor konversi × 100) / 64
>
> Angka 64 merupakan skor maksimum yang mungkin (16 item × 4 poin maksimum per item). Prosedur ini menghasilkan skor akhir dalam rentang 0–100, di mana skor 50 merupakan titik netral, dan skor di atas 68 umumnya dianggap above average dalam konteks usabilitas.
>
> Sebagai ilustrasi, jika seorang responden menjawab semua item positif dengan skor 4 dan semua item negatif dengan skor 3, maka: item positif = 4−1 = 3 (×8 = 24), item negatif = 5−3 = 2 (×8 = 16), total = 40, skor CUQ = (40 × 100) / 64 = 62,50.

---

## PERBAIKAN 4: Tambah Narasi Mengapa t-test dan Wilcoxon Berbeda (Temuan #6)

**[LOKASI]** Bab IV, sub-bab 4.6.2, setelah paragraf "Dengan demikian, paired sample t-test tidak menunjukkan perbedaan rata-rata yang signifikan, tetapi Wilcoxon menunjukkan perbedaan secara nonparametrik."

**[SISIPKAN SETELAH]** Kalimat tersebut

> Perbedaan hasil kedua uji ini dapat dijelaskan secara metodologis. Pertama, dari 405 responden, sebanyak 118 responden (29,1%) memiliki selisih skor tepat sama dengan nol — artinya mereka memberikan penilaian identik pada kedua chatbot. Dalam Wilcoxon signed-rank test, responden dengan selisih nol (tied) dikeluarkan dari perhitungan, sehingga uji ini hanya menggunakan 287 responden yang benar-benar merasakan perbedaan. Dari 287 responden tersebut, 174 responden (60,6%) memberikan skor lebih tinggi pada chatbot Gen-Z, sedangkan 113 responden (39,4%) memberikan skor lebih tinggi pada chatbot formal. Pola rasio 61:39 ini konsisten secara statistik meskipun besaran selisihnya kecil.
>
> Sebaliknya, paired sample t-test menghitung seluruh 405 responden termasuk 118 responden dengan selisih nol. Keberadaan responden-responden ini "menekan" nilai t ke bawah karena mereka tidak berkontribusi pada perbedaan rata-rata tetapi tetap menambah variabilitas. Dengan demikian, perbedaan hasil kedua uji bukan merupakan kontradiksi, melainkan konsekuensi dari perbedaan cara masing-masing uji memperlakukan data berpasangan.

---

## PERBAIKAN 5: Tambah Statistik Deskriptif Selisih (Temuan #7)

**[LOKASI]** Bab IV, sub-bab 4.4.1 (Uji Normalitas), sebagai paragraf pembuka sebelum hasil uji.

**[SISIPKAN SEBELUM]** Kalimat pertama sub-bab 4.4.1

> Sebelum melakukan uji normalitas, terlebih dahulu dihitung distribusi selisih skor (D = Skor Gen-Z − Skor Formal) untuk setiap responden. Statistik deskriptif selisih menunjukkan: Mean = 0,57; SD = 8,10; Median = 0,00; Minimum = −43,75; Maksimum = 39,06; Skewness = −1,04; dan Kurtosis = 8,13. Dari 405 responden, sebanyak 174 responden (43,0%) memiliki selisih positif (menilai Gen-Z lebih tinggi), 118 responden (29,1%) memiliki selisih tepat nol (menilai keduanya sama), dan 113 responden (27,9%) memiliki selisih negatif (menilai Formal lebih tinggi). Median selisih yang tepat berada di nol mengindikasikan bahwa titik tengah distribusi tidak condong ke salah satu arah.

---

## PERBAIKAN 6: Selaraskan Kriteria Validitas (Temuan #14)

**[LOKASI]** Bab III, sub-bab 3.9.1

**[HAPUS]** Kalimat: "Item dinyatakan valid apabila nilai korelasi memenuhi kriteria minimal r >= 0,30 dan/atau signifikan pada taraf 0,05."

**[GANTI DENGAN]**

> Item dinyatakan valid apabila nilai korelasi item-total (r hitung) lebih besar dari nilai r tabel pada taraf signifikansi 0,05 dengan derajat kebebasan df = N − 2. Dengan jumlah sampel N = 405 (df = 403), nilai r tabel yang digunakan adalah 0,098. Uji validitas dilakukan terpisah pada data CUQ kondisi formal dan kondisi Generasi Z.

---

## PERBAIKAN 7: Koreksi Tabel 4.1 — Jumlah Anomali (Temuan #2)

**[LOKASI]** Bab IV, Tabel 4.1

**[HAPUS]** Baris: "2 nilai G5 di luar rentang 1–5; dikoreksi median item (4) | 2 sel"

**[GANTI DENGAN]**

> | Validasi rentang skala CUQ | 1 nilai G5=0 di luar rentang 1–5; dikoreksi dengan median valid item G5, yaitu 4 | 1 sel |

---

## PERBAIKAN 8: Tambah Narasi Straight-Lining (Temuan #11)

**[LOKASI]** Bab IV, sub-bab 4.2.1, setelah paragraf tentang data cleaning.

**[SISIPKAN SETELAH]** Paragraf terakhir sub-bab 4.2.1 (sebelum Tabel 4.1 atau setelahnya)

> Selain pemeriksaan rentang skala, dilakukan pula identifikasi pola respons seragam (straight-lining), yaitu responden yang menjawab seluruh 16 item CUQ dengan nilai yang sama. Ditemukan 60 responden pada kondisi formal dan 69 responden pada kondisi Gen-Z yang menunjukkan pola ini (mayoritas menjawab semua item dengan skor 3/netral). Responden-responden tersebut tetap dipertahankan dalam analisis dengan pertimbangan: (1) tidak ada bukti pasti bahwa mereka tidak serius; (2) setelah reverse scoring, straight-liner selalu menghasilkan skor CUQ = 50,00 (titik netral) karena item positif dan negatif saling mengompensasi; (3) reliabilitas instrumen tetap sangat tinggi (α > 0,9) meskipun straight-liner dipertahankan; dan (4) menghapus responden tersebut akan mengurangi sampel secara signifikan (~15%) tanpa justifikasi metodologis yang kuat.

---

## PERBAIKAN 9: Tambah Confidence Interval (Temuan #8)

**[LOKASI]** Bab IV, sub-bab 4.5.1, setelah pelaporan hasil paired t-test.

**[SISIPKAN SETELAH]** Kalimat yang melaporkan t = 1,418 dan Sig. = 0,157

> Interval kepercayaan 95% untuk selisih rata-rata berada pada rentang [−0,22 ; 1,36]. Karena interval ini mencakup nilai nol, maka secara statistik tidak terdapat bukti yang cukup untuk menyatakan bahwa rata-rata skor CUQ kedua kondisi berbeda.

---

## PERBAIKAN 10: Tambah Narasi Alpha If Item Deleted (Temuan #9)

**[LOKASI]** Bab IV, sub-bab 4.3.1, setelah pelaporan Cronbach Alpha.

**[SISIPKAN SETELAH]** Kalimat yang melaporkan α Formal = 0,905 dan α Gen-Z = 0,922

> Analisis alpha if item deleted menunjukkan bahwa tidak ada item yang jika dihapus akan meningkatkan reliabilitas secara substansial. Satu-satunya item yang sedikit meningkatkan alpha jika dihapus adalah Q16 ("Chatbot terasa sangat kompleks"), dengan peningkatan sebesar 0,014 pada kondisi formal dan 0,012 pada kondisi Gen-Z. Namun, peningkatan ini sangat kecil dan Q16 tetap dipertahankan karena merupakan bagian standar instrumen CUQ.

---

## PERBAIKAN 11: Tambah Distribusi Kategori Skor (Temuan #10)

**[LOKASI]** Bab IV, sub-bab 4.2.3 dan 4.2.4, setelah tabel statistik deskriptif.

**[SISIPKAN SETELAH]** Tabel statistik deskriptif (Tabel 4.3)

> Berdasarkan interpretasi umum skala usabilitas 0–100, distribusi kategori skor menunjukkan bahwa mayoritas responden menilai kedua chatbot pada kategori Baik hingga Sangat Baik. Pada chatbot formal, 178 responden (44,0%) berada pada kategori Baik (51–75) dan 212 responden (52,3%) pada kategori Sangat Baik (76–100). Pada chatbot Gen-Z, 167 responden (41,2%) berada pada kategori Baik dan 218 responden (53,8%) pada kategori Sangat Baik. Hanya 2 responden (0,5%) pada masing-masing kondisi yang memberikan skor pada kategori Rendah (0–25). Pola distribusi ini menunjukkan bahwa kedua chatbot dipersepsikan secara positif oleh mayoritas responden.

---

## PERBAIKAN 12: Koreksi Presisi Angka Klaster (Temuan #12)

**[LOKASI]** Lampiran 7, Tabel L.7

**[HAPUS]** Kolom "Selisih" dengan nilai 0 dan 0,01

**[GANTI DENGAN]**

> | Klaster | Deskripsi | Mean Formal | Mean Gen-Z | Selisih |
> |---------|-----------|-------------|-----------|---------|
> | Persona & Afeksi | Kepribadian, keramahan, kesan non-robotik (Q1-Q4) | 2,91 | 3,00 | +0,09 |
> | Navigasi & Kemudahan | Kemudahan berpindah menu dan alur interaksi (Q7-Q8, Q15-Q16) | 2,70 | 2,72 | +0,02 |
> | Kualitas Informasi | Kejelasan scope, relevansi, kebermanfaatan pesan (Q5-Q6, Q11-Q12) | 3,13 | 3,08 | −0,05 |
> | Efektivitas Interaksi | Pemahaman chatbot dan penanganan kesalahan (Q9-Q10, Q13-Q14) | 2,93 | 2,96 | +0,03 |

---

## PERBAIKAN 13: Tambah Nuansa pada Narasi Klaster (Temuan #13)

**[LOKASI]** Bab IV, sub-bab 4.6.3, paragraf pertama.

**[SISIPKAN SETELAH]** Kalimat "Seluruh klaster dimensi memiliki selisih yang sangat kecil antara chatbot formal dan chatbot Generasi Z."

> Meskipun demikian, analisis lebih detail menunjukkan bahwa klaster Persona & Afeksi memiliki selisih terbesar (+2,27 poin pada skala 0–100) dan signifikan secara Wilcoxon (p < 0,001). Chatbot Gen-Z dinilai sedikit kurang robotik (Q2) dan lebih realistis (Q1) dibandingkan chatbot formal. Namun, effect size klaster ini (dz = 0,185) masih berada di bawah threshold "small effect" (0,20), sehingga perbedaan tersebut tetap belum dapat dinyatakan sebagai pembeda yang kuat secara praktis. Di sisi lain, klaster Kualitas Informasi menunjukkan arah sebaliknya — chatbot formal dinilai sedikit lebih baik dalam kejelasan dan relevansi informasi (selisih −1,25 poin). Pola kompensasi ini (Gen-Z unggul di persona, Formal unggul di informasi) menjelaskan mengapa skor total CUQ kedua kondisi hampir setara.

---

## RINGKASAN PERBAIKAN

| No | Temuan | Tipe Perbaikan | Status |
|----|--------|---------------|--------|
| 1 | Tabel 4.2 profil responden | Koreksi data | Siap diterapkan |
| 2 | Klaim "data tidak memuat domisili" | Hapus & ganti | Siap diterapkan |
| 3 | Narasi reverse scoring | Tambah baru | Siap diterapkan |
| 4 | Penjelasan t-test vs Wilcoxon | Tambah baru | Siap diterapkan |
| 5 | Statistik deskriptif selisih | Tambah baru | Siap diterapkan |
| 6 | Kriteria validitas Bab III | Koreksi narasi | Siap diterapkan |
| 7 | Tabel 4.1 jumlah anomali | Koreksi minor | Siap diterapkan |
| 8 | Narasi straight-lining | Tambah baru | Siap diterapkan |
| 9 | Confidence interval | Tambah baru | Siap diterapkan |
| 10 | Alpha if item deleted | Tambah baru | Siap diterapkan |
| 11 | Distribusi kategori skor | Tambah baru | Siap diterapkan |
| 12 | Presisi angka klaster | Koreksi minor | Siap diterapkan |
| 13 | Nuansa narasi klaster | Tambah baru | Siap diterapkan |
