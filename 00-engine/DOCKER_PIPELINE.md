# Docker Pipeline - HARNO-KOMPRE

Arsitektur ini mengimplementasikan RDP bagian 4 secara minimal dan aman.

## Service

| Service | Fungsi |
|---|---|
| `parser` | Parse tesis, paparan, PPT manifest |
| `analyzer` | Hitung statistik CSV master dan integration map |
| `skill-checker` | Cek alignment dokumen terhadap file skill |
| `ai-interpretation` | Buat klaim aman, teori, dan Q&A kompre |
| `database` | Bangun SQLite index |
| `pipeline` | Jalankan semua modul berurutan |
| `frontend` | Serve dashboard statis via Nginx |

## Command

Build image:

```powershell
docker compose build
```

Jalankan service tunggal:

```powershell
docker compose run --rm parser
docker compose run --rm analyzer
docker compose run --rm skill-checker
docker compose run --rm ai-interpretation
docker compose run --rm database
```

Jalankan pipeline penuh:

```powershell
docker compose --profile pipeline run --rm pipeline
```

Serve frontend:

```powershell
docker compose --profile frontend up frontend
```

Buka:

```text
http://localhost:8088
```

## Catatan aman

- Pipeline Docker ini tidak menjalankan patch/lock DOCX final otomatis.
- Patch dokumen akademik tetap manual-terkontrol via script khusus dan log.
- Data master tetap `02-data/cuq/cuq_responses_rows.csv`.
- N final CSV master adalah `405`.
