"""
Tahap 3: Reverse Scoring & Normalisasi Skor CUQ
=================================================
Script ini mendemonstrasikan proses konversi jawaban mentah CUQ
menjadi skor total 0-100 untuk setiap responden.
"""

import pandas as pd
import json

# ============================================================
# LOAD DATA
# ============================================================
df = pd.read_csv(r'D:\DATA\TESIS\KOMPRE\PENDALAMAN\02-data\cuq\cuq_responses_rows.csv')

cuq_formal_raw = pd.DataFrame(df['cuq_formal'].apply(json.loads).tolist()).apply(pd.to_numeric)
cuq_genz_raw = pd.DataFrame(df['cuq_genz'].apply(json.loads).tolist()).apply(pd.to_numeric)

# ============================================================
# DEFINISI ITEM POSITIF DAN NEGATIF
# ============================================================
pos_items = ['q1', 'q3', 'q5', 'q7', 'q9', 'q11', 'q13', 'q15']
neg_items = ['q2', 'q4', 'q6', 'q8', 'q10', 'q12', 'q14', 'q16']

print("=" * 70)
print("TAHAP 3: REVERSE SCORING & NORMALISASI SKOR CUQ")
print("=" * 70)

# ============================================================
# LANGKAH 1: Tampilkan data mentah contoh (5 responden pertama)
# ============================================================
print("\n--- LANGKAH 1: DATA MENTAH (5 responden pertama, CUQ Formal) ---")
print(cuq_formal_raw.head().to_string())

# ============================================================
# LANGKAH 2: REVERSE SCORING
# ============================================================
# Rumus:
#   Item positif (Q1,Q3,Q5,Q7,Q9,Q11,Q13,Q15): skor_konversi = skor_mentah - 1
#   Item negatif (Q2,Q4,Q6,Q8,Q10,Q12,Q14,Q16): skor_konversi = 5 - skor_mentah

def reverse_score(raw_df):
    """Konversi skor mentah CUQ ke skor yang sudah di-reverse."""
    converted = pd.DataFrame(index=raw_df.index)
    for item in pos_items:
        converted[item] = raw_df[item] - 1
    for item in neg_items:
        converted[item] = 5 - raw_df[item]
    return converted

formal_converted = reverse_score(cuq_formal_raw)
genz_converted = reverse_score(cuq_genz_raw)

print("\n--- LANGKAH 2: SETELAH REVERSE SCORING (5 responden pertama, Formal) ---")
print(formal_converted.head().to_string())

# ============================================================
# LANGKAH 3: DEMONSTRASI MANUAL (Responden pertama)
# ============================================================
print("\n--- LANGKAH 3: DEMONSTRASI MANUAL (Responden #1, CUQ Formal) ---")
print(f"{'Item':<6} {'Tipe':<10} {'Mentah':<8} {'Rumus':<20} {'Konversi':<10}")
print("-" * 54)

resp1_raw = cuq_formal_raw.iloc[0]
resp1_conv = formal_converted.iloc[0]

all_items = [f'q{i}' for i in range(1, 17)]
for item in all_items:
    raw_val = int(resp1_raw[item])
    conv_val = int(resp1_conv[item])
    if item in pos_items:
        tipe = "Positif"
        rumus = f"{raw_val} - 1 = {conv_val}"
    else:
        tipe = "Negatif"
        rumus = f"5 - {raw_val} = {conv_val}"
    print(f"{item:<6} {tipe:<10} {raw_val:<8} {rumus:<20} {conv_val:<10}")

total_konversi = resp1_conv.sum()
print(f"\nTotal skor konversi: {total_konversi}")
print(f"Skor maksimum: 16 item x 4 = 64")

# ============================================================
# LANGKAH 4: NORMALISASI KE SKALA 0-100
# ============================================================
# Rumus: Skor CUQ = (Total skor konversi) x 100 / 64

formal_total = formal_converted.sum(axis=1)
genz_total = genz_converted.sum(axis=1)

formal_scores = formal_total * 100 / 64
genz_scores = genz_total * 100 / 64

skor_resp1 = formal_total.iloc[0] * 100 / 64
print(f"\nNormalisasi: ({total_konversi} x 100) / 64 = {skor_resp1:.2f}")

print("\n--- LANGKAH 4: SKOR CUQ FINAL (0-100), 10 responden pertama ---")
print(f"{'No':<5} {'Formal Total':<15} {'Formal CUQ':<15} {'GenZ Total':<15} {'GenZ CUQ':<15}")
print("-" * 65)
for i in range(10):
    print(f"{i+1:<5} {formal_total.iloc[i]:<15} {formal_scores.iloc[i]:<15.2f} {genz_total.iloc[i]:<15} {genz_scores.iloc[i]:<15.2f}")

# ============================================================
# LANGKAH 5: STATISTIK DESKRIPTIF SKOR FINAL
# ============================================================
print("\n--- LANGKAH 5: STATISTIK DESKRIPTIF SKOR CUQ (0-100) ---")
print(f"\n{'Indikator':<12} {'Formal':<12} {'Gen-Z':<12}")
print("-" * 36)
print(f"{'N':<12} {len(formal_scores):<12} {len(genz_scores):<12}")
print(f"{'Mean':<12} {formal_scores.mean():<12.2f} {genz_scores.mean():<12.2f}")
print(f"{'SD':<12} {formal_scores.std():<12.2f} {genz_scores.std():<12.2f}")
print(f"{'Median':<12} {formal_scores.median():<12.2f} {genz_scores.median():<12.2f}")
print(f"{'Min':<12} {formal_scores.min():<12.2f} {genz_scores.min():<12.2f}")
print(f"{'Max':<12} {formal_scores.max():<12.2f} {genz_scores.max():<12.2f}")
print(f"\nSelisih Mean (Gen-Z - Formal): {genz_scores.mean() - formal_scores.mean():.2f} poin")

# ============================================================
# LANGKAH 6: DISTRIBUSI SKOR
# ============================================================
print("\n--- LANGKAH 6: DISTRIBUSI KATEGORI SKOR CUQ ---")
print("(Berdasarkan interpretasi umum skala 0-100)")
print()

def kategorikan(scores, label):
    bins = [0, 25, 50, 75, 100.01]
    labels_cat = ['Rendah (0-25)', 'Cukup (26-50)', 'Baik (51-75)', 'Sangat Baik (76-100)']
    cats = pd.cut(scores, bins=bins, labels=labels_cat, right=False)
    dist = cats.value_counts().sort_index()
    print(f"  {label}:")
    for cat, count in dist.items():
        pct = count / len(scores) * 100
        print(f"    {cat}: {count} ({pct:.1f}%)")
    print()

kategorikan(formal_scores, "CUQ Formal")
kategorikan(genz_scores, "CUQ Gen-Z")

# ============================================================
# LANGKAH 7: VERIFIKASI RENTANG SKOR
# ============================================================
print("--- LANGKAH 7: VERIFIKASI ---")
print(f"Rentang skor Formal: {formal_scores.min():.2f} - {formal_scores.max():.2f} (harus 0-100)")
print(f"Rentang skor Gen-Z:  {genz_scores.min():.2f} - {genz_scores.max():.2f} (harus 0-100)")
print(f"Jumlah data Formal:  {len(formal_scores)} (harus 405)")
print(f"Jumlah data Gen-Z:   {len(genz_scores)} (harus 405)")
print("\n✓ Proses skoring selesai. Data siap untuk uji validitas & reliabilitas.")
