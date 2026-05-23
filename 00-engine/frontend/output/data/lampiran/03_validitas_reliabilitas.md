# Tahap 4: Uji Validitas & Reliabilitas Instrumen CUQ

**Input:** Skor CUQ (16 item per kondisi, 405 responden)  
**Output:** Keputusan apakah instrumen layak digunakan untuk analisis  
**Script:** `03_validitas_reliabilitas.py`, `03b_validitas_raw.py`

---

## 1. Tujuan Uji Validitas & Reliabilitas

| Uji | Pertanyaan yang Dijawab |
|-----|------------------------|
| **Validitas** | Apakah setiap item CUQ benar-benar mengukur konstruk "usabilitas chatbot"? |
| **Reliabilitas** | Apakah instrumen CUQ menghasilkan pengukuran yang konsisten (stabil)? |

Kedua uji ini dilakukan **sebelum** analisis inferensial (uji beda) untuk memastikan data yang dianalisis berasal dari instrumen yang layak.

---

## 2. Uji Validitas Item

### 2.1 Metode

**Korelasi Item-Total (Pearson Product Moment)**  
Mengukur seberapa kuat hubungan antara skor setiap item dengan skor total instrumen.

### 2.2 Kriteria

| Parameter | Nilai |
|-----------|-------|
| N (sampel) | 405 |
| df (degrees of freedom) | 403 (N − 2) |
| α (signifikansi) | 0,05 (two-tailed) |
| **r tabel** | **0,098** |
| Keputusan | r hitung > r tabel → **Valid** |

### 2.3 Hasil Uji Validitas (Skor Setelah Reverse Scoring)

| Item | r Formal | Keputusan | r Gen-Z | Keputusan |
|------|----------|-----------|---------|-----------|
| CUQ 1 | 0,580 | ✓ Valid | 0,681 | ✓ Valid |
| CUQ 2 | 0,637 | ✓ Valid | 0,758 | ✓ Valid |
| CUQ 3 | 0,556 | ✓ Valid | 0,622 | ✓ Valid |
| CUQ 4 | 0,743 | ✓ Valid | 0,782 | ✓ Valid |
| CUQ 5 | 0,677 | ✓ Valid | 0,699 | ✓ Valid |
| CUQ 6 | 0,694 | ✓ Valid | 0,690 | ✓ Valid |
| CUQ 7 | 0,611 | ✓ Valid | 0,674 | ✓ Valid |
| CUQ 8 | 0,708 | ✓ Valid | 0,755 | ✓ Valid |
| CUQ 9 | 0,655 | ✓ Valid | 0,713 | ✓ Valid |
| CUQ 10 | 0,781 | ✓ Valid | 0,798 | ✓ Valid |
| CUQ 11 | 0,699 | ✓ Valid | 0,702 | ✓ Valid |
| CUQ 12 | 0,806 | ✓ Valid | 0,816 | ✓ Valid |
| CUQ 13 | 0,596 | ✓ Valid | 0,660 | ✓ Valid |
| CUQ 14 | 0,785 | ✓ Valid | 0,771 | ✓ Valid |
| CUQ 15 | 0,669 | ✓ Valid | 0,666 | ✓ Valid |
| CUQ 16 | 0,211 | ✓ Valid | 0,254 | ✓ Valid |
| **Total** | **16/16 Valid** | | **16/16 Valid** | |

### 2.4 Catatan tentang Tabel L.3 dalam Tesis

Tesis melaporkan beberapa item sebagai "Tidak Valid" (Q1, Q3, Q5, Q7, Q9, Q13, Q15 pada Formal). Perbedaan ini disebabkan oleh **pendekatan perhitungan yang berbeda**:

| Pendekatan | Penjelasan | Hasil |
|------------|-----------|-------|
| **Tesis (Tabel L.3)** | Korelasi skor mentah terhadap total mentah dengan metode tertentu | Beberapa item tidak valid |
| **Script ini** | Korelasi skor setelah reverse terhadap total setelah reverse | Semua item valid |

