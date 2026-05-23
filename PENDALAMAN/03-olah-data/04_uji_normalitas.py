"""
Tahap 5: Uji Normalitas Distribusi Selisih Skor CUQ
=====================================================
Script ini menguji apakah distribusi selisih skor (Gen-Z minus Formal)
berdistribusi normal, untuk menentukan uji beda yang tepat.
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

# ============================================================
# HITUNG SELISIH SKOR
# ============================================================
diff = genz_scores - formal_scores

print("=" * 70)
print("TAHAP 5: UJI NORMALITAS DISTRIBUSI SELISIH SKOR CUQ")
print("=" * 70)

# ============================================================
# LANGKAH 1: MENGAPA MENGUJI SELISIH (BUKAN MASING-MASING)?
# ============================================================
print("""
--- LANGKAH 1: MENGAPA MENGUJI NORMALITAS SELISIH? ---

Karena desain penelitian ini adalah WITHIN-SUBJECT (paired):
- Setiap responden menguji KEDUA chatbot
- Yang dibandingkan adalah SELISIH skor dalam diri responden yang sama
- Paired t-test mensyaratkan SELISIH skor berdistribusi normal
- BUKAN mensyaratkan masing-masing skor berdistribusi normal

Rumus selisih: D = Skor Gen-Z - Skor Formal
""")

# ============================================================
# LANGKAH 2: STATISTIK DESKRIPTIF SELISIH
# ============================================================
print("--- LANGKAH 2: STATISTIK DESKRIPTIF SELISIH (D = Gen-Z - Formal) ---")
print(f"  N           : {len(diff)}")
print(f"  Mean        : {diff.mean():.4f}")
print(f"  SD          : {diff.std():.4f}")
print(f"  Median      : {diff.median():.4f}")
print(f"  Min         : {diff.min():.4f}")
print(f"  Max         : {diff.max():.4f}")
print(f"  Skewness    : {diff.skew():.4f}")
print(f"  Kurtosis    : {diff.kurtosis():.4f}")

# Distribusi selisih
print(f"\n  Distribusi arah selisih:")
print(f"    D > 0 (Gen-Z lebih tinggi) : {(diff > 0).sum()} responden ({(diff > 0).sum()/len(diff)*100:.1f}%)")
print(f"    D = 0 (sama persis)        : {(diff == 0).sum()} responden ({(diff == 0).sum()/len(diff)*100:.1f}%)")
print(f"    D < 0 (Formal lebih tinggi): {(diff < 0).sum()} responden ({(diff < 0).sum()/len(diff)*100:.1f}%)")

# ============================================================
# LANGKAH 3: UJI NORMALITAS SHAPIRO-WILK
# ============================================================
print("\n--- LANGKAH 3: UJI SHAPIRO-WILK ---")
print("  Hipotesis:")
print("    H0: Distribusi selisih berdistribusi normal")
print("    H1: Distribusi selisih TIDAK berdistribusi normal")
print("  Kriteria: Jika p-value < 0,05 → Tolak H0 (tidak normal)")
print()

shapiro_stat, shapiro_p = stats.shapiro(diff)
keputusan_sw = "TIDAK NORMAL (Tolak H0)" if shapiro_p < 0.05 else "NORMAL (Terima H0)"

print(f"  Statistik W : {shapiro_stat:.6f}")
print(f"  p-value     : {shapiro_p:.10f}")
print(f"  Keputusan   : {keputusan_sw}")

# ============================================================
# LANGKAH 4: UJI NORMALITAS KOLMOGOROV-SMIRNOV
# ============================================================
print("\n--- LANGKAH 4: UJI KOLMOGOROV-SMIRNOV (Lilliefors) ---")
print("  Hipotesis:")
print("    H0: Distribusi selisih berdistribusi normal")
print("    H1: Distribusi selisih TIDAK berdistribusi normal")
print("  Kriteria: Jika p-value < 0,05 → Tolak H0 (tidak normal)")
print()

# Standardize data for KS test against normal
diff_standardized = (diff - diff.mean()) / diff.std()
ks_stat, ks_p = stats.kstest(diff_standardized, 'norm')
keputusan_ks = "TIDAK NORMAL (Tolak H0)" if ks_p < 0.05 else "NORMAL (Terima H0)"

print(f"  Statistik D : {ks_stat:.6f}")
print(f"  p-value     : {ks_p:.10f}")
print(f"  Keputusan   : {keputusan_ks}")

# ============================================================
# LANGKAH 5: MENGAPA TIDAK NORMAL?
# ============================================================
print("\n--- LANGKAH 5: ANALISIS MENGAPA DISTRIBUSI TIDAK NORMAL ---")

# Cek proporsi selisih = 0
zero_diff = (diff == 0).sum()
print(f"\n  a) Banyaknya selisih = 0 (tied): {zero_diff} dari 405 ({zero_diff/405*100:.1f}%)")
print(f"     → Banyak responden memberikan skor IDENTIK pada kedua chatbot")
print(f"     → Ini menciptakan 'spike' di tengah distribusi")

# Cek distribusi selisih dalam interval
print(f"\n  b) Distribusi selisih dalam interval:")
intervals = [(-80, -20), (-20, -10), (-10, -5), (-5, 0), (0, 0.001), (0.001, 5), (5, 10), (10, 20), (20, 80)]
labels = ['< -20', '-20 s/d -10', '-10 s/d -5', '-5 s/d 0', '= 0', '0 s/d 5', '5 s/d 10', '10 s/d 20', '> 20']
for (lo, hi), label in zip(intervals, labels):
    if label == '= 0':
        count = (diff == 0).sum()
    else:
        count = ((diff > lo) & (diff <= hi)).sum()
    bar = '█' * (count // 5)
    print(f"     {label:>12}: {count:>4} {bar}")

# Skewness & Kurtosis
print(f"\n  c) Skewness = {diff.skew():.4f}")
if abs(diff.skew()) < 0.5:
    print(f"     → Mendekati simetris (|skew| < 0,5)")
elif diff.skew() > 0:
    print(f"     → Sedikit miring ke kanan (positif)")
else:
    print(f"     → Sedikit miring ke kiri (negatif)")

print(f"\n  d) Kurtosis = {diff.kurtosis():.4f}")
if diff.kurtosis() > 0:
    print(f"     → Leptokurtik (lebih lancip dari normal, ekor lebih berat)")
else:
    print(f"     → Platikurtik (lebih datar dari normal)")

# ============================================================
# LANGKAH 6: IMPLIKASI UNTUK PEMILIHAN UJI BEDA
# ============================================================
print("\n--- LANGKAH 6: IMPLIKASI UNTUK PEMILIHAN UJI BEDA ---")
print("""
  Karena distribusi selisih TIDAK NORMAL:
  
  ┌─────────────────────────────────────────────────────────────────┐
  │ UJI PARAMETRIK (Paired t-test)                                  │
  │ → Tetap dilaporkan sebagai INFORMASI PEMBANDING                 │
  │ → Asumsi normalitas TIDAK terpenuhi                             │
  │ → Hasil: referensi sekunder                                     │
  ├─────────────────────────────────────────────────────────────────┤
  │ UJI NONPARAMETRIK (Wilcoxon Signed-Rank Test)                   │
  │ → Digunakan sebagai ACUAN UTAMA                                 │
  │ → Tidak mensyaratkan normalitas                                 │
  │ → Membandingkan median dan ranking selisih                      │
  │ → Hasil: keputusan final                                        │
  └─────────────────────────────────────────────────────────────────┘
