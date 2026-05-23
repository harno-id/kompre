# Progress Checklist Proyek HARNO-KOMPRE

Sumber acuan: `01-docs/RDP/rdp_aplikasi_komprehensif_ilmu_komunikasi.md`  
Tanggal monitoring: 2026-05-21  
Status terakhir: tesis CSV master sudah dikunci, PDF tesis sudah diekspor, naskah paparan copy sudah diperbarui.

## 1. Status Ringkas

| Area | Status | Catatan |
|---|---:|---|
| Audit file data | ✅ Selesai | DOCX, PPTX, XLSX, CSV sudah diaudit |
| Penetapan raw master | ✅ Selesai | CSV dipilih sebagai raw master aman |
| Parser dokumen | ✅ Selesai awal | Tesis, paparan, PPT manifest, slide PNG |
| Analyzer CUQ | ✅ Selesai | Statistik CSV master sudah dihitung ulang |
| Skill checker | ✅ Selesai | Struktur tesis lolos, statistik sudah dipatch |
| AI interpretation | ✅ Selesai awal | Klaim aman, teori, Q&A kompre dibuat |
| Database index | ✅ Selesai awal | SQLite index tersedia |
| Frontend dashboard | ✅ Selesai awal | Dashboard statis HTML tersedia, belum final interaktif |
| Update tesis copy | ✅ Selesai | Copy kerja dipatch, diaudit, dan dikunci read-only |
| Audit narasi tesis | ✅ Selesai | Kontradiksi narasi: 0 |
| Audit format Word tesis | ✅ Selesai | FAIL 0; warning tersisa false positive TOC/daftar tabel |
| Export PDF tesis | ✅ Selesai | PDF dari locked DOCX tersedia |
| Update naskah paparan copy | ✅ Selesai | Data dan narasi paparan diselaraskan ke CSV master |
| OCR PPT | ⏳ Belum | Slide sudah PNG, OCR belum karena package belum tersedia |
| Validasi visual PDF/slide | ⏳ Belum | Perlu review visual final sebelum presentasi |

## 2. Checklist Berdasarkan RDP

### 2.1 Tujuan Proyek

| Tujuan RDP | Status | Bukti / Output | Prioritas |
|---|---:|---|---:|
| Breakdown tesis, PPT, paparan, dataset CUQ | ✅ Selesai awal | `00-engine/parser/output/*` | P1 |
| Menjawab potensi pertanyaan kompre | ✅ Selesai awal | `00-engine/ai-interpretation/output/ai_interpretation_report.md` | P2 |
| Analisis statistik dataset CUQ mentah | ✅ Selesai | `00-engine/analyzer/output/cuq_statistics_report.md` | P1 |
| Validitas, reliabilitas, uji beda, Wilcoxon, effect size, order effect | ✅ Selesai | `cuq_statistics_report.json` | P1 |
| Mapping teori CMC, TAM, S-O-R | ✅ Selesai awal | `ai_interpretation_report.md` | P2 |
| Dashboard interaktif visualisasi | 🟡 Sebagian | `00-engine/frontend/output/index.html`; belum dashboard final | P3 |

### 2.2 Input

| Input RDP | Status | Catatan |
|---|---:|---|
| Tesis DOCX | ✅ Final kerja terkunci | `TESIS_HARNO_CSV_MASTER_LOCKED_20260521-095322.docx` |
| Tesis PDF | ✅ Tersedia | `02-data/thesis/pdf/TESIS_HARNO_CSV_MASTER_LOCKED_20260521-095322.pdf` |
| Naskah paparan DOCX | ✅ Copy diperbarui | `NASKAH_PAPARAN_KOMPRE_HARNO_CSV_MASTER_UPDATE_WORKING_20260521-095618.docx` |
| PPTX | ✅ Ter-render | Text layer minim, PNG slide tersedia |
| Dataset CUQ mentah | ✅ Terbaca | CSV dipilih sebagai raw master |
| PDF/TXT lain | ⚪ Opsional | Belum diperlukan |

### 2.3 Output

| Output RDP | Status | Catatan |
|---|---:|---|
| Breakdown per bab/subbab/tabel | ✅ Selesai awal | JSON parser tersedia |
| Breakdown slide PPT | ✅ Selesai awal | PNG + manifest slide tersedia |
| Analisis kuantitatif dataset mentah | ✅ Selesai | CSV master, N=405 |
| Evaluasi file skill profesi | ✅ Selesai | Tesis sudah lolos audit statistik/narasi |
| Mapping slide ke tesis dan paparan | ✅ Selesai awal | `integration_map_report.json` |
| Prediksi pertanyaan dan jawaban singkat | ✅ Selesai awal | Q&A aman tersedia |
| Tesis locked | ✅ Selesai | Read-only + SHA256 manifest |
| PDF tesis | ✅ Selesai | Export LibreOffice berhasil |
| Paparan updated copy | ✅ Selesai | Angka dan narasi sudah konsisten CSV master |

