# Tahap 3: Reverse Scoring & Normalisasi Skor CUQ

**Input:** Data bersih hasil cleaning (405 responden, 16 item CUQ per kondisi)  
**Output:** Skor CUQ total per responden dalam skala 0–100  
**Script:** `02_scoring_cuq.py`

---

## 1. Mengapa Perlu Reverse Scoring?

CUQ dirancang dengan **item positif dan item negatif secara bergantian**. Tujuannya adalah mengurangi response bias (kecenderungan responden menjawab semua "setuju" tanpa membaca).

Masalahnya: pada item negatif, skor tinggi (5 = Sangat Setuju) justru berarti **usabilitas buruk**. Contoh:
- Q2: "Chatbot terasa terlalu kaku atau robotik" → Jika dijawab 5 (Sangat Setuju), artinya chatbot **buruk**
- Q1: "Kepribadian chatbot terasa realistis dan menarik" → Jika dijawab 5 (Sangat Setuju), artinya chatbot **baik**

Agar semua item memiliki arah yang sama (skor tinggi = usabilitas baik), item negatif harus **dibalik**.

---

## 2. Klasifikasi Item Positif dan Negatif

| Tipe | Nomor Item | Contoh Pernyataan |
|------|-----------|-------------------|
| **Positif** | Q1, Q3, Q5, Q7, Q9, Q11, Q13, Q15 | "Kepribadian chatbot terasa realistis dan menarik" |
| **Negatif** | Q2, Q4, Q6, Q8, Q10, Q12, Q14, Q16 | "Chatbot terasa terlalu kaku atau robotik" |

**Pola:** Ganjil = Positif, Genap = Negatif

---

## 3. Rumus Konversi

| Tipe Item | Rumus | Rentang Hasil |
|-----------|-------|---------------|
| **Positif** | Skor konversi = Skor mentah − 1 | 0–4 |
| **Negatif** | Skor konversi = 5 − Skor mentah | 0–4 |

**Logika:**
- Item positif: jawaban 5 (sangat setuju) → 5−1 = **4** (skor tertinggi)
- Item positif: jawaban 1 (sangat tidak setuju) → 1−1 = **0** (skor terendah)
- Item negatif: jawaban 1 (sangat tidak setuju = chatbot TIDAK buruk) → 5−1 = **4** (skor tertinggi)
- Item negatif: jawaban 5 (sangat setuju = chatbot BURUK) → 5−5 = **0** (skor terendah)

---

## 4. Demonstrasi Manual (Responden #1, CUQ Formal)

| Item | Tipe | Skor Mentah | Rumus | Skor Konversi |
|------|------|-------------|-------|---------------|
| Q1 | Positif | 4 | 4 − 1 | **3** |
| Q2 | Negatif | 4 | 5 − 4 | **1** |
| Q3 | Positif | 4 | 4 − 1 | **3** |
| Q4 | Negatif | 3 | 5 − 3 | **2** |
| Q5 | Positif | 4 | 4 − 1 | **3** |
| Q6 | Negatif | 3 | 5 − 3 | **2** |
| Q7 | Positif | 4 | 4 − 1 | **3** |
| Q8 | Negatif | 3 | 5 − 3 | **2** |
| Q9 | Positif | 4 | 4 − 1 | **3** |
| Q10 | Negatif | 3 | 5 − 3 | **2** |
| Q11 | Positif | 4 | 4 − 1 | **3** |
| Q12 | Negatif | 3 | 5 − 3 | **2** |
| Q13 | Positif | 4 | 4 − 1 | **3** |
| Q14 | Negatif | 3 | 5 − 3 | **2** |
| Q15 | Positif | 4 | 4 − 1 | **3** |
| Q16 | Negatif | 3 | 5 − 3 | **2** |
| | | | **Total** | **39** |

---

## 5. Normalisasi ke Skala 0–100

### Rumus

```
Skor CUQ = (Total skor konversi × 100) / 64
```

### Penjelasan Angka 64

- Setiap item setelah konversi memiliki rentang 0–4
- Total 16 item × 4 (skor maks per item) = **64** (skor maksimum yang mungkin)
- Pembagian dengan 64 lalu dikali 100 menghasilkan persentase 0–100

