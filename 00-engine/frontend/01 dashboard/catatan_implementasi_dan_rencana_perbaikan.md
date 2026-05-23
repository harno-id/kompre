# 01 Dashboard — Catatan Implementasi & Rencana Perbaikan

Lokasi referensi: `01-docs/Mockups/ChatGPT Image May 21, 2026, 07_18_02 AM (1).png`

Lokasi realita saat ini: `00-engine/frontend/output/index.html` via `http://localhost:8088`

Tanggal catatan: 2026-05-21

---

## 1. Tujuan Modul

Dashboard utama harus menjadi halaman ringkasan awal untuk persiapan ujian komprehensif.
Fungsi utamanya:

- memberi ringkasan cepat penelitian;
- menampilkan status data, instrumen, metode, dan hasil utama;
- memberi akses cepat ke modul akademik penting;
- menampilkan potensi pertanyaan kompre sejak halaman awal;
- menjaga narasi tetap defensible dan anti-overclaim.

---

## 2. Perbandingan Referensi vs Realita

| Area | Referensi Mockup | Realita Saat Ini | Status |
|---|---|---|---|
| Sidebar | Logo perisai, teks `KOMPRE Assistant`, menu dengan ikon, badge `Baru`, info penelitian di bawah | Logo `HC`, teks `HARNO KOMPRE`, menu teks polos, belum ada ikon/badge/info riset detail | Belum sesuai |
| Topbar | Judul `Dashboard`, subjudul, theme toggle, notifikasi, profil, tombol `Ekspor PDF`, `Panduan Kompre` | Heading besar `Academic Defense Command Center`, badge status, belum ada profil/notifikasi/theme/tombol | Belum sesuai |
| Metric cards | 5 kartu ringkas: Responden, Instrumen, Metode, Hasil Utama, Keyakinan | 4 kartu statistik: Formal Mean, Gen-Z Mean, Paired p, Wilcoxon p | Sebagian sesuai data, belum sesuai layout |
| Hero area | Tidak ada hero raksasa; mockup langsung fokus ringkasan | Ada hero besar dan radial gauge `Defense Readiness 92%` | Perlu dipindah/dikecilkan |
| Alur analisis | Panel 5 tahap: Input → Ekstraksi → Analisis → Sintesis → Persiapan | Belum ada | Belum sesuai |
| Quick access | Grid 2x2: Latar Belakang, Metodologi, Hasil, Implikasi + tombol peta konsep | Belum ada | Belum sesuai |
| Potensi pertanyaan | Panel bawah dashboard dengan search, filter, tab kategori, list pertanyaan | Ada modul pertanyaan terpisah di bawah, belum terintegrasi sebagai ringkasan dashboard | Perlu integrasi |
| Visual style | Clean dark academic, banyak ikon, card compact, spacing rapat-premium | Sudah dark glassmorphism, tetapi terlalu hero-centric dan kurang ikonografi | Perlu refinement |

---

## 3. Catatan Implementasi Saat Ini

File utama:

- `00-engine/frontend/build_static_dashboard.py`
- `00-engine/frontend/output/index.html`
- `00-engine/frontend/output/app.css`
- `00-engine/frontend/output/app.js`
- `00-engine/frontend/output/data/dashboard_data.json`

Yang sudah berjalan:

- dashboard bisa diakses di `http://localhost:8088`;
- data `dashboard_data.json` terbaca;
- statistik utama tampil;
- safe claims tampil;
- readiness monitor tampil;
- layout responsive dasar sudah ada;
- port konflik 8080 sudah diselesaikan dengan 8088.

Keterbatasan saat ini:

- struktur belum mengikuti mockup dashboard utama;
- topbar aplikasi belum lengkap;
- sidebar belum memakai ikon dan panel info riset;
- metric cards belum sesuai urutan referensi;
- alur analisis dan quick access belum tersedia;
- question bank belum diformat sebagai ringkasan dashboard.

---

## 4. Rencana Perbaikan Prioritas

### Tahap 1 — Restrukturisasi Topbar

Target:

