# Progress Implementasi Frontend - Academic Defense Command Center

**Tanggal update:** 2026-05-21 10:38 WIB  
**Lokasi modul:** `00-engine/frontend/`  
**Status umum:** Tahap 1–4 selesai dan pipeline lulus (`PIPELINE OK`)  
**Peran dashboard:** pusat kendali persiapan ujian komprehensif berbasis tesis, paparan, PPT, CUQ, teori, dan Q&A aman.

---

## 1. Tujuan Implementasi

Frontend dibangun sebagai **Academic Defense Command Center**, bukan sekadar halaman ringkasan. Dashboard berfungsi untuk:

1. Memantau kesiapan dokumen kompre.
2. Menampilkan statistik CUQ final dari CSV raw master.
3. Menjaga narasi akademik tetap aman dan netral.
4. Menghubungkan tesis, paparan, PPT, dataset, teori, dan Q&A.
5. Membantu simulasi jawaban ujian komprehensif.

---

## 2. Sumber Acuan

Frontend mengikuti acuan berikut:

| Acuan | Lokasi | Fungsi |
|---|---|---|
| RDP aplikasi | `01-docs/RDP/rdp_aplikasi_komprehensif_ilmu_komunikasi.md` | Arsitektur aplikasi dan modul utama |
| File skill akademik | `01-docs/FileSkill/file_skill_ilmu_komunikasi_metode_penelitian_kuantitatif.md` | Peran profesor/reviewer kuantitatif Ilmu Komunikasi |
| UI/UX skill | `01-docs/FileSkill/uiux_skill_master_reference_mockups.md` | Navigasi, elemen UI, dan struktur dashboard |
| Mockup visual | `01-docs/Mockups/` | Referensi tampilan 10 modul dashboard |
| CSV master | `02-data/cuq/cuq_responses_rows.csv` | Source of truth statistik final |

---

## 3. File yang Sudah Diimplementasikan

| File | Status | Fungsi |
|---|---:|---|
| `build_dashboard_data.py` | Selesai | Menggabungkan output pipeline menjadi `dashboard_data.json` |
| `build_static_dashboard.py` | Selesai | Membangun `index.html` dan memanggil data aggregator |
| `output/data/dashboard_data.json` | Selesai | Data tunggal frontend |
| `output/index.html` | Selesai | Struktur dashboard premium statis |
| `output/app.css` | Selesai | Desain dark academic, glassmorphism, responsive layout |
| `output/app.js` | Selesai | Render data dinamis dari JSON |

---

## 4. Tahapan yang Sudah Dieksekusi

### Tahap 1 — Data Aggregator

**File:** `build_dashboard_data.py`

Fungsi:
- Membaca output analyzer, parser, skill-checker, dan AI interpretation.
- Menggabungkan data statistik, Q&A, teori, slide map, status dokumen, dan audit excerpt.
- Menulis data final ke:

```text
00-engine/frontend/output/data/dashboard_data.json
```

Data utama yang dimasukkan:
- N CSV master = 405.
- Mean CUQ Formal dan Gen-Z.
- Paired t-test.
- Wilcoxon.
- Cohen's dz.
- Shapiro normality.
- Order effect.
- Cronbach alpha.
- Safe core claims.
- Theory mapping CMC, TAM, S-O-R.
- Question bank kompre.
- Slide-to-thesis map.
- Traceability dokumen final.

---

### Tahap 2 — Frontend Premium Static

**File:**

```text
output/index.html
output/app.css
output/app.js
```

Modul UI yang sudah tersedia:

1. Dashboard utama.
2. Potensi pertanyaan kompre.
3. Analisis data CUQ.
4. Viewer presentasi kompre.
5. Tesis dan breakdown dokumen.
6. Peta teori dan konsep.
7. Metodologi penelitian.
8. Simulasi tanya jawab.
9. Laporan dan ekspor.
10. Status kesiapan akademik.

Elemen desain:
- Sidebar navigasi.
- Topbar status.
- Metric cards.
- Glass cards.
- Aurora gradient background.
- Safe claim panel.
- CUQ comparison bars.
- Slide cards.
- Theory cards.
- Methodology timeline.
- Export links.

---

