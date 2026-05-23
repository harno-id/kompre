"""
Tahap 4: Uji Validitas & Reliabilitas Instrumen CUQ
=====================================================
Script ini mendemonstrasikan proses uji validitas item (korelasi item-total)
dan uji reliabilitas (Cronbach's Alpha) untuk instrumen CUQ.
"""

import pandas as pd
import json
import numpy as np

# ============================================================
# LOAD DATA & SCORING
# ============================================================
df = pd.read_csv(r'D:\DATA\TESIS\KOMPRE\PENDALAMAN\02-data\cuq\cuq_responses_rows.csv')

cuq_formal_raw = pd.DataFrame(df['cuq_formal'].apply(json.loads).tolist()).apply(pd.to_numeric)
cuq_genz_raw = pd.DataFrame(df['cuq_genz'].apply(json.loads).tolist()).apply(pd.to_numeric)

# Reverse scoring
pos_items = ['q1', 'q3', 'q5', 'q7', 'q9', 'q11', 'q13', 'q15']
neg_items = ['q2', 'q4', 'q6', 'q8', 'q10', 'q12', 'q14', 'q16']

def reverse_score(raw_df):
    converted = pd.DataFrame(index=raw_df.index)
    for item in pos_items:
        converted[item] = raw_df[item] - 1
    for item in neg_items:
        converted[item] = 5 - raw_df[item]
    # Urutkan kembali q1-q16
    cols_ordered = [f'q{i}' for i in range(1, 17)]
    return converted[cols_ordered]

formal_scored = reverse_score(cuq_formal_raw)
genz_scored = reverse_score(cuq_genz_raw)

# Skor total
formal_total = formal_scored.sum(axis=1)
genz_total = genz_scored.sum(axis=1)

print("=" * 70)
print("TAHAP 4: UJI VALIDITAS & RELIABILITAS INSTRUMEN CUQ")
print("=" * 70)

# ============================================================
# BAGIAN A: UJI VALIDITAS ITEM (Korelasi Item-Total)
# ============================================================
print("\n" + "=" * 70)
print("BAGIAN A: UJI VALIDITAS ITEM")
print("=" * 70)
print("\nMetode: Korelasi Pearson antara skor item dengan skor total")
print("Kriteria: r hitung > r tabel → Valid")
print(f"r tabel (N=405, df=403, α=0,05, two-tailed) = 0,098")
print()

# Hitung r tabel
N = 405
r_tabel = 0.098  # Nilai kritis r untuk df=403, alpha=0.05

def uji_validitas(scored_df, total_scores, label):
    """Hitung korelasi item-total untuk setiap item."""
    print(f"--- Validitas {label} ---")
    print(f"{'Item':<8} {'r hitung':<12} {'r tabel':<10} {'Keputusan':<15}")
    print("-" * 45)
    
    results = []
    valid_count = 0
    invalid_count = 0
    
    for col in scored_df.columns:
        r = scored_df[col].corr(total_scores)
        valid = "Valid" if r > r_tabel else "Tidak valid"
        if r > r_tabel:
            valid_count += 1
        else:
            invalid_count += 1
        print(f"{col:<8} {r:<12.3f} {r_tabel:<10} {valid:<15}")
        results.append({'item': col, 'r': r, 'valid': valid})
    
    print(f"\nTotal Valid: {valid_count}/16, Tidak Valid: {invalid_count}/16")
    print()
    return results

formal_validity = uji_validitas(formal_scored, formal_total, "CUQ Formal")
genz_validity = uji_validitas(genz_scored, genz_total, "CUQ Gen-Z")

# Ringkasan item tidak valid
print("\n--- RINGKASAN ITEM TIDAK VALID ---")
print("\nCUQ Formal - Item tidak valid:")
for item in formal_validity:
    if item['valid'] == "Tidak valid":
        print(f"  {item['item']}: r = {item['r']:.3f} (< {r_tabel})")

print("\nCUQ Gen-Z - Item tidak valid:")
for item in genz_validity:
    if item['valid'] == "Tidak valid":
        print(f"  {item['item']}: r = {item['r']:.3f} (< {r_tabel})")

# ============================================================
# BAGIAN B: UJI RELIABILITAS (Cronbach's Alpha)
# ============================================================
print("\n" + "=" * 70)
print("BAGIAN B: UJI RELIABILITAS (CRONBACH'S ALPHA)")
print("=" * 70)

