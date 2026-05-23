# Tahap 8: Interpretasi & Kesimpulan Penelitian

**Input:** Seluruh hasil analisis dari Tahap 2–7  
**Output:** Interpretasi gabungan, jawaban rumusan masalah, dan simpulan akhir  
**Script:** `07_interpretasi_kesimpulan.py`

---

## 1. Ringkasan Seluruh Temuan Statistik

| Kategori | Parameter | Hasil |
|----------|-----------|-------|
| **Deskriptif** | Mean Formal | 72,92 |
| | Mean Gen-Z | 73,50 |
| | Selisih | 0,57 poin |
| **Normalitas** | Shapiro-Wilk | p < 0,001 (Tidak Normal) |
| **Uji Beda** | Paired t-test | t = 1,418, p = 0,157 (Tidak Signifikan) |
| | Wilcoxon | W = 16.453,5, p = 0,003 (Signifikan) |
| | Cohen's dz | 0,070 (Trivial) |
| | Order Effect | p = 0,570 (Tidak Signifikan) |
| **Klaster** | Persona & Afeksi | +2,27 (Gen-Z > Formal) |
| | Kualitas Informasi | −1,25 (Formal > Gen-Z) |
| | Navigasi & Kemudahan | +0,51 (Setara) |
| | Efektivitas Interaksi | +0,76 (Setara) |

---

## 2. Jawaban Rumusan Masalah 1

**"Bagaimana tingkat usabilitas interaksi komunikasi pada chatbot bergaya bahasa formal dan chatbot bergaya bahasa Generasi Z?"**

### Jawaban

Tingkat usabilitas kedua chatbot **relatif setara** dan berada pada kategori **Baik** mendekati **Sangat Baik**:

| Chatbot | Skor CUQ | Kategori |
|---------|----------|----------|
| Formal | 72,92 / 100 | Baik (mendekati Sangat Baik) |
| Gen-Z | 73,50 / 100 | Baik (mendekati Sangat Baik) |
| **Selisih** | **0,57 poin** | **< 1% skala** |

### Bukti Pendukung

- 96,3% responden menilai chatbot Formal pada kategori Baik–Sangat Baik
- 95,0% responden menilai chatbot Gen-Z pada kategori Baik–Sangat Baik
- Selisih 0,57 poin tidak cukup kuat untuk menyatakan keunggulan deskriptif yang substantif

### Makna

Kedua gaya bahasa mampu menghasilkan pengalaman usabilitas yang baik. Gaya formal **bukan hambatan**, dan gaya Gen-Z **bukan keunggulan** yang signifikan.

---

## 3. Jawaban Rumusan Masalah 2

**"Apakah terdapat perbedaan tingkat usabilitas (skor CUQ) antara chatbot bergaya bahasa formal dan chatbot bergaya bahasa Generasi Z?"**

### Jawaban

Temuan perlu ditafsirkan **secara hati-hati** karena hasil uji tidak sepenuhnya konsisten:

| Uji | Hasil | Interpretasi |
|-----|-------|-------------|
| Paired t-test | p = 0,157 | Tidak ada perbedaan rata-rata yang signifikan |
| Wilcoxon | p = 0,003 | Ada perbedaan ranking yang signifikan |
| Cohen's dz | 0,070 | Perbedaan sangat kecil secara praktis |

### Interpretasi Gabungan

> Terdapat **indikasi perbedaan** secara nonparametrik (Wilcoxon signifikan), tetapi ukuran efek sangat kecil (dz = 0,070). Temuan ini **tidak cukup** untuk menyatakan keunggulan praktis yang kuat pada salah satu gaya bahasa chatbot.

### Mengapa Wilcoxon Signifikan tapi t-test Tidak?

| Faktor | Penjelasan |
|--------|-----------|
| Tied scores | 118 responden (29,1%) memiliki selisih = 0 → dikeluarkan dari Wilcoxon |
| N efektif | Wilcoxon hanya menggunakan 287 responden (yang benar-benar berbeda) |
| Rasio ranking | Dari 287: 174 positif vs 113 negatif (rasio 61:39) — konsisten tapi kecil |
| Dilusi t-test | 118 responden dengan selisih nol "menekan" nilai t ke bawah |

### Analogi Sederhana

