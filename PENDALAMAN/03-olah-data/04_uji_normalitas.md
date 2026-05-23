# Tahap 5: Uji Normalitas Distribusi Selisih Skor CUQ

**Input:** Skor CUQ total (0–100) untuk Formal dan Gen-Z, masing-masing 405 responden  
**Output:** Keputusan pemilihan uji beda (parametrik vs nonparametrik)  
**Script:** `04_uji_normalitas.py`

---

## 1. Mengapa Menguji Normalitas Selisih?

Desain penelitian ini adalah **within-subject (paired)** — setiap responden menguji kedua chatbot. Oleh karena itu:

| Yang Diuji | Alasan |
|-----------|--------|
| ✓ Normalitas **selisih** (D = Gen-Z − Formal) | Paired t-test mensyaratkan selisih berdistribusi normal |
| ✗ Bukan normalitas masing-masing skor | Itu syarat untuk independent t-test, bukan paired |

**Logika:** Paired t-test menguji apakah rata-rata selisih berbeda dari nol. Jika selisih tidak normal, asumsi uji dilanggar → perlu alternatif nonparametrik.

---

## 2. Statistik Deskriptif Selisih (D = Gen-Z − Formal)

| Indikator | Nilai | Interpretasi |
|-----------|-------|-------------|
| N | 405 | |
| Mean | 0,57 | Rata-rata selisih sangat kecil |
| SD | 8,10 | Variasi selisih cukup besar |
| Median | **0,00** | Titik tengah tepat di nol |
| Min | −43,75 | Ada responden yang menilai Formal jauh lebih tinggi |
| Max | 39,06 | Ada responden yang menilai Gen-Z jauh lebih tinggi |
| Skewness | −1,04 | Miring ke kiri (negatif) |
| Kurtosis | 8,13 | Sangat leptokurtik (lancip, ekor berat) |

### Distribusi Arah Selisih

| Arah | Jumlah | Persentase | Makna |
|------|--------|-----------|-------|
| D > 0 (Gen-Z lebih tinggi) | 174 | 43,0% | Responden yang menilai Gen-Z lebih baik |
| D = 0 (sama persis) | 118 | 29,1% | Responden yang menilai keduanya identik |
| D < 0 (Formal lebih tinggi) | 113 | 27,9% | Responden yang menilai Formal lebih baik |

**Insight:** Hampir sepertiga responden (29,1%) memberikan skor yang persis sama untuk kedua chatbot. Ini menunjukkan banyak responden tidak merasakan perbedaan apa pun.

---

## 3. Hasil Uji Normalitas

### 3.1 Uji Shapiro-Wilk

| Parameter | Nilai |
|-----------|-------|
| Hipotesis H0 | Distribusi selisih berdistribusi normal |
| Hipotesis H1 | Distribusi selisih TIDAK berdistribusi normal |
| Statistik W | 0,8356 |
| p-value | < 0,001 (sangat kecil) |
| Kriteria | p < 0,05 → Tolak H0 |
| **Keputusan** | **TIDAK NORMAL** |

### 3.2 Uji Kolmogorov-Smirnov

| Parameter | Nilai |
|-----------|-------|
| Hipotesis H0 | Distribusi selisih berdistribusi normal |
| Hipotesis H1 | Distribusi selisih TIDAK berdistribusi normal |
| Statistik D | 0,1929 |
| p-value | < 0,001 (sangat kecil) |
| Kriteria | p < 0,05 → Tolak H0 |
| **Keputusan** | **TIDAK NORMAL** |

### 3.3 Ringkasan Kedua Uji

| Uji | Statistik | p-value | Keputusan |
|-----|-----------|---------|-----------|
| Shapiro-Wilk | 0,836 | < 0,001 | ❌ Tidak Normal |
| Kolmogorov-Smirnov | 0,193 | < 0,001 | ❌ Tidak Normal |

Kedua uji sepakat: distribusi selisih **tidak berdistribusi normal**.

---

## 4. Mengapa Distribusi Tidak Normal?

### 4.1 Spike di Titik Nol (Tied Scores)

```
Distribusi selisih:
       < -20:    9 █
 -20 s/d -10:   15 ███
  -10 s/d -5:   22 ████
    -5 s/d 0:  185 █████████████████████████████████████
         = 0:  118 ███████████████████████
     0 s/d 5:  104 ████████████████████
    5 s/d 10:   40 ████████
   10 s/d 20:   25 █████
        > 20:    5 █
```