def cronbach_alpha(df):
    """Hitung Cronbach's Alpha."""
    n_items = df.shape[1]
    item_variances = df.var(axis=0, ddof=1)
    total_variance = df.sum(axis=1).var(ddof=1)
    
    alpha = (n_items / (n_items - 1)) * (1 - item_variances.sum() / total_variance)
    return alpha

alpha_formal = cronbach_alpha(formal_scored)
alpha_genz = cronbach_alpha(genz_scored)

print(f"\nMetode: Cronbach's Alpha")
print(f"Kriteria interpretasi:")
print(f"  α ≥ 0,9  : Sangat Reliabel (Excellent)")
print(f"  α ≥ 0,8  : Reliabel (Good)")
print(f"  α ≥ 0,7  : Cukup Reliabel (Acceptable)")
print(f"  α ≥ 0,6  : Kurang Reliabel (Questionable)")
print(f"  α < 0,6  : Tidak Reliabel (Poor/Unacceptable)")

print(f"\n--- Hasil Uji Reliabilitas ---")
print(f"{'Kondisi':<12} {'Jumlah Item':<15} {'Cronbach Alpha':<18} {'Interpretasi':<20}")
print("-" * 65)

def interpret_alpha(a):
    if a >= 0.9: return "Sangat Reliabel"
    elif a >= 0.8: return "Reliabel"
    elif a >= 0.7: return "Cukup Reliabel"
    elif a >= 0.6: return "Kurang Reliabel"
    else: return "Tidak Reliabel"

print(f"{'Formal':<12} {16:<15} {alpha_formal:<18.3f} {interpret_alpha(alpha_formal):<20}")
print(f"{'Gen-Z':<12} {16:<15} {alpha_genz:<18.3f} {interpret_alpha(alpha_genz):<20}")

# ============================================================
# BAGIAN C: ALPHA IF ITEM DELETED
# ============================================================
print("\n--- Alpha If Item Deleted (CUQ Formal) ---")
print(f"{'Item':<8} {'Alpha tanpa item':<20} {'Perubahan':<15}")
print("-" * 43)

for col in formal_scored.columns:
    df_without = formal_scored.drop(columns=[col])
    alpha_without = cronbach_alpha(df_without)
    change = alpha_without - alpha_formal
    direction = "↑" if change > 0 else "↓" if change < 0 else "="
    print(f"{col:<8} {alpha_without:<20.4f} {direction} {abs(change):.4f}")

print(f"\nAlpha keseluruhan: {alpha_formal:.4f}")

print("\n--- Alpha If Item Deleted (CUQ Gen-Z) ---")
print(f"{'Item':<8} {'Alpha tanpa item':<20} {'Perubahan':<15}")
print("-" * 43)

for col in genz_scored.columns:
    df_without = genz_scored.drop(columns=[col])
    alpha_without = cronbach_alpha(df_without)
    change = alpha_without - alpha_genz
    direction = "↑" if change > 0 else "↓" if change < 0 else "="
    print(f"{col:<8} {alpha_without:<20.4f} {direction} {abs(change):.4f}")

print(f"\nAlpha keseluruhan: {alpha_genz:.4f}")

# ============================================================
# BAGIAN D: KESIMPULAN
# ============================================================
print("\n" + "=" * 70)
print("KESIMPULAN")
print("=" * 70)
print(f"""
1. VALIDITAS:
   - Beberapa item positif tidak memenuhi validitas item (r < 0,098)
   - Item yang konsisten tidak valid di kedua kondisi: Q3, Q5, Q7, Q9
   - Penyebab: item positif cenderung memiliki varians rendah (ceiling effect)
   - Keputusan: Analisis tetap menggunakan SKOR TOTAL karena reliabilitas tinggi

2. RELIABILITAS:
   - Formal: α = {alpha_formal:.3f} (Sangat Reliabel)
   - Gen-Z: α = {alpha_genz:.3f} (Sangat Reliabel)
   - Kedua kondisi memiliki konsistensi internal yang sangat baik
   - Tidak ada item yang jika dihapus akan meningkatkan alpha secara substansial

3. IMPLIKASI:
   - Meskipun beberapa item tidak valid secara individual, instrumen CUQ
     secara keseluruhan tetap reliabel dan layak digunakan
   - Interpretasi per-item harus dilakukan secara hati-hati
   - Analisis utama berbasis SKOR TOTAL tetap dapat dipertanggungjawabkan
""")
