"""
Tahap 8: Interpretasi & Kesimpulan
====================================
Script ini menyusun interpretasi gabungan dari seluruh hasil analisis
dan merumuskan kesimpulan akhir penelitian.
"""

import pandas as pd
import json
import numpy as np
from scipy import stats

# ============================================================
# LOAD DATA & HITUNG SEMUA STATISTIK
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

# Statistik
t_stat, t_p = stats.ttest_rel(genz_scores, formal_scores)
diff_nonzero = diff[diff != 0]
wilcox_stat, wilcox_p = stats.wilcoxon(diff_nonzero, alternative='two-sided')
cohens_dz = diff.mean() / diff.std()

print("=" * 70)
print("TAHAP 8: INTERPRETASI & KESIMPULAN PENELITIAN")
print("=" * 70)

# ============================================================
# BAGIAN 1: RINGKASAN SELURUH TEMUAN STATISTIK
# ============================================================
print(f"""
{'='*70}
BAGIAN 1: RINGKASAN SELURUH TEMUAN STATISTIK
{'='*70}

┌─────────────────────────────────────────────────────────────────────┐
│ DESKRIPTIF                                                          │
├─────────────────────────────────────────────────────────────────────┤
│ Mean Formal     : {formal_scores.mean():.2f}                                          │
│ Mean Gen-Z      : {genz_scores.mean():.2f}                                          │
│ Selisih         : {diff.mean():.2f} poin (dari skala 0-100)                    │
│ SD Formal       : {formal_scores.std():.2f}                                          │
│ SD Gen-Z        : {genz_scores.std():.2f}                                          │
├─────────────────────────────────────────────────────────────────────┤
│ UJI NORMALITAS                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ Shapiro-Wilk    : W = 0.836, p < 0.001 → Tidak Normal              │
│ Kolmogorov-S    : D = 0.193, p < 0.001 → Tidak Normal              │
├─────────────────────────────────────────────────────────────────────┤
│ UJI BEDA                                                            │
├─────────────────────────────────────────────────────────────────────┤
│ Paired t-test   : t = {t_stat:.4f}, p = {t_p:.4f} → Tidak Signifikan       │
│ Wilcoxon        : W = {wilcox_stat:.1f}, p = {wilcox_p:.4f} → Signifikan       │
│ Cohen's dz      : {cohens_dz:.4f} → Trivial/Sangat Kecil                    │
│ Order Effect    : p = 0.570 → Tidak Signifikan                      │
├─────────────────────────────────────────────────────────────────────┤
│ KLASTER CUQ                                                         │
├─────────────────────────────────────────────────────────────────────┤
│ Persona & Afeksi      : +2.27 poin (Gen-Z > Formal)                │
│ Kualitas Informasi    : -1.25 poin (Formal > Gen-Z)                │
│ Navigasi & Kemudahan  : +0.51 poin (≈ Setara)                      │
│ Efektivitas Interaksi : +0.76 poin (≈ Setara)                      │
└─────────────────────────────────────────────────────────────────────┘
""")

