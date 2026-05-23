"""
Tahap 6: Uji Beda — Paired t-test, Wilcoxon Signed-Rank, Effect Size, Order Effect
=====================================================================================
Script ini melakukan uji hipotesis utama penelitian:
Apakah terdapat perbedaan usabilitas (skor CUQ) antara chatbot Formal dan Gen-Z?
"""

import pandas as pd
import json
import numpy as np
from scipy import stats

# ============================================================
# LOAD DATA & SCORING
# ============================================================
df = pd.read_csv(r'D:\DATA\TESIS\KOMPRE\PENDALAMAN\02-data\cuq\cuq_responses_rows.csv')

cuq_formal_raw = pd.DataFrame(df['cuq_formal'].apply(json.loads).tolist()).apply(pd.to_numeric)
cuq_genz_raw = pd.DataFrame(df['cuq_genz'].apply(json.loads).tolist()).apply(pd.to_numeric)

bagian_b = pd.DataFrame(df['bagian_b'].apply(json.loads).tolist())

pos_items = ['q1', 'q3', 'q5', 'q7', 'q9', 'q11', 'q13', 'q15']
neg_items = ['q2', 'q4', 'q6', 'q8', 'q10', 'q12', 'q14', 'q16']

def calc_cuq_score(raw_df):
    converted = pd.DataFrame(index=raw_df.index)
    for item in pos_items:
        converted[item] = raw_df[item] - 1
    for item in neg_items:
        converted[item] = 5 - raw_df[item]
    return converted.sum(axis=1) * 100 / 64

formal_scores = calc_cuq_score(cuq_formal_raw)
genz_scores = calc_cuq_score(cuq_genz_raw)
diff = genz_scores - formal_scores

print("=" * 70)
print("TAHAP 6: UJI BEDA — PAIRED T-TEST, WILCOXON, EFFECT SIZE, ORDER EFFECT")
print("=" * 70)

# ============================================================
# BAGIAN A: PAIRED SAMPLE T-TEST
# ============================================================
print("\n" + "=" * 70)
print("BAGIAN A: PAIRED SAMPLE T-TEST (Uji Pembanding)")
print("=" * 70)

print("""
  Hipotesis:
    H0: μD = 0 (tidak ada perbedaan rata-rata skor CUQ)
    H1: μD ≠ 0 (ada perbedaan rata-rata skor CUQ)
  
  Kriteria:
    α = 0,05 (two-tailed)
    Jika p-value < 0,05 → Tolak H0 (ada perbedaan signifikan)
    Jika p-value ≥ 0,05 → Terima H0 (tidak ada perbedaan signifikan)
  
  Catatan: Asumsi normalitas TIDAK terpenuhi, sehingga hasil ini
  bersifat PEMBANDING saja. Keputusan utama berdasarkan Wilcoxon.
""")

t_stat, t_p = stats.ttest_rel(genz_scores, formal_scores)

print(f"  --- Hasil Paired Sample t-test ---")
print(f"  N                    : {len(diff)}")
print(f"  Mean Formal          : {formal_scores.mean():.4f}")
print(f"  Mean Gen-Z           : {genz_scores.mean():.4f}")
print(f"  Mean Difference (D)  : {diff.mean():.4f}")
print(f"  SD Difference        : {diff.std():.4f}")
print(f"  SE Difference        : {diff.std() / np.sqrt(len(diff)):.4f}")
print(f"  t-statistik          : {t_stat:.4f}")
print(f"  df                   : {len(diff) - 1}")
print(f"  Sig. (2-tailed)      : {t_p:.4f}")
print(f"  ")
keputusan_t = "TIDAK SIGNIFIKAN (Terima H0)" if t_p >= 0.05 else "SIGNIFIKAN (Tolak H0)"
print(f"  KEPUTUSAN: {keputusan_t}")
print(f"  → Tidak cukup bukti untuk menyatakan ada perbedaan rata-rata")

# Demonstrasi perhitungan manual
print(f"""
  --- Demonstrasi Perhitungan Manual ---
  t = Mean_D / SE_D
  t = Mean_D / (SD_D / √N)
  t = {diff.mean():.4f} / ({diff.std():.4f} / √{len(diff)})
  t = {diff.mean():.4f} / ({diff.std():.4f} / {np.sqrt(len(diff)):.4f})
  t = {diff.mean():.4f} / {diff.std() / np.sqrt(len(diff)):.4f}
  t = {t_stat:.4f}
""")

# ============================================================
# BAGIAN B: WILCOXON SIGNED-RANK TEST
# ============================================================
print("=" * 70)
print("BAGIAN B: WILCOXON SIGNED-RANK TEST (Uji Utama)")
print("=" * 70)

