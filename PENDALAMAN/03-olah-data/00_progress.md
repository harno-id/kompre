# PROGRESS PENDALAMAN PENGOLAHAN DATA TESIS

**Tanggal Update:** 22 Mei 2026

---

## Daftar Tahapan & Status

| No | Tahap | Status | File .md | File .py |
|----|-------|--------|----------|----------|
| 01 | Data Cleaning | ✅ | `01_data_cleaning.md` | `01_data_cleaning.py`, `01_data_cleaning_analisis_awal.py` |
| 02 | Reverse Scoring & Normalisasi (0–100) | ✅ | `02_scoring_normalisasi.md` | `02_scoring_normalisasi.py` |
| 03 | Uji Validitas & Reliabilitas | ✅ | `03_validitas_reliabilitas.md` | `03_validitas_reliabilitas.py`, `03_validitas_reliabilitas_alt.py` |
| 04 | Uji Normalitas Selisih | ✅ | `04_uji_normalitas.md` | `04_uji_normalitas.py` |
| 05 | Uji Beda + Effect Size + Order Effect | ✅ | `05_uji_beda_efek_order.md` | `05_uji_beda_efek_order.py` |
| 06 | Analisis Klaster CUQ | ✅ | `06_analisis_klaster.md` | `06_analisis_klaster.py` |
| 07 | Interpretasi & Simpulan | ✅ | `07_interpretasi_simpulan.md` | `07_interpretasi_simpulan.py` |
| 08 | Verifikasi Angka vs Tesis | ✅ | `08_verifikasi_vs_tesis.md` | `08_verifikasi_vs_tesis.py` |

---

## Struktur Folder

```
03-olah-data/
│
├── 00_progress.md                        ← FILE INI
│
├── 01_data_cleaning.md                   ← Dokumentasi tahap cleaning
├── 01_data_cleaning.py                   ← Script: cek straight-lining, missing, duplikat
├── 01_data_cleaning_analisis_awal.py     ← Script: analisis deskriptif awal dataset
│
├── 02_scoring_normalisasi.md             ← Dokumentasi reverse scoring & normalisasi
├── 02_scoring_normalisasi.py             ← Script: proses skoring CUQ
│
├── 03_validitas_reliabilitas.md          ← Dokumentasi validitas & reliabilitas
├── 03_validitas_reliabilitas.py          ← Script: uji validitas & Cronbach Alpha
├── 03_validitas_reliabilitas_alt.py      ← Script: pendekatan validitas alternatif
│
├── 04_uji_normalitas.md                  ← Dokumentasi uji normalitas selisih
├── 04_uji_normalitas.py                  ← Script: Shapiro-Wilk & KS test
│
├── 05_uji_beda_efek_order.md             ← Dokumentasi uji beda, effect size, order effect
├── 05_uji_beda_efek_order.py             ← Script: t-test, Wilcoxon, Cohen's dz, order
│
├── 06_analisis_klaster.md                ← Dokumentasi analisis per dimensi CUQ
├── 06_analisis_klaster.py                ← Script: perbandingan 4 klaster
│
├── 07_interpretasi_simpulan.md           ← Dokumentasi interpretasi & kesimpulan
├── 07_interpretasi_simpulan.py           ← Script: ringkasan seluruh temuan
│
├── 08_verifikasi_vs_tesis.md             ← Dokumentasi verifikasi angka vs tesis
└── 08_verifikasi_vs_tesis.py             ← Script: cross-check semua statistik
```

---

## Konvensi Penamaan

- **Prefix angka** `01_` s.d. `08_` = urutan tahap pengolahan data
- **`.md`** = dokumentasi naratif (penjelasan untuk sidang)
- **`.py`** = script Python yang dapat dijalankan ulang
- **`_alt`** = script pendekatan alternatif/tambahan
- **`_analisis_awal`** = script eksplorasi awal sebelum analisis utama

---

## Status: ✅ SEMUA TAHAP SELESAI & TERSTRUKTUR
