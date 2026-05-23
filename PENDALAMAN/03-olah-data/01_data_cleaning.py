import pandas as pd
import json

df = pd.read_csv(r'D:\DATA\TESIS\KOMPRE\PENDALAMAN\02-data\cuq\cuq_responses_rows.csv')

# Parse CUQ columns
cuq_formal = df['cuq_formal'].apply(json.loads)
cuq_formal_df = pd.DataFrame(cuq_formal.tolist()).apply(pd.to_numeric)

cuq_genz = df['cuq_genz'].apply(json.loads)
cuq_genz_df = pd.DataFrame(cuq_genz.tolist()).apply(pd.to_numeric)

print('=== CEK STRAIGHT-LINING (semua jawaban sama) ===')
print()

# Formal
formal_straight = cuq_formal_df[cuq_formal_df.nunique(axis=1) == 1]
print(f'Formal - Responden dengan semua jawaban identik: {len(formal_straight)}')
for idx in formal_straight.index:
    resp_id = df.iloc[idx]['respondent_id_text']
    val = cuq_formal_df.iloc[idx]['q1']
    print(f'  ID {resp_id}: semua jawaban = {val}')

print()

# Gen-Z
genz_straight = cuq_genz_df[cuq_genz_df.nunique(axis=1) == 1]
print(f'Gen-Z - Responden dengan semua jawaban identik: {len(genz_straight)}')
for idx in genz_straight.index:
    resp_id = df.iloc[idx]['respondent_id_text']
    val = cuq_genz_df.iloc[idx]['q1']
    print(f'  ID {resp_id}: semua jawaban = {val}')

print()
print('=== CEK MISSING VALUES ===')
print(f'Missing di cuq_formal: {df["cuq_formal"].isna().sum()}')
print(f'Missing di cuq_genz: {df["cuq_genz"].isna().sum()}')
print(f'Missing di profil: {df["profil"].isna().sum()}')

print()
print('=== CEK DUPLIKAT RESPONDEN ===')
profil = df['profil'].apply(json.loads)
profil_df = pd.json_normalize(profil)
dupl = profil_df[profil_df.duplicated(subset=['nama'], keep=False)]
if len(dupl) > 0:
    print(f'Nama duplikat ditemukan: {len(dupl)} baris')
    for nama in dupl['nama'].unique():
        count = len(dupl[dupl['nama'] == nama])
        print(f'  "{nama}" muncul {count} kali')
else:
    print('Tidak ada duplikat nama')

print()
print('=== DISTRIBUSI NILAI PER ITEM (untuk deteksi pola aneh) ===')
print('CUQ Formal - Frekuensi nilai per item:')
for col in cuq_formal_df.columns:
    counts = cuq_formal_df[col].value_counts().sort_index()
    print(f'  {col}: {dict(counts)}')