**118 responden (29,1%)** memiliki selisih tepat = 0. Ini menciptakan "spike" yang tidak mungkin ada pada distribusi normal kontinu.

### 4.2 Kurtosis Tinggi (Leptokurtik)

Kurtosis = 8,13 (jauh di atas 0 untuk distribusi normal). Artinya:
- Distribusi sangat **lancip** di tengah
- **Ekor lebih berat** dari distribusi normal (ada beberapa selisih ekstrem)

### 4.3 Skewness Negatif

Skewness = −1,04. Distribusi sedikit miring ke kiri, artinya ada beberapa responden dengan selisih negatif yang cukup besar (menilai Formal jauh lebih tinggi dari Gen-Z).

### 4.4 Penyebab Substantif

| Penyebab | Penjelasan |
|----------|-----------|
| Straight-liner | 60–69 responden menjawab identik di kedua kondisi → selisih = 0 |
| Skor diskret | CUQ menghasilkan skor kelipatan 1,5625 (= 100/64), bukan kontinu |
| Perbedaan kecil | Selisih rata-rata hanya 0,57 poin → mayoritas responden di sekitar nol |

---

## 5. Implikasi: Pemilihan Uji Beda

Karena asumsi normalitas **tidak terpenuhi**, maka:

| Uji | Status | Peran dalam Penelitian |
|-----|--------|----------------------|
| **Wilcoxon Signed-Rank Test** | ✓ Acuan utama | Tidak mensyaratkan normalitas; membandingkan ranking selisih |
| Paired Sample t-test | Informasi pembanding | Asumsi dilanggar; tetap dilaporkan untuk transparansi |

### Mengapa Tetap Melaporkan Paired t-test?

1. **Transparansi** — pembaca dapat melihat kedua hasil dan membandingkan
2. **Robustness** — paired t-test cukup robust terhadap pelanggaran normalitas pada N besar (N=405)
3. **Konvensi akademik** — banyak jurnal mengharapkan kedua uji dilaporkan
4. **Konsistensi interpretasi** — jika keduanya sepakat, kesimpulan lebih kuat

---

## 6. Informasi Tambahan: Normalitas Per Kondisi

| Kondisi | Shapiro-Wilk W | p-value | Keputusan |
|---------|---------------|---------|-----------|
| Formal | 0,954 | < 0,001 | Tidak Normal |
| Gen-Z | 0,936 | < 0,001 | Tidak Normal |
| **Selisih** | **0,836** | **< 0,001** | **Tidak Normal** |

Catatan: Normalitas per kondisi bukan syarat paired t-test, tetapi menunjukkan bahwa data secara keseluruhan memang tidak mengikuti distribusi normal.

---

## 7. Alur Keputusan

```
Skor CUQ Formal (405) & Skor CUQ Gen-Z (405)
  │
  ├─ Hitung Selisih: D = Gen-Z - Formal
  │
  ├─ Uji Normalitas Selisih
  │     ├─ Shapiro-Wilk: p < 0,001 → TIDAK NORMAL
  │     └─ Kolmogorov-Smirnov: p < 0,001 → TIDAK NORMAL
  │
  ├─ KEPUTUSAN:
  │     ├─ Uji Utama: Wilcoxon Signed-Rank Test (nonparametrik)
  │     └─ Uji Pembanding: Paired t-test (parametrik, dilaporkan)
  │
  └─ → Lanjut Tahap 6: Uji Beda
```

---

## 8. Catatan Metodologis

- **Shapiro-Wilk** dipilih karena merupakan uji normalitas paling powerful untuk sampel menengah-besar
- **Kolmogorov-Smirnov** dilaporkan sebagai konfirmasi tambahan
- Pada N besar (>300), uji normalitas cenderung menolak H0 bahkan untuk deviasi kecil dari normal. Namun dalam kasus ini, deviasi sangat jelas (kurtosis = 8,13, banyak tied scores)
- Keputusan menggunakan Wilcoxon sebagai acuan utama sudah tepat secara metodologis
- Wilcoxon signed-rank test hanya menggunakan responden dengan selisih ≠ 0 (N nonzero = 287 dari 405)
