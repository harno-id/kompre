# Tahap 7: Analisis Klaster CUQ (Per-Dimensi Usabilitas)

**Input:** Skor CUQ per item (16 item × 405 responden × 2 kondisi)  
**Output:** Identifikasi aspek usabilitas yang paling menonjol sebagai pembeda  
**Script:** `06_analisis_klaster.py`

---

## 1. Tujuan

Menjawab **Rumusan Masalah 3**: *Aspek usabilitas mana yang paling menonjol sebagai pembeda antara chatbot formal dan chatbot Generasi Z?*

Analisis ini memecah skor total CUQ menjadi 4 dimensi (klaster) untuk melihat apakah ada aspek tertentu yang menunjukkan perbedaan lebih besar dibanding aspek lainnya.

---

## 2. Definisi 4 Klaster CUQ

### Klaster 1: Persona & Afeksi (Q1–Q4)

| Item | Tipe | Pernyataan |
|------|------|-----------|
| Q1 | Positif | Kepribadian chatbot terasa realistis dan menarik |
| Q2 | Negatif | Chatbot terasa terlalu kaku atau robotik |
| Q3 | Positif | Chatbot bersikap ramah pada awal interaksi |
| Q4 | Negatif | Chatbot terlihat tidak bersahabat |

**Mengukur:** Karakter, keramahan, dan kesan "hidup" chatbot

### Klaster 2: Kualitas Informasi (Q5, Q6, Q11, Q12)

| Item | Tipe | Pernyataan |
|------|------|-----------|
| Q5 | Positif | Chatbot menjelaskan tujuan dan fungsinya dengan jelas |
| Q6 | Negatif | Chatbot tidak memberikan penjelasan mengenai tujuannya |
| Q11 | Positif | Respon chatbot bermanfaat, relevan, dan informatif |
| Q12 | Negatif | Respon chatbot tidak relevan |

**Mengukur:** Kejelasan tujuan, relevansi, dan kebermanfaatan respons

### Klaster 3: Navigasi & Kemudahan (Q7, Q8, Q15, Q16)

| Item | Tipe | Pernyataan |
|------|------|-----------|
| Q7 | Positif | Chatbot mudah digunakan untuk bernavigasi |
| Q8 | Negatif | Saya mudah merasa bingung saat menggunakan chatbot |
| Q15 | Positif | Chatbot sangat mudah digunakan |
| Q16 | Negatif | Chatbot terasa sangat kompleks |

**Mengukur:** Kemudahan penggunaan dan kompleksitas interaksi

### Klaster 4: Efektivitas Interaksi (Q9, Q10, Q13, Q14)

| Item | Tipe | Pernyataan |
|------|------|-----------|
| Q9 | Positif | Chatbot memahami pertanyaan/masukan saya dengan baik |
| Q10 | Negatif | Chatbot sering gagal memahami masukan saya |
| Q13 | Positif | Chatbot mampu menangani kesalahan dengan baik |
| Q14 | Negatif | Chatbot tidak mampu menangani kesalahan |

**Mengukur:** Kemampuan chatbot memahami input dan menangani error

---

## 3. Hasil Perbandingan Rata-Rata Per Klaster

### Skala 0–100

| Klaster | Mean Formal | Mean Gen-Z | Selisih | Arah |
|---------|-------------|-----------|---------|------|
| Kualitas Informasi | **78,19** | **76,94** | −1,25 | ← Formal sedikit lebih tinggi |
| Efektivitas Interaksi | 73,27 | 74,03 | +0,76 | → Gen-Z sedikit lebih tinggi |
| Persona & Afeksi | 72,81 | 75,08 | +2,27 | → Gen-Z sedikit lebih tinggi |
| Navigasi & Kemudahan | 67,42 | 67,93 | +0,51 | ≈ Setara |

### Visualisasi

```
Persona & Afeksi
  Formal : █████████████████████████████░░░░░░░░░░░ 72,8%
  Gen-Z  : ██████████████████████████████░░░░░░░░░░ 75,1%
  Selisih: +2,27

Kualitas Informasi
  Formal : ███████████████████████████████░░░░░░░░░ 78,2%
  Gen-Z  : ██████████████████████████████░░░░░░░░░░ 76,9%
  Selisih: −1,25

Navigasi & Kemudahan
  Formal : ██████████████████████████░░░░░░░░░░░░░░ 67,4%
  Gen-Z  : ███████████████████████████░░░░░░░░░░░░░ 67,9%
  Selisih: +0,51

Efektivitas Interaksi
  Formal : █████████████████████████████░░░░░░░░░░░ 73,3%
  Gen-Z  : █████████████████████████████░░░░░░░░░░░ 74,0%
  Selisih: +0,76
```

