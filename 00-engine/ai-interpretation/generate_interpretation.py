import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
outdir = ROOT / "00-engine/ai-interpretation/output"
outdir.mkdir(parents=True, exist_ok=True)

stats = json.loads((ROOT / "00-engine/analyzer/output/cuq_statistics_report.json").read_text(encoding="utf-8"))
integ = json.loads((ROOT / "00-engine/analyzer/integration_map_report.json").read_text(encoding="utf-8"))

n = stats["n"]
formal_mean = stats["descriptive"]["formal_cuq_0_100"]["mean"]
genz_mean = stats["descriptive"]["genz_cuq_0_100"]["mean"]
mean_diff = stats["descriptive"]["diff_genz_minus_formal"]["mean"]
paired_p = stats["paired_t_test"]["p"]
wilcoxon_p = stats["wilcoxon"]["p"]
dz = stats["effect_size"]["cohens_dz"]
formal_alpha = stats["reliability"]["formal_cronbach_alpha"]
genz_alpha = stats["reliability"]["genz_cronbach_alpha"]
shapiro_p = stats["normality_diff_shapiro"]["p"]
order_p = stats["order_effect"]["welch_t"]["p"]


def q(category, question, safe_answer, basis, risk="Tinggi"):
    return {
        "category": category,
        "question": question,
        "safe_answer": safe_answer,
        "basis": basis,
        "risk_level": risk,
    }