Bayangkan 405 orang mencicipi dua kopi. 118 orang bilang "sama saja". Dari 287 yang merasakan perbedaan, 174 bilang kopi B sedikit lebih enak, 113 bilang kopi A. Secara statistik ada kecenderungan ke kopi B, tapi perbedaan rasanya sangat tipis — hampir tidak terasa.

---

## 4. Jawaban Rumusan Masalah 3

**"Aspek usabilitas mana yang paling menonjol sebagai pembeda antara chatbot formal dan chatbot Generasi Z?"**

### Jawaban

**Tidak terdapat** aspek usabilitas yang menjadi pembeda dominan. Seluruh klaster CUQ memiliki selisih yang sangat kecil.

### Detail Per Klaster

| Klaster | Selisih | Signifikansi | Effect Size | Interpretasi |
|---------|---------|-------------|-------------|-------------|
| Persona & Afeksi | +2,27 | p < 0,001 | dz = 0,185 | Terbesar, tapi masih < "small" |
| Kualitas Informasi | −1,25 | p = 0,018 | dz = −0,108 | Formal sedikit lebih baik |
| Navigasi & Kemudahan | +0,51 | p = 0,184 | dz = 0,046 | Tidak signifikan |
| Efektivitas Interaksi | +0,76 | p = 0,121 | dz = 0,061 | Tidak signifikan |

### Pola Kompensasi

```
Gen-Z unggul di PERSONA (+2,27)  ←→  Formal unggul di INFORMASI (−1,25)
                    ↓                              ↓
         Saling mengompensasi → Skor total SETARA (selisih 0,57)
```

Ini menjelaskan mengapa skor total hampir sama meskipun ada perbedaan kecil di level dimensi.

---

## 5. Interpretasi dalam Kerangka Teori

### 5.1 CMC (Computer-Mediated Communication)

| Aspek Teori | Temuan Empiris |
|-------------|---------------|
| Isyarat nonverbal menghilang dalam komunikasi termediasi | ✓ Terkonfirmasi — chatbot hanya mengandalkan teks |
| Pengguna bergantung pada isyarat tekstual | ✓ Gaya Gen-Z berhasil sebagai isyarat sosial (Q2: kurang robotik) |
| Isyarat tekstual memengaruhi persepsi | ⚠️ Hanya memengaruhi dimensi persona, bukan usabilitas keseluruhan |

**Kontribusi:** Teori CMC perlu digunakan bersama pertimbangan kualitas konten dan desain interaksi. Isyarat tekstual saja tidak cukup.

### 5.2 TAM (Technology Acceptance Model)

| Konstruk TAM | Klaster CUQ Terkait | Temuan |
|-------------|-------------------|--------|
| PEOU (Perceived Ease of Use) | Navigasi & Kemudahan | Tidak berbeda (selisih 0,51) |
| PU (Perceived Usefulness) | Kualitas Informasi | Formal sedikit lebih baik (−1,25) |

**Kontribusi:** Gaya bahasa bukan faktor tunggal penentu PEOU dan PU. Penerimaan chatbot adalah hasil gabungan kejelasan bahasa, relevansi informasi, kemudahan navigasi, dan kualitas respons.

### 5.3 S-O-R (Stimulus-Organism-Response)

| Komponen | Dalam Penelitian | Status |
|----------|-----------------|--------|
| **S** (Stimulus) | Variasi gaya bahasa (Formal vs Gen-Z) | ✓ Diberikan |
| **O** (Organism) | Proses perseptual Generasi Z | ⚠️ Dipengaruhi faktor lain |
| **R** (Response) | Skor CUQ | ✗ Tidak berbeda signifikan |

**Kontribusi:** Jalur S-O-R tidak linier dalam konteks ini. Stimulus gaya bahasa saja tidak cukup menghasilkan respons usabilitas yang berbeda. Organism (persepsi pengguna) dipengaruhi oleh:
- Kualitas isi jawaban chatbot
- Pengalaman sebelumnya dengan chatbot
- Kebiasaan responden dalam menjawab kuesioner
- Ekspektasi terhadap layanan institusi resmi

---

## 6. Implikasi Praktis

### Bagi Universitas Lampung

| No | Rekomendasi | Dasar Temuan |
|----|-------------|-------------|
| 1 | Kembangkan gaya bahasa **hibrida** (formal + ramah) | Keduanya setara; tidak perlu pilih salah satu |
| 2 | Prioritaskan **kualitas informasi** dan **akurasi jawaban** | Kualitas Informasi = dimensi tertinggi |
| 3 | Perbaiki **navigasi dan alur interaksi** | Navigasi = dimensi terendah di kedua kondisi |
| 4 | Gaya Gen-Z boleh digunakan untuk **sapaan dan pembuka** | Gen-Z unggul di persona/keramahan |
| 5 | Pertahankan gaya formal untuk **isi informasi resmi** | Formal unggul di kejelasan informasi |