**Mengapa perbedaan ini tidak menjadi masalah?**
- Reliabilitas keseluruhan tetap sangat tinggi (α > 0,9)
- Analisis utama menggunakan **skor total**, bukan per-item
- Tesis sudah menyatakan bahwa interpretasi per-item harus dilakukan hati-hati
- Keputusan akhir tetap sama: instrumen layak digunakan

### 2.5 Interpretasi Pola Validitas

| Pola | Penjelasan |
|------|-----------|
| Item negatif (Q2,Q4,Q6,Q8,Q10,Q12,Q14) memiliki r tinggi | Item negatif memiliki varians lebih besar → diskriminasi lebih kuat |
| Q16 memiliki r paling rendah (0,211 / 0,254) | Q16 ("Chatbot terasa sangat kompleks") mungkin kurang relevan dalam konteks chatbot WhatsApp yang sederhana |
| Q12 memiliki r paling tinggi (0,806 / 0,816) | Q12 ("Respon chatbot tidak relevan") paling kuat membedakan responden dengan usabilitas tinggi vs rendah |

---

## 3. Uji Reliabilitas (Cronbach's Alpha)

### 3.1 Metode

**Cronbach's Alpha** mengukur konsistensi internal instrumen — sejauh mana item-item dalam kuesioner mengukur konstruk yang sama.

### 3.2 Rumus

```
α = (k / (k-1)) × (1 - Σσ²ᵢ / σ²total)

Dimana:
  k       = jumlah item (16)
  σ²ᵢ     = varians masing-masing item
  σ²total = varians skor total
```

### 3.3 Kriteria Interpretasi

| Nilai Alpha | Interpretasi |
|-------------|-------------|
| α ≥ 0,9 | Sangat Reliabel (Excellent) |
| α ≥ 0,8 | Reliabel (Good) |
| α ≥ 0,7 | Cukup Reliabel (Acceptable) |
| α ≥ 0,6 | Kurang Reliabel (Questionable) |
| α < 0,6 | Tidak Reliabel (Poor) |

### 3.4 Hasil

| Kondisi | Jumlah Item | Cronbach's Alpha | Interpretasi |
|---------|-------------|-----------------|--------------|
| **Formal** | 16 | **0,905** | Sangat Reliabel |
| **Gen-Z** | 16 | **0,922** | Sangat Reliabel |

Kedua kondisi melampaui batas 0,9 — instrumen CUQ memiliki konsistensi internal yang **sangat baik**.

### 3.5 Alpha If Item Deleted

Analisis ini menunjukkan apa yang terjadi pada reliabilitas jika satu item dihapus:

**CUQ Formal (α keseluruhan = 0,905):**

| Item | Alpha tanpa item | Perubahan |
|------|-----------------|-----------|
| Q1 | 0,9010 | ↓ 0,0038 |
| Q2 | 0,8995 | ↓ 0,0053 |
| Q3 | 0,9016 | ↓ 0,0031 |
| Q4 | 0,8951 | ↓ 0,0097 |
| Q5 | 0,8978 | ↓ 0,0069 |
| Q6 | 0,8975 | ↓ 0,0072 |
| Q7 | 0,9000 | ↓ 0,0048 |
| Q8 | 0,8966 | ↓ 0,0081 |
| Q9 | 0,8985 | ↓ 0,0062 |
| Q10 | 0,8933 | ↓ 0,0114 |
| Q11 | 0,8973 | ↓ 0,0074 |
| Q12 | 0,8923 | ↓ 0,0125 |
| Q13 | 0,9005 | ↓ 0,0042 |
| Q14 | 0,8931 | ↓ 0,0116 |
| Q15 | 0,8983 | ↓ 0,0064 |
| **Q16** | **0,9191** | **↑ 0,0143** |