question_bank = [
    q(
        "Metodologi",
        "Mengapa penelitian ini memakai desain within-subject, bukan between-subject?",
        "Karena responden yang sama menilai dua kondisi chatbot, variasi individual lebih terkendali, dan perbandingan Formal versus Gen-Z lebih tepat dianalisis dengan uji berpasangan. Risiko carry-over dijawab dengan counterbalancing urutan pengujian dan uji order effect.",
        "Skill: evaluasi desain penelitian; Tesis Bab III; Statistik order effect.",
    ),
    q(
        "Instrumen",
        "Bagaimana Anda mempertanggungjawabkan penggunaan CUQ ketika beberapa item validitas item lemah atau tidak valid?",
        f"Jawaban aman: interpretasi utama memakai skor total CUQ karena reliabilitas keseluruhan tinggi, alpha Formal {formal_alpha:.3f} dan Gen-Z {genz_alpha:.3f}. Namun, interpretasi per item atau per dimensi harus dibatasi dan tidak boleh dijadikan klaim dominan.",
        "Skill: evaluasi instrumen, validitas, reliabilitas; Tesis Bab IV dan Lampiran validitas.",
    ),
    q(
        "Statistik",
        "Mengapa hasil paired t-test tidak signifikan, tetapi Wilcoxon signifikan?",
        f"Selisih skor tidak normal, sehingga paired t-test p = {paired_p:.3f} dilaporkan sebagai pembanding parametrik, sedangkan Wilcoxon p = {wilcoxon_p:.3f} dipakai sebagai sinyal nonparametrik. Keduanya tetap dibaca bersama effect size yang sangat kecil.",
        "Skill: evaluasi analisis data, uji asumsi normalitas, inferensial.",
    ),
    q(
        "Interpretasi",
        "Apakah Anda berani menyimpulkan gaya bahasa Gen-Z lebih unggul daripada gaya formal?",
        f"Tidak dalam makna praktis yang kuat. Rata-rata Gen-Z {genz_mean:.2f} memang sedikit di atas Formal {formal_mean:.2f}, tetapi selisihnya hanya {mean_diff:.2f} dan Cohen's dz {dz:.3f}, sehingga klaim yang aman adalah kecenderungan kecil, bukan superioritas praktis.",
        "Skill: evaluasi interpretasi dan kesimpulan; Tesis Bab IV-V.",
    ),
    q(
        "Rumusan Masalah",
        "Apakah rumusan masalah, tujuan, hipotesis, dan teknik analisis sudah benar-benar linear?",
        "Linearitas dijaga dengan memetakan tiga fokus: deskripsi tingkat usabilitas, uji perbedaan Formal versus Gen-Z, dan aspek usabilitas yang menonjol. Teknik analisisnya mengikuti fokus itu: deskriptif, uji berpasangan, Wilcoxon, effect size, serta pembacaan dimensi CUQ.",
        "Skill: evaluasi judul, rumusan masalah, tujuan, hipotesis.",
        "Sedang",
    ),
    q(
        "Latar Belakang",
        "Apa celah penelitian yang paling kuat dari tesis ini?",
        "Celahnya adalah belum banyak kajian komunikasi institusional PMB yang menguji gaya bahasa chatbot secara langsung pada Generasi Z dengan instrumen usabilitas dan desain paired. Jadi kontribusinya ada pada konteks komunikasi digital institusional, bukan pada klaim bahwa satu gaya bahasa pasti terbaik.",
        "Skill: evaluasi relevansi judul dan research gap; Tesis Bab I-II.",
        "Sedang",
    ),
    q(
        "Teori",
        "Mengapa teori CMC relevan untuk penelitian chatbot PMB?",
        "CMC relevan karena chatbot diposisikan sebagai media komunikasi institusional yang memediasi interaksi calon mahasiswa dengan universitas. Gaya bahasa dilihat sebagai isyarat sosial yang dapat memengaruhi pengalaman komunikasi digital.",
        "Tesis Bab II; Skill: konsistensi teori dan interpretasi.",
        "Sedang",
    ),
    q(
        "Teori",
        "Apa fungsi TAM dalam tesis ini jika instrumen yang dipakai adalah CUQ?",
        "TAM tidak dipakai sebagai alat ukur utama, tetapi sebagai kerangka interpretif untuk memahami kemudahan, kebermanfaatan, dan penerimaan layanan informasi. Pengukuran operasional tetap memakai CUQ.",
        "Tesis Bab II; Skill: evaluasi teori dan instrumen.",
        "Sedang",
    ),
    q(
        "Teori",
        "Bagaimana S-O-R menjelaskan hubungan gaya bahasa chatbot dan skor CUQ?",
        "Gaya bahasa berperan sebagai stimulus, persepsi pengalaman pengguna sebagai organism, dan skor CUQ sebagai response terukur. Namun, karena effect size kecil, jalur S-O-R harus dibaca sebagai kerangka interpretasi, bukan bukti kausal kuat.",
        "Tesis Bab II-IV; Skill: interpretasi data dan teori.",
        "Sedang",
    ),
    q(
        "Operasionalisasi",
        "Bagaimana Anda mendefinisikan gaya bahasa Gen-Z agar tidak sekadar menjadi istilah populer?",
        "Gaya bahasa Gen-Z harus dijelaskan sebagai variasi pesan yang lebih ringkas, interaktif, ringan, dan dekat dengan kebiasaan komunikasi digital target responden. Jawaban aman perlu menegaskan bahwa label Gen-Z adalah konstruksi operasional penelitian, bukan stereotip seluruh Generasi Z.",
        "Skill: definisi konseptual dan operasional variabel; Tesis Bab III.",
        "Tinggi",
    ),
    q(
        "Operasionalisasi",
        "Apa indikator bahwa perbedaan yang diuji benar-benar gaya bahasa, bukan perbedaan konten informasi?",
        "Kedua chatbot harus menyampaikan substansi informasi PMB yang setara, sementara yang dibedakan adalah gaya penyampaian. Jika konten ikut berbeda, maka efek yang muncul tidak dapat dikaitkan secara bersih dengan gaya bahasa.",
        "Skill: validitas desain dan kontrol variabel.",
        "Tinggi",
    ),
    q(
        "Sampel",
        "Apakah 405 responden cukup dan representatif untuk Generasi Z calon pengguna PMB Unila?",
        f"Jumlah {n} cukup kuat untuk analisis berpasangan dan reliabilitas instrumen. Namun, representativitas tetap harus dibatasi pada karakteristik responden penelitian, sehingga generalisasi ke seluruh Generasi Z Indonesia tidak boleh dibuat terlalu luas.",
        "Skill: evaluasi populasi, sampel, teknik penentuan sampel.",
        "Sedang",
    ),
    q(
        "Sampel",
        "Bagaimana Anda menjawab kritik bahwa sampel tidak benar-benar calon mahasiswa baru?",
        "Jawaban aman adalah menjelaskan kriteria responden sebagai Generasi Z yang relevan dengan layanan informasi PMB, lalu mengakui bahwa kedekatan dengan populasi calon mahasiswa menjadi batas generalisasi. Ini bisa menjadi saran penelitian lanjutan dengan sampel calon pendaftar aktual.",
        "Skill: evaluasi populasi dan keterbatasan penelitian.",
        "Tinggi",
    ),
    q(
        "Prosedur",
        "Apakah ada risiko efek urutan karena responden mencoba dua chatbot secara berurutan?",
        f"Ada risiko carry-over, karena itu penelitian memakai counterbalancing dan menguji order effect. Hasil order effect p = {order_p:.3f}, sehingga tidak ada bukti kuat bahwa urutan pengujian mengubah selisih skor.",
        "Skill: desain eksperimen/kuasi dan kontrol bias.",
        "Sedang",
    ),
    q(
        "Prosedur",
        "Apakah responden dapat mengenali tujuan penelitian dan menjadi bias dalam menilai chatbot?",
        "Kemungkinan demand characteristic perlu diakui. Jawaban aman adalah menekankan prosedur instruksi yang netral dan penggunaan dua kondisi yang dinilai oleh responden yang sama, tetapi tetap mencatat potensi bias persepsi sebagai keterbatasan.",
        "Skill: evaluasi pengumpulan data dan bias responden.",
        "Sedang",
    ),
    q(
        "Statistik",
        "Mengapa tetap melaporkan paired t-test jika data selisih tidak normal?",
        f"Paired t-test tetap dilaporkan karena hipotesis awal sering diformulasikan dalam perbedaan rata-rata, tetapi interpretasi utama harus mempertimbangkan Shapiro p sangat kecil ({shapiro_p:.2e}) dan hasil Wilcoxon sebagai uji nonparametrik.",
        "Skill: uji asumsi dan pelaporan inferensial.",
        "Sedang",
    ),
    q(
        "Statistik",
        "Mengapa effect size lebih penting daripada sekadar p-value dalam hasil ini?",
        f"Karena p-value hanya menunjukkan bukti statistik terhadap hipotesis nol, sedangkan effect size menunjukkan besar dampak. Dengan Cohen's dz {dz:.3f}, dampak praktis sangat kecil meskipun Wilcoxon signifikan.",
        "Skill: interpretasi data ilmiah.",
        "Tinggi",
    ),
    q(
        "Statistik",
        "Apakah median difference 0,00 melemahkan klaim perbedaan?",
        "Ya, median difference 0,00 menunjukkan banyak responden memberi skor yang relatif setara pada kedua kondisi. Karena itu hasil harus dibaca sebagai perbedaan kecil pada distribusi/ranking, bukan perubahan pengalaman yang besar.",
        "Tesis Bab IV; Skill: interpretasi hasil inferensial.",
        "Tinggi",
    ),
    q(
        "Instrumen",
        "Apakah CUQ tepat untuk menilai usabilitas komunikasi, bukan hanya usabilitas teknis?",
        "CUQ relevan karena memuat aspek persona, navigasi, kualitas respons, dan efektivitas interaksi. Namun, untuk kajian komunikasi yang lebih mendalam, CUQ dapat dilengkapi studi kualitatif tentang makna pesan dan pengalaman komunikasi.",
        "Skill: evaluasi instrumen dan rekomendasi lanjutan.",
        "Sedang",
    ),
    q(
        "Instrumen",
        "Mengapa item negatif perlu reverse scoring?",
        "Item negatif harus dibalik agar arah skor konsisten: skor tinggi selalu berarti usabilitas lebih baik. Tanpa reverse scoring, skor total CUQ akan bias dan dapat menyesatkan interpretasi.",
        "Tesis Lampiran skoring CUQ; Skill: pengolahan data.",
        "Sedang",
    ),
    q(
        "Validitas",
        "Apakah reliabilitas tinggi otomatis berarti instrumen valid?",
        "Tidak. Reliabilitas tinggi menunjukkan konsistensi internal, tetapi tidak otomatis membuktikan validitas konstruk. Karena itu hasil validitas item tetap dilaporkan dan interpretasi item/dimensi dilakukan hati-hati.",
        "Skill: validitas dan reliabilitas instrumen.",
        "Tinggi",
    ),
    q(
        "Validitas",
        "Bagaimana Anda menanggapi item CUQ yang korelasinya rendah tetapi alpha total tinggi?",
        "Itu menunjukkan instrumen secara total masih konsisten, tetapi beberapa item mungkin kurang selaras dengan konstruk pada konteks responden ini. Kesimpulan utama sebaiknya bertumpu pada skor total dan reliabilitas keseluruhan, bukan klaim per item.",
        "Skill: review instrumen dan interpretasi item-total.",
        "Tinggi",
    ),
    q(
        "Hasil",
        "Apa makna substantif selisih mean hanya sekitar 0,57 poin pada skala 0-100?",
        "Maknanya sangat kecil secara praktis. Selisih ini dapat menjadi sinyal preferensi minor, tetapi tidak cukup untuk merekomendasikan penggantian total gaya formal menjadi gaya Gen-Z.",
        "Tesis Bab IV-V; Skill: interpretasi hasil dan rekomendasi.",
        "Tinggi",
    ),
    q(
        "Hasil",
        "Jika semua dimensi CUQ relatif setara, aspek apa yang sebenarnya paling menonjol?",
        "Tidak ada aspek yang dapat diklaim sebagai pembeda kuat. Jawaban aman adalah menyebut semua dimensi relatif setara, sehingga rekomendasi diarahkan pada segmentasi dan penyempurnaan gaya bahasa, bukan pada satu dimensi dominan.",
        "Tesis Bab IV; Skill: interpretasi dimensi dan simpulan.",
        "Sedang",
    ),
    q(
        "Pembahasan",
        "Bagaimana menghubungkan hasil yang kecil dengan kontribusi teoretis?",
        "Kontribusinya bukan membuktikan efek besar, melainkan menunjukkan bahwa gaya bahasa sebagai isyarat komunikasi digital tidak otomatis menghasilkan perbedaan praktis besar pada usabilitas. Ini memperkaya pembahasan CMC/TAM/S-O-R secara lebih hati-hati.",
        "Skill: kontribusi teoretis dan interpretasi.",
        "Sedang",
    ),
    q(
        "Pembahasan",
        "Mengapa hasil tidak signifikan pada t-test tetap penting untuk komunikasi institusional?",
        "Karena hasil tersebut menunjukkan bahwa gaya formal tidak harus ditinggalkan. Bagi institusi, stabilitas, kejelasan, dan kredibilitas pesan tetap penting, sementara gaya Gen-Z dapat dipakai secara segmentatif.",
        "Tesis Bab IV-V; Skill: implikasi praktis.",
        "Sedang",
    ),
    q(
        "Kesimpulan",
        "Apakah simpulan sudah konsisten dengan hasil statistik?",
        "Simpulan harus menyatakan perbedaan deskriptif kecil, paired t-test tidak signifikan, Wilcoxon signifikan nonparametrik, dan effect size sangat kecil. Hindari simpulan yang menyatakan Gen-Z lebih unggul secara mutlak.",
        "Skill: evaluasi interpretasi dan kesimpulan.",
        "Tinggi",
    ),
    q(
        "Implikasi",
        "Apa rekomendasi praktis paling aman untuk Universitas Lampung?",
        "Rekomendasi aman adalah segmentasi gaya komunikasi chatbot: tetap mempertahankan gaya formal untuk informasi resmi, dan menggunakan gaya yang lebih ringan/interaktif pada konteks bantuan, orientasi, atau engagement calon mahasiswa.",
        "Tesis Bab V; Skill: rekomendasi berbasis data.",
        "Sedang",
    ),
    q(
        "Implikasi",
        "Mengapa rekomendasi bukan mengganti semua chatbot menjadi gaya Gen-Z?",
        "Karena bukti praktisnya sangat kecil. Penggantian total tidak proporsional dengan data. Segmentasi pesan lebih sesuai karena menjaga kredibilitas institusi sekaligus memberi ruang adaptasi untuk pengguna muda.",
        "Skill: interpretasi hasil dan kebijakan komunikasi.",
        "Sedang",
    ),
    q(
        "Etika",
        "Apakah penggunaan gaya bahasa Gen-Z oleh institusi berisiko manipulatif atau tidak autentik?",
        "Risiko itu ada jika gaya bahasa hanya meniru slang tanpa menjaga akurasi dan etika informasi. Jawaban aman adalah menekankan bahwa adaptasi gaya bahasa harus tetap transparan, informatif, sopan, dan sesuai identitas institusi.",
        "Skill: evaluasi komunikasi institusional dan etika.",
        "Sedang",
    ),
    q(
        "Keterbatasan",
        "Apa keterbatasan paling kritis dari penelitian ini?",
        "Keterbatasan utama adalah konteks tunggal PMB Unila, pengukuran berbasis skenario/eksposur dua kondisi, dan fokus kuantitatif CUQ. Penelitian lanjutan dapat memakai eksperimen lapangan, data perilaku, dan wawancara mendalam.",
        "Tesis Bab V; Skill: evaluasi keterbatasan.",
        "Sedang",
    ),
    q(
        "Lanjutan",
        "Riset lanjutan apa yang paling kuat setelah tesis ini?",
        "Riset lanjutan dapat berupa A/B testing chatbot PMB aktual, analisis segmentasi responden, pengukuran behavioral seperti completion rate dan waktu pencarian informasi, serta studi kualitatif pengalaman pengguna.",
        "Skill: strategi penelitian lanjutan dan inovasi metodologi.",
        "Aman",
    ),
    q(
        "Profesor",
        "Jika Anda menjadi reviewer jurnal, bagian mana yang paling mungkin diminta diperkuat?",
        "Reviewer kemungkinan meminta penguatan operasionalisasi gaya bahasa Gen-Z, kontrol kesetaraan konten dua chatbot, pelaporan validitas konstruk, dan pembahasan effect size agar klaim tidak berlebihan.",
        "File skill level Profesor: review kritis metodologi dan standardisasi.",
        "Tinggi",
    ),
    q(
        "Profesor",
        "Apa kontribusi tesis ini pada Ilmu Komunikasi, bukan hanya pada evaluasi aplikasi?",
        "Kontribusinya adalah menempatkan chatbot PMB sebagai media komunikasi institusional dan menguji bagaimana gaya bahasa sebagai strategi pesan dipersepsi dalam interaksi digital. Fokusnya bukan sekadar aplikasi, tetapi relasi gaya komunikasi, pengguna muda, dan kredibilitas institusi.",
        "File skill Ilmu Komunikasi; Tesis Bab II dan V.",
        "Tinggi",
    ),
    q(
        "Profesor",
        "Apa jawaban jika penguji menyatakan penelitian ini terlalu teknis dan kurang komunikasi?",
        "Jawaban aman: objek teknologinya adalah chatbot, tetapi variabel yang diuji adalah gaya bahasa dan pengalaman komunikasi. Teori CMC, TAM, dan S-O-R dipakai untuk menempatkan chatbot sebagai media komunikasi institusional.",
        "File skill Ilmu Komunikasi; evaluasi kontribusi bidang.",
        "Tinggi",
    ),
    q(
        "Profesor",
        "Apa standar klaim ilmiah paling penting yang harus Anda jaga saat ujian?",
        "Jaga tiga batas: jangan mengklaim superioritas Gen-Z yang kuat, jangan menggeneralisasi ke semua Generasi Z, dan jangan menjadikan signifikansi Wilcoxon sebagai bukti dampak praktis besar. Semua jawaban harus kembali ke data final audited, effect size, dan konteks PMB Unila.",
        "File skill level Profesor: interpretasi ilmiah dan review kritis.",
        "Tinggi",
    ),
]