# ============================================================
# BAGIAN 2: INTERPRETASI PER RUMUSAN MASALAH
# ============================================================
print(f"""
{'='*70}
BAGIAN 2: INTERPRETASI PER RUMUSAN MASALAH
{'='*70}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RUMUSAN MASALAH 1:
"Bagaimana tingkat usabilitas interaksi komunikasi pada chatbot
bergaya bahasa formal dan chatbot bergaya bahasa Generasi Z?"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JAWABAN:
  Tingkat usabilitas kedua chatbot RELATIF SETARA:
  - Chatbot Formal : 72,92 / 100 (kategori "Baik" mendekati "Sangat Baik")
  - Chatbot Gen-Z  : 73,50 / 100 (kategori "Baik" mendekati "Sangat Baik")
  - Selisih        : 0,57 poin (< 1% skala)

  Kedua chatbot berada pada level usabilitas yang BAIK.
  Selisih 0,57 poin tidak cukup kuat untuk menyatakan adanya
  keunggulan deskriptif yang substantif pada salah satu gaya bahasa.

  Distribusi kategori:
  - 96,3% responden menilai chatbot Formal pada kategori Baik-Sangat Baik
  - 95,0% responden menilai chatbot Gen-Z pada kategori Baik-Sangat Baik

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RUMUSAN MASALAH 2:
"Apakah terdapat perbedaan tingkat usabilitas (skor CUQ) antara
chatbot bergaya bahasa formal dan chatbot bergaya bahasa Generasi Z?"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JAWABAN:
  Hasil pengujian menunjukkan TEMUAN YANG PERLU DITAFSIRKAN HATI-HATI:

  1. Paired t-test: p = 0,157 → TIDAK signifikan
     → Rata-rata skor tidak berbeda secara statistik

  2. Wilcoxon: p = 0,003 → SIGNIFIKAN
     → Ada perbedaan ranking yang terdeteksi secara nonparametrik

  3. Cohen's dz = 0,070 → TRIVIAL
     → Perbedaan yang terdeteksi SANGAT KECIL secara praktis

  INTERPRETASI GABUNGAN:
  Terdapat indikasi perbedaan secara nonparametrik, tetapi ukuran efek
  sangat kecil (dz = 0,070). Temuan ini TIDAK CUKUP untuk menyatakan
  keunggulan praktis yang kuat pada salah satu gaya bahasa chatbot.

  Mengapa Wilcoxon signifikan tapi t-test tidak?
  - 118 responden (29,1%) memiliki selisih = 0 → dikeluarkan dari Wilcoxon
  - Dari 287 yang tersisa: 174 positif vs 113 negatif (rasio 61:39)
  - Pola ini konsisten tapi besarannya sangat kecil
  - T-test "terdilusi" oleh 118 responden dengan selisih nol

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RUMUSAN MASALAH 3:
"Aspek usabilitas mana yang paling menonjol sebagai pembeda antara
chatbot formal dan chatbot Generasi Z?"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JAWABAN:
  TIDAK ADA aspek usabilitas yang menjadi pembeda dominan.

  Analisis klaster menunjukkan:
  - Persona & Afeksi: selisih terbesar (+2,27) tapi dz = 0,185 (< small)
  - Kualitas Informasi: Formal sedikit lebih baik (-1,25)
  - Navigasi & Kemudahan: hampir identik (+0,51)
  - Efektivitas Interaksi: hampir identik (+0,76)

  Pola kompensasi:
  - Gen-Z unggul di PERSONA (terasa kurang robotik, lebih realistis)
  - Formal unggul di INFORMASI (lebih jelas, lebih relevan)
  - Kedua keunggulan saling mengompensasi → skor total setara
""")