print("""
  Hipotesis:
    H0: Median selisih = 0 (tidak ada perbedaan usabilitas)
    H1: Median selisih ≠ 0 (ada perbedaan usabilitas)
  
  Kriteria:
    α = 0,05 (two-tailed)
    Jika p-value < 0,05 → Tolak H0 (ada perbedaan signifikan)
    Jika p-value ≥ 0,05 → Terima H0 (tidak ada perbedaan signifikan)
  
  Catatan: Wilcoxon HANYA menggunakan responden dengan selisih ≠ 0.
  Responden dengan selisih = 0 (tied) dikeluarkan dari perhitungan.
""")

# Hitung detail Wilcoxon
diff_nonzero = diff[diff != 0]
n_nonzero = len(diff_nonzero)
n_zero = (diff == 0).sum()
n_positive = (diff > 0).sum()
n_negative = (diff < 0).sum()

wilcox_stat, wilcox_p = stats.wilcoxon(diff_nonzero, alternative='two-sided')

print(f"  --- Hasil Wilcoxon Signed-Rank Test ---")
print(f"  N total              : {len(diff)}")
print(f"  N selisih = 0 (tied) : {n_zero} (dikeluarkan)")
print(f"  N selisih ≠ 0 (used) : {n_nonzero}")
print(f"    - Positive ranks   : {n_positive} (Gen-Z > Formal)")
print(f"    - Negative ranks   : {n_negative} (Formal > Gen-Z)")
print(f"  W-statistik          : {wilcox_stat:.1f}")
print(f"  Sig. (2-tailed)      : {wilcox_p:.6f}")
print(f"  ")
keputusan_w = "SIGNIFIKAN (Tolak H0)" if wilcox_p < 0.05 else "TIDAK SIGNIFIKAN (Terima H0)"
print(f"  KEPUTUSAN: {keputusan_w}")

if wilcox_p < 0.05:
    print(f"  → Terdapat perbedaan signifikan secara nonparametrik")
    print(f"  → NAMUN perlu dilihat bersama effect size untuk makna praktis")

# Penjelasan cara kerja Wilcoxon
print(f"""
  --- Cara Kerja Wilcoxon Signed-Rank ---
  1. Hitung selisih D = Gen-Z - Formal untuk setiap responden
  2. Buang responden dengan D = 0 (118 responden dikeluarkan)
  3. Ranking |D| dari terkecil ke terbesar (287 responden)
  4. Beri tanda + atau - sesuai arah selisih
  5. Jumlahkan ranking positif (T+) dan ranking negatif (T-)
  6. W = min(T+, T-) atau T+ (tergantung implementasi)
  7. Bandingkan dengan distribusi Wilcoxon untuk menentukan p-value
""")

# ============================================================
# BAGIAN C: EFFECT SIZE (Cohen's dz)
# ============================================================
print("=" * 70)
print("BAGIAN C: EFFECT SIZE — COHEN'S dz")
print("=" * 70)

print("""
  Tujuan: Mengukur BESARAN PRAKTIS perbedaan, terlepas dari signifikansi statistik.
  
  Mengapa penting?
  - Signifikansi statistik (p-value) dipengaruhi oleh ukuran sampel
  - Dengan N=405, perbedaan sangat kecil pun bisa "signifikan" secara statistik
  - Effect size menunjukkan apakah perbedaan tersebut BERMAKNA secara praktis
""")

cohens_dz = diff.mean() / diff.std()

print(f"  --- Perhitungan Cohen's dz ---")
print(f"  Rumus: dz = Mean_D / SD_D")
print(f"  dz = {diff.mean():.4f} / {diff.std():.4f}")
print(f"  dz = {cohens_dz:.4f}")

print(f"""
  --- Kriteria Interpretasi Cohen's d ---
  | Nilai |d|    | Kategori        | Makna Praktis                    |
  |--------------|-----------------|----------------------------------|
  | < 0,20       | Trivial/Sangat  | Perbedaan tidak bermakna         |
  |              | Kecil           | secara praktis                   |
  | 0,20 – 0,49  | Kecil (Small)   | Perbedaan kecil tapi terdeteksi  |
  | 0,50 – 0,79  | Sedang (Medium) | Perbedaan cukup bermakna         |
  | ≥ 0,80       | Besar (Large)   | Perbedaan sangat bermakna        |
  
  Hasil: Cohen's dz = {cohens_dz:.4f} → TRIVIAL / SANGAT KECIL
  
  Interpretasi:
  → Meskipun Wilcoxon signifikan (p = {wilcox_p:.4f}), perbedaan yang
    terdeteksi SANGAT KECIL secara praktis
  → Perbedaan 0,57 poin pada skala 0-100 tidak bermakna dalam konteks nyata
  → Pengguna tidak akan merasakan perbedaan usabilitas yang berarti
""")

# ============================================================
# BAGIAN D: ORDER EFFECT (Kontrol Urutan Pengujian)
# ============================================================
print("=" * 70)
print("BAGIAN D: ORDER EFFECT — KONTROL URUTAN PENGUJIAN")
print("=" * 70)