**Temuan:** Selisih terbesar hanya 2,27 poin (Persona & Afeksi) — masih sangat kecil pada skala 0–100.

---

## 4. Uji Wilcoxon Per Klaster

| Klaster | W-stat | p-value | N nonzero | Cohen's dz | Keputusan |
|---------|--------|---------|-----------|-----------|-----------|
| **Persona & Afeksi** | 9.092,5 | **0,000008** | 233 | 0,185 | Signifikan* |
| **Kualitas Informasi** | 7.970,5 | **0,018** | 198 | −0,108 | Signifikan* |
| Navigasi & Kemudahan | 10.422,0 | 0,184 | 215 | 0,046 | Tidak Signifikan |
| Efektivitas Interaksi | 9.633,0 | 0,121 | 209 | 0,061 | Tidak Signifikan |

*\* Signifikan secara statistik, tetapi effect size tetap kecil (< 0,2)*

### Interpretasi

- **Persona & Afeksi** menunjukkan perbedaan paling "kuat" (dz = 0,185), tetapi masih di bawah threshold "small effect" (0,2). Gen-Z dinilai sedikit lebih baik dalam aspek keramahan dan karakter.
- **Kualitas Informasi** signifikan dengan arah terbalik — Formal dinilai sedikit lebih baik dalam kejelasan dan relevansi informasi (dz = −0,108).
- **Navigasi & Kemudahan** dan **Efektivitas Interaksi** tidak signifikan — kedua chatbot dinilai setara.

---

## 5. Analisis Per Item (Detail)

### Item dengan Selisih Terbesar

| Item | Klaster | Mean F | Mean G | Selisih | Interpretasi |
|------|---------|--------|--------|---------|-------------|
| **Q2** | Persona & Afeksi | 2,40 | 2,77 | **+0,37** | Gen-Z dinilai KURANG kaku/robotik |
| **Q1** | Persona & Afeksi | 2,91 | 3,12 | **+0,21** | Gen-Z dinilai lebih realistis |
| Q4 | Persona & Afeksi | 3,17 | 3,05 | −0,12 | Formal dinilai lebih bersahabat |
| Q16 | Navigasi & Kemudahan | 1,70 | 1,80 | +0,10 | Gen-Z dinilai kurang kompleks |
| Q13 | Efektivitas Interaksi | 2,92 | 3,01 | +0,10 | Gen-Z dinilai lebih baik tangani error |

### Item yang Hampir Identik (Selisih < 0,01)

| Item | Klaster | Mean F | Mean G | Selisih |
|------|---------|--------|--------|---------|
| Q7 | Navigasi & Kemudahan | 2,98 | 2,99 | +0,005 |
| Q9 | Efektivitas Interaksi | 3,11 | 3,10 | −0,005 |
| Q10 | Efektivitas Interaksi | 2,79 | 2,80 | +0,007 |
| Q8 | Navigasi & Kemudahan | 2,79 | 2,78 | −0,010 |

---

## 6. Pola Temuan: Apa yang Sebenarnya Terjadi?

### Gen-Z Unggul di Aspek "Persona"

Item Q1 dan Q2 (kesan realistis, tidak kaku) menunjukkan selisih terbesar yang menguntungkan Gen-Z. Ini masuk akal — gaya bahasa Gen-Z memang dirancang untuk terasa lebih "hidup" dan kurang robotik.

### Formal Unggul di Aspek "Informasi"

Item Q5, Q6, Q11, Q12 (kejelasan tujuan, relevansi) sedikit lebih tinggi pada Formal. Ini mengindikasikan bahwa gaya formal dipersepsikan lebih jelas dan langsung dalam menyampaikan informasi.

### Navigasi & Efektivitas: Tidak Terpengaruh Gaya Bahasa

Item Q7–Q10, Q13–Q16 hampir identik. Kemudahan navigasi dan kemampuan memahami input tidak dipengaruhi oleh gaya bahasa — ini lebih ditentukan oleh desain teknis chatbot.

