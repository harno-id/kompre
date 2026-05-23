# Tahap 6: Uji Beda — Paired t-test, Wilcoxon, Effect Size, Order Effect

**Input:** Skor CUQ total (0–100) untuk Formal dan Gen-Z, 405 responden  
**Output:** Keputusan apakah terdapat perbedaan usabilitas yang signifikan  
**Script:** `05_uji_beda.py`

---

## 1. Gambaran Umum

Tahap ini menjawab **Rumusan Masalah 2**: *Apakah terdapat perbedaan tingkat usabilitas (skor CUQ) antara chatbot formal dan chatbot Generasi Z?*

Empat analisis dilakukan secara berurutan:

| No | Analisis | Fungsi |
|----|----------|--------|
| A | Paired Sample t-test | Uji parametrik (pembanding) |
| B | Wilcoxon Signed-Rank | Uji nonparametrik (acuan utama) |
| C | Cohen's dz | Mengukur besaran praktis perbedaan |
| D | Order Effect | Memastikan urutan pengujian tidak bias |

---

## 2. Bagian A: Paired Sample t-test (Uji Pembanding)

### Hipotesis

| | Pernyataan |
|--|-----------|
| H0 | μD = 0 (tidak ada perbedaan rata-rata skor CUQ antara Formal dan Gen-Z) |
| H1 | μD ≠ 0 (ada perbedaan rata-rata skor CUQ) |

### Kriteria

- α = 0,05 (two-tailed)
- Jika p < 0,05 → Tolak H0
- Jika p ≥ 0,05 → Terima H0

### Hasil

| Parameter | Nilai |
|-----------|-------|
| N | 405 |
| Mean Formal | 72,92 |
| Mean Gen-Z | 73,50 |
| Mean Difference (D) | 0,5710 |
| SD Difference | 8,1048 |
| SE Difference | 0,4027 |
| **t-statistik** | **1,4178** |
| df | 404 |
| **Sig. (2-tailed)** | **0,157** |
| **Keputusan** | **TIDAK SIGNIFIKAN (Terima H0)** |

### Perhitungan Manual

```
t = Mean_D / SE_D
t = Mean_D / (SD_D / √N)
t = 0,5710 / (8,1048 / √405)
t = 0,5710 / (8,1048 / 20,1246)
t = 0,5710 / 0,4027
t = 1,4178
```

### Interpretasi

Dengan p = 0,157 (> 0,05), paired t-test **tidak menemukan perbedaan rata-rata yang signifikan**. Namun, karena asumsi normalitas tidak terpenuhi, hasil ini bersifat pembanding saja.

---

## 3. Bagian B: Wilcoxon Signed-Rank Test (Uji Utama)

### Mengapa Wilcoxon?

- Distribusi selisih **tidak normal** (Shapiro-Wilk p < 0,001)
- Wilcoxon tidak mensyaratkan normalitas
- Bekerja berdasarkan **ranking** selisih, bukan nilai absolut

### Hipotesis

| | Pernyataan |
|--|-----------|
| H0 | Median selisih = 0 (tidak ada perbedaan usabilitas) |
| H1 | Median selisih ≠ 0 (ada perbedaan usabilitas) |

### Cara Kerja Wilcoxon

```
1. Hitung selisih D = Gen-Z - Formal untuk setiap responden
2. Buang responden dengan D = 0 → 118 responden dikeluarkan
3. Ambil nilai absolut |D| dari 287 responden yang tersisa
4. Ranking |D| dari terkecil ke terbesar
5. Beri tanda + (D > 0) atau - (D < 0) pada setiap ranking
6. Jumlahkan ranking positif (T+) dan ranking negatif (T-)
7. Hitung statistik W dan tentukan p-value
```

### Hasil