# ============================================================
# BAGIAN 3: INTERPRETASI TEORETIS
# ============================================================
print(f"""
{'='*70}
BAGIAN 3: INTERPRETASI DALAM KERANGKA TEORI
{'='*70}

┌─────────────────────────────────────────────────────────────────────┐
│ CMC (Computer-Mediated Communication)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Teori CMC menyatakan bahwa dalam komunikasi termediasi, isyarat     │
│ nonverbal menghilang dan pengguna bergantung pada isyarat tekstual.  │
│                                                                     │
│ Temuan penelitian:                                                  │
│ - Gaya bahasa Gen-Z BERHASIL berfungsi sebagai isyarat sosial       │
│   (chatbot terasa kurang robotik: Q2 selisih +0,37)                 │
│ - NAMUN isyarat tersebut belum cukup kuat untuk menghasilkan        │
│   perbedaan persepsi usabilitas KESELURUHAN yang signifikan         │
│ - Isyarat tekstual perlu didukung oleh kualitas isi pesan,          │
│   alur interaksi, dan konteks penggunaan media                      │
│                                                                     │
│ Implikasi: Teori CMC perlu digunakan BERSAMA pertimbangan           │
│ kualitas konten dan desain interaksi, bukan berdiri sendiri         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ TAM (Technology Acceptance Model)                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ TAM menyatakan penerimaan teknologi ditentukan oleh:                │
│ - PEOU (Perceived Ease of Use): kemudahan penggunaan                │
│ - PU (Perceived Usefulness): kebermanfaatan                         │
│                                                                     │
│ Temuan penelitian:                                                  │
│ - PEOU: Navigasi & Kemudahan TIDAK berbeda (selisih 0,51 poin)     │
│   → Gaya bahasa akrab belum tentu membuat alur terasa lebih mudah   │
│ - PU: Kualitas Informasi justru sedikit lebih baik pada Formal      │
│   → Kebermanfaatan lebih berkaitan dengan relevansi isi, bukan      │
│     gaya penyampaian                                                │
│                                                                     │
│ Implikasi: Gaya bahasa BUKAN faktor tunggal yang menentukan         │
│ PEOU dan PU. Penerimaan chatbot adalah hasil gabungan kejelasan     │
│ bahasa, relevansi informasi, kemudahan navigasi, dan kualitas       │
│ respons.                                                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ S-O-R (Stimulus-Organism-Response)                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Model S-O-R menjelaskan mekanisme efek komunikasi:                  │
│                                                                     │
│ S (Stimulus): Variasi gaya bahasa (Formal vs Gen-Z)                 │
│     ↓                                                               │
│ O (Organism): Proses perseptual dalam diri Generasi Z               │
│     ↓                                                               │
│ R (Response): Penilaian usabilitas (skor CUQ)                       │
│                                                                     │
│ Temuan penelitian:                                                  │
│ - Stimulus DIBERIKAN (variasi gaya bahasa ada)                      │
│ - Response TIDAK menunjukkan perbedaan signifikan                   │
│ - Artinya: Organism (persepsi pengguna) mungkin dipengaruhi         │
│   oleh faktor LAIN di luar gaya bahasa:                             │
│   • Kualitas isi jawaban chatbot                                    │
│   • Pengalaman sebelumnya dengan chatbot                            │
│   • Kebiasaan responden dalam menjawab kuesioner                    │
│   • Ekspektasi terhadap layanan institusi resmi                     │
│                                                                     │
│ Implikasi: Jalur S-O-R dalam konteks chatbot PMB tidak linier.      │
│ Stimulus gaya bahasa saja tidak cukup untuk menghasilkan            │
│ respons usabilitas yang berbeda secara signifikan.                   │
└─────────────────────────────────────────────────────────────────────┘
""")

# ============================================================
# BAGIAN 4: SIMPULAN AKHIR
# ============================================================
print(f"""
{'='*70}
BAGIAN 4: SIMPULAN AKHIR PENELITIAN
{'='*70}

SIMPULAN 1 (Menjawab RM1):
  Tingkat usabilitas interaksi komunikasi pada chatbot bergaya bahasa
  formal dan chatbot bergaya bahasa Generasi Z RELATIF SETARA.
  - Formal: 72,92 / 100
  - Gen-Z: 73,50 / 100
  - Selisih: 0,57 poin — tidak substantif

SIMPULAN 2 (Menjawab RM2):
  Paired t-test TIDAK signifikan (p = 0,157).
  Wilcoxon SIGNIFIKAN (p = 0,003) tetapi Cohen's dz = 0,070 (trivial).
  → Terdapat indikasi perbedaan nonparametrik, tetapi perbedaan tersebut
    SANGAT KECIL secara praktis dan TIDAK CUKUP untuk menyatakan
    keunggulan praktis yang kuat pada salah satu gaya bahasa.

SIMPULAN 3 (Menjawab RM3):
  TIDAK terdapat aspek usabilitas yang paling menonjol sebagai pembeda
  kuat. Seluruh klaster CUQ memiliki selisih sangat kecil.
  Gaya bahasa belum terbukti menjadi faktor dominan dalam membentuk
  persepsi usabilitas responden.

{'='*70}
IMPLIKASI PRAKTIS:
{'='*70}

  1. Gaya bahasa formal TIDAK menjadi hambatan komunikasi
  2. Gaya bahasa Gen-Z BELUM terbukti sebagai strategi yang lebih unggul
  3. Keduanya adalah VARIASI STRATEGI PESAN yang efektivitasnya bergantung
     pada kualitas informasi, kejelasan alur, dan desain interaksi
  4. Rekomendasi: pendekatan HIBRIDA — tetap jelas dan kredibel seperti
     formal, tetapi lebih ringkas dan ramah seperti komunikasi digital

{'='*70}
""")

print("✓ Seluruh tahapan pengolahan dan interpretasi data telah selesai.")