- Ganti heading besar atas menjadi topbar compact.
- Tambahkan judul `Dashboard` dan subjudul ringkasan.
- Tambahkan area kanan:
  - theme toggle;
  - notification bell dengan badge `3`;
  - profil `Harno` atau `Hamo` sesuai final naming;
  - avatar bulat.
- Tambahkan tombol:
  - `Ekspor PDF`;
  - `Panduan Kompre`.

File terdampak:

- `build_static_dashboard.py`
- `app.css`

### Tahap 2 — Revisi Metric Cards

Target 5 kartu sesuai referensi:

1. `Responden` — `N=405` atau sesuaikan bila referensi menulis 404.
2. `Instrumen` — `CUQ`.
3. `Metode` — `Paired t-test + Wilcoxon`.
4. `Hasil Utama` — `Gen-Z sedikit lebih tinggi deskriptif`.
5. `Keyakinan` — `Aman / Anti-overclaim`.

Catatan penting:

- `dashboard_data.json` saat ini memakai N=405 sebagai source of truth.
- Jika mockup menulis 404, dashboard harus tetap ikut data pipeline final kecuali user minta ubah.

### Tahap 3 — Sidebar Premium

Target:

- Tambah ikon SVG inline untuk setiap menu.
- Tambah badge `Baru` pada `Metodologi`.
- Tambah panel bawah `Info Penelitian`:
  - Responden: 405;
  - Instrumen: CUQ;
  - Metode: Kuantitatif komparatif / paired design;
  - Fokus: gaya komunikasi formal vs Gen-Z.
- Tambah tombol `Tentang Aplikasi`.

### Tahap 4 — Panel Alur Analisis

Target layout:

- Grid tengah rasio `60% : 40%`.
- Kolom kiri: `Alur Analisis Penelitian`.
- Isi 5 tahap:
  1. Input dokumen & dataset;
  2. Ekstraksi struktur;
  3. Analisis statistik;
  4. Sintesis teori & temuan;
  5. Persiapan Q&A.
- Gunakan ikon bulat, connector arrow, dan micro-animation hover.
- Tambah sub-panel `Ringkasan Singkat`.

### Tahap 5 — Quick Access

Target:

- Grid 2x2:
  - Latar Belakang;
  - Metodologi;
  - Hasil;
  - Implikasi.
- Tombol penuh:
  - `Lihat Peta Konsep Penelitian`.
- Setiap item harus anchor ke modul terkait.

### Tahap 6 — Potensi Pertanyaan di Dashboard

Target:

- Panel ringkas di bawah dashboard utama.
- Search input.
- Filter dropdown.
- Tab kategori dengan counter.
- List 3–5 pertanyaan prioritas.
- Badge tingkat risiko/jawaban:
  - tinggi;
  - sedang;
  - aman.

---

## 5. Keputusan Desain

- Pertahankan dark academic premium.
- Kurangi dominasi hero raksasa.
- Jadikan dashboard lebih compact, informatif, dan action-oriented.
- Gunakan data pipeline sebagai ground truth.
- Hindari klaim visual/statistik yang mengesankan efek besar.
- Semua elemen interaktif diberi ID unik untuk QA browser.

---

## 6. Acceptance Criteria Dashboard Utama

Dashboard dianggap sesuai referensi bila:

- [ ] topbar lengkap tampil di atas;
- [ ] sidebar punya ikon, badge, dan info penelitian;
- [ ] 5 metric cards tampil dalam satu baris pada desktop;
- [ ] panel alur analisis 5 tahap tampil;
- [ ] quick access 2x2 tampil;
- [ ] panel potensi pertanyaan ringkas tampil di halaman dashboard;
- [ ] data N memakai source of truth pipeline;
- [ ] tidak ada blank page;
- [ ] tidak ada error JavaScript di console;
- [ ] tampilan desktop dan mobile tetap rapi.

---

## 7. Urutan Eksekusi Berikutnya

1. Update HTML generator `build_static_dashboard.py`.
2. Update CSS layout dashboard di `output/app.css`.
3. Jika perlu, tambah logic kecil di `output/app.js` untuk filter pertanyaan.
4. Rebuild:

```powershell
python .\00-engine\frontend\build_static_dashboard.py
```

5. QA browser:

```text
http://localhost:8088
```

6. Catat hasil final di dokumen ini.