| Parameter | Nilai |
|-----------|-------|
| N total | 405 |
| N selisih = 0 (tied, dikeluarkan) | 118 |
| **N selisih ≠ 0 (digunakan)** | **287** |
| Positive ranks (Gen-Z > Formal) | 174 |
| Negative ranks (Formal > Gen-Z) | 113 |
| **W-statistik** | **16.453,5** |
| **Sig. (2-tailed)** | **0,003** |
| **Keputusan** | **SIGNIFIKAN (Tolak H0)** |

### Interpretasi

Wilcoxon mendeteksi perbedaan yang **signifikan secara statistik** (p = 0,003 < 0,05). Namun, signifikansi statistik saja tidak cukup — perlu dilihat bersama effect size.

### Mengapa t-test dan Wilcoxon Berbeda?

| Faktor | Penjelasan |
|--------|-----------|
| Sensitivitas terhadap distribusi | Wilcoxon lebih sensitif terhadap pola ranking, t-test terhadap rata-rata |
| Pengaruh tied scores | 118 responden dengan D=0 dikeluarkan dari Wilcoxon, tetapi tetap masuk t-test |
| Asumsi | t-test mengasumsikan normalitas (dilanggar), Wilcoxon tidak |
| N efektif | t-test: N=405, Wilcoxon: N=287 (lebih fokus pada yang benar-benar berbeda) |

---

## 4. Bagian C: Effect Size — Cohen's dz

### Mengapa Effect Size Penting?

- **p-value** hanya mengatakan "ada/tidak ada perbedaan" — dipengaruhi ukuran sampel
- Dengan N=405, perbedaan sangat kecil pun bisa signifikan secara statistik
- **Effect size** mengatakan "seberapa besar perbedaan itu" — independen dari N

### Rumus dan Perhitungan

```
Cohen's dz = Mean_D / SD_D
Cohen's dz = 0,5710 / 8,1048
Cohen's dz = 0,0705
```

### Kriteria Interpretasi

| Nilai |d| | Kategori | Makna Praktis |
|-----------|----------|---------------|
| < 0,20 | **Trivial / Sangat Kecil** | Perbedaan tidak bermakna secara praktis |
| 0,20 – 0,49 | Kecil (Small) | Perbedaan kecil tapi terdeteksi |
| 0,50 – 0,79 | Sedang (Medium) | Perbedaan cukup bermakna |
| ≥ 0,80 | Besar (Large) | Perbedaan sangat bermakna |

### Hasil

**Cohen's dz = 0,070 → TRIVIAL / SANGAT KECIL**

### Interpretasi Praktis

- Perbedaan 0,57 poin pada skala 0–100 setara dengan **kurang dari 1% skala**
- Dalam konteks nyata: pengguna **tidak akan merasakan** perbedaan usabilitas
- Analoginya: seperti perbedaan suhu 0,07°C — secara teknis terukur, tetapi tidak terasa

---

## 5. Bagian D: Order Effect — Kontrol Urutan Pengujian

### Mengapa Perlu Dikontrol?

Dalam desain within-subject, ada risiko:
- **Learning effect**: Responden lebih terbiasa pada chatbot kedua → skor lebih tinggi
- **Fatigue effect**: Responden lelah pada chatbot kedua → skor lebih rendah
- Jika ada order effect, perbedaan skor bisa disebabkan urutan, bukan gaya bahasa

### Desain Counterbalance

| Kelompok | Urutan | N |
|----------|--------|---|
| 1 | Formal → Gen-Z | 283 |
| 2 | Gen-Z → Formal | 122 |

### Uji yang Dilakukan

**Welch t-test** (independent samples, tidak mengasumsikan varians sama):  
Membandingkan rata-rata selisih (D) antara kedua kelompok urutan.

### Hasil

| Parameter | Formal→Gen-Z | Gen-Z→Formal |
|-----------|-------------|-------------|
| N | 283 | 122 |
| Mean D | 0,73 | 0,19 |
| SD D | 7,55 | 9,29 |

| Statistik | Nilai |
|-----------|-------|
| Welch t | 0,5688 |
| Sig. (2-tailed) | **0,570** |
| **Keputusan** | **TIDAK SIGNIFIKAN** |