### Bagi Pengembangan Ilmu Komunikasi

| Implikasi Teoretis | Penjelasan |
|-------------------|-----------|
| Evolusi CMC | Isyarat tekstual penting tapi tidak cukup tanpa kualitas konten |
| Penguatan TAM | Gaya bahasa bukan faktor tunggal PEOU dan PU |
| Revisi S-O-R | Jalur stimulus→respons tidak linier; organism dipengaruhi multi-faktor |

---

## 7. Keterbatasan yang Perlu Diakui

| Keterbatasan | Implikasi |
|-------------|-----------|
| Persepsi sesaat (satu kali interaksi) | Hasil mungkin berbeda jika interaksi berulang |
| Konteks lokal (Lampung) | Faktor budaya lokal mungkin memengaruhi |
| CUQ tidak mengukur trust/empati | Aspek psikologis lebih dalam belum terukur |
| Straight-liner (29,1% selisih = 0) | Banyak responden mungkin tidak merasakan perbedaan |

---

## 8. Saran Penelitian Lanjutan

| Saran | Tujuan |
|-------|--------|
| Tambah variabel emosional (trust, empati) | Melihat aspek psikologis yang lebih dalam |
| Studi longitudinal (satu periode PMB) | Melihat perubahan persepsi seiring waktu |
| Content analysis transkrip percakapan | Memetakan pola bahasa dari sisi pengguna |
| Eksperimen avatar visual | Menguji efek sinergis visual + bahasa |
| Desain eksperimen lebih sensitif | Instrumen yang lebih tajam membedakan gaya bahasa |

---

## 9. Alur Keseluruhan Penelitian (Tahap 2–8)

```
┌─────────────────────────────────────────────────────────────────┐
│ TAHAP 2: Data Cleaning                                          │
│   → 405 responden valid, 1 anomali dikoreksi                   │
├─────────────────────────────────────────────────────────────────┤
│ TAHAP 3: Reverse Scoring & Normalisasi                          │
│   → Skor CUQ 0-100 per responden per kondisi                   │
├─────────────────────────────────────────────────────────────────┤
│ TAHAP 4: Validitas & Reliabilitas                               │
│   → Instrumen valid & sangat reliabel (α > 0,9)                │
├─────────────────────────────────────────────────────────────────┤
│ TAHAP 5: Uji Normalitas                                         │
│   → Selisih tidak normal → Wilcoxon sebagai uji utama           │
├─────────────────────────────────────────────────────────────────┤
│ TAHAP 6: Uji Beda                                               │
│   → t-test: tidak signifikan                                    │
│   → Wilcoxon: signifikan tapi effect size trivial               │
│   → Order effect: tidak signifikan                              │
├─────────────────────────────────────────────────────────────────┤
│ TAHAP 7: Analisis Klaster                                       │
│   → Tidak ada klaster pembeda dominan                           │
│   → Pola kompensasi: Gen-Z↑persona, Formal↑informasi           │
├─────────────────────────────────────────────────────────────────┤
│ TAHAP 8: Interpretasi & Kesimpulan                              │
│   → Usabilitas setara                                           │
│   → Gaya bahasa bukan faktor dominan                            │
│   → Rekomendasi: pendekatan hibrida                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Pernyataan Penutup

Penelitian ini menunjukkan bahwa dalam konteks chatbot PMB Universitas Lampung, **gaya bahasa merupakan salah satu variasi strategi pesan** — bukan faktor penentu tunggal usabilitas. Efektivitas chatbot lebih ditentukan oleh **gabungan** kualitas informasi, kemudahan navigasi, efektivitas interaksi, dan persona chatbot secara keseluruhan.

Temuan "tidak ada perbedaan signifikan" bukan berarti penelitian gagal — justru memberikan **bukti empiris** bahwa:
1. Gaya formal tidak perlu ditakuti sebagai hambatan komunikasi
2. Gaya Gen-Z tidak otomatis menjadi solusi peningkatan usabilitas
3. Pengembangan chatbot perlu pendekatan **holistik**, bukan sekadar perubahan gaya bahasa