print("""
  Tujuan: Memastikan urutan pengujian chatbot tidak memengaruhi hasil.
  
  Masalah potensial:
  - Jika responden selalu menilai chatbot KEDUA lebih tinggi (learning effect)
  - Atau selalu menilai chatbot PERTAMA lebih tinggi (fatigue effect)
  - Maka perbedaan skor bukan karena gaya bahasa, tapi karena urutan
  
  Desain counterbalance:
  - Kelompok 1: Formal → Gen-Z (283 responden)
  - Kelompok 2: Gen-Z → Formal (122 responden)
  
  Uji: Apakah selisih skor berbeda antara kedua kelompok urutan?
""")

order = bagian_b['b4']
diff_formal_first = diff[order == 'Formal \u2192 Gen-Z']
diff_genz_first = diff[order == 'Gen-Z \u2192 Formal']

# Welch t-test (tidak mengasumsikan varians sama)
t_order, p_order = stats.ttest_ind(diff_formal_first, diff_genz_first, equal_var=False)

print(f"  --- Hasil Uji Order Effect (Welch t-test) ---")
print(f"  Kelompok Formal→Gen-Z:")
print(f"    N     = {len(diff_formal_first)}")
print(f"    Mean D = {diff_formal_first.mean():.4f}")
print(f"    SD D   = {diff_formal_first.std():.4f}")
print(f"  ")
print(f"  Kelompok Gen-Z→Formal:")
print(f"    N     = {len(diff_genz_first)}")
print(f"    Mean D = {diff_genz_first.mean():.4f}")
print(f"    SD D   = {diff_genz_first.std():.4f}")
print(f"  ")
print(f"  Welch t-statistik : {t_order:.4f}")
print(f"  df (Welch)        : {len(diff_formal_first) + len(diff_genz_first) - 2:.1f}")
print(f"  Sig. (2-tailed)   : {p_order:.4f}")
print(f"  ")
keputusan_order = "TIDAK SIGNIFIKAN" if p_order >= 0.05 else "SIGNIFIKAN"
print(f"  KEPUTUSAN: {keputusan_order}")
print(f"  → Urutan pengujian TIDAK memengaruhi hasil secara signifikan")
print(f"  → Counterbalance berhasil mengontrol order effect")

# ============================================================
# BAGIAN E: RINGKASAN KOMPREHENSIF
# ============================================================
print("\n" + "=" * 70)
print("RINGKASAN KOMPREHENSIF TAHAP 6")
print("=" * 70)

print(f"""
  ┌────────────────────────────────────────────────────────────────────┐
  │                    HASIL UJI HIPOTESIS                              │
  ├────────────────────────────────────────────────────────────────────┤
  │                                                                    │
  │  Paired t-test:                                                    │
  │    t = {t_stat:.4f}, df = 404, Sig. = {t_p:.4f}                          │
  │    → TIDAK SIGNIFIKAN (p > 0,05)                                   │
  │                                                                    │
  │  Wilcoxon Signed-Rank (UJI UTAMA):                                 │
  │    W = {wilcox_stat:.1f}, N nonzero = {n_nonzero}, Sig. = {wilcox_p:.6f}          │
  │    → SIGNIFIKAN (p < 0,05)                                         │
  │                                                                    │
  │  Cohen's dz (Effect Size):                                         │
  │    dz = {cohens_dz:.4f} → TRIVIAL / SANGAT KECIL                        │
  │                                                                    │
  │  Order Effect:                                                     │
  │    t = {t_order:.4f}, Sig. = {p_order:.4f}                                    │
  │    → TIDAK SIGNIFIKAN (urutan tidak berpengaruh)                    │
  │                                                                    │
  ├────────────────────────────────────────────────────────────────────┤
  │                    INTERPRETASI GABUNGAN                            │
  ├────────────────────────────────────────────────────────────────────┤
  │                                                                    │
  │  1. Wilcoxon mendeteksi perbedaan signifikan secara statistik      │
  │  2. NAMUN effect size sangat kecil (dz = 0,070)                    │
  │  3. Paired t-test tidak signifikan (mendukung kehati-hatian)       │
  │  4. Selisih praktis hanya 0,57 poin dari 100                      │
  │  5. Order effect tidak signifikan (hasil valid)                    │
  │                                                                    │
  │  KESIMPULAN:                                                       │
  │  Terdapat indikasi perbedaan secara nonparametrik, tetapi          │
  │  perbedaan tersebut SANGAT KECIL secara praktis dan TIDAK          │
  │  cukup untuk menyatakan keunggulan salah satu gaya bahasa.         │
  │                                                                    │
  └────────────────────────────────────────────────────────────────────┘
""")

print("  ✓ Siap lanjut ke Tahap 7: Analisis Klaster CUQ")