### Tahap 3 — Integrasi Builder

**File:** `build_static_dashboard.py`

Perubahan:
- Builder sekarang memanggil `build_dashboard_data.py` terlebih dahulu.
- HTML dipisahkan dari CSS dan JS.
- Output final tetap di folder Nginx/static:

```text
00-engine/frontend/output/
```

---

### Tahap 4 — QA Build dan Pipeline

Command QA yang sudah berhasil:

```powershell
python .\00-engine\frontend\build_dashboard_data.py
python .\00-engine\frontend\build_static_dashboard.py
```

Output berhasil:

```text
00-engine/frontend/output/data/dashboard_data.json
00-engine/frontend/output/index.html
```

Pipeline penuh berhasil:

```powershell
python .\00-engine\run_pipeline.py
```

Status:

```text
PIPELINE OK
```

---

## 5. Validasi Akademik yang Dipertahankan

Dashboard menahan klaim berlebihan dengan prinsip:

1. CSV raw master adalah source of truth.
2. N final = 405.
3. Gen-Z sedikit lebih tinggi secara deskriptif.
4. Paired t-test tidak signifikan.
5. Wilcoxon signifikan sebagai sinyal nonparametrik.
6. Cohen's dz sangat kecil.
7. Implikasi aman: segmentasi gaya komunikasi, bukan superioritas mutlak.

Kalimat inti dashboard:

> Skor Gen-Z sedikit lebih tinggi secara deskriptif, tetapi paired t-test tidak signifikan dan effect size sangat kecil. Wilcoxon signifikan dibaca sebagai sinyal nonparametrik, bukan bukti superioritas praktis besar.

---

## 6. Masalah yang Ditemukan dan Sudah Diperbaiki

### Bug JSON serialization

Error:

```text
TypeError: Object of type WindowsPath is not JSON serializable
```

Penyebab:
- Asset path slide masih bertipe `WindowsPath`.

Perbaikan:
- Path slide dikonversi ke string POSIX melalui `.as_posix()`.

Status:

```text
FIXED
```

---

## 7. Cara Menjalankan Frontend

### Opsi 1 — Python static server

```powershell
python -m http.server 8088 -d .\00-engine\frontend\output
```

Buka:

```text
http://localhost:8088
```

### Opsi 2 — Docker Nginx

```powershell
docker compose --profile frontend up frontend
```

Buka:

```text
http://localhost:8088
```

### Opsi 3 — Rebuild penuh

```powershell
python .\00-engine\run_pipeline.py
```

---

## 8. Status Modul Saat Ini

| Modul | Status | Catatan |
|---|---:|---|
| Data aggregator | Selesai | JSON tunggal sudah terbentuk |
| Static builder | Selesai | Terintegrasi pipeline |
| Dashboard shell | Selesai | Sidebar + topbar + sections |
| Statistik CUQ | Selesai | Mean, p-value, effect size, normality, order effect |
| Q&A Kompre | Selesai | Dari AI interpretation report |
| Theory mapping | Selesai | CMC, TAM, S-O-R |
| Slide viewer | Selesai awal | Butuh visual QA browser |
| Thesis traceability | Selesai awal | Menampilkan path dan audit excerpt |
| Export panel | Selesai awal | Link output pipeline |
| Responsive styling | Selesai awal | Perlu uji layar kecil |

---

## 9. Next Step yang Disarankan

1. Jalankan frontend di browser.
2. Lakukan visual QA:
   - apakah slide image tampil,
   - apakah layout rapi,
   - apakah mobile responsive cukup baik,
   - apakah angka tampil benar.
3. Tambahkan filter kategori pertanyaan.
4. Tambahkan mode detail pertanyaan dengan template 5 langkah.
5. Tambahkan chart SVG/canvas untuk paired comparison.
6. Tambahkan tombol export ringkasan kompre.
7. Setelah visual QA lolos, update checklist progress utama.

---

## 10. Catatan Penting

Frontend ini **tidak mengubah dokumen tesis/paparan/PPT**.  
Frontend hanya membaca output pipeline dan menyajikannya untuk persiapan ujian komprehensif.

Dokumen akademik final tetap dijaga melalui workflow audit, patch, lock, dan manifest terpisah.
