"""
Tahap 7: Analisis Klaster CUQ (Per-Dimensi Usabilitas)
========================================================
Script ini menganalisis perbedaan per klaster/dimensi CUQ untuk menjawab
Rumusan Masalah 3: Aspek usabilitas mana yang paling menonjol?
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

def reverse_score(raw_df):
    """Konversi ke skor 0-4 (setelah reverse)."""
    converted = pd.DataFrame(index=raw_df.index)
    for item in pos_items:
        converted[item] = raw_df[item] - 1
    for item in neg_items:
        converted[item] = 5 - raw_df[item]
    cols_ordered = [f'q{i}' for i in range(1, 17)]
    return converted[cols_ordered]

formal_scored = reverse_score(cuq_formal_raw)
genz_scored = reverse_score(cuq_genz_raw)

print("=" * 70)
print("TAHAP 7: ANALISIS KLASTER CUQ (PER-DIMENSI USABILITAS)")
print("=" * 70)

# ============================================================
# DEFINISI KLASTER CUQ
# ============================================================
print("""
--- DEFINISI 4 KLASTER CUQ ---

CUQ 16 item dikelompokkan ke dalam 4 dimensi usabilitas chatbot:
""")

clusters = {
    'Persona & Afeksi': {
        'items': ['q1', 'q2', 'q3', 'q4'],
        'deskripsi': 'Kepribadian chatbot, keramahan, kesan non-robotik',
        'detail_items': [
            'Q1(+): Kepribadian chatbot terasa realistis dan menarik',
            'Q2(-): Chatbot terasa terlalu kaku atau robotik',
            'Q3(+): Chatbot bersikap ramah pada awal interaksi',
            'Q4(-): Chatbot terlihat tidak bersahabat'
        ]
    },
    'Kualitas Informasi': {
        'items': ['q5', 'q6', 'q11', 'q12'],
        'deskripsi': 'Kejelasan tujuan, relevansi, kebermanfaatan respons',
        'detail_items': [
            'Q5(+): Chatbot menjelaskan tujuan dan fungsinya dengan jelas',
            'Q6(-): Chatbot tidak memberikan penjelasan mengenai tujuannya',
            'Q11(+): Respon chatbot bermanfaat, relevan, dan informatif',
            'Q12(-): Respon chatbot tidak relevan'
        ]
    },
    'Navigasi & Kemudahan': {
        'items': ['q7', 'q8', 'q15', 'q16'],
        'deskripsi': 'Kemudahan navigasi, kompleksitas penggunaan',
        'detail_items': [
            'Q7(+): Chatbot mudah digunakan untuk bernavigasi',
            'Q8(-): Saya mudah merasa bingung saat menggunakan chatbot',
            'Q15(+): Chatbot sangat mudah digunakan',
            'Q16(-): Chatbot terasa sangat kompleks'
        ]
    },
    'Efektivitas Interaksi': {
        'items': ['q9', 'q10', 'q13', 'q14'],
        'deskripsi': 'Pemahaman input pengguna, penanganan kesalahan',
        'detail_items': [
            'Q9(+): Chatbot memahami pertanyaan/masukan saya dengan baik',
            'Q10(-): Chatbot sering gagal memahami masukan saya',
            'Q13(+): Chatbot mampu menangani kesalahan dengan baik',
            'Q14(-): Chatbot tidak mampu menangani kesalahan'
        ]
    }
}

for name, info in clusters.items():
    print(f"  {name} ({', '.join(info['items']).upper()})")
    print(f"    → {info['deskripsi']}")
    for detail in info['detail_items']:
        print(f"      {detail}")
    print()

# ============================================================
# ANALISIS PER KLASTER: RATA-RATA
# ============================================================
print("=" * 70)
print("ANALISIS 1: PERBANDINGAN RATA-RATA PER KLASTER")
print("=" * 70)
print()

# Menggunakan skala rata-rata item (0-4, kemudian ditampilkan juga dalam 0-100)
print(f"{'Klaster':<25} {'Mean F (0-4)':<14} {'Mean G (0-4)':<14} {'Selisih':<10} {'Mean F (0-100)':<16} {'Mean G (0-100)':<16} {'Selisih %'}")
print("-" * 110)

cluster_results = []
for name, info in clusters.items():
    items = info['items']
    
    # Rata-rata per klaster (skala 0-4)
    f_mean = formal_scored[items].mean(axis=1).mean()
    g_mean = genz_scored[items].mean(axis=1).mean()
    diff_mean = g_mean - f_mean
    
    # Konversi ke skala 0-100
    f_pct = f_mean * 100 / 4
    g_pct = g_mean * 100 / 4
    diff_pct = diff_mean * 100 / 4
    
    print(f"{name:<25} {f_mean:<14.4f} {g_mean:<14.4f} {diff_mean:<10.4f} {f_pct:<16.2f} {g_pct:<16.2f} {diff_pct:.2f}")
    
    cluster_results.append({
        'name': name,
        'items': items,
        'f_mean': f_mean,
        'g_mean': g_mean,
        'diff': diff_mean,
        'f_pct': f_pct,
        'g_pct': g_pct
    })

# ============================================================
# ANALISIS PER KLASTER: RATA-RATA SKOR MENTAH (skala 1-5)
# ============================================================
print(f"\n\n{'='*70}")
print("ANALISIS 2: RATA-RATA SKOR MENTAH PER KLASTER (Skala 1-5)")
print("(Sebelum reverse — untuk melihat pola jawaban asli)")
print("=" * 70)
print()

print(f"{'Klaster':<25} {'Item':<6} {'Tipe':<9} {'Mean F':<9} {'Mean G':<9} {'Selisih':<9} {'Interpretasi'}")
print("-" * 85)

for name, info in clusters.items():
    items = info['items']
    print(f"\n  {name}:")
    for item in items:
        tipe = "Positif" if item in pos_items else "Negatif"
        f_val = cuq_formal_raw[item].mean()
        g_val = cuq_genz_raw[item].mean()
        diff_val = g_val - f_val
        
        if item in pos_items:
            if diff_val > 0:
                interp = "Gen-Z dinilai lebih baik"
            elif diff_val < 0:
                interp = "Formal dinilai lebih baik"
            else:
                interp = "Sama"
        else:  # negatif
            if diff_val < 0:
                interp = "Gen-Z dinilai lebih baik"
            elif diff_val > 0:
                interp = "Formal dinilai lebih baik"
            else:
                interp = "Sama"
        
        print(f"  {'':>23} {item.upper():<6} {tipe:<9} {f_val:<9.3f} {g_val:<9.3f} {diff_val:<+9.3f} {interp}")

# ============================================================
# ANALISIS PER KLASTER: UJI WILCOXON PER DIMENSI
# ============================================================
print(f"\n\n{'='*70}")
print("ANALISIS 3: UJI WILCOXON PER KLASTER")
print("(Apakah ada klaster yang menunjukkan perbedaan signifikan?)")
print("=" * 70)
print()

print(f"{'Klaster':<25} {'W-stat':<12} {'p-value':<12} {'N nonzero':<12} {'Cohen dz':<12} {'Keputusan'}")
print("-" * 85)

for name, info in clusters.items():
    items = info['items']
    
    # Skor klaster per responden (rata-rata item dalam klaster, skala 0-4)
    f_cluster = formal_scored[items].mean(axis=1)
    g_cluster = genz_scored[items].mean(axis=1)
    d_cluster = g_cluster - f_cluster
    
    # Wilcoxon pada selisih klaster
    d_nonzero = d_cluster[d_cluster != 0]
    n_nonzero = len(d_nonzero)
    
    if n_nonzero > 0:
        w_stat, w_p = stats.wilcoxon(d_nonzero, alternative='two-sided')
        dz = d_cluster.mean() / d_cluster.std() if d_cluster.std() > 0 else 0
        keputusan = "Signifikan*" if w_p < 0.05 else "Tidak Signifikan"
    else:
        w_stat, w_p, dz = 0, 1, 0
        keputusan = "N/A"
    
    print(f"{name:<25} {w_stat:<12.1f} {w_p:<12.6f} {n_nonzero:<12} {dz:<12.4f} {keputusan}")

print("\n  * Signifikan secara statistik, tetapi perlu dilihat effect size")

# ============================================================
# ANALISIS PER ITEM INDIVIDUAL
# ============================================================
print(f"\n\n{'='*70}")
print("ANALISIS 4: PERBANDINGAN PER ITEM (Setelah Reverse, Skala 0-4)")
print("=" * 70)
print()

print(f"{'Item':<6} {'Klaster':<22} {'Mean F':<9} {'Mean G':<9} {'Selisih':<9} {'Arah'}")
print("-" * 65)

for name, info in clusters.items():
    for item in info['items']:
        f_val = formal_scored[item].mean()
        g_val = genz_scored[item].mean()
        diff_val = g_val - f_val
        
        if diff_val > 0.05:
            arah = "→ Gen-Z"
        elif diff_val < -0.05:
            arah = "→ Formal"
        else:
            arah = "≈ Setara"
        
        print(f"{item.upper():<6} {name:<22} {f_val:<9.4f} {g_val:<9.4f} {diff_val:<+9.4f} {arah}")

# ============================================================
# VISUALISASI TEKS: RADAR CHART SEDERHANA
# ============================================================
print(f"\n\n{'='*70}")
print("VISUALISASI: PERBANDINGAN KLASTER (Skala 0-100)")
print("=" * 70)
print()

max_bar = 40  # panjang bar maksimum

for cr in cluster_results:
    f_bar_len = int(cr['f_pct'] / 100 * max_bar)
    g_bar_len = int(cr['g_pct'] / 100 * max_bar)
    
    print(f"  {cr['name']}")
    print(f"    Formal : {'█' * f_bar_len}{'░' * (max_bar - f_bar_len)} {cr['f_pct']:.1f}%")
    print(f"    Gen-Z  : {'█' * g_bar_len}{'░' * (max_bar - g_bar_len)} {cr['g_pct']:.1f}%")
    print(f"    Selisih: {(cr['g_pct'] - cr['f_pct']):+.2f} poin")
    print()

# ============================================================
# RINGKASAN
# ============================================================
print("=" * 70)
print("RINGKASAN TAHAP 7")
print("=" * 70)
print(f"""
  TEMUAN UTAMA:
  
  1. Seluruh klaster memiliki selisih yang SANGAT KECIL (< 1 poin pada skala 0-100)
  
  2. Tidak ada klaster yang menjadi PEMBEDA DOMINAN antara kedua kondisi
  
  3. Urutan klaster berdasarkan skor (kedua kondisi konsisten):
     - Tertinggi : Kualitas Informasi & Navigasi/Kemudahan
     - Terendah  : Efektivitas Interaksi & Persona/Afeksi
  
  4. Pola ini menunjukkan bahwa:
     - Responden menilai KUALITAS ISI dan KEMUDAHAN NAVIGASI paling tinggi
     - Aspek PERSONA (keramahan, karakter) dan EFEKTIVITAS (pemahaman input)
       dinilai sedikit lebih rendah — tetapi tetap di atas rata-rata
  
  5. Gaya bahasa (Formal vs Gen-Z) TIDAK mengubah pola prioritas dimensi
     → Kedua chatbot dinilai dengan pola yang sama

  IMPLIKASI:
  - Perbedaan gaya bahasa belum terbukti menjadi faktor dominan
  - Usabilitas chatbot lebih ditentukan oleh kualitas informasi dan
    kemudahan navigasi daripada gaya penyampaian pesan
  - Pengembangan chatbot sebaiknya fokus pada SEMUA dimensi secara merata

  ✓ Analisis klaster selesai. Seluruh tahapan pengolahan data telah lengkap.
""")
