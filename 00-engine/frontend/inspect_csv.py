import csv, json, collections, pathlib

CSV = pathlib.Path(r"D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE\PENDALAMAN\02-data\cuq\cuq_responses_rows.csv")

with CSV.open(encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

print("N=", len(rows))

genders = collections.Counter()
usia = collections.Counter()
status = collections.Counter()
kab = collections.Counter()
orders = collections.Counter()
duration = collections.Counter()
freq = collections.Counter()
b1 = collections.Counter()
b2 = collections.Counter()
b5 = collections.Counter()
media = collections.Counter()

for r in rows:
    p = json.loads(r["profil"]) if r.get("profil") else {}
    b = json.loads(r["bagian_b"]) if r.get("bagian_b") else {}
    genders[p.get("gender", "")] += 1
    usia[p.get("usia", "")] += 1
    status[p.get("status", "")] += 1
    kab[p.get("kabkota", "")] += 1
    orders[b.get("b4", "")] += 1
    duration[b.get("b6", "")] += 1
    freq[b.get("b8", "")] += 1
    b1[b.get("b1", "")] += 1
    b2[b.get("b2", "")] += 1
    b5[b.get("b5", "")] += 1
    media_value = b.get("b3")
    if isinstance(media_value, list):
        for m in media_value:
            media[m] += 1
    elif media_value:
        media[str(media_value)] += 1

print("genders=", genders.most_common())
print("usia=", usia.most_common())
print("status=", status.most_common())
print("orders=", orders.most_common())
print("durations=", duration.most_common())
print("freq=", freq.most_common())
print("b1=", b1.most_common())
print("b2=", b2.most_common())
print("b5=", b5.most_common())
print("media=", media.most_common())
print("kab top10=", kab.most_common(10))
print("kab unique=", len(kab))
