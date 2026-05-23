import pandas as pd
import json
import numpy as np

df = pd.read_csv(r'D:\DATA\TESIS\KOMPRE\PENDALAMAN\02-data\cuq\cuq_responses_rows.csv')

# Parse JSON columns
profil = df['profil'].apply(json.loads)
profil_df = pd.json_normalize(profil)

bagian_b = df['bagian_b'].apply(json.loads)
bagian_b_df = pd.json_normalize(bagian_b)

cuq_formal = df['cuq_formal'].apply(json.loads)
cuq_formal_df = pd.DataFrame(cuq_formal.tolist())
cuq_formal_df = cuq_formal_df.apply(pd.to_numeric)

cuq_genz = df['cuq_genz'].apply(json.loads)
cuq_genz_df = pd.DataFrame(cuq_genz.tolist())
cuq_genz_df = cuq_genz_df.apply(pd.to_numeric)

print("=" * 60)
print("ANALISIS DATASET CUQ RESPONSES - 405 RESPONDEN")
print("=" * 60)

print("\n--- PROFIL RESPONDEN ---")
print(f"Gender:\n{profil_df['gender'].value_counts()}")
print(f"\nUsia:\n{profil_df['usia'].value_counts().sort_index()}")
print(f"\nStatus:\n{profil_df['status'].value_counts()}")
print(f"\nKab/Kota (top 10):\n{profil_df['kabkota'].value_counts().head(10)}")

print("\n--- BAGIAN B (KONTEKS PMB) ---")
print(f"Urutan pengujian (b4):\n{bagian_b_df['b4'].value_counts()}")
print(f"\nMenyelesaikan kedua chatbot (b5):\n{bagian_b_df['b5'].value_counts()}")
print(f"\nDurasi pengujian (b6):\n{bagian_b_df['b6'].value_counts()}")
print(f"\nFrekuensi chatbot sebelumnya (b8):\n{bagian_b_df['b8'].value_counts()}")

print("\n--- STATISTIK DESKRIPTIF CUQ FORMAL (per item) ---")
print(cuq_formal_df.describe().round(3))

print("\n--- STATISTIK DESKRIPTIF CUQ GEN-Z (per item) ---")
print(cuq_genz_df.describe().round(3))

# Hitung skor CUQ total (normalisasi 0-100)
# Item positif: 1,3,5,7,9,11,13,15 -> skor - 1
# Item negatif: 2,4,6,8,10,12,14,16 -> 5 - skor
pos_items = ['q1','q3','q5','q7','q9','q11','q13','q15']
neg_items = ['q2','q4','q6','q8','q10','q12','q14','q16']

def calc_cuq_score(cuq_df):
    scores = pd.DataFrame()
    for item in pos_items:
        scores[item] = cuq_df[item] - 1
    for item in neg_items:
        scores[item] = 5 - cuq_df[item]
    total = scores.sum(axis=1) * 100 / 64
    return total

formal_scores = calc_cuq_score(cuq_formal_df)
genz_scores = calc_cuq_score(cuq_genz_df)

print("\n--- SKOR CUQ TOTAL (0-100) ---")
print(f"Formal: Mean={formal_scores.mean():.2f}, SD={formal_scores.std():.2f}, Median={formal_scores.median():.2f}, Min={formal_scores.min():.2f}, Max={formal_scores.max():.2f}")
print(f"Gen-Z:  Mean={genz_scores.mean():.2f}, SD={genz_scores.std():.2f}, Median={genz_scores.median():.2f}, Min={genz_scores.min():.2f}, Max={genz_scores.max():.2f}")
print(f"Selisih Mean: {genz_scores.mean() - formal_scores.mean():.2f}")

# Uji normalitas selisih
from scipy import stats
diff = genz_scores - formal_scores
shapiro_stat, shapiro_p = stats.shapiro(diff)
print(f"\n--- UJI NORMALITAS SELISIH ---")
print(f"Shapiro-Wilk: stat={shapiro_stat:.4f}, p={shapiro_p:.6f}")

# Paired t-test
t_stat, t_p = stats.ttest_rel(genz_scores, formal_scores)
print(f"\n--- PAIRED T-TEST ---")
print(f"t={t_stat:.4f}, p={t_p:.4f}")

# Wilcoxon signed-rank
wilcox_stat, wilcox_p = stats.wilcoxon(diff[diff != 0])
print(f"\n--- WILCOXON SIGNED-RANK ---")
print(f"W={wilcox_stat:.1f}, p={wilcox_p:.6f}, N nonzero={sum(diff != 0)}")

# Cohen's dz
cohens_dz = diff.mean() / diff.std()
print(f"\n--- EFFECT SIZE ---")
print(f"Cohen's dz = {cohens_dz:.4f}")

# Order effect
order = bagian_b_df['b4']
formal_first = diff[order == 'Formal \u2192 Gen-Z']
genz_first = diff[order == 'Gen-Z \u2192 Formal']
t_order, p_order = stats.ttest_ind(formal_first, genz_first, equal_var=False)
print(f"\n--- ORDER EFFECT (Welch t-test) ---")
print(f"t={t_order:.4f}, p={p_order:.4f}")
print(f"N Formal->GenZ: {len(formal_first)}, N GenZ->Formal: {len(genz_first)}")

# Klaster CUQ
print("\n--- ANALISIS KLASTER CUQ ---")
# Persona & Afeksi: Q1-Q4
# Navigasi & Kemudahan: Q7,Q8,Q15,Q16
# Kualitas Informasi: Q5,Q6,Q11,Q12
# Efektivitas Interaksi: Q9,Q10,Q13,Q14

clusters = {
    'Persona & Afeksi (Q1-Q4)': ['q1','q2','q3','q4'],
    'Navigasi & Kemudahan (Q7,Q8,Q15,Q16)': ['q7','q8','q15','q16'],
    'Kualitas Informasi (Q5,Q6,Q11,Q12)': ['q5','q6','q11','q12'],
    'Efektivitas Interaksi (Q9,Q10,Q13,Q14)': ['q9','q10','q13','q14']
}

for name, items in clusters.items():
    f_mean = cuq_formal_df[items].mean().mean()
    g_mean = cuq_genz_df[items].mean().mean()
    print(f"{name}: Formal={f_mean:.3f}, GenZ={g_mean:.3f}, Selisih={g_mean-f_mean:.3f}")