## 3. Hasil Penting yang Sudah Diputuskan

### 3.1 CSV sebagai raw master

Keputusan: gunakan `02-data/cuq/cuq_responses_rows.csv` sebagai raw master.

Alasan:
- Semua nilai CUQ valid dalam rentang 1–5.
- Berisi respons JSON mentah lengkap.
- XLSX punya 2 nilai invalid `G5 = 0`.
- XLSX tidak identik dengan CSV dan banyak mismatch.

### 3.2 Statistik terbaru dari CSV master

| Metrik | Nilai |
|---|---:|
| N | 405 |
| Formal CUQ mean | 72.9244 |
| Gen-Z CUQ mean | 73.4954 |
| Selisih mean Gen-Z minus Formal | 0.5710 |
| Paired t-test p | 0.157023 |
| Wilcoxon p | 0.002674 |
| Cohen dz | 0.0705 |
| Cronbach Alpha Formal | 0.9048 |
| Cronbach Alpha Gen-Z | 0.9221 |

### 3.3 Klaim aman untuk kompre

- Gen-Z sedikit lebih tinggi secara deskriptif.
- Effect size sangat kecil.
- Paired t-test tidak signifikan.
- Wilcoxon signifikan secara nonparametrik.
- Karena effect size sangat kecil, klaim keunggulan praktis Gen-Z tidak boleh dibuat kuat.
- Rekomendasi aman: segmentasi gaya bahasa chatbot, bukan penggantian total gaya formal.

## 4. Output File Monitoring

### Parser

- `00-engine/parser/parse_academic_documents.py`
- `00-engine/parser/output/thesis_parsed.json`
- `00-engine/parser/output/paparan_parsed.json`
- `00-engine/parser/output/ppt_parsed.json`
- `00-engine/parser/output/parse_summary.json`
- `00-engine/parser/ppt_render/PPT KOMPRE-HARNO.pdf`
- `00-engine/parser/ppt_render/slides_png/slide_01.png` sampai `slide_15.png`

### Analyzer dan Statistik

- `00-engine/analyzer/analyze_cuq_master_csv.py`
- `00-engine/analyzer/output/cuq_master_scored.csv`
- `00-engine/analyzer/output/cuq_statistics_report.json`
- `00-engine/analyzer/output/cuq_statistics_report.md`
- `00-engine/analyzer/output/pipeline_final_report.md`
- `00-engine/analyzer/integration_map_report.json`

### Audit, Patch, dan Lock Tesis

- `00-engine/analyzer/output/thesis_patch_plan.md`
- `00-engine/analyzer/output/thesis_patch_change_log.md`
- `00-engine/analyzer/output/thesis_patch_verify.md`
- `00-engine/analyzer/output/audit_404_remaining.md`
- `00-engine/analyzer/output/thesis_consistency_audit.md`
- `00-engine/analyzer/output/thesis_narrative_audit.md`
- `00-engine/analyzer/output/word_format_audit.md`
- `00-engine/analyzer/output/caption_cleanup_log.md`
- `00-engine/analyzer/output/thesis_lock_manifest.md`

### Tesis Final Kerja

- `02-data/thesis/TESIS_HARNO_CSV_MASTER_UPDATE_WORKING_20260521-092331.docx`
- `02-data/thesis/TESIS_HARNO_CSV_MASTER_LOCKED_20260521-095322.docx`
- `02-data/thesis/pdf/TESIS_HARNO_CSV_MASTER_LOCKED_20260521-095322.pdf`

SHA256 locked DOCX:

```text
8D4F9DC302EA574F185AB8AC0CA5AC756C8BC8ABF6E2EDAC16AC1BBC8CBE914A
```

### Paparan

- `02-data/paparan/NASKAH_PAPARAN_KOMPRE_HARNO_CSV_MASTER_UPDATE_WORKING_20260521-095618.docx`
- `00-engine/analyzer/output/paparan_data_patch_log.md`
- `00-engine/analyzer/output/paparan_data_verify.md`
- `00-engine/analyzer/output/paparan_narrative_fix_log.json`

### Skill Checker

- `00-engine/skill-checker/check_alignment.py`
- `00-engine/skill-checker/output/skill_check_report.json`
- `00-engine/skill-checker/output/skill_check_report.md`

### AI Interpretation