**CUQ Gen-Z (α keseluruhan = 0,922):**

| Item | Alpha tanpa item | Perubahan |
|------|-----------------|-----------|
| Q1 | 0,9173 | ↓ 0,0048 |
| Q2 | 0,9147 | ↓ 0,0074 |
| Q3 | 0,9189 | ↓ 0,0032 |
| Q4 | 0,9138 | ↓ 0,0082 |
| Q5 | 0,9168 | ↓ 0,0052 |
| Q6 | 0,9177 | ↓ 0,0043 |
| Q7 | 0,9174 | ↓ 0,0047 |
| Q8 | 0,9149 | ↓ 0,0072 |
| Q9 | 0,9164 | ↓ 0,0057 |
| Q10 | 0,9132 | ↓ 0,0089 |
| Q11 | 0,9167 | ↓ 0,0054 |
| Q12 | 0,9126 | ↓ 0,0095 |
| Q13 | 0,9178 | ↓ 0,0043 |
| Q14 | 0,9142 | ↓ 0,0078 |
| Q15 | 0,9178 | ↓ 0,0043 |
| **Q16** | **0,9345** | **↑ 0,0124** |

### 3.6 Interpretasi Alpha If Item Deleted

- **15 dari 16 item**: Jika dihapus, alpha **turun** → item tersebut berkontribusi positif terhadap reliabilitas
- **Q16 saja**: Jika dihapus, alpha **naik** sedikit (0,014) → Q16 sedikit "mengganggu" konsistensi
- Namun kenaikan sangat kecil (0,014) dan alpha sudah sangat tinggi → **tidak perlu menghapus Q16**
- Q16 tetap dipertahankan karena merupakan bagian standar instrumen CUQ

---

## 4. Mengapa Tidak Menghapus Item yang Bermasalah?

| Alasan | Penjelasan |
|--------|-----------|
| Instrumen standar | CUQ adalah instrumen baku 16 item; menghapus item mengubah konstruk |
| Reliabilitas sudah sangat tinggi | α > 0,9 tanpa perlu modifikasi |
| Konsistensi lintas studi | Mempertahankan 16 item memungkinkan perbandingan dengan penelitian lain |
| Analisis berbasis total | Analisis utama menggunakan skor total, bukan per-item |

---

## 5. Kesimpulan Tahap 4

| Aspek | Hasil | Keputusan |
|-------|-------|-----------|
| Validitas item | Seluruh item valid (r > 0,098) setelah reverse scoring | ✓ Instrumen valid |
| Reliabilitas Formal | α = 0,905 (Sangat Reliabel) | ✓ Konsisten |
| Reliabilitas Gen-Z | α = 0,922 (Sangat Reliabel) | ✓ Konsisten |
| Alpha if item deleted | Hanya Q16 sedikit meningkatkan alpha jika dihapus | Tetap dipertahankan |
| **Keputusan akhir** | **Instrumen CUQ layak digunakan** | **→ Lanjut ke uji normalitas** |

---

## 6. Alur Proses Tahap 4

```
Skor CUQ (16 item × 405 responden × 2 kondisi)
  │
  ├─ [A] Uji Validitas Item
  │     ├─ Hitung korelasi item-total (Pearson)
  │     ├─ Bandingkan dengan r tabel (0,098)
  │     └─ Hasil: Semua item valid
  │
  ├─ [B] Uji Reliabilitas
  │     ├─ Hitung Cronbach's Alpha
  │     ├─ Formal: 0,905 | Gen-Z: 0,922
  │     └─ Hasil: Sangat Reliabel
  │
  ├─ [C] Alpha If Item Deleted
  │     ├─ Cek apakah ada item yang menurunkan reliabilitas
  │     └─ Hasil: Hanya Q16 sedikit, tidak substansial
  │
  └─ KEPUTUSAN: Instrumen layak → Lanjut Tahap 5 (Uji Normalitas)
```
