# Tahap 2: Data Cleaning (Pembersihan Data)

**Sumber Data:** `cuq_responses_rows.csv` (405 responden)  
**Tujuan:** Memastikan data bersih, valid, dan siap diolah — tidak ada nilai di luar rentang, tidak ada data kosong, dan anomali sudah ditangani.

---

## 1. Pemeriksaan Kelengkapan Data (Missing Values)

**Yang dicek:** Apakah ada data kosong pada kolom utama?

| Kolom | Missing Values | Status |
|-------|---------------|--------|
| cuq_formal | 0 | ✓ Lengkap |
| cuq_genz | 0 | ✓ Lengkap |
| profil | 0 | ✓ Lengkap |

**Keputusan:** Seluruh 405 responden memiliki data lengkap. Tidak ada baris yang perlu dihapus.

---

## 2. Pemeriksaan Rentang Skala (Range Check)

**Kriteria:** Seluruh jawaban CUQ harus berada dalam rentang Likert 1–5.  
**Logika:** Jika ada nilai < 1 atau > 5, maka itu anomali yang harus ditangani.

### Hasil Pemeriksaan CUQ Formal (16 item)

| Item | Min | Max | Status |
|------|-----|-----|--------|
| Q1–Q16 | 1 | 5 | ✓ Semua dalam rentang |

### Hasil Pemeriksaan CUQ Gen-Z (16 item)

| Item | Min | Max | Status |
|------|-----|-----|--------|
| Q1–Q4, Q6–Q16 | 1 | 5 | ✓ Dalam rentang |
| **Q5 (G5)** | **0** | 5 | ⚠️ **Anomali ditemukan** |

### Penanganan Anomali G5=0

| Aspek | Keterangan |
|-------|------------|
| Masalah | Ditemukan 1 responden dengan nilai G5 (Gen-Z Q5) = 0 |
| Penyebab kemungkinan | Kesalahan input sistem atau responden tidak menjawab tetapi tercatat sebagai 0 |
| Metode koreksi | Imputasi dengan **median valid item G5** |
| Nilai median valid G5 | **4** (dari 404 responden valid) |
| Alasan median (bukan mean) | Median lebih robust terhadap outlier dan mempertahankan sifat ordinal data Likert |

**Setelah koreksi:** Seluruh nilai CUQ berada dalam rentang 1–5.

---

## 3. Identifikasi Pola Respons Mencurigakan (Straight-Lining)

**Definisi:** Straight-lining = responden menjawab semua 16 item CUQ dengan nilai yang sama persis.

### Hasil Deteksi

| Kondisi | Jumlah Straight-Liner | Pola Dominan |
|---------|----------------------|--------------|
| CUQ Formal | 60 responden (14,8%) | Mayoritas semua = 3 (netral) |
| CUQ Gen-Z | 69 responden (17,0%) | Mayoritas semua = 3 (netral) |

### Keputusan: Dipertahankan

**Alasan:**
1. Tidak ada bukti pasti bahwa responden tidak serius — mungkin memang merasa netral terhadap seluruh aspek
2. CUQ memiliki item positif dan negatif — jika seseorang menjawab semua 3, setelah reverse scoring hasilnya tetap konsisten (skor tengah = 50/100)
3. Menghapus 60–69 responden akan mengurangi sampel secara signifikan (~15%)
4. Reliabilitas keseluruhan tetap sangat tinggi (Cronbach Alpha > 0,9) meskipun ada straight-liner
5. Tidak ada standar baku yang mewajibkan penghapusan straight-liner dalam penelitian survei

---

## 4. Identifikasi Duplikat Nama Responden

### Hasil Deteksi

| Aspek | Keterangan |
|-------|------------|
| Total baris dengan nama duplikat | 139 baris |
| Jumlah nama unik yang muncul >1 kali | 64 nama |
| Frekuensi duplikat | 2–5 kali per nama |

### Contoh Kasus

| Nama | Frekuensi |
|------|-----------|
| Faiza Madina Effendi Djs | 5 kali |
| Vira Diva Widiana | 4 kali |
| Mikaila Oktariani | 3 kali |
| Kesya Rachma Fatiha | 3 kali |
| Razan Naufal Rafif | 3 kali |

### Keputusan: Dipertahankan

**Alasan:**
1. Setiap baris memiliki `respondent_id_text` yang berbeda dan timestamp yang berbeda
2. Kemungkinan: responden mengisi ulang karena merasa jawaban pertama kurang tepat, atau ada nama yang kebetulan sama dari sekolah berbeda
3. Dalam dataset final, seluruh 405 baris diperlakukan sebagai respons valid yang independen

---

## 5. Ringkasan Keputusan Data Cleaning

| Aspek | Temuan | Tindakan | Jumlah Data Terdampak |
|-------|--------|----------|----------------------|
| Missing values | 0 kasus | Tidak perlu tindakan | 0 |
| Nilai di luar rentang | 1 kasus (G5=0) | Koreksi dengan median = 4 | 1 |
| Straight-lining | 60–69 responden | Dipertahankan | 0 (tidak dihapus) |
| Duplikat nama | 139 baris | Dipertahankan | 0 (tidak dihapus) |
| **Total data final** | **405 responden** | **Siap masuk tahap skoring** | — |

---

## 6. Alur Proses Data Cleaning

```
CSV Mentah (405 baris)
  │
  ├─ [1] Cek missing values → Tidak ada → OK
  │
  ├─ [2] Cek rentang 1–5 → Ditemukan G5=0 → Koreksi dengan median (4)
  │
  ├─ [3] Cek straight-lining → 60-69 kasus → Dipertahankan
  │
  ├─ [4] Cek duplikat nama → 139 baris → Dipertahankan
  │
  └─ CSV Final Bersih (405 baris) → Siap masuk Tahap 3: Skoring CUQ
```

---

## 7. Catatan Metodologis

- Data cleaning dilakukan **sebelum** proses reverse scoring dan normalisasi skor
- Pendekatan yang digunakan bersifat **konservatif** (mempertahankan data sebanyak mungkin) untuk menjaga kekuatan statistik sampel besar (N=405)
- Keputusan mempertahankan straight-liner didukung oleh reliabilitas instrumen yang tetap tinggi (α > 0,9)
- CSV setelah cleaning digunakan sebagai **raw master** untuk seluruh analisis selanjutnya