### Interpretasi

Urutan pengujian **tidak memengaruhi** hasil. Responden yang mengerjakan Formal dulu vs Gen-Z dulu menghasilkan selisih skor yang tidak berbeda secara statistik. Counterbalance berhasil.

---

## 6. Sintesis: Mengapa Hasil t-test dan Wilcoxon Bisa Berbeda?

Ini adalah pertanyaan kritis yang sering muncul di sidang:

| Aspek | Paired t-test | Wilcoxon |
|-------|--------------|----------|
| Hasil | Tidak signifikan (p=0,157) | Signifikan (p=0,003) |
| Basis | Rata-rata selisih | Ranking selisih |
| Pengaruh outlier | Sensitif (outlier menarik rata-rata) | Robust (menggunakan ranking) |
| Tied scores (D=0) | Tetap dihitung (menekan t) | Dikeluarkan (N efektif lebih kecil) |
| Asumsi | Normalitas (dilanggar) | Tidak perlu normalitas |

**Penjelasan:** Wilcoxon signifikan karena dari 287 responden yang memiliki selisih ≠ 0, lebih banyak yang memiliki ranking positif (174) daripada negatif (113). Pola ini konsisten meskipun besaran selisihnya kecil. Sementara t-test "terdilusi" oleh 118 responden dengan selisih = 0 yang menekan nilai t.

---

## 7. Kesimpulan Tahap 6

| Uji | Hasil | Makna |
|-----|-------|-------|
| Paired t-test | p = 0,157 (tidak signifikan) | Rata-rata tidak berbeda |
| Wilcoxon | p = 0,003 (signifikan) | Ada perbedaan ranking |
| Cohen's dz | 0,070 (trivial) | Perbedaan sangat kecil secara praktis |
| Order effect | p = 0,570 (tidak signifikan) | Urutan tidak bias |

### Kesimpulan Final

> Terdapat **indikasi perbedaan** secara nonparametrik (Wilcoxon signifikan), tetapi perbedaan tersebut **sangat kecil secara praktis** (Cohen's dz = 0,070, selisih 0,57 poin). Temuan ini **tidak cukup** untuk menyatakan keunggulan praktis yang kuat pada salah satu gaya bahasa chatbot.

---

## 8. Alur Proses Tahap 6

```
Skor CUQ Formal & Gen-Z (405 responden)
  │
  ├─ [A] Paired t-test
  │     → t = 1,418, p = 0,157 → Tidak Signifikan
  │
  ├─ [B] Wilcoxon Signed-Rank (UJI UTAMA)
  │     → W = 16.453,5, p = 0,003 → Signifikan
  │     → Tapi perlu cek effect size...
  │
  ├─ [C] Cohen's dz
  │     → dz = 0,070 → Trivial (sangat kecil)
  │     → Signifikansi statistik ≠ signifikansi praktis
  │
  ├─ [D] Order Effect
  │     → p = 0,570 → Tidak signifikan (urutan tidak bias)
  │
  └─ KESIMPULAN: Perbedaan terdeteksi tapi tidak bermakna secara praktis
       → Lanjut Tahap 7: Analisis Klaster CUQ
```

---

## 9. Catatan Metodologis

- **Mengapa melaporkan keduanya?** Transparansi akademik — pembaca dapat menilai sendiri
- **Mana yang diutamakan?** Wilcoxon, karena asumsi normalitas tidak terpenuhi
- **Mengapa effect size krusial?** Pada N besar, uji statistik sangat sensitif. Effect size memberikan perspektif praktis yang tidak bergantung pada ukuran sampel
- **Interpretasi hati-hati:** Signifikan secara statistik ≠ bermakna secara praktis. Ini adalah contoh klasik di mana kedua konsep harus dibedakan
- **Order effect terkontrol:** Hasil tidak dipengaruhi oleh urutan pengujian, sehingga perbedaan (sekecil apa pun) memang berasal dari variasi gaya bahasa