### Kesimpulan Pola

```
Gaya bahasa memengaruhi PERSEPSI KARAKTER (persona) chatbot,
tetapi TIDAK memengaruhi persepsi terhadap:
  - Kemudahan navigasi
  - Kualitas informasi (bahkan Formal sedikit lebih baik)
  - Efektivitas interaksi teknis
```

---

## 7. Hubungan dengan Kerangka Teori

### CMC (Computer-Mediated Communication)

Gaya bahasa Gen-Z berfungsi sebagai **isyarat sosial (social cues)** yang membuat chatbot terasa kurang robotik (Q2) dan lebih realistis (Q1). Namun, isyarat ini hanya memengaruhi dimensi persona — tidak cukup kuat untuk mengubah persepsi keseluruhan usabilitas.

### TAM (Technology Acceptance Model)

- **PEOU (Perceived Ease of Use):** Tidak terpengaruh gaya bahasa (Navigasi & Kemudahan setara)
- **PU (Perceived Usefulness):** Tidak terpengaruh, bahkan Formal sedikit lebih baik di Kualitas Informasi

### S-O-R (Stimulus-Organism-Response)

- **Stimulus:** Variasi gaya bahasa berhasil menciptakan perbedaan persepsi persona
- **Organism:** Responden memproses isyarat bahasa, tetapi faktor lain (kualitas isi, pengalaman sebelumnya) juga berperan
- **Response:** Skor CUQ total tidak berbeda signifikan karena keunggulan persona Gen-Z dikompensasi oleh keunggulan informasi Formal

---

## 8. Kesimpulan Tahap 7

| Temuan | Detail |
|--------|--------|
| Ada pembeda dominan? | **TIDAK** — seluruh klaster memiliki selisih sangat kecil |
| Klaster dengan selisih terbesar | Persona & Afeksi (+2,27 poin, dz = 0,185) |
| Klaster dengan arah terbalik | Kualitas Informasi (−1,25 poin, Formal lebih baik) |
| Klaster paling setara | Navigasi & Kemudahan (+0,51 poin) |
| Pola konsisten? | Ya — urutan prioritas dimensi sama di kedua kondisi |

### Jawaban untuk Rumusan Masalah 3

> Tidak terdapat aspek usabilitas yang paling menonjol sebagai pembeda kuat antara kedua kondisi. Seluruh klaster dimensi CUQ memiliki selisih yang sangat kecil. Gaya bahasa hanya sedikit memengaruhi dimensi Persona & Afeksi, tetapi tidak cukup untuk mengubah persepsi usabilitas secara keseluruhan.

---

## 9. Alur Proses Tahap 7

```
Skor CUQ per item (16 item × 405 responden × 2 kondisi)
  │
  ├─ [1] Kelompokkan item ke 4 klaster
  │
  ├─ [2] Hitung rata-rata per klaster
  │     → Selisih terbesar: Persona & Afeksi (+2,27 poin)
  │     → Selisih terkecil: Navigasi & Kemudahan (+0,51 poin)
  │
  ├─ [3] Uji Wilcoxon per klaster
  │     → Persona & Afeksi: signifikan (p<0,001) tapi dz=0,185
  │     → Kualitas Informasi: signifikan (p=0,018) tapi dz=−0,108
  │     → Navigasi & Efektivitas: tidak signifikan
  │
  ├─ [4] Analisis per item
  │     → Q2 (kaku/robotik) selisih terbesar (+0,37)
  │     → Q7, Q9, Q10 hampir identik (selisih < 0,01)
  │
  └─ KESIMPULAN: Tidak ada klaster pembeda dominan
       → Gaya bahasa hanya sedikit memengaruhi persona
       → Usabilitas keseluruhan ditentukan oleh gabungan semua dimensi
```

---

## 10. Catatan Metodologis

- Analisis klaster menggunakan **rata-rata item dalam klaster** (bukan skor total) agar perbandingan antar klaster adil (semua klaster memiliki 4 item)
- Uji Wilcoxon per klaster dilakukan sebagai eksplorasi tambahan — bukan uji hipotesis utama
- Effect size per klaster tetap kecil (< 0,2), konsisten dengan temuan skor total
- Pola "Gen-Z unggul di persona, Formal unggul di informasi" menjelaskan mengapa skor total hampir setara — kedua keunggulan saling mengompensasi