### Contoh Perhitungan (Responden #1)

```
Skor CUQ = (39 × 100) / 64 = 60,94
```

Interpretasi: Responden #1 memberikan penilaian usabilitas chatbot formal sebesar **60,94 dari 100**.

---

## 6. Hasil Skor CUQ Final (Statistik Deskriptif)

| Indikator | Formal | Gen-Z |
|-----------|--------|-------|
| N | 405 | 405 |
| **Mean** | **72,92** | **73,50** |
| SD | 16,95 | 18,50 |
| Median | 75,00 | 76,56 |
| Min | 20,31 | 20,31 |
| Max | 100,00 | 100,00 |
| **Selisih Mean** | | **0,57 poin** |

---

## 7. Distribusi Kategori Skor

| Kategori | Formal | Gen-Z |
|----------|--------|-------|
| Rendah (0–25) | 2 (0,5%) | 2 (0,5%) |
| Cukup (26–50) | 13 (3,2%) | 18 (4,4%) |
| Baik (51–75) | 178 (44,0%) | 167 (41,2%) |
| Sangat Baik (76–100) | 212 (52,3%) | 218 (53,8%) |

**Interpretasi:**
- Mayoritas responden (>95%) menilai kedua chatbot pada kategori **Baik** hingga **Sangat Baik**
- Distribusi kategori antara Formal dan Gen-Z sangat mirip
- Hanya 2 responden (0,5%) yang memberikan skor rendah pada masing-masing kondisi

---

## 8. Kasus Khusus: Straight-Liner

Bagaimana skor straight-liner setelah proses ini?

| Jawaban Straight-Line | Konversi Positif | Konversi Negatif | Total | Skor CUQ |
|----------------------|-----------------|-----------------|-------|----------|
| Semua = 1 | 1−1 = 0 | 5−1 = 4 | 32 | 50,00 |
| Semua = 2 | 2−1 = 1 | 5−2 = 3 | 32 | 50,00 |
| **Semua = 3** | 3−1 = 2 | 5−3 = 2 | **32** | **50,00** |
| Semua = 4 | 4−1 = 3 | 5−4 = 1 | 32 | 50,00 |
| Semua = 5 | 5−1 = 4 | 5−5 = 0 | 32 | 50,00 |

**Catatan penting:** Semua straight-liner menghasilkan skor CUQ = **50,00** (titik tengah), terlepas dari nilai yang dipilih. Ini karena item positif dan negatif saling mengompensasi. Skor 50 berarti "netral" — tidak baik, tidak buruk.

---

## 9. Verifikasi Hasil

| Aspek | Formal | Gen-Z | Status |
|-------|--------|-------|--------|
| Rentang skor | 20,31 – 100,00 | 20,31 – 100,00 | ✓ Dalam 0–100 |
| Jumlah data | 405 | 405 | ✓ Lengkap |
| Tidak ada NaN | Ya | Ya | ✓ Bersih |

---

## 10. Alur Proses Tahap 3

```
Data Bersih (405 × 16 item per kondisi)
  │
  ├─ [1] Identifikasi item positif (ganjil) & negatif (genap)
  │
  ├─ [2] Konversi item positif: skor - 1
  │
  ├─ [3] Konversi item negatif: 5 - skor
  │
  ├─ [4] Jumlahkan 16 item konversi → Total (0-64)
  │
  ├─ [5] Normalisasi: (Total × 100) / 64 → Skor CUQ (0-100)
  │
  └─ Skor CUQ Final (405 responden × 2 kondisi) → Siap uji validitas & reliabilitas
```

---

## 11. Catatan Metodologis

- Prosedur skoring ini mengikuti panduan resmi **CUQ Usage Guide** dari Ulster University
- Rumus `(skor-1)` untuk positif dan `(5-skor)` untuk negatif memastikan semua item memiliki arah yang sama: **skor tinggi = usabilitas baik**
- Normalisasi ke 0–100 memudahkan interpretasi dan perbandingan lintas studi
- Skor 50 merupakan titik netral (tidak baik/tidak buruk)
- Skor di atas 68 umumnya dianggap "above average" dalam konteks usabilitas (analog dengan SUS)