interp = {
    "safe_core_claims": [
        "Dataset final hasil audit sudah konsisten untuk perhitungan statistik dan narasi tesis.",
        f"Skor CUQ Gen-Z sedikit lebih tinggi secara deskriptif ({genz_mean:.2f}) daripada Formal ({formal_mean:.2f}), tetapi selisih mean hanya {mean_diff:.2f}.",
        f"Paired t-test tidak signifikan (p = {paired_p:.3f}); Wilcoxon signifikan (p = {wilcoxon_p:.3f}) karena distribusi selisih tidak normal.",
        f"Effect size Cohen's dz = {dz:.3f}, sehingga klaim praktis harus sangat hati-hati.",
        "Implikasi paling aman adalah segmentasi gaya bahasa chatbot, bukan penggantian total gaya formal.",
    ],
    "theory_mapping": {
        "CMC": "Chatbot diposisikan sebagai media komunikasi institusional; gaya bahasa menjadi isyarat sosial dalam interaksi bermedia.",
        "TAM": "Usabilitas dan penerimaan dipahami melalui kemudahan, kejelasan, dan kebermanfaatan informasi PMB.",
        "S-O-R": "Gaya bahasa sebagai stimulus, persepsi usabilitas sebagai organism response, skor CUQ sebagai respons terukur.",
    },
    "professor_review_basis": [
        "Evaluasi judul, rumusan masalah, tujuan, dan hipotesis.",
        "Evaluasi desain penelitian, populasi, sampel, dan prosedur.",
        "Evaluasi instrumen, validitas, reliabilitas, dan skoring.",
        "Evaluasi analisis deskriptif, inferensial, normalitas, dan effect size.",
        "Evaluasi interpretasi, simpulan, rekomendasi, kontribusi teori, dan batas klaim.",
    ],
    "question_bank": question_bank,
    "slide_to_argument": integ["integration_map"],
}

(outdir / "ai_interpretation_report.json").write_text(json.dumps(interp, ensure_ascii=False, indent=2), encoding="utf-8")

md = ["# AI Interpretation Report", "", "## Safe Core Claims"]
md += [f"- {item}" for item in interp["safe_core_claims"]]
md += ["", "## Professor Review Basis"]
md += [f"- {item}" for item in interp["professor_review_basis"]]
md += ["", "## Theory Mapping"]
md += [f"- **{key}**: {value}" for key, value in interp["theory_mapping"].items()]
md += ["", "## Critical Question Bank"]
for item in interp["question_bank"]:
    md += [
        f"### {item['category']}: {item['question']}",
        f"Risk: `{item['risk_level']}`",
        f"Basis: {item['basis']}",
        "",
        item["safe_answer"],
        "",
    ]
(outdir / "ai_interpretation_report.md").write_text("\n".join(md), encoding="utf-8")
print(outdir / "ai_interpretation_report.md")