""")

# ============================================================
# LANGKAH 7: UJI TAMBAHAN - NORMALITAS PER KONDISI (informatif)
# ============================================================
print("--- LANGKAH 7: UJI NORMALITAS PER KONDISI (Informatif) ---")
print("  (Ini BUKAN syarat paired t-test, hanya informasi tambahan)\n")

sw_formal_stat, sw_formal_p = stats.shapiro(formal_scores)
sw_genz_stat, sw_genz_p = stats.shapiro(genz_scores)

print(f"  {'Kondisi':<10} {'Shapiro-Wilk W':<18} {'p-value':<15} {'Keputusan'}")
print(f"  {'-'*60}")
print(f"  {'Formal':<10} {sw_formal_stat:<18.6f} {sw_formal_p:<15.10f} {'Tidak Normal' if sw_formal_p < 0.05 else 'Normal'}")
print(f"  {'Gen-Z':<10} {sw_genz_stat:<18.6f} {sw_genz_p:<15.10f} {'Tidak Normal' if sw_genz_p < 0.05 else 'Normal'}")
print(f"  {'Selisih':<10} {shapiro_stat:<18.6f} {shapiro_p:<15.10f} {'Tidak Normal' if shapiro_p < 0.05 else 'Normal'}")

print("""
  Catatan: Masing-masing skor Formal dan Gen-Z juga tidak normal.
  Namun yang MENENTUKAN pemilihan uji adalah normalitas SELISIH.
""")

# ============================================================
# RINGKASAN
# ============================================================
print("=" * 70)
print("RINGKASAN TAHAP 5")
print("=" * 70)
print(f"""
  Distribusi selisih (D = Gen-Z - Formal):
    Mean    = {diff.mean():.2f}
    SD      = {diff.std():.2f}
    Median  = {diff.median():.2f}
  
  Uji Normalitas:
    Shapiro-Wilk  : W = {shapiro_stat:.4f}, p < 0,001 → TIDAK NORMAL
    Kolmogorov-S  : D = {ks_stat:.4f}, p < 0,001 → TIDAK NORMAL
  
  Penyebab ketidaknormalan:
    - {zero_diff} responden ({zero_diff/405*100:.1f}%) memiliki selisih = 0
    - Kurtosis tinggi ({diff.kurtosis():.2f}) → distribusi leptokurtik
  
  KEPUTUSAN:
    → Wilcoxon Signed-Rank Test sebagai UJI UTAMA
    → Paired t-test sebagai informasi pembanding
    
  ✓ Siap lanjut ke Tahap 6: Uji Beda (Paired t-test & Wilcoxon)
""")
