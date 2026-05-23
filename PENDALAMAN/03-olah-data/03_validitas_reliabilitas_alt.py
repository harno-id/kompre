"""
Verifikasi: Uji Validitas dengan Skor Mentah (sebelum reverse)
terhadap Skor Total (setelah reverse & normalisasi)
- Ini mereproduksi hasil tabel L.3 dalam tesis
"""

import pandas as pd
import json
import numpy as np

df = pd.read_csv(r'D:\DATA\TESIS\KOMPRE\PENDALAMAN\02-data\cuq\cuq_responses_rows.csv')

cuq_formal_raw = pd.DataFrame(df['cuq_formal'].apply(json.loads).tolist()).apply(pd.to_numeric)
cuq_genz_raw = pd.DataFrame(df['cuq_genz'].apply(json.loads).tolist()).apply(pd.to_numeric)

# Reverse scoring untuk total
pos_items = ['q1', 'q3', 'q5', 'q7', 'q9', 'q11', 'q13', 'q15']
neg_items = ['q2', 'q4', 'q6', 'q8', 'q10', 'q12', 'q14', 'q16']

def get_total(raw_df):
    converted = pd.DataFrame(index=raw_df.index)
    for item in pos_items:
        converted[item] = raw_df[item] - 1
    for item in neg_items:
        converted[item] = 5 - raw_df[item]
    return converted.sum(axis=1) * 100 / 64

formal_total = get_total(cuq_formal_raw)
genz_total = get_total(cuq_genz_raw)

r_tabel = 0.098

print("=" * 70)
print("VALIDITAS: Korelasi SKOR MENTAH (raw) vs SKOR TOTAL (normalized)")
print("Ini mereproduksi pendekatan tabel L.3 dalam tesis")
print("=" * 70)

print(f"\n{'Item':<8} {'r Formal':<12} {'Keputusan F':<16} {'r Gen-Z':<12} {'Keputusan G':<16} {'r tabel'}")
print("-" * 76)

for i in range(1, 17):
    col = f'q{i}'
    r_formal = cuq_formal_raw[col].corr(formal_total)
    r_genz = cuq_genz_raw[col].corr(genz_total)
    
    # Untuk item negatif, korelasi raw vs total akan negatif (karena arah berlawanan)
    # Tesis mungkin menggunakan nilai absolut atau korelasi langsung
    
    valid_f = "Valid" if abs(r_formal) > r_tabel else "Tidak valid"
    valid_g = "Valid" if abs(r_genz) > r_tabel else "Tidak valid"
    
    print(f"CUQ {i:<4} {r_formal:<12.3f} {valid_f:<16} {r_genz:<12.3f} {valid_g:<16} {r_tabel}")

print("\n\nNOTE: Item negatif memiliki korelasi negatif karena skor mentah")
print("berlawanan arah dengan skor total (yang sudah di-reverse).")
print("Tesis menggunakan pendekatan berbeda dalam menghitung validitas.")

# Coba pendekatan lain: korelasi item mentah vs total mentah (tanpa reverse)
print("\n\n" + "=" * 70)
print("ALTERNATIF: Korelasi SKOR MENTAH vs TOTAL MENTAH (tanpa reverse)")
print("=" * 70)

formal_raw_total = cuq_formal_raw.sum(axis=1)
genz_raw_total = cuq_genz_raw.sum(axis=1)

print(f"\n{'Item':<8} {'r Formal':<12} {'Keputusan F':<16} {'r Gen-Z':<12} {'Keputusan G':<16} {'r tabel'}")
print("-" * 76)

for i in range(1, 17):
    col = f'q{i}'
    r_formal = cuq_formal_raw[col].corr(formal_raw_total)
    r_genz = cuq_genz_raw[col].corr(genz_raw_total)
    
    valid_f = "Valid" if r_formal > r_tabel else "Tidak valid"
    valid_g = "Valid" if r_genz > r_tabel else "Tidak valid"
    
    print(f"CUQ {i:<4} {r_formal:<12.3f} {valid_f:<16} {r_genz:<12.3f} {valid_g:<16} {r_tabel}")

# Pendekatan ketiga: corrected item-total correlation
print("\n\n" + "=" * 70)
print("PENDEKATAN TESIS: Corrected Item-Total Correlation")
print("(Korelasi item dengan total DIKURANGI item tersebut, dari skor mentah)")
print("=" * 70)

print(f"\n{'Item':<8} {'r Formal':<12} {'Keputusan F':<16} {'r Gen-Z':<12} {'Keputusan G':<16} {'r tabel'}")
print("-" * 76)

for i in range(1, 17):
    col = f'q{i}'
    # Corrected: total minus item itu sendiri
    formal_corrected_total = formal_raw_total - cuq_formal_raw[col]
    genz_corrected_total = genz_raw_total - cuq_genz_raw[col]
    
    r_formal = cuq_formal_raw[col].corr(formal_corrected_total)
    r_genz = cuq_genz_raw[col].corr(genz_corrected_total)
    
    valid_f = "Valid" if r_formal > r_tabel else "Tidak valid"
    valid_g = "Valid" if r_genz > r_tabel else "Tidak valid"
    
    print(f"CUQ {i:<4} {r_formal:<12.3f} {valid_f:<16} {r_genz:<12.3f} {valid_g:<16} {r_tabel}")