- `00-engine/ai-interpretation/generate_interpretation.py`
- `00-engine/ai-interpretation/output/ai_interpretation_report.json`
- `00-engine/ai-interpretation/output/ai_interpretation_report.md`

### Database

- `00-engine/database/build_sqlite_index.py`
- `00-engine/database/output/harno_kompre_analysis.sqlite`

### Frontend

- `00-engine/frontend/build_static_dashboard.py`
- `00-engine/frontend/output/index.html`

## 5. Yang Belum Selesai

| Item | Status | Risiko | Catatan |
|---|---:|---|---|
| Visual audit PDF tesis | Belum | Sedang | PDF sudah ada, perlu review halaman/tabel/TOC secara visual |
| OCR isi slide PPT | Belum | Sedang | Slide visual sudah ada, text layer minim |
| Validasi visual/manual slide | Belum | Sedang | Perlu cocokkan PNG slide vs paparan updated |
| Lock naskah paparan | Belum | Sedang | Paparan copy sudah update, belum dikunci read-only |
| Export PDF naskah paparan | Belum | Sedang | Setelah audit singkat paparan |
| Sinkronisasi PPT | Belum | Sedang | PPT mungkin masih membawa angka lama jika berbasis gambar |
| Dashboard interaktif penuh | Belum | Rendah | Saat ini statis, bisa pakai data final setelah dokumen terkunci |
| Docker Compose modular | Belum | Rendah | Belum prioritas, pipeline lokal sudah jalan |

## 6. Prioritas Berikutnya

### P1 — Finalisasi dokumen akademik

1. Audit visual PDF tesis.
2. Audit ringkas paparan updated copy.
3. Lock paparan copy jika lolos.
4. Export PDF paparan jika diperlukan.
5. Cek PPT apakah angka lama masih ada secara visual.

### P2 — Sinkronisasi presentasi kompre

1. Cocokkan 15 slide PNG dengan data final CSV master.
2. Identifikasi slide yang memuat statistik lama.
3. Jika PPT berbasis gambar, tentukan apakah perlu revisi manual desain slide.
4. Siapkan catatan jawaban lisan yang mengikuti tesis dan paparan final.

### P3 — Frontend/dashboard final

1. Pakai data CSV master dan thesis lock manifest.
2. Update dashboard dengan angka final.
3. Tambah viewer PDF/slide.
4. Tambah Q&A per slide.
5. Tambah panel audit trail agar semua angka bisa ditelusuri ke CSV master.

### P4 — Docker dan otomasi lanjutan

1. Rapikan script pipeline.
2. Buat `README` eksekusi ulang.
3. Dockerize jika perlu untuk reproduksibilitas.

## 7. Stop-Gate Tesis CSV Master

> [!IMPORTANT]
> Jangan edit `TESIS_HARNO_FORMATTED_UNILA.docx` langsung.
> Versi kerja yang valid adalah locked copy berbasis CSV master.

Checklist tesis:

- [x] Copy master tesis dibuat.
- [x] Statistik CSV master final.
- [x] Lokasi tabel dan narasi lama terpetakan.
- [x] Patch angka punya log perubahan.
- [x] Audit konsistensi statistik PASS.
- [x] Audit kontradiksi narasi 0 item.
- [x] Audit format Word FAIL 0.
- [x] Caption kosong dibersihkan.
- [x] Locked DOCX dibuat read-only.
- [x] SHA256 manifest dibuat.
- [x] Export PDF tesis dilakukan.
- [ ] Visual audit PDF tesis dilakukan.

## 8. Stop-Gate Paparan

Checklist paparan:

- [x] Copy paparan dibuat.
- [x] Data paparan dipatch ke CSV master.
- [x] Narasi paired t-test/Wilcoxon diperbaiki.
- [x] Verifikasi angka lama: 0 temuan.
- [x] Verifikasi angka baru: lengkap.
- [ ] Audit format/narasi akhir paparan.
- [ ] Lock paparan copy.
- [ ] Export PDF paparan jika diperlukan.

## 9. Rekomendasi Urutan Eksekusi Terdekat

1. **Audit visual PDF tesis**.
2. **Audit singkat naskah paparan updated copy**.
3. **Lock paparan copy**.
4. **Cek PPT visual terhadap angka final**.
5. **Baru lanjut frontend/dashboard final**.

## 10. Status Akhir Saat Ini

Tesis sudah melewati tahap data, narasi, format, lock, dan export PDF.  
Paparan sudah disalin dan diselaraskan dengan CSV master, tetapi belum dikunci.  
Bottleneck berikutnya adalah **audit visual PDF tesis, lock paparan, dan sinkronisasi PPT** sebelum masuk frontend final.
